import {createApp} from 'vue'
import './style.less'
import './design/theme.less'
import App from './App.vue'
import {registerThirdComp} from "./settings/registerThirdComp.ts";
import {setTheme} from "./settings/setTheme.ts";

async function bootstrap() {
    const app = createApp(App);
    /**
     * 设置主题
     */
    await setTheme()

    /**
     * 注册第三方组件
     */
    registerThirdComp(app)

    /**
     * 挂载
     */
    app.mount('#app').$nextTick(() => {
        // Use contextBridge
        // window.ipcRenderer.on('main-process-message', (_event, message) => {
        //     console.log(message)
        // })
    })
}

bootstrap()