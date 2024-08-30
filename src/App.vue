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
    <div class="window-content">
      <div class="app-left">
        <div class="app-left-content">
          <img src="./assets/favicon.ico" alt="" @click="openOfficialWebsite">
        </div>
      </div>
      <div class="app-content">
        <router-view :key="route.fullPath"/>
      </div>
    </div>
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
import {useColorMode} from "@vueuse/core";

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
    const mode = useColorMode()
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

    function CloseWindow() {
      window.ipcRenderer.send('close-window')
    }

    function minimizeWindow() {
      window.ipcRenderer.send('minimize-window')
    }

    function openOfficialWebsite() {
      window.ipcRenderer.send('open-official-website')
    }

    return {
      mode,
      route,
      TopType,
      titleBar,
      FullScreen,
      CloseWindow,
      TopOperation,
      FullScreenType,
      minimizeWindow,
      openOfficialWebsite
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

  .window-content {
    width: 100vw;
    height: 100vh;
    display: flex;

    .app-left {
      width: 78px;
      height: 100vh;

      .app-left-content {
        padding-top: 36px;
        width: 78px;
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

    .app-content {
      width: calc(100vw - 78px);
      height: calc(100vh - 56px);
      padding: 36px 20px 20px 20px;
    }
  }
}

</style>
