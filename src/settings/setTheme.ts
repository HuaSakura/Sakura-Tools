import {usePreferredColorScheme} from "@vueuse/core";
import {watch} from "vue";

/**
 * 设置主题
 * @param theme
 */
export async function setTheme(theme: string = '') {
    const htmlRoot: any = document.getElementById('htmlRoot')
    if (!htmlRoot) {
        return;
    }
    const preferredColor = usePreferredColorScheme()
    watch(() => preferredColor.value, () => {
        setTheme()
    })
    if (theme == '') {
        htmlRoot.setAttribute('data-theme', preferredColor.value)
    } else {
        htmlRoot.setAttribute('data-theme', theme)
    }
}