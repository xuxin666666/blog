import { act, renderHook } from '@testing-library/react'
import { Options, useCountDown } from '..'


const setup = (options: Options = {}) => {
    return renderHook((props: Options = options) => useCountDown(props))
}

describe('hooks/useCountDowm', () => {
    beforeAll(() => {
        vi.useFakeTimers()
    })
    afterAll(() => {
        vi.useRealTimers()
    })

    it('should initialize correctly with undefined targetDate and leftTime', () => {
        const { result } = setup()
        const [count, formatted] = result.current

        expect(count).toBe(0)
        expect(formatted).toEqual({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0
        })
    })

    it('should initialize correctly with correct targetDate', () => {
        const { result } = setup({ targetDate: Date.now() + 5000 })
        const [count, formatted] = result.current

        expect(count).toBe(5000)
        expect(formatted.minutes).toBe(0)
        expect(formatted.seconds).toBe(5)
        expect(formatted.milliseconds).toBe(0)
    })

    it('should initialize correctly with correct leftTime', () => {
        const { result } = setup({ remainTime: 5000 })
        const [count, formatted] = result.current

        expect(count).toBe(5000)
        expect(formatted.minutes).toBe(0)
        expect(formatted.seconds).toBe(5)
        expect(formatted.milliseconds).toBe(0)
    })

    it('show work automatically', () => {
        const { result } = setup({ targetDate: Date.now() + 5000 })

        expect(result.current[0]).toBe(5000)
        expect(result.current[1].seconds).toBe(5)

        act(() => {
            vi.advanceTimersByTime(1000)
        })
        expect(result.current[0]).toBe(4000)
        expect(result.current[1].seconds).toBe(4)

        act(() => {
            vi.advanceTimersByTime(4000)
        })
        expect(result.current[0]).toBe(0)
        expect(result.current[1].seconds).toBe(0)

        act(() => {
            vi.advanceTimersByTime(1000)
        })
        expect(result.current[0]).toBe(0)
        expect(result.current[1].seconds).toBe(0)
    })

    it('should work manually', () => {
        const { result, rerender } = setup({ interval: 100 })

        rerender({ targetDate: Date.now() + 5000, interval: 1000 })
        expect(result.current[0]).toBe(5000)
        expect(result.current[1].seconds).toBe(5)

        act(() => {
            vi.advanceTimersByTime(1000)
        })
        expect(result.current[0]).toBe(4000)
        expect(result.current[1].seconds).toBe(4)

        act(() => {
            vi.advanceTimersByTime(4000);
        });
        expect(result.current[0]).toBe(0);
        expect(result.current[1].seconds).toBe(0);

        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(result.current[0]).toBe(0);
        expect(result.current[1].seconds).toBe(0);
    })

    it('should work a long time', () => {
        const { result } = setup({ remainTime: 60 * 1000 })

        expect(result.current[0]).toBe(60000)
        expect(result.current[1].minutes).toBe(1)
        expect(result.current[1].seconds).toBe(0)

        act(() => {
            vi.advanceTimersByTime(20000)
        })
        expect(result.current[0]).toBe(40000)
        expect(result.current[1].minutes).toBe(0)
        expect(result.current[1].seconds).toBe(40)

        act(() => {
            vi.advanceTimersByTime(39000)
        })
        expect(result.current[0]).toBe(1000)
        expect(result.current[1].seconds).toBe(1)
    })

    it('it onEnd should work', () => {
        const onEnd = vi.fn()
        setup({ remainTime: 5000, onEnd })

        act(() => {
            vi.advanceTimersByTime(5000)
        })
        expect(onEnd).toBeCalled()
    })

    it('timeLeft should be 0 when target date less than current time', () => {
        const { result } = setup({
            targetDate: Date.now() - 5000
        })
        
        expect(result.current[0]).toBe(0)
        expect(result.current[1].seconds).toBe(0)
    });

    it('should work stop and not trigger onEnd when post undefiend remainTime', () => {
        const onEnd = vi.fn()
        const {result, rerender} = setup({remainTime: 5000, onEnd})

        act(() => {
            vi.advanceTimersByTime(1000)
        })
        expect(result.current[0]).toBe(4000)
        expect(result.current[1].seconds).toBe(4)

        rerender({remainTime: undefined})
        expect(result.current[0]).toBe(0)
        expect(result.current[1].seconds).toBe(0)
        expect(onEnd).toBeCalledTimes(0)

        act(() => {
            vi.advanceTimersByTime(1000)
        })
        expect(result.current[0]).toBe(0)
        expect(result.current[1].seconds).toBe(0)
        expect(onEnd).toBeCalledTimes(0)
    })

    it('should work stop and not trigger onEnd when post undefiend targetDate', () => {
        const onEnd = vi.fn()
        const {result, rerender} = setup({remainTime: 5000, onEnd})

        act(() => {
            vi.advanceTimersByTime(1000)
        })
        expect(result.current[0]).toBe(4000)
        expect(result.current[1].seconds).toBe(4)

        rerender({targetDate: undefined})
        expect(result.current[0]).toBe(0)
        expect(result.current[1].seconds).toBe(0)
        expect(onEnd).toBeCalledTimes(0)

        act(() => {
            vi.advanceTimersByTime(1000)
        })
        expect(result.current[0]).toBe(0)
        expect(result.current[1].seconds).toBe(0)
        expect(onEnd).toBeCalledTimes(0)
    })

    it('should countdown paused and continue when toggleStatus work', () => {
        const onEnd = vi.fn()
        const {result} = setup({remainTime: 5000, onEnd})
        const [, , toggle] = result.current

        act(() => {
            vi.advanceTimersByTime(1000)
        })
        expect(result.current[0]).toBe(4000)
        expect(result.current[1].seconds).toBe(4)

        // 浏览器测试时没问题，但测试环境下就有问题了，之前是toggle、vi.advanceTimersByTime放一块的，不得行
        // 现在分开了，过了，不知道这样写正确的还是错误的
        act(() => {
            toggle()
        })
        act(() => {
            vi.advanceTimersByTime(1000)
        })
        expect(result.current[0]).toBe(4000)
        expect(result.current[1].seconds).toBe(4)
        expect(onEnd).toBeCalledTimes(0)

        act(() => {
            toggle()
        })
        act(() => {
            vi.advanceTimersByTime(4000)
        })
        expect(result.current[0]).toBe(0)
        expect(result.current[1].seconds).toBe(0)
        expect(onEnd).toBeCalled()
    })

    it('should countdown paused and continue when toggleStatus work manually', () => {
        const onEnd = vi.fn()
        const {result} = setup({remainTime: 5000, onEnd})
        const [, , toggle] = result.current

        // 不暂停，初始就是这样，没变化
        act(() => {
            toggle(false)
        })
        act(() => {
            vi.advanceTimersByTime(1000)
        })
        expect(result.current[0]).toBe(4000)
        expect(result.current[1].seconds).toBe(4)

        // 暂停
        act(() => {
            toggle()
        })
        act(() => {
            vi.advanceTimersByTime(1000)
        })
        expect(result.current[0]).toBe(4000)
        expect(result.current[1].seconds).toBe(4)
        expect(onEnd).toBeCalledTimes(0)

        // 还是暂停
        act(() => {
            toggle(true)
        })
        act(() => {
            vi.advanceTimersByTime(1000)
        })
        expect(result.current[0]).toBe(4000)
        expect(result.current[1].seconds).toBe(4)
        expect(onEnd).toBeCalledTimes(0)

        // 继续
        act(() => {
            toggle()
        })
        act(() => {
            vi.advanceTimersByTime(4000)
        })
        expect(result.current[0]).toBe(0)
        expect(result.current[1].seconds).toBe(0)
        expect(onEnd).toBeCalled()
    })

    it('should toggleStatus work many times be not matter', () => {
        const onEnd = vi.fn()
        const {result} = setup({remainTime: 5000, onEnd})
        const [, , toggle] = result.current

        act(() => toggle())
        act(() => toggle())
        act(() => vi.advanceTimersByTime(1000))
        expect(result.current[0]).toBe(4000)

        act(() => toggle(true))
        act(() => vi.advanceTimersByTime(1000))
        act(() => toggle(true))
        act(() => vi.advanceTimersByTime(1000))
        act(() => toggle(true))
        act(() => vi.advanceTimersByTime(1000))
        expect(result.current[0]).toBe(4000)

        act(() => toggle(false))
        act(() => vi.advanceTimersByTime(1000))
        expect(result.current[0]).toBe(3000)

        act(() => toggle(false))
        act(() => vi.advanceTimersByTime(1000))
        expect(result.current[0]).toBe(2000)
        expect(onEnd).toBeCalledTimes(0)

        act(() => toggle(false))
        act(() => vi.advanceTimersByTime(2000))
        expect(result.current[0]).toBe(0)
        expect(onEnd).toBeCalled()
    })

    it('should stop working when unmount', () => {
        const onEnd = vi.fn()
        const {result, unmount} = setup({remainTime: 5000, onEnd})

        act(() => vi.advanceTimersByTime(1000))
        act(() => unmount())
        expect(result.current[0]).toBe(4000)
        expect(onEnd).toBeCalledTimes(0)

        act(() => vi.advanceTimersByTime(1000))
        expect(result.current[0]).toBe(4000)
        expect(onEnd).toBeCalledTimes(0)

        act(() => result.current[2](false))
        act(() => vi.advanceTimersByTime(1000))
        expect(result.current[0]).toBe(4000)
        expect(onEnd).toBeCalledTimes(0)
    })
})