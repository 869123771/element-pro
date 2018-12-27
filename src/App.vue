<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import "@/assets/iconfont/iconfont.css";
import "font-awesome/less/font-awesome.less";
import "bootstrap-scss/bootstrap.scss";
import "@/assets/css/custom.css";
export default {
  name: "App"
};
</script>
<style lang="less">
html,
body,
#app {
  height: 100%;
}
</style>
