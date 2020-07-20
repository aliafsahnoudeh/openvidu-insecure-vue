import generator from '@/utils/generator.js'
import config from '@/config'
import { OpenVidu } from 'openvidu-browser'
import ApiService from '@/services/api.service'

const apiService = new ApiService()

const app = {
  namespaced: true,
  state: {
    sessionId: config.DEFAULT_SESSION_NAME,
    username: generator.generateParticipantName(),
    OV: null,
    session: undefined,
    mainStreamManager: undefined,
    publisher: undefined,
    subscribers: []
  },
  actions: {
    setSessionId({ commit }, sessionId) {
      commit('SET_SESSION_ID', sessionId)
    },
    setUsername({ commit }, username) {
      commit('SET_USER_NAME', username)
    },
    init({ commit, state }) {
      // --- 1) Get an OpenVidu object ---
      commit('SET_OV', new OpenVidu())

      // --- 2) Init a session ---
      commit('SET_SESSION', state.OV.initSession())

      // --- 3) Specify the actions when events take place in the session ---
      // On every new Stream received...
      state.session.on('streamCreated', (event) => {
        console.log(`streamCreated`)
        // Subscribe to the Stream to receive it. Second parameter is undefined
        // so OpenVidu doesn't create an HTML video by its own
        const subscriber = state.session.subscribe(event.stream, undefined)
        state.subscribers.push(subscriber)
      })

      // On every Stream destroyed...
      state.session.on('streamDestroyed', (event) => {
      // Remove the stream from 'subscribers' array
        commit('DELETE_SUBSCRIBER', event.stream.streamManager)
      })
    },
    join({ commit, state }) {
      // --- 4) Connect to the session with a valid user token ---

      // 'getToken' method is simulating what your server-side should do.
      // 'token' parameter should be retrieved and returned by your own backend
      apiService.getToken(state.sessionId).then((token) => {
        // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
        // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
        state.session
          .connect(
            token,
            { clientData: state.username }
          )
          .then(() => {
            // --- 5) Get your own camera stream ---

            // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
            // element: we will manage it on our own) and with the desired properties
            const publisher = state.OV.initPublisher(undefined, {
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

            state.session.publish(publisher)

            // Set the main video in the page to display our webcam and store our Publisher
            commit('SET_PUBLISHER', publisher)
            commit('SET_MAIN_STREAM_MANAGER', publisher)
          })
          .catch((error) => {
            console.log('There was an error connecting to the session:', error.code, error.message)
          })
      })
    },
    leave({ commit, state }) {
      // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

      if (state.session) {
        state.session.disconnect()
      }

      // Empty all properties...
      commit('LEAVE')
    },
    setMainStream({ commit, state }, stream) {
      commit('SET_MAIN_STREAM_MANAGER', stream)
    }
  },
  mutations: {
    SET_SESSION_ID: (state, sessionId) => {
      state.sessionId = sessionId
    },
    SET_USER_NAME: (state, username) => {
      state.username = username
    },
    SET_OV: (state, OV) => {
      state.OV = OV
    },
    SET_SESSION: (state, session) => {
      state.session = session
    },
    SET_PUBLISHER: (state, publisher) => {
      state.publisher = publisher
    },
    SET_MAIN_STREAM_MANAGER: (state, mainStreamManager) => {
      state.mainStreamManager = mainStreamManager
    },
    LEAVE: (state) => {
      state.OV = null
      state.session = undefined
      state.subscribers = []
      state.sessionId = config.DEFAULT_SESSION_NAME
      state.myUserName = generator.generateParticipantName()
      state.mainStreamManager = undefined
      state.publisher = undefined
    },
    DELETE_SUBSCRIBER: (state, streamManager) => {
      const index = state.subscribers.indexOf(streamManager, 0)
      if (index > -1) {
        state.subscribers.splice(index, 1)
      }
    }
  }
}

export default app
