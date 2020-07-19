<template>
  <nav class="navbar navbar-default">
    <div class="container">
      <div class="navbar-header">
        <a class="navbar-brand" href="/">
          Insecure Vue
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style>
nav {
	height: 50px;
	width: 100%;
	z-index: 1;
	background-color: #4d4d4d !important;
	border-color: #4d4d4d !important;
	border-top-right-radius: 0 !important;
	border-top-left-radius: 0 !important;
}

.navbar-header {
	width: 100%;
}

.nav-icon {
	padding: 5px 15px 5px 15px;
	float: right;
}

nav a {
	color: #ccc !important;
}

nav i.fa {
	font-size: 40px;
	color: #ccc;
}

nav a:hover {
	color: #a9a9a9 !important;
}

nav i.fa:hover {
	color: #a9a9a9;
}

nav .navbar-brand {
	padding-left: 20px;
}
</style>
