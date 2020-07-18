<template>
  <div id="app">
    <div class="container">
      <Join v-if="!session" />
      <Session v-else />
    </div>
  </div>
</template>

<script>
import Join from '@/components/Join'
import Session from '@/components/Session'

export default {
  name: 'Main',
  components: {
    Join,
    Session
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
  }
}
</script>

<style>
@import "./index.css";
</style>
