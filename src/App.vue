<template>
  <div id="app">
    <div class="container">
      <div v-if="!session" id="join">
        <div id="img-div">
          <img src="./assets/images/openvidu_grey_bg_transp_cropped.png" alt="OpenVidu logo">
        </div>
        <div id="join-dialog" class="jumbotron vertical-center">
          <h1> Join a video session </h1>
          <form class="form-group" @submit="joinSession">
            <p>
              <label>Participant: </label>
              <input
                id="userName"
                class="form-control"
                type="text"
                :value="myUserName"
                required
                @change="handleChangeUserName"
              >
            </p>
            <p>
              <label> Session: </label>
              <input
                id="sessionId"
                class="form-control"
                type="text"
                :value="mySessionId"
                required
                @change="handleChangeSessionId"
              >
            </p>
            <p class="text-center">
              <input class="btn btn-lg btn-success" name="commit" type="submit" value="JOIN">
            </p>
          </form>
        </div>
      </div>

      <div v-else id="session">
        <div id="session-header">
          <h1 id="session-title">
            {{ mySessionId }}
          </h1>
          <input
            id="buttonLeaveSession"
            class="btn btn-large btn-danger"
            type="button"
            value="Leave session"
            @click="leaveSession"
          >
        </div>

        <div v-if="mainStreamManager !== undefined" id="main-video" class="col-md-6">
          <UserVideoComponent :stream-manager="mainStreamManager" />
        </div>

        <div id="video-container" class="col-md-6">
          <div
            v-if="publisher !== undefined"
            class="stream-container col-md-6 col-xs-6"
            @click="handleMainVideoStream(publisher)"
          >
            <UserVideoComponent
              :stream-manager="publisher"
            />
          </div>

          <div
            v-for="(sub, i) in subscribers"
            :key="i"
            class="stream-container col-md-6 col-xs-6"
            @click="handleMainVideoStream(sub)"
          >
            <UserVideoComponent :stream-manager="sub" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { OpenVidu } from 'openvidu-browser'
import UserVideoComponent from './components/UserVideoComponent'

const OPENVIDU_SERVER_URL = 'https://localhost:4443'
const OPENVIDU_SERVER_SECRET = 'YOUR_SECRET'

export default {
  name: 'App',
  components: {
    UserVideoComponent
  },
  data() {
    return {
      mySessionId: 'SessionA',
      myUserName: 'Participant' + Math.floor(Math.random() * 100),
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: []
    }
  },
  methods: {
    onbeforeunload(event) {
      this.leaveSession()
    },
    handleChangeSessionId(e) {
      this.mySessionId = e.target.value
    },
    handleChangeUserName(e) {
      this.myUserName = e.target.value
    },
    handleMainVideoStream(stream) {
      if (this.mainStreamManager !== stream) {
        this.mainStreamManager = stream
      }
    },
    deleteSubscriber(streamManager) {
      const subscribers = this.subscribers
      const index = subscribers.indexOf(streamManager, 0)
      if (index > -1) {
        subscribers.splice(index, 1)
        this.subscribers = subscribers
      }
    },
    joinSession() {
      // --- 1) Get an OpenVidu object ---

      this.OV = new OpenVidu()

      // --- 2) Init a session ---
      this.session = this.OV.initSession()
      var mySession = this.session

      // --- 3) Specify the actions when events take place in the session ---

      // On every new Stream received...
      mySession.on('streamCreated', (event) => {
        // Subscribe to the Stream to receive it. Second parameter is undefined
        // so OpenVidu doesn't create an HTML video by its own
        var subscriber = mySession.subscribe(event.stream, undefined)
        var subscribers = this.subscribers
        subscribers.push(subscriber)

        // Update the state with the new subscribers
        this.subscribers = subscribers
      })

      // On every Stream destroyed...
      mySession.on('streamDestroyed', (event) => {
        // Remove the stream from 'subscribers' array
        this.deleteSubscriber(event.stream.streamManager)
      })

      // --- 4) Connect to the session with a valid user token ---

      // 'getToken' method is simulating what your server-side should do.
      // 'token' parameter should be retrieved and returned by your own backend
      this.getToken().then((token) => {
        // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
        // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
        mySession
          .connect(
            token,
            { clientData: this.myUserName }
          )
          .then(() => {
            // --- 5) Get your own camera stream ---

            // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
            // element: we will manage it on our own) and with the desired properties
            const publisher = this.OV.initPublisher(undefined, {
              audioSource: undefined, // The source of audio. If undefined default microphone
              videoSource: undefined, // The source of video. If undefined default webcam
              publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
              publishVideo: true, // Whether you want to start publishing with your video enabled or not
              resolution: '640x480', // The resolution of your video
              frameRate: 30, // The frame rate of your video
              insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
              mirror: false // Whether to mirror your local video or not
            })

            // --- 6) Publish your stream ---

            mySession.publish(publisher)

            // Set the main video in the page to display our webcam and store our Publisher
            this.mainStreamManager = publisher
            this.publisher = publisher
          })
          .catch((error) => {
            console.log('There was an error connecting to the session:', error.code, error.message)
          })
      })
    },
    leaveSession() {
      // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

      const mySession = this.session

      if (mySession) {
        mySession.disconnect()
      }

      // Empty all properties...
      this.OV = null
      this.session = undefined
      this.subscribers = []
      this.mySessionId = 'SessionA'
      this.myUserName = 'Participant' + Math.floor(Math.random() * 100)
      this.mainStreamManager = undefined
      this.publisher = undefined
    },
    /**
     * --------------------------
     * SERVER-SIDE RESPONSIBILITY
     * --------------------------
     * These methods retrieve the mandatory user token from OpenVidu Server.
     * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
     * the API REST, openvidu-java-client or openvidu-node-client):
     *   1) Initialize a session in OpenVidu Server	(POST /api/sessions)
     *   2) Generate a token in OpenVidu Server		(POST /api/tokens)
     *   3) The token must be consumed in Session.connect() method
     */
    getToken() {
      return this.createSession(this.mySessionId).then((sessionId) => this.createToken(sessionId))
    },
    createSession(sessionId) {
      return new Promise((resolve, reject) => {
        var data = JSON.stringify({ customSessionId: sessionId })
        axios
          .post(OPENVIDU_SERVER_URL + '/api/sessions', data, {
            headers: {
              Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
              'Content-Type': 'application/json'
            }
          })
          .then((response) => {
            console.log('CREATE SESION', response)
            resolve(response.data.id)
          })
          .catch((response) => {
            console.error(response)
            var error = Object.assign({}, response)
            if (error.response.status === 409) {
              resolve(sessionId)
            } else {
              console.log(error)
              console.warn(
                'No connection to OpenVidu Server. This may be a certificate error at ' +
                            OPENVIDU_SERVER_URL
              )
              if (
                window.confirm(
                  'No connection to OpenVidu Server. This may be a certificate error at "' +
                                OPENVIDU_SERVER_URL +
                                '"\n\nClick OK to navigate and accept it. ' +
                                'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                                OPENVIDU_SERVER_URL +
                                '"'
                )
              ) {
                window.location.assign(OPENVIDU_SERVER_URL + '/accept-certificate')
              }
            }
          })
      })
    },
    createToken(sessionId) {
      return new Promise((resolve, reject) => {
        var data = JSON.stringify({ session: sessionId })
        axios
          .post(OPENVIDU_SERVER_URL + '/api/tokens', data, {
            headers: {
              Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
              'Content-Type': 'application/json'
            }
          })
          .then((response) => {
            console.log('TOKEN', response)
            resolve(response.data.token)
          })
          .catch((error) => reject(error))
      })
    }
  }
}
</script>

<style>
@import "./index.css";
</style>
