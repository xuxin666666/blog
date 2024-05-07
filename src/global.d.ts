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
    filter<T = any>(callback: (key: string, val: T, index: number) => boolean): {key: string, val: T}[]
    map<T = any, K = any>(callback: (key: string, val: T, index: number) => K): K[]
    getAll<T = any>(): {key: string, val: T}[]
}
declare const store: StoreJsAPI
declare module 'store' {
    export = store
}


type InferArray<T> = T extends (infer S)[] ? S : never
type ValueOf<T> = T extends {[K in keyof T]: T[K]} ? T[K] : never
type PromiseType<T> = T extends Promise<infer S> ? S: never