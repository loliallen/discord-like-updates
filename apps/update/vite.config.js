import { rmSync } from "fs"
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => {
    rmSync('dist', { recursive: true, force: true })
    return {
        build: {
            base: '',
            assetsDir: './'
        },
        server: {
            port: '3001'
        }
    }
})