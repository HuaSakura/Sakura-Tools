import {app, BrowserWindow, ipcMain, Menu, Tray} from "electron";
import {dirname, join} from "node:path";
import {createWindow, VITE_DEV_SERVER_URL} from "../../electron/main.ts";
import {fileURLToPath} from "node:url";

//@ts-ignore
let staticPath: string = 'resources/app.asar.unpacked/';

const __dirname = dirname(fileURLToPath(import.meta.url))

function useCreateWindow(iconPath: string) {
    let mainWin = new BrowserWindow({
        title: import.meta.env.VITE_APP_TITLE,
        width: 1024,
        height: 768,
        frame: false,
        resizable: false,
        icon: iconPath,
        minimizable: true,
        maximizable: true,
        webPreferences: {
            preload: join(__dirname, 'preload.mjs'),
            webSecurity: true,
            nodeIntegration: true,
            contextIsolation: true,
            //@ts-ignore
            nativeWindowOpen: true,
        }
    })

    return mainWin
}

function DidFinishLoad(mainWin: any) {
    mainWin.webContents.on('did-finish-load', () => {
        ipcMain.on('win-restart', () => {
            restart()
        })

        if (JudgmentMode()) {
            mainWin.webContents.openDevTools()
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
        app.setLoginItemSettings({
            openAtLogin: true,
            type: "mainAppService",
            path: `"${process.execPath}"`
        })
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
 * 判断是否为开发模式
 * @constructor
 */
function JudgmentMode() {
    return process.env.NODE_ENV === 'development';
}


/**
 * 设置文件路径
 * @constructor
 */
function SetFilePath() {
    let iconPath: any;

    if (JudgmentMode()) {
        iconPath = join(process.env.VITE_PUBLIC, 'favicon.ico')
    } else {
        iconPath = join(dirname(app.getPath('exe')), 'favicon.ico')
    }

    return {iconPath}
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

export {
    restart,
    SetBootPath,
    SetFilePath,
    JudgmentMode,
    DidFinishLoad,
    createTrayIcon,
    useCreateWindow,
    OrganizeWindowDefaultEvents
}