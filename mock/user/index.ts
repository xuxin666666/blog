// https://github.com/vbenjs/vite-plugin-mock/blob/main/README.zh_CN.md
import { MockMethod } from "vite-plugin-mock";
import { handleRoutes } from "..";


const adminUser = {
    username: 'admin',
    avatar: 'adminAvatar.jpg',
    email: 'admin@qq.com',
    uid: 1e9,
    role: 'admin',
    token: 'qweqwe',
    // 12345678 => +ft +sha256 +base64
    password: 'XUvgDAAc/1Mc5Kk30NnosP1wc2DZdfqrCYg4as+j76o='
}
const normalUser = {
    username: 'normal',
    avatar: 'normalAvatar.jpg',
    email: 'normal@qq.com',
    uid: 1e9 + 1,
    role: 'normal',
    token: 'asdasd',
    password: 'XUvgDAAc/1Mc5Kk30NnosP1wc2DZdfqrCYg4as+j76o='
}
const adminInfo = handle(adminUser)
const normalInfo = handle(normalUser)


function handle(obj: any) {
    let keys = ['token', 'password']
    let newObj = { ...obj }
    keys.forEach(key => delete newObj[key])
    return newObj
}


const routes: MockMethod[] = [
    {
        url: '/api/user/auto',
        method: 'get',
        statusCode: 200,
        // 响应数据，json
        response({ headers }) {
            let token = headers.authorization as string
            if (token) {
                token = token.split('Bearer ')[1]
                console.log(token)
                if (token === adminUser.token) return adminInfo
                if (token === normalUser.token) return normalInfo
            }
            this.res.statusCode = 401
        },
    },
    {
        url: '/api/user',
        method: 'post',
        statusCode: 200,
        response({ body }) {
            if (body.email === normalUser.email && body.password === normalUser.password) {
                return {data: normalInfo, token: normalUser.token}
            } else if (body.email === adminUser.email && body.password === adminUser.password) {
                return {data: adminInfo, token: adminUser.token}
            }
            this.res.statusCode = 400
        }
    },
    {
        url: '/api/user/register',
        method: 'post',
        statusCode: 200,
        response() {
            return normalInfo
        }
    }
]


export default handleRoutes(routes)