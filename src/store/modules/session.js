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
      commit('SET_SESSION_ID', sessionId)
    },
    setUsername({ commit }, username) {
      commit('SET_USER_NAME', username)
    },
    setOV({ commit }, OV) {
      commit('SET_OV', OV)
    },
    setSession({ commit }, session) {
      commit('SET_SESSION', session)
    },
    setPublisher({ commit }, publisher) {
      commit('SET_PUBLISHER', publisher)
    },
    setMainStreamManager({ commit }, mainStreamManager) {
      commit('SET_MAIN_STREAM_MANAGER', mainStreamManager)
    },
    leave({ commit }) {
      commit('LEAVE')
    },
    deleteSubscriber({ commit }, streamManager) {
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
