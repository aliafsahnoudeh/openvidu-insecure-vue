<template>
  <div id="app">
    <Navbar />
    <Main />
  </div>
</template>

<script>
import Main from '@/components/Main'
import Navbar from '@/components/Navbar'

export default {
  name: 'App',
  components: {
    Navbar,
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
