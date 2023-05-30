import { defineConfig, mergeConfig, splitVendorChunkPlugin } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import vitePluginImp from 'vite-plugin-imp'
import progress from 'vite-plugin-progress'
import viteCompression from 'vite-plugin-compression'

import commom, {rootPath} from './vite.common'


const config = defineConfig({
    mode: 'production',
    build: {
        reportCompressedSize: false,
        target: 'es2015',
        sourcemap: false,
    },
    plugins: [
        visualizer({
            open: false,
            projectRoot: rootPath,
            emitFile: true
        }),
        // splitVendorChunkPlugin()
        // vitePluginImp()
    ],

})


export default mergeConfig(commom, config)