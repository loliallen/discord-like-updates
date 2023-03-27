import { BrowserWindow, BrowserWindowConstructorOptions } from "electron"

export interface IWindow {
    start(): void
}

export abstract class Window {
    window: BrowserWindow
    constructor(windowOpt: BrowserWindowConstructorOptions) {
        this.window = new BrowserWindow({ ...windowOpt, show: false })
    }
    static create() { }
    start() { }
}