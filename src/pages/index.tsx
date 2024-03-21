import { Card } from 'antd'
import {useCountDown, useCountDownLocal} from '@/hooks/useCountDown'
import { useEffect } from 'react'

const Home = () => {
    const [timeRemain, formatted, toggle] = useCountDown({ remainTime: 15000 })

    const [tm] = useCountDownLocal({key: '123', remainTime: 15000})

    useEffect(() => {
        // toggle(true)
    }, [])
    return (
        <div>
            <Card style={{ height: 200 }}>
                time: {timeRemain}
                seconds: {formatted.seconds}
                milliseconds: {formatted.milliseconds}
                <button onClick={() => toggle()}>click</button>
                {tm}
            </Card>
        </div>
    )
}

export default Home