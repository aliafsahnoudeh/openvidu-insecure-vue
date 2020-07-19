const app = {
  namespaced: true,
  state: {
    sessionId: 'SessionA',
    username: 'Participant' + Math.floor(Math.random() * 100),
    OV: null,
    session: undefined,
    mainStreamManager: undefined,
    publisher: undefined,
    subscribers: []
  },
  actions: {
    setSessionId({ commit }, sessionId) {
      console.log(`setSessionId`)
      commit('SET_SESSION_ID', sessionId)
    },
    setUsername({ commit }, username) {
      console.log(`setUsername`)
      commit('SET_USER_NAME', username)
    },
    setOV({ commit }, OV) {
      console.log(`setOV`)
      commit('SET_OV', OV)
    },
    setSession({ commit }, session) {
      console.log(`setSession`)
      commit('SET_SESSION', session)
    },
    setPublisher({ commit }, publisher) {
      console.log(`setPublisher`)
      commit('SET_PUBLISHER', publisher)
    },
    setMainStreamManager({ commit }, mainStreamManager) {
      console.log(`setMainStreamManager`)
      commit('SET_MAIN_STREAM_MANAGER', mainStreamManager)
    },
    leave({ commit }) {
      console.log(`leave`)
      commit('LEAVE')
    },
    deleteSubscriber({ commit }, streamManager) {
      console.log(`deleteSubscriber`)
      commit('DELETE_SUBSCRIBER', streamManager)
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
      state.sessionId = 'SessionA'
      state.myUserName = 'Participant' + Math.floor(Math.random() * 100)
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
