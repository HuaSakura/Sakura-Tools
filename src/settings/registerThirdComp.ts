import type {App} from "vue";
import router from "../router";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.dark.less'

export function registerThirdComp(app: App) {
    app.use(router)
    app.use(Antd)
}