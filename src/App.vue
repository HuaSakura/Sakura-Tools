<template>
  <div class="app">
    <img src="./assets/electron-vite.svg" alt="">
  </div>
</template>

<script lang="ts">

import {defineComponent} from "vue";

export default defineComponent({
  name: 'App',
  setup() {
    console.log('App')
    return {}
  }
})

</script>

<style scoped lang="less">
.app {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 50%;
    height: 50%;
  }
}
</style>
