<template>
    <div class="streamcomponent">
        <OpenViduVideoComponent :streamManager="streamManager" />
        <div><p>{{ getNicknameTag() }}</p></div>
    </div>
</template>

<script>
import OpenViduVideoComponent from './OvVideo';

export default {
    components: {
        OpenViduVideoComponent
    },
    props:{
        streamManager: {
            type: Object,
            default() {
                return null;
            }
        }
    },
    methods: {
        getNicknameTag() {
            // Gets the nickName of the user
            return JSON.parse(this.streamManager.stream.connection.data).clientData;
        }
    }
}
</script>


<style scoped>
video {
    width: 100%;
    height: auto;
    float: left;
    cursor: pointer;
}
.streamcomponent div {
    position: absolute;
    background: #f8f8f8;
    padding-left: 5px;
    padding-right: 5px;
    color: #777777;
    font-weight: bold;
    border-bottom-right-radius: 4px;
}
p{
    margin: 0;
}
</style>