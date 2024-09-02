<template>
  <div class="setting">
    <div class="setting-title">
      基础设置
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "setting",
  setup() {

    return {}
  }
})
</script>

<style scoped lang="less">
html[data-theme='light'] {
  .setting {
    width: 100%;
    height: 100%;

    .setting-title {
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      padding-bottom: 12px;
      margin: 0 16px;
      border-bottom: 2px solid rgba(0, 0, 0, .1);
    }
  }
}

html[data-theme='dark'] {
  .setting {
    width: 100%;
    height: 100%;

    .setting-title {
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      padding-bottom: 12px;
      margin: 0 16px;
      border-bottom: 2px solid rgba(255, 255, 255, .1);
    }
  }
}
</style>