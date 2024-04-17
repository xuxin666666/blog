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

const adminInfo = handle(adminUser)


function handle(obj: any) {
    let deletekeys = ['password', 'token']
    let newObj = { ...obj }
    deletekeys.forEach(key => delete newObj[key])
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
                if (token === adminUser.token) return adminInfo
            }
            this.res.statusCode = 401
        },
    },
    {
        url: '/api/user',
        method: 'post',
        statusCode: 200,
        response({ body }) {
            if (body.email === adminUser.email && body.password === adminUser.password) {
                return {data: adminInfo, token: adminUser.token}
            }
            this.res.statusCode = 400
        }
    }
]


export default handleRoutes(routes)