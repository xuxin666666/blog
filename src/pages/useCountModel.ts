import { useState } from "react";
// import useLoggerModel from "./useLoggerModel";
// import useUserModel from "./useUserModel";
import { createStore } from "hox";

function useCounter() {
    const [count, setCount] = useState<number>(1);

    const increment = () => {
        setCount(count + 1);
        // logAction("increment");
    };

    const decrement = () => {
        setCount(count - 1);
        // logAction("decrement");
    };

    // const logAction = (action: string) => {
    //     const user = useUserModel.data;
    //     const logger = useLoggerModel.data;
    //     logger.addLog(`${user.userInfo.username} trigger ${action}`);
    // };

    return {
        count,
        increment,
        decrement
    };
}

export const [useCounterStore, CounterProvider] = createStore(useCounter);
