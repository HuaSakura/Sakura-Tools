import {app, globalShortcut, ipcMain, shell} from 'electron';
import {restart} from "./utils.ts";

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
    ipcMain.on('full-screen-type', (_event, type) => {
        if (type && !mainWin.isMaximized()) {
            mainWin.maximize()
        } else {
            mainWin.unmaximize()
        }
    })

    ipcMain.on('top-type', (_event, type) => {
        mainWin.setAlwaysOnTop(type)
    })

    ipcMain.on('close-window', () => {
        mainWin.close()
    })

    ipcMain.on('minimize-window', () => {
        mainWin.minimize()
    })

    ipcMain.on('open-official-website', () => {
        shell.openExternal('https://www.98one.cn');
    })
}

export {RegisterGlobalShortcut, signalPath}