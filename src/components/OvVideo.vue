<template>
  <video autoPlay="true" ref="videoRef" :id="streamManager.stream.connection.connectionId"/>
</template>

<script>
export default {
     props:{
        streamManager: {
            type: Object,
            default() {
                return null;
            }
        }
    },
    methods:{
        addVideoElement() {
        if (this.streamManager) {
            const element = document.getElementById(this.streamManager.stream.connection.connectionId)
            this.streamManager.addVideoElement(element);
        }
        }
    },
    mounted() {
        this.addVideoElement()
    },
    updated() {
        this.addVideoElement()
    }
}
</script>

<style>

</style>