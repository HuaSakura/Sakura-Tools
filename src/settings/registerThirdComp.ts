import type {App} from "vue";
import router from "../router";

export function registerThirdComp(app: App) {
    app.use(router)
}