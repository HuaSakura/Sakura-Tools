<template>
  <div class="app">
    <div class="window-operate">
      <div ref="titleBar" class="window-operate-left"></div>
      <div class="window-operate-right">
        <div class="window-operate-icon" @click="TopOperation">
          <PushpinOutlined v-if="TopType"/>
          <PushpinFilled v-else/>
        </div>
        <div class="window-operate-icon" @click="minimizeWindow">
          <MinusOutlined/>
        </div>
        <div class="window-operate-icon" @click="FullScreen">
          <FullscreenOutlined v-if="FullScreenType"/>
          <FullscreenExitOutlined v-else/>
        </div>
        <div class="window-operate-icon close" @click="CloseWindow">
          <CloseOutlined/>
        </div>
      </div>
    </div>
    <router-view :key="route.fullPath"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {useRoute} from "vue-router";
import {
  CloseOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  MinusOutlined,
  PushpinFilled,
  PushpinOutlined
} from "@ant-design/icons-vue"

export default defineComponent({
  name: "App",
  components: {
    PushpinFilled,
    MinusOutlined,
    CloseOutlined,
    PushpinOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined
  },
  setup() {
    const route = useRoute();
    const FullScreenType = ref(true as boolean);
    const TopType = ref(true as boolean);
    const titleBar = ref(null as any);

    function FullScreen() {
      FullScreenType.value = !FullScreenType.value;
      window.ipcRenderer.send('full-screen-type', !FullScreenType.value)
    }

    function TopOperation() {
      TopType.value = !TopType.value;
      window.ipcRenderer.send('top-type', !TopType.value)
    }

    function CloseWindow(){
      window.ipcRenderer.send('close-window')
    }

    function minimizeWindow(){
      window.ipcRenderer.send('minimize-window')
    }

    return {
      route,
      TopType,
      titleBar,
      FullScreen,
      CloseWindow,
      TopOperation,
      FullScreenType,
      minimizeWindow
    }
  }
})
</script>

<style scoped lang="less">
.app {
  width: 100vw;
  height: 100vh;

  .window-operate {
    display: flex;
    top: 0;
    position: fixed;
    width: 100vw;
    height: 36px;
    z-index: 5000;

    .window-operate-left {
      width: 100%;
      -webkit-app-region: drag;
    }

    .window-operate-right {
      display: flex;
      width: 205px;

      &:hover {
        .window-operate-icon {
          .anticon {
            font-size: 14px;
            font-weight: bold;
            color: #eee;
          }
        }
      }

      .window-operate-icon {
        width: 25%;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;

        .anticon {
          font-size: 14px;
          font-weight: bold;
          color: #888888;
        }

        &:hover {
          background-color: #242424;
        }
      }

      .close {
        &:hover {
          background-color: #FF0000;
        }
      }
    }
  }
}

</style>
