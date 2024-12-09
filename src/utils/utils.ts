import {app, BrowserWindow, Menu, Tray} from "electron";
import {dirname, join} from "node:path";
import {createWindow, VITE_DEV_SERVER_URL} from "../../electron/main.ts";
import {fileURLToPath} from "node:url";
import {JudgmentMode} from './signalPath.ts'
import {getUserInfo, initSql} from "./sqlite.ts";

const __dirname = dirname(fileURLToPath(import.meta.url))

function useCreateWindow(iconPath: string) {
    let mainWin: BrowserWindow = new BrowserWindow({
        show: false,
        title: import.meta.env.VITE_APP_TITLE,
        width: 1024,
        height: 768,
        frame: false,
        icon: iconPath,
        resizable: false,
        minimizable: true,
        maximizable: true,
        backgroundColor: '#000',
        webPreferences: {
            webviewTag: true,
            webSecurity: true,
            nodeIntegration: true,
            contextIsolation: false,
            preload: join(__dirname, './preload.mjs'),
        }
    })

    return mainWin
}

function DidFinishLoad(mainWin: any) {
    mainWin.webContents.on('did-finish-load', () => {
        mainWin.show()
        initSql()
        getUserInfo()
        if (JudgmentMode()) {
            //mainWin.webContents.openDevTools()
        } else {
            setTimeout(() => {
                mainWin.fullScreen = true
            }, 1000)
        }
    })
}

/**
 * 设置应用启动路径
 * @param mainWin
 * @constructor
 */
function SetBootPath(mainWin: any) {
    if (JudgmentMode()) {
        mainWin.loadURL(VITE_DEV_SERVER_URL)
    } else {
        mainWin.loadFile('dist/index.html')
    }
}

/**
 * 重启应用
 */
function restart() {
    app.relaunch()
    setTimeout(() => app.exit(), 100)
}

/**
 *  阻止默认关闭窗口事件
 */
function OrganizeWindowDefaultEvents(mainWin: any) {
    mainWin.on('close', (event: any) => {
        event.preventDefault()
        mainWin.hide()
    })
}

/**
 * 创建托盘图标
 */
function createTrayIcon(mainWin: any) {
    const tray: any = new Tray(join(process.env.VITE_PUBLIC, 'favicon.ico'))
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '重启', click: () => {
                restart()
            }
        },
        {
            label: '退出', click: () => {
                app.exit(0)
            }
        }
    ])
    tray.setToolTip(import.meta.env.VITE_APP_TITLE)
    tray.setContextMenu(contextMenu)

    /**
     * 双击托盘图标打开窗口
     */
    tray.on('double-click', () => {
        if (!mainWin) {
            createWindow()
        } else {
            mainWin.show()
        }
    })
}

/**
 * 设置开机启动
 * @param type
 */
function setAutoStart(type: boolean) {
    app.setLoginItemSettings({
        openAtLogin: type,
        type: "mainAppService",
        path: `"${process.execPath}"`
    })
}

export {
    restart,
    SetBootPath,
    JudgmentMode,
    setAutoStart,
    DidFinishLoad,
    createTrayIcon,
    useCreateWindow,
    OrganizeWindowDefaultEvents
}
