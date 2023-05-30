// https://github.com/vbenjs/vite-plugin-mock/blob/main/README.zh_CN.md
import { MockMethod } from "vite-plugin-mock";


const routes: MockMethod[] = [
    {
        url: '/api/get',
        method: 'get',
        timeout: 2000,
        statusCode: 200,
        // 响应数据，json
        response({ query }) {
            return {
                code: 0,
                data: { name: 'vben' }
            }
        },
    },
    {
        url: '/api/text',
        method: 'post',
        // 没有express，响应数据，非json
        async rawResponse(req, res) {
            let reqbody = ''
            await new Promise((resolve) => {
                req.on('data', (chunk) => {
                    reqbody += chunk
                })
                req.on('end', () => resolve(undefined))
            })
            res.setHeader('Content-Type', 'text/plain')
            res.statusCode = 200
            res.end(`hello, ${reqbody}`)
        },
    }
]
export default routes