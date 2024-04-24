// 这里就简单的进行一些加密等处理，真要被硬破解的话，肯定还是防不住的，但安全性至少还是能提升一点点的
import CryptoJS from 'crypto-js'

// const encoder = new TextEncoder()

export const SHA256 = (val: string) => {
    const res = CryptoJS.SHA256(val + 'ft')
    return res.toString(CryptoJS.enc.Base64)
}


export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}