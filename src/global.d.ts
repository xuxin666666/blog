/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    // 更多环境变量...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare const asserts: (expression: any) => asserts expression

interface StoreJsAPI {
    set(key: string, value: any, expireTime?: number): any;
}
declare const store: StoreJsAPI
declare module 'store' {
    export = store
}


type InferArray<T> = T extends (infer S)[] ? S : never