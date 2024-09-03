import {defineConfig} from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers';
import {resolve} from "path";

function pathResolve(dir: string) {
    return resolve(process.cwd(), '.', dir);
}

// https://cn.vitejs.dev/config/
export default defineConfig({
    server: {
        port: 5919
    },
    css: {
        preprocessorOptions: {
            less: {
                lessOptions: {
                    modifyVars: {
                       'checkbox-check-bg': '#5b5bfa',
                        'checkbox-color': '#fff',
                        'checkbox-check-color': '#fff'
                    }
                },
                javascriptEnabled: true,
            },
        },
    },
    resolve: {
        alias: [
            {
                find: '@',
                replacement: pathResolve('src'),
            },
        ],
    },
    plugins: [
        vue(),
        Components({
            resolvers: [
                AntDesignVueResolver({
                    importStyle: true,
                }),
            ],
        }),
        electron({
            main: {
                // Shortcut of `build.lib.entry`.
                entry: 'electron/main.ts',
            },
            preload: {
                // build.rollupOptions.input' 的快捷方式。预加载脚本可能包含 Web 资产，因此请使用“build.rollupOptions.input”而不是“build.lib.entry”。
                input: path.join(__dirname, 'electron/preload.ts'),
            },
            // Ployfill Electron 和 Node.js API 用于渲染器进程。如果要在 Renderer 进程中使用 Node.js，则需要在 Main 进程中启用 'nodeIntegration'。
            // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
            // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
            renderer: process.env.NODE_ENV === 'test' ? undefined : {},
        }),
    ],
})
