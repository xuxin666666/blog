import path from 'path'
import { defineConfig } from 'vitest/config'
// import react from '@vitejs/plugin-react'
import react from '@vitejs/plugin-react-swc'




export const rootPath = path.resolve(__dirname, '../')
// https://vitejs.dev/config/
export default defineConfig({
    root: rootPath,
    base: './',
    resolve: {
        alias: {
            '@/': '/src/',
            '@images/': '/src/assets/images/'
        }
    },
    envDir: 'config',
    plugins: [
        react()
    ],
    test: {
        root: rootPath,
        include: [
            'src/**/__tests__/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
        ],
        environment: 'jsdom',
        useAtomics: true
    }
})
