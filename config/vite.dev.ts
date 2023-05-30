import { defineConfig, mergeConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'

import commom from './vite.common'


const config = defineConfig({
    mode: 'development',
    clearScreen: false,
    plugins: [
        viteMockServe({
            mockPath: '/mock/',
            localEnabled: true
        })
    ],
    server: {
        port: 3000,
        proxy: {

        }
    }
})


export default mergeConfig(commom, config)