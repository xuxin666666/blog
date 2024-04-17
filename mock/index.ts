// https://github.com/vbenjs/vite-plugin-mock/blob/main/README.zh_CN.md
import { MockMethod } from "vite-plugin-mock";


// 错误处理
// 换掉route中的response和rawResponse
function bind(fn: Function) {
    return function (...params: any[]) {
        try {
            return fn.apply(this, params)
        } catch(err) {
            console.log(err)
            this.res.statusCode = 500
        }
    }
}
export function handleRoutes(routes: MockMethod[]) {
    routes.forEach(item => {
        if(item.response) {
            item.response = bind(item.response)
        } else if(item.rawResponse) {
            item.rawResponse = bind(item.rawResponse)
        }
    })
    return routes
}


const routes: MockMethod[] = [
    {
        url: '/api',
        statusCode: 200,
        response: () => 'hello'
    }
]
export default handleRoutes(routes)