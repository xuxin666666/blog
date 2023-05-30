import { describe, it, test, assert, expect } from 'vitest'

// 此测试套件的报告中将显示一个条目
describe.todo('unimplemented suite')

// 此测试的报告中将显示一个条目
describe('suite', () => {
    // 指定超时阈值
    test.skip('timeout', async () => {
        await new Promise(res => setTimeout(res, 5000))
    })

    // 使用 .todo 留存将要实施的测试套件和测试的待办事项
    it.todo('unimplemented test')

    // 跳过测试套件和测试
    it.skip('skipTest', () => {
        assert.equal(Math.sqrt(4), 2)
    })

    // 使用 .only 仅运行某些测试套件或测试

    // 使用快照
    it('snapShot', () => {
        const result = 'foobar'.toUpperCase()
        expect(result).toMatchInlineSnapshot('"FOOBAR"')
    })
})