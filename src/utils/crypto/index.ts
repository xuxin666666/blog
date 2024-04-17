// 这里就简单的进行一些加密等处理，真要被硬破解的话，肯定还是防不住的，但安全性至少还是能提升一点点的
import CryptoJS from 'crypto-js'

// const encoder = new TextEncoder()

export const SHA256 = async (val: string) => {
    const res = CryptoJS.SHA256(val + 'ft')
    return res.toString(CryptoJS.enc.Base64)
}