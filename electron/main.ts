import {app, BrowserWindow, globalShortcut, ipcMain, Menu, Tray} from 'electron'
//import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'
import fs from 'node:fs'
import dayjs from "dayjs";

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

let mainWindow: any;
let ledChild: any;
let rtspChild: any;
let serviceChild: any;

let iconPath: string;
let exePath: string;

let staticPath: string = 'resources/app.asar.unpacked/';

let configPath: string;

let logType: boolean;
//@ts-ignore
let ledType: boolean;
//@ts-ignore
let rtspType: boolean;
//@ts-ignore
let serviceType: boolean;

// logToFile(`'cwd====${process.cwd()}'`)
// logToFile(`'execPath====${process.execPath}'`)
// logToFile(`'__dirname====${__dirname}'`)
// logToFile(`'process.env.VITE_PUBLIC====${process.env.VITE_PUBLIC}'`)
// logToFile(`'app.getPath('exe')====${dirname(app.getPath('exe'))}'`)
// logToFile(`'app.getPath('home')====${app.getPath('home')}'`)

//判断只允许开启一个窗口
const goTheLock: boolean = app.requestSingleInstanceLock()
if (!goTheLock) {
    app.quit()
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore()
                mainWindow.focus()
                mainWindow.show()
            }
        }
    })

    app.on('ready', () => {
        createWindow()
        createTrayIcon()
    })
}

/**
 * 创建窗口
 */
function createWindow() {
    SetFilePath();
    mainWindow = new BrowserWindow({
        title: import.meta.env.VITE_APP_TITLE,
        width: 1280,
        height: 800,
        resizable: false,
        icon: iconPath,
        webPreferences: {
            preload: join(__dirname, 'preload.mjs'),
            nodeIntegration: true,
            contextIsolation: true,
            webSecurity: true,
            //@ts-ignore
            nativeWindowOpen: true,
        }
    })

    mainWindow.webContents.on('did-finish-load', () => {
        LoadConfig()

        // const title = mainWindow.webContents.getTitle()
        // mainWindow.setTitle(`${import.meta.env.VITE_APP_TITLE}-${title}`)

        mainWindow.webContents.send('main-process-message', dayjs().format('YYYY-MM-DD HH:mm:ss'))

        ipcMain.on('win-restart', () => {
            restart()
        })

        ipcMain.on('logToFile', (_event, message) => {
            logToFile(message)
        })

        ipcMain.on('writeConfig', (_event, message) => {
            writeConfig(message)
        })

        RegisterGlobalShortcut()

        if (JudgmentMode()) {
            startExe(exePath)
            mainWindow.webContents.openDevTools()
        } else {
            startExe(exePath)
            setTimeout(() => {
                mainWindow.fullScreen = true
            }, 1000)
        }
    })

    if (JudgmentMode()) {
        mainWindow.loadURL(VITE_DEV_SERVER_URL)
    } else {
        app.setLoginItemSettings({
            openAtLogin: true,
            type: "mainAppService",
            path: `"${process.execPath}"`
        })
        mainWindow.loadFile('dist/index.html')
    }

    createMenu()

    // 阻止默认关闭窗口事件
    mainWindow.on('close', (event: any) => {
        event.preventDefault()
        mainWindow.hide()
    })
}

function createMenu() {
    const template: any = [
        {
            label: 'File',
            submenu: [
                {label: 'New', accelerator: 'CmdOrCtrl+N'},
                {label: 'Open', accelerator: 'CmdOrCtrl+O'},
                {type: 'separator'},
                {label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: app.quit}
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {label: 'Undo', accelerator: 'CmdOrCtrl+Z'},
                {label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z'},
                {type: 'separator'},
                {label: 'Cut', accelerator: 'CmdOrCtrl+X'},
                {label: 'Copy', accelerator: 'CmdOrCtrl+C'},
                {label: 'Paste', accelerator: 'CmdOrCtrl+V'}
            ]
        },
        {
            label: 'Help',
            submenu: [
                {label: 'About'}
            ]
        }
    ];

    const menu: any = Menu.buildFromTemplate(template);
    // @ts-ignore
    Menu.setApplicationMenu(menu)
}

/**
 * 重启应用
 */
function restart() {
    stopExe()
    app.relaunch()
    setTimeout(() => app.exit(), 100)
}

/**
 * 启动执行
 * @param path
 */
function startExe(path: string) {
    try {
        startRtsp(path)
        startService(path)
        startLed(path)
    } catch (err) {
        console.error(err)
    }
}

/**
 * 启动rtsp
 * @param path
 */
//@ts-ignore
function startRtsp(path: string) {
    // if (rtspType) {
    //   try {
    //     const rtspStaticPath: string = join(path, 'rtsp/');
    //
    //     rtspChild = spawn(join(rtspStaticPath, 'rtsp2webrtc.exe'), {cwd: rtspStaticPath});
    //
    //     rtspChild.stdout.on('data', (data: any) => {
    //       console.log(`rtspChild_stdout: ${data}`);
    //       logToFile(`rtspChild_stdout: ${data}`)
    //     });
    //
    //     rtspChild.stderr.on('data', (data: any) => {
    //       console.log(`rtspChild_stderr: ${data}`);
    //       logToFile(`rtspChild_stderr: ${data}`)
    //     });
    //   } catch (err) {
    //     console.error(`rtspChild_err:${err}`)
    //     logToFile(`rtspChild_err:${err}`)
    //   }
    // }
}

/**
 * 启动service
 * @param path
 */
//@ts-ignore
function startService(path: string) {
    // if (serviceType) {
    //   try {
    //     const serviceStaticPath: string = join(path, 'service/');
    //
    //     serviceChild = spawn(join(serviceStaticPath, 'gam_gui.exe'), {cwd: serviceStaticPath});
    //
    //     serviceChild.stdout.on('data', (data: any) => {
    //       console.log(`serviceChild_stdout: ${data}`);
    //       logToFile(`serviceChild_stdout: ${data}`)
    //     });
    //
    //     serviceChild.stderr.on('data', (data: any) => {
    //       console.log(`serviceChild_stderr: ${data}`);
    //       logToFile(`serviceChild_stderr: ${data}`)
    //     });
    //   } catch (err) {
    //     console.error(`serviceChild_err:${err}`)
    //     logToFile(`serviceChild_err:${err}`)
    //   }
    // }
}

/**
 * 启动led
 * @param path
 */
//@ts-ignore
function startLed(path: string) {
    // if (ledType) {
    //   try {
    //     const ledStaticPath: string = join(path, 'led/');
    //
    //     ledChild = spawn(join(ledStaticPath, 'WebApplication1.exe'), {cwd: ledStaticPath});
    //
    //     ledChild.stdout.on('data', (data: any) => {
    //       console.log(`ledChild_stdout: ${data}`);
    //       logToFile(`ledChild_stdout: ${data}`)
    //     });
    //
    //     ledChild.stderr.on('data', (data: any) => {
    //       console.log(`ledChild_stderr: ${data}`);
    //       logToFile(`ledChild_stderr: ${data}`)
    //     });
    //   } catch (err) {
    //     console.error(`ledChild_err:${err}`)
    //     logToFile(`ledChild_err:${err}`)
    //   }
    // }
}

/**
 * 停止执行
 */
function stopExe() {
    if (rtspChild) {
        try {
            rtspChild.kill()
        } catch (err) {
            console.error(err)
        }
    }

    if (ledChild) {
        try {
            ledChild.kill()
        } catch (err) {
            console.error(err)
        }
    }

    if (serviceChild) {
        try {
            serviceChild.kill()
        } catch (err) {
            console.error(err)
        }
    }
}

/**
 * 创建托盘图标
 */
function createTrayIcon() {
    const tray: any = new Tray(join(process.env.VITE_PUBLIC, 'favicon.ico'))
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '重启', click: () => {
                restart()
            }
        },
        {
            label: '退出', click: () => {
                stopExe()
                app.exit(0)
            }
        }
    ])
    tray.setToolTip(import.meta.env.VITE_APP_TITLE)
    tray.setContextMenu(contextMenu)

    //双击托盘图标打开窗口
    tray.on('double-click', () => {
        if (!mainWindow) {
            createWindow()
        } else {
            mainWindow.show()
        }
    })
}

// 设置默认语言
app.commandLine.appendSwitch('lang', 'zh-CN')

// 当所有窗口都关闭时退出，但在 macOS 上除外。在那里，应用程序及其菜单栏通常会保持活动状态，直到用户使用 Cmd + Q 明确退出。
app.on('window-all-closed', () => {
    mainWindow = null
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
    if (JudgmentMode()) {
        exePath = join(process.env.VITE_PUBLIC, 'software/')
        configPath = join(process.env.VITE_PUBLIC, 'config/')
        iconPath = join(process.env.VITE_PUBLIC, 'favicon.ico')
    } else {
        exePath = join(dirname(app.getPath('exe')), staticPath, 'software/')
        configPath = join(dirname(app.getPath('exe')), staticPath, 'config/')
        iconPath = join(dirname(app.getPath('exe')), 'favicon.ico')
    }
}

/**
 * 注册全局快捷键
 * @constructor
 */
function RegisterGlobalShortcut() {

    //刷新
    globalShortcut.register('F5', () => {
        mainWindow.reload();
    });

    //退出全屏
    globalShortcut.register('shift + ESC', () => {
        mainWindow.fullScreen = false
    })

    //全屏
    globalShortcut.register('shift + F1', () => {
        mainWindow.fullScreen = true
    })


    //开发者工具
    globalShortcut.register('ctrl + shift + i', () => {
        mainWindow.webContents.openDevTools()
    })

    //重启
    globalShortcut.register('ctrl + shift + alt + r', () => {
        restart()
    })

    //确认
    globalShortcut.register('ctrl + shift + alt + y', () => {
        mainWindow.webContents.send('enter')
    })

    //取消
    globalShortcut.register('ctrl + shift + alt + n', () => {
        mainWindow.webContents.send('exit')
    })

    //设置
    globalShortcut.register('ctrl + shift + alt + s', () => {
        mainWindow.webContents.send('setting')
    })

    //退出
    globalShortcut.register('ctrl + shift+ alt + d', () => {
        mainWindow.webContents.send('dropOut')
    })

    //关闭退出
    globalShortcut.register('ctrl + shift+ alt + q', () => {
        stopExe()
        app.exit(0)
    })

    //屏蔽Alt+F4
    mainWindow.webContents.on("before-input-event", (_: any, input: any) => {
        mainWindow.webContents.setIgnoreMenuShortcuts(input.key === "F4" && input.alt);
    })
}

/**
 * 加载配置文件
 * @constructor
 */
function LoadConfig() {
    try {
        const data = fs.readFileSync(join(configPath, 'config.json'), 'utf8');
        const config = JSON.parse(data);
        logType = config.logType;
        ledType = config.ledType;
        rtspType = config.rtspType;
        serviceType = config.serviceType;
        mainWindow.webContents.send('setting-config', data);
        logToFile('读取配置文件成功：Success');
    } catch (err) {
        logToFile(`读取配置文件失败：${err}`);
    }
}


/**
 * 写入配置文件
 */
function writeConfig(message: string) {
    try {
        const data: string = JSON.stringify(message, null, 2);
        fs.writeFileSync(join(configPath, 'config.json'), data, 'utf8');
    } catch (err) {
        console.error(err);
    }
}

/**
 * 写入日志文件
 * @param message
 */
//@ts-ignore
function logToFile(message: string) {
    if (logType) {
        const logPath: string = JudgmentMode() ? join(process.env.VITE_PUBLIC, 'log.txt') : join(app.getPath('home'), 'gam_pro_log.txt');
        const logLine: string = `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] ${message}`;
        fs.appendFile(logPath, logLine, (err) => {
            if (err) {
                console.error('无法写入日志文件', err);
                return;
            }
        });
    }
}