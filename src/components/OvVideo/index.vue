<template>
  <video :id="streamManager.stream.connection.connectionId" ref="videoRef" autoPlay="true" />
</template>

<script>
export default {
  props: {
    streamManager: {
      type: Object,
      default() {
        return null
      }
    }
  },
  mounted() {
    this.addVideoElement()
  },
  updated() {
    this.addVideoElement()
  },
  methods: {
    addVideoElement() {
      if (this.streamManager) {
        const element = document.getElementById(this.streamManager.stream.connection.connectionId)
        this.streamManager.addVideoElement(element)
      }
    }
  }
}
</script>
