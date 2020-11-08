<template>
  <div id="app" style="width: 100%; height: 100%">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>

/* Main settings */

#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  /*text-align: center;*/
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
}

html, body {
  margin: 0px;
  padding: 0px;

  height: 100%;
  width: 100%;
  background: #18172a;
  overflow: hidden;
}

table {
  border-collapse: collapse;
  /*border: solid 1px #5eeec5;*/
}

* {
  box-sizing: border-box;
}

body.home {
  /*background: #18172a;*/
  /*background: red;*/
  /*overflow: hidden;*/
}

body.intro {
  /*background: pink;*/
}

</style>
