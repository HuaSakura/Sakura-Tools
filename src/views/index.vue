<template>
  <div class="index">
    <div class="index-left">
      <div class="index-left-content">
        <img src="../assets/favicon.ico" alt="" @click="openOfficialWebsite">
      </div>
    </div>
    <div class="index-right">

    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: "index",
  setup() {

    function openOfficialWebsite() {
      window.ipcRenderer.send('open-official-website')
    }

    return {
      openOfficialWebsite
    }
  }
})
</script>

<style scoped lang="less">
.index{
  width: 100vw;
  height: 100vh;
  background-color: #343434;

  .index-left {
    width: 78px;
    height: 100vh;
    background-color: #191919;

    .index-left-content {
      padding-top: 36px;
      width: 100%;
      height: 78px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 48px;
        height: 48px;
      }
    }
  }
}

</style>