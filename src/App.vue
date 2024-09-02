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
          <div class="app-left-content-logo">
            <img src="./assets/favicon.ico" alt="" @click="openOfficialWebsite">
          </div>
          <div class="app-left-content-button">
            <div class="button-bottom">
              <div class="icon">
                <svg version="1.1" role="presentation" width="20" height="20" viewBox="0 0 24 24" class="mo-icon">
                  <g stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <line x1="14" y1="4" x2="23" y2="4"></line>
                    <line x1="1" y1="4" x2="4" y2="4"></line>
                    <line data-color="color-2" x1="22" y1="12" x2="23" y2="12"></line>
                    <line data-color="color-2" x1="1" y1="12" x2="12" y2="12"></line>
                    <line x1="14" y1="20" x2="23" y2="20"></line>
                    <line x1="1" y1="20" x2="4" y2="20"></line>
                    <circle cx="7" cy="4" r="3"></circle>
                    <circle data-color="color-2" cx="15" cy="12" r="3"></circle>
                    <circle cx="7" cy="20" r="3"></circle>
                  </g>
                </svg>
              </div>
              <div class="icon">
                <svg version="1.1" role="presentation" width="20" height="20" viewBox="0 0 24 24" class="mo-icon">
                  <g>
                    <g stroke-linecap="round" stroke-linejoin="round" stroke-width="2" fill="#fff" stroke="#fff">
                      <circle fill="none" stroke="#fff" stroke-miterlimit="10" cx="12" cy="12" r="11"></circle>
                      <path data-color="color-2" fill="none" stroke-miterlimit="10"
                            d="M12,15v-2 c1.609,0,3-1.391,3-3s-1.391-3-3-3c-1.194,0-2.342,0.893-2.792,1.921"></path>
                      <circle data-color="color-2" data-stroke="none" cx="12" cy="18" r="1" stroke-linejoin="miter"
                              stroke-linecap="square" stroke="none"></circle>
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </div>
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
  PushpinOutlined,
  QuestionCircleOutlined,
  SettingOutlined
} from "@ant-design/icons-vue"
import {useColorMode} from "@vueuse/core";

export default defineComponent({
  name: "App",
  components: {
    QuestionCircleOutlined,
    SettingOutlined,
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
