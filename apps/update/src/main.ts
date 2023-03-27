import { autorun } from "mobx"
// import { ipcRenderer } from 'electron'
import type { ProgressInfo } from 'electron-updater'
import { ErrorType, VersionInfo, rootStore } from './store'
import './index.css'

const { ipcRenderer } = require('electron')


const main = () => {
    const checkUpdate = async () => {
        rootStore.setChecking(true)
        /**
         * @type {import('electron-updater').UpdateCheckResult | null | { message: string, error: Error }}
         */
        const result = await ipcRenderer.invoke('check-update')
        console.log(result)
        rootStore.setProgressInfo({ percent: 0 })
        rootStore.setChecking(false)
        if (result?.error) {
            rootStore.setUpdateAvailable(false)
            rootStore.setUpdateError(result?.error)
        }
    }

    const onUpdateCanAvailable = (_event: Electron.IpcRendererEvent, arg1: VersionInfo) => {
        rootStore.setVersionInfo(arg1)
        rootStore.setUpdateError(undefined)
        // Can be update
        if (arg1.update) {
            ipcRenderer.invoke('start-download')
            rootStore.setUpdateAvailable(true)
        } else {
            rootStore.setUpdateAvailable(false)
        }
    }

    const onUpdateError = (_event: Electron.IpcRendererEvent, arg1: ErrorType) => {
        rootStore.setUpdateAvailable(false)
        rootStore.setUpdateError(arg1)
    }

    const onDownloadProgress = (_event: Electron.IpcRendererEvent, arg1: ProgressInfo) => {
        rootStore.setProgressInfo(arg1)
    }

    const onUpdateDownloaded = (_event: Electron.IpcRendererEvent) => {
        rootStore.setProgressInfo({ percent: 100 })
        rootStore.setDisplay({
            okText: 'Installing',
        })
        setTimeout(() => {
            ipcRenderer.invoke('quit-and-install')
        }, 500)
    }

    autorun(() => {
        if (rootStore.display.okText) {
            const element = document.querySelector<HTMLSpanElement>('#text')
            if (element)
                element.innerHTML = rootStore.display.okText
        }
        if (rootStore.updateError) {
            console.log(rootStore.updateError)
            const okSection = document.querySelector<HTMLDivElement>('#ok_section')
            const errorSection = document.querySelector<HTMLDivElement>('#error_section')
            if (!okSection || !errorSection)
                return
            okSection.classList.add('hidden')
            errorSection.innerHTML = `
                <div class='text-xl text-red-400'>${rootStore.updateError.message}</div>
                <div class='text-xs mt-4'>Window will be closed in 5 seconds</div> 
            `

            setTimeout(() => {
                window.close()
            }, 10000)
        }
    })

    checkUpdate()


    ipcRenderer.on('update-can-available', onUpdateCanAvailable)
    ipcRenderer.on('update-error', onUpdateError)
    ipcRenderer.on('download-progress', onDownloadProgress)
    ipcRenderer.on('update-downloaded', onUpdateDownloaded)
}


window.addEventListener('DOMContentLoaded', () => {
    main()
})