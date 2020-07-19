import Vue from 'vue'
import Vuex from 'vuex'
import session from './modules/session'

import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    session
  },
  getters
})

export default store
