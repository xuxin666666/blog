// import { SHA256 } from "..";
// import crypto from 'crypto'
// import { JSDOM } from 'jsdom'


// describe('test sha256', () => {
//     it('should hash&base64 12345678 correctly', async () => {
//         const sha256 = crypto.createHash('sha256')
//         const {window: win} = new JSDOM()

//         // console.log(window)
//         console.log(win.crypto)

//         const text = '12345678'
//         const res1 = await SHA256.call(window, text)

//         sha256.update(text + 'ft')
//         console.log(sha256)
//         const res2 = sha256.digest('base64')

//         expect(res1).toBe(res2)
//     })
// })