import { useState } from 'react'
import { createStore } from "hox";



function useCounter() {
    const [count, setCount] = useState<number>(1);

    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        setCount(count - 1);
    };

    return {
        count,
        increment,
        decrement
    };
}

export const [useCounterStore, CounterProvider] = createStore(useCounter);