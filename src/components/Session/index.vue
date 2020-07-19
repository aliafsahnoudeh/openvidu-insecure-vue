<template>
  <div id="session">
    <div id="session-header">
      <h1 id="session-title">
        {{ sessionId }}
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
        v-for="(sub, i) in subscribers"
        :key="i"
        class="stream-container col-md-6 col-xs-6"
        @click="handleMainVideoStream(sub)"
      >
        <UserVideoComponent :stream-manager="sub" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import UserVideoComponent from '../UserVideoComponent'

export default {
  name: 'Session',
  components: {
    UserVideoComponent
  },
  computed: {
    ...mapState('session', [
      'mainStreamManager',
      'session',
      'sessionId',
      'publisher',
      'subscribers'
    ])
  },
  methods: {
    ...mapActions('session', [
      'leave'
    ]),
    onbeforeunload(event) {
      this.leaveSession()
    },
    leaveSession() {
      // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

      if (this.session) {
        this.session.disconnect()
      }

      // Empty all properties...
      this.leave()
    },
    handleMainVideoStream(stream) {
      if (this.mainStreamManager !== stream) {
        this.mainStreamManager = stream
      }
    }
  }
}
</script>

<style>

</style>
