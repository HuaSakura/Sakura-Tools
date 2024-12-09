<template>
  <div class="index">
    <div class="index-title">
      首页
    </div>
    <div class="index-content">
      还没想好放什么
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: "index",
  setup() {
      return {}
  }
})
</script>

<style scoped lang="less">
.index {
  position: relative;
  width: 100%;
  height: 100%;

  .index-title {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    padding-bottom: 12px;
    margin: 0 16px;
  }
}

html[data-theme='light'] {
  .index {
    .index-title {
      border-bottom: 2px solid rgba(0, 0, 0, .1);
    }
  }
}

html[data-theme='dark'] {
  .index {
    .index-title {
      border-bottom: 2px solid rgba(255, 255, 255, .1);
    }
  }
}
</style>
