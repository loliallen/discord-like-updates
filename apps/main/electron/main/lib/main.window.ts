import { BrowserWindow } from "electron";
import { join } from "node:path";
import { Window } from "./types";


export class MainWindow extends Window {
    private constructor() {
        super({
            title: 'Main window',
            icon: join(process.env.PUBLIC, 'favicon.ico'),
            show: false,
            webPreferences: {
                preload: join(__dirname, '../../preload/index.js'),
                // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
                // Consider using contextBridge.exposeInMainWorld
                // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
    }

    start() {
        if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
            this.window.loadURL(process.env.VITE_DEV_SERVER_URL)
            // Open devTool if the app is not packaged
            this.window.webContents.openDevTools()
            this.window.show()
        } else {
            this.window.loadFile(join(process.env.DIST, 'index.html'))
        }
    }

    static create() {
        return new MainWindow()
    }

}
// win = new BrowserWindow({
//     title: 'Main window',
//     icon: join(process.env.PUBLIC, 'favicon.ico'),
//     webPreferences: {
//         preload,
//         // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
//         // Consider using contextBridge.exposeInMainWorld
//         // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
//         nodeIntegration: true,
//         contextIsolation: false,
//     },
// })

// if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
//     win.loadURL(url)
//     // Open devTool if the app is not packaged
//     win.webContents.openDevTools()
// } else {
//     win.loadFile(indexHtml)
// }

// // Test actively push message to the Electron-Renderer
// win.webContents.on('did-finish-load', () => {
//     win?.webContents.send('main-process-message', new Date().toLocaleString())
// })

// // Make all links open with the browser, not with the application
// win.webContents.setWindowOpenHandler(({ url }) => {
//     if (url.startsWith('https:')) shell.openExternal(url)
//     return { action: 'deny' }
// })

// // Apply electron-updater
// update(win)
// }