import {app, BrowserWindow, Menu} from 'electron'
//import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

import {
    createTrayIcon,
    DidFinishLoad,
    OrganizeWindowDefaultEvents,
    SetBootPath,
    SetFilePath,
    useCreateWindow
} from "../src/utils/utils.ts";
import {RegisterGlobalShortcut, signalPath} from "../src/utils/signalPath.ts";

//const require: NodeRequire = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

// 构建的目录结构
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let mainWin: any;

// logToFile(`'cwd====${process.cwd()}'`)
// logToFile(`'execPath====${process.execPath}'`)
// logToFile(`'__dirname====${__dirname}'`)
// logToFile(`'process.env.VITE_PUBLIC====${process.env.VITE_PUBLIC}'`)
// logToFile(`'app.getPath('exe')====${dirname(app.getPath('exe'))}'`)
// logToFile(`'app.getPath('home')====${app.getPath('home')}'`)

/**
 * 判断只允许开启一个窗口
 */
const goTheLock: boolean = app.requestSingleInstanceLock()
if (!goTheLock) {
    app.quit()
} else {
    app.on('second-instance', () => {
        if (mainWin) {
            if (mainWin.isMinimized()) {
                mainWin.restore()
                mainWin.focus()
                mainWin.show()
            }
        }
    })

    app.on('ready', () => {
        createWindow()
        createTrayIcon(mainWin)
    })
}

/**
 * 创建窗口
 */
function createWindow() {
    const {iconPath} = SetFilePath()
    mainWin = useCreateWindow(iconPath)

    /**
     * 监听窗口加载完成事件
     */
    DidFinishLoad(mainWin)

    /**
     * 设置窗口启动路径
     */
    SetBootPath(mainWin)

    /**
     * 阻止默认关闭窗口事件
     */
    OrganizeWindowDefaultEvents(mainWin)

    /**
     * 注册全局快捷键
     */
    RegisterGlobalShortcut(mainWin)

    /**
     * 信号通道
     */
    signalPath(mainWin)

    /**
     * 隐藏menu
     */
    Menu.setApplicationMenu(null)

}

/**
 * 设置默认语言
 */
app.commandLine.appendSwitch('lang', 'zh-CN')

/**
 * 当所有窗口都关闭时退出，但在 macOS 上除外。在那里，应用程序及其菜单栏通常会保持活动状态，直到用户使用 Cmd + Q 明确退出。
 */
app.on('window-all-closed', () => {
    mainWin = null
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

/**
 * 当应用程序激活时，如果没有其他窗口打开，则重新创建窗口。
 */
app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

export {
    createWindow
}

