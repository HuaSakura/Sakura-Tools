import {dirname, join} from "node:path"
import {restart, setAutoStart} from "./utils.ts";
import {app, globalShortcut, ipcMain, shell} from 'electron';
import {useSqlite} from "./sqlite.ts";

const {getTheme, setTheme} = useSqlite();


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
    const exePath: string = dirname(app.getPath('exe'));
    const staticPath: string = 'resources/app.asar.unpacked/';
    const publicPath: string = process.env.VITE_PUBLIC || '';

    let configPath: string;
    let iconPath: string;

    if (JudgmentMode()) {
        configPath = join(publicPath, 'config');
        iconPath = join(publicPath, 'favicon.ico');
    } else {
        configPath = join(exePath, staticPath, 'config');
        iconPath = join(exePath, 'favicon.ico');
    }

    return {configPath, iconPath};
}

/**
 * 注册全局快捷键
 * @constructor
 */
function RegisterGlobalShortcut(mainWin: any) {

    //退出全屏
    globalShortcut.register('shift + ESC', () => {
        mainWin.fullScreen = false
    })

    //全屏
    globalShortcut.register('shift + F1', () => {
        mainWin.fullScreen = true
    })

    //开发者工具
    globalShortcut.register('ctrl + shift + i', () => {
        mainWin.webContents.openDevTools()
    })

    //重启
    globalShortcut.register('ctrl + shift + alt + r', () => {
        restart()
    })

    //确认
    globalShortcut.register('ctrl + shift + alt + y', () => {
        mainWin.webContents.send('enter')
    })

    //取消
    globalShortcut.register('ctrl + shift + alt + n', () => {
        mainWin.webContents.send('exit')
    })

    //设置
    globalShortcut.register('ctrl + shift + alt + s', () => {
        mainWin.webContents.send('setting')
    })

    //退出
    globalShortcut.register('ctrl + shift+ alt + d', () => {
        mainWin.webContents.send('dropOut')
    })

    //关闭退出
    globalShortcut.register('ctrl + shift+ alt + q', () => {
        app.exit(0)
    })

    //屏蔽Alt+F4
    mainWin.webContents.on("before-input-event", (_: any, input: any) => {
        mainWin.webContents.setIgnoreMenuShortcuts(input.key === "F4" && input.alt);
    })
}

/**
 * 信号通道
 */
function signalPath(mainWin: any) {
    ipcMain.handle('full-screen-type', (_event, type) => {
        if (type && !mainWin.isMaximized()) {
            mainWin.maximize()
        } else {
            mainWin.unmaximize()
        }
    })

    ipcMain.handle('top-type', (_event, type) => {
        mainWin.setAlwaysOnTop(type)
    })

    ipcMain.handle('win-restart', () => {
        restart()
    })

    ipcMain.handle('close-window', () => {
        mainWin.close()
    })

    ipcMain.handle('minimize-window', () => {
        mainWin.minimize()
    })

    ipcMain.handle('open-official-website', () => {
        shell.openExternal('https://www.98one.cn');
    })

    ipcMain.handle('set-auto-start', (_event, data) => {
        setAutoStart(data)
    })

    ipcMain.handle('get-theme', async () => {
        return await getTheme()
    })

    ipcMain.handle('set-theme', async (_event, data) => {
        return await setTheme(data)
    })
}

export {RegisterGlobalShortcut, signalPath, SetFilePath, JudgmentMode}
