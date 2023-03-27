import { observable, action, makeObservable } from "mobx"
import type { ProgressInfo } from 'electron-updater'

export interface VersionInfo {
    update: boolean
    version: string
    newVersion?: string
}

export interface ErrorType {
    message: string
    error: Error
}


export class RootStore {
    @observable
    checking = false
    @observable
    updateAvailable = false
    @observable
    versionInfo: VersionInfo | null = null
    @observable
    updateError: ErrorType | null = null
    @observable
    progressInfo: Partial<ProgressInfo> = {}
    @observable
    display: Partial<{
        okText: string
        onOk: () => void
    }> = {}

    constructor() {
        makeObservable(this)
    }


    @action
    setChecking(value: boolean) {
        this.checking = value
    }
    @action
    setUpdateAvailable(value: boolean) {
        this.updateAvailable = value
    }
    @action
    setVersionInfo(info: VersionInfo | null) {
        this.versionInfo = info
    }
    @action
    setUpdateError(error: ErrorType | null | undefined) {
        if (!error)
            this.updateError = null
        else
            this.updateError = error
    }
    @action
    setProgressInfo(progress: Partial<ProgressInfo>) {
        this.progressInfo = { ...this.progressInfo, ...progress }
    }
    @action
    setDisplay(value: typeof this.display) {
        this.display = { ...this.display, ...value }
    }
}

export const rootStore = new RootStore()