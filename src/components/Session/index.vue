<template>
  <div id="session">
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
</template>

<script>
export default {
  name: 'Session',
  methods: {
    onbeforeunload(event) {
      this.leaveSession()
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
