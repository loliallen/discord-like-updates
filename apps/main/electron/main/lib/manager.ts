import { Window } from "./types";

type Windows = Record<string, {
    instance: Window,
    windowAfterClose: Window | null
}>

export class WindowManager {
    constructor(private readonly windows: Windows) {
        const windowKeys: Array<keyof typeof this.windows> = Object.keys(this.windows)
        for (const key of windowKeys) {
            const window = this.windows[key].instance;
            window.window.on('close', () => { this.windows[key].windowAfterClose.start() })
        }

        this.windows[windowKeys[0]].instance.start()
    }
}