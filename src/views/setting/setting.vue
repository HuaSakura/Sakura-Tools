<template>
  <div class="setting">
    <div class="setting-title">
      基础设置
    </div>
    <div class="setting-content">
      <a-form layout="horizontal" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 8,offset: 1  }">
        <a-form-item label="外观" name="appearance">
          <div class="appearance">
            <div class="appearance-content" @click="switchThemes('auto')">
              <div
                  :class="{'appearance-auto': !theme['autoType'], 'appearance-auto-selected': theme['autoType']}"></div>
              <div :class="{'appearance-text': !theme['autoType'], 'appearance-text-selected': theme['autoType']}">
                自动
              </div>
            </div>
            <div class="appearance-content" @click="switchThemes('light')">
              <div
                  :class="{'appearance-light': !theme['lightType'], 'appearance-light-selected': theme['lightType']}"></div>
              <div :class="{'appearance-text': !theme['lightType'], 'appearance-text-selected': theme['lightType']}">
                浅色
              </div>
            </div>
            <div class="appearance-content" @click="switchThemes('dark')">
              <div
                  :class="{'appearance-dark': !theme['darkType'], 'appearance-dark-selected': theme['darkType']}"></div>
              <div :class="{'appearance-text': !theme['darkType'], 'appearance-text-selected': theme['darkType']}">
                深色
              </div>
            </div>
          </div>
        </a-form-item>

        <a-form-item label="启动" name="initiate">
          <a-checkbox v-model:checked="autoStart">开机自启动</a-checkbox>
        </a-form-item>
      </a-form>

      <div class="setting-footer">
        <div class="setting-footer-btn">
          <a-button type="primary" @click="saveApply">保存并应用</a-button>
          <a-button @click="abandon">放弃</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {Button, Checkbox, Form, FormItem} from "ant-design-vue";
import {setTheme} from "@/settings/setTheme.ts";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "setting",
  components: {
    Form: [Form.name],
    Button: [Button.name],
    FormItem: [FormItem.name],
    Checkbox: [Checkbox.name],
  },
  setup() {
    const router = useRouter();

    const theme: any = ref({
      autoType: true,
      darkType: false,
      lightType: false
    });

    const autoStart = ref(false as boolean);

    const typesFun: any = {
      'auto': () => {
        theme.value = {autoType: true, lightType: false, darkType: false}
      },
      'light': () => {
        theme.value = {autoType: false, lightType: true, darkType: false}
      },
      'dark': () => {
        theme.value = {autoType: false, lightType: false, darkType: true}
      }
    };

    function switchThemes(type: any) {
      typesFun[type]()
      let types: any = checkObjectType();
      setTheme(types)
    }

    function checkObjectType() {
      for (let key in theme.value) {
        const type = theme.value[key];
        if(type == true){
          return key.replace('Type', '');
        }
      }
    }

    function saveApply() {
      window.ipcRenderer.send('set-auto-start', autoStart.value)
    }

    function abandon() {
      router.push('/')
    }

    return {
      theme,
      abandon,
      autoStart,
      saveApply,
      switchThemes
    }
  }
})
</script>

<style scoped lang="less">
.setting {
  position: relative;
  width: 100%;
  height: 100%;

  .setting-title {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    padding-bottom: 12px;
    margin: 0 16px;
  }

  .setting-content {
    margin-top: 20px;
  }

  .appearance {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .appearance-content {
      margin-right: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .appearance-text {
        margin-top: 5px;
      }

      .appearance-text-selected {
        color: #5b5bfa;
      }

      .appearance-auto,
      .appearance-light,
      .appearance-dark {
        width: 68px;
        height: 44px;
        border-radius: 5px;
        border: 1px solid #fff;
      }

      .appearance-auto {
        background: url('@/assets/images/auto.png') 50% / 68px 44px no-repeat;
      }

      .appearance-light {
        background: url('@/assets/images/light.png') 50% / 68px 44px no-repeat;
      }

      .appearance-dark {
        background: url('@/assets/images/dark.png') 50% / 68px 44px no-repeat;
      }

      .appearance-auto-selected,
      .appearance-light-selected,
      .appearance-dark-selected {
        width: 68px;
        height: 44px;
        border-radius: 5px;
        border: 1px solid #5b5bfa;
      }

      .appearance-auto-selected {
        background: url('@/assets/images/auto.png') 50% / 68px 44px no-repeat;
      }

      .appearance-light-selected {
        background: url('@/assets/images/light.png') 50% / 68px 44px no-repeat;
      }

      .appearance-dark-selected {
        background: url('@/assets/images/dark.png') 50% / 68px 44px no-repeat;
      }
    }
  }

  .setting-footer {
    width: 100%;
    height: 40px;
    padding: 0 12px;
    position: absolute;
    bottom: 0;

    .setting-footer-btn {
      width: 165px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}


html[data-theme='light'] {
  .setting {
    .setting-title {
      border-bottom: 2px solid rgba(0, 0, 0, .1);
    }

    .setting-content {
      .ant-form,
      .ant-form-item,
      .ant-form-item-label {
        color: #000;

        :deep(label) {
          color: #000;
        }
      }
    }
  }
}

html[data-theme='dark'] {
  .setting {
    .setting-title {
      border-bottom: 2px solid rgba(255, 255, 255, .1);
    }

    .setting-content {
      .ant-form,
      .ant-form-item,
      .ant-form-item-label {
        color: #fff;

        :deep(label) {
          color: #fff;
        }
      }
    }
  }
}
</style>