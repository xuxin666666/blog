
declare module 'store' {
    interface StoreJsAPI {
        set(key: string, value: any, expireTime?: number): any;
    }
}