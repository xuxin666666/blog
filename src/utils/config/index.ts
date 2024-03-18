import store from 'store'
import expirePlugin from 'store/plugins/expire'


store.addPlugin(expirePlugin)
// store.set('foo', 'bar', new Date().getTime() + 3000)

const { set } = store
store.set = function (key, ...others) {
    set.call(this, key, ...others)
}