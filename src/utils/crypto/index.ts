// 这里就简单的进行一些加密等处理，真要被硬破解的话，肯定还是防不住的，但安全性至少还是能提升一点点的

const encoder = new TextEncoder()

export const SHA256 = async (val: string) => {
    const res = await window.crypto.subtle.digest('SHA-256', encoder.encode(val + 'ft'))
    return window.btoa(String.fromCharCode(...new Uint8Array(res)))
}