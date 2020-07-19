<template>
  <div id="app">
    <Join v-if="!session" />
    <Session v-else />
  </div>
</template>

<script>
import Join from '@/components/Join'
import Session from '@/components/Session'
import { mapState } from 'vuex'

export default {
  name: 'Main',
  components: {
    Join,
    Session
  },
  computed: {
    ...mapState('session', [
      'session'
    ])
  }
}
</script>

<style>
@import "./index.css";
</style>
