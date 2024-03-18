import { useState, useEffect } from 'react'
import { Divider, Card, Button } from 'antd'
import { useCounterStore } from './useCounterStore'
import go from '@images/go.jpeg'


const Counter = () => {
    const counter = useCounterStore()

    const [localCount, setLocalCount] = useState(42);

    const combinedInc = () => {
        counter.increment();
        setLocalCount(localCount + 1);
    };

    const combinedDec = () => {

        counter.decrement();
        setLocalCount(localCount - 1);
    };

    useEffect(() => {
        console.log("count:", counter.count);
        console.log("localCount:", localCount);
        console.log("sum:", counter.count + localCount);
    }, [counter.count, localCount]);

    return (
        <>
            <p>{counter.count}</p>
            <p>{localCount}</p>
            <Button.Group>

                <Button onClick={combinedInc}>increment</Button>
                <Button onClick={combinedDec}>decrement</Button>
            </Button.Group>
            <Divider />

            <img src={go} alt="bgImg" width={300} />
            <Card style={{ height: 200 }}>

            </Card>
        </>
    )
}

export default Counter