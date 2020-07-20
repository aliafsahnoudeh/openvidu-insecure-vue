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
      'init',
      'join'
    ]),
    joinSession() {
      try {
        this.init()
        this.join()
      } catch (error) {
        alert(error)
      }
    },
    handleChangeSessionId(e) {
      this.setSessionId(e.target.value)
    },
    handleChangeUserName(e) {
      this.setUsername(e.target.value)
    }
  }
}
</script>
