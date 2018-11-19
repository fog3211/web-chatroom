<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
    name: "App"
};
</script>

<style scoped lang="less">
.size {
    width: 100%;
    height: 100%;
}
html,
body {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
#app {
    .size;
      overflow: hidden;
}
</style>
