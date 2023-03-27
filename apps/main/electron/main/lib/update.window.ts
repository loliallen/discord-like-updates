import { BrowserWindow } from "electron";
import { join } from "path";
import { Window } from "./types";

export class UpdateWindow extends Window {
    private constructor() {
        super({
            width: 300,
            height: 400,
            resizable: false,
            titleBarStyle: 'hidden',
            autoHideMenuBar: true,
            movable: true,
            webPreferences: {
                preload: join(__dirname, '../../preload/index.js'),
                nodeIntegration: true,
                contextIsolation: false,
            }
        });
    }


    static create() {
        return new UpdateWindow()
    }

    public start() {
        if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
            this.window.loadURL('http://localhost:3001')
            // Open devTool if the app is not packaged
            this.window.webContents.openDevTools()
            this.window.show()
        } else {
            this.window.loadFile(join(process.env.DIST_ELECTRON, '../update/dist/index.html'))
        }
        this.window.loadURL('')
        this.window.show()
        this.window.webContents.openDevTools({ mode: 'undocked' })
    }
}