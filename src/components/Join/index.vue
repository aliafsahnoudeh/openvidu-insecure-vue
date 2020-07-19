<template>
  <div id="join">
    <div id="img-div">
      <img src="../../assets/images/openvidu_grey_bg_transp_cropped.png" alt="OpenVidu logo">
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
            :value="username"
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
            :value="sessionId"
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
</template>

<script>
import { OpenVidu } from 'openvidu-browser'
import axios from 'axios'
import config from '../../config'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Join',
  computed: {
    ...mapState('session', [
      'OV',
      'session',
      'subscribers',
      'username',
      'sessionId'
    ])
  },
  methods: {
    ...mapActions('session', [
      'setSessionId',
      'setUsername',
      'setOV',
      'setSession',
      'setPublisher',
      'setMainStreamManager',
      'deleteSubscriber'
    ]),
    joinSession() {
      // --- 1) Get an OpenVidu object ---
      this.setOV(new OpenVidu())
      // --- 2) Init a session ---
      this.setSession(this.OV.initSession())

      // --- 3) Specify the actions when events take place in the session ---
      // On every new Stream received...
      this.session.on('streamCreated', (event) => {
        console.log(`streamCreated`)
        // Subscribe to the Stream to receive it. Second parameter is undefined
        // so OpenVidu doesn't create an HTML video by its own
        var subscriber = this.session.subscribe(event.stream, undefined)
        this.subscribers.push(subscriber)
      })

      // On every Stream destroyed...
      this.session.on('streamDestroyed', (event) => {
        // Remove the stream from 'subscribers' array
        this.deleteSubscriber(event.stream.streamManager)
      })

      // --- 4) Connect to the session with a valid user token ---

      // 'getToken' method is simulating what your server-side should do.
      // 'token' parameter should be retrieved and returned by your own backend
      this.getToken().then((token) => {
        // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
        // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
        this.session
          .connect(
            token,
            { clientData: this.username }
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

            this.session.publish(publisher)

            // Set the main video in the page to display our webcam and store our Publisher
            this.setPublisher(publisher)
            this.setMainStreamManager(publisher)
          })
          .catch((error) => {
            console.log('There was an error connecting to the session:', error.code, error.message)
          })
      })
    },
    handleChangeSessionId(e) {
      this.setSessionId(e.target.value)
    },
    handleChangeUserName(e) {
      this.setUsername(e.target.value)
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
      return this.createSession().then((id) => this.createToken(id))
    },
    createSession() {
      return new Promise((resolve, reject) => {
        var data = JSON.stringify({ customSessionId: this.sessionId })
        console.log(`createSession: ${data}`)

        axios
          .post(config.OPENVIDU_SERVER_URL + '/api/sessions', data, {
            headers: {
              Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + config.OPENVIDU_SERVER_SECRET),
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
              resolve(this.sessionId)
            } else {
              console.log(error)
              console.warn(
                'No connection to OpenVidu Server. This may be a certificate error at ' +
                            config.OPENVIDU_SERVER_URL
              )
              if (
                window.confirm(
                  'No connection to OpenVidu Server. This may be a certificate error at "' +
                                config.OPENVIDU_SERVER_URL +
                                '"\n\nClick OK to navigate and accept it. ' +
                                'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                                config.OPENVIDU_SERVER_URL +
                                '"'
                )
              ) {
                window.location.assign(config.OPENVIDU_SERVER_URL + '/accept-certificate')
              }
            }
          })
      })
    },
    createToken(sessionId) {
      return new Promise((resolve, reject) => {
        console.log(`createToken: ${sessionId}`)
        var data = JSON.stringify({ session: sessionId })
        axios
          .post(config.OPENVIDU_SERVER_URL + '/api/tokens', data, {
            headers: {
              Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + config.OPENVIDU_SERVER_SECRET),
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

</style>
