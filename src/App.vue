<template>
  <div class="app">
    <img src="./assets/electron-vite.svg" alt="">
  </div>
</template>

<script lang="ts">

import {defineComponent, onMounted} from "vue";
import {getAction} from "./api/api.ts";

export default defineComponent({
  name: 'App',
  setup() {
    console.log('App')

    onMounted(() => {
      getAction('/').then((resp: any) => {
        console.log(resp)
      })
    })

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
