<template>
  <div id="app">
    <Main />
  </div>
</template>

<script>
import Main from '@/components/Main'

export default {
  name: 'App',
  components: {
    Main
  }
}
</script>

<style>
html {
	position: relative;
	min-height: 100%;
}

body {
	margin: 0;
	padding: 0;
	width: 100%;
}
</style>
