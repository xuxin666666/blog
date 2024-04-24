import store from 'store'
import expirePlugin from 'store/plugins/expire'


store.addPlugin(expirePlugin)
// store.set('foo', 'bar', new Date().getTime() + 3000)

store.getAll = () => {
    const res: any[] = []
    store.each((val, key) => {
        res.push({key, val})
    })

    return res
}

store.filter = (callback) => store.getAll().filter(({key, val}, index) => callback(key, val, index))

store.map = (callback) => store.getAll().map(({key, val}, index) => callback(key, val, index))

