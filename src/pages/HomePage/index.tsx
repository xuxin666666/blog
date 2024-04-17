import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import Slider from '@/components/Slider'
import { MusicPausingOutlined, MusicPlayingOutlined, DownArrowWiderOutlined } from '@/components/Icons'
import { useHomePageListStore } from '@/globalStore/homePageList'
import huaniaoFengyue from '@/assets/musics/HuaniaoFengyue.mp3'
import style from './index.module.less'




const HomePage: React.FC = () => {
    const [playing, setPlaying] = useState(false)
    const [volumn, setVolumn] = useState(100)
    const audio = useRef(new Audio(huaniaoFengyue))
    const {list: listData} = useHomePageListStore()

    useEffect(() => {
        audio.current.loop = true
    }, [])

    useEffect(() => {
        if (playing) audio.current.play()
        else audio.current.pause()
    }, [playing])

    useEffect(() => {
        audio.current.volume = volumn / 100
    }, [volumn])

    return (
        <>
            <div className={classNames(style.welcome)}>
                <div>
                    <header>WelCome</header>
                    <div className={classNames(style.line)}>
                        <div className={classNames(style.fixed)}></div>
                        <div className={style.slider}>
                            <Slider defaultValue={50} onChange={setVolumn} />
                        </div>
                    </div>
                    <span>吾心吾行澄如明镜，所作所为皆为四季</span><br />
                    <span className='no-mobile'>（没找着合适的图片哎呀，放张好看的顶着）</span>
                    {playing ? <MusicPlayingOutlined className={classNames(style.music)} onClick={() => setPlaying(false)} /> : <MusicPausingOutlined className={classNames(style.music)} onClick={() => setPlaying(true)} />}
                </div>
                <DownArrowWiderOutlined className={style.arrow} />
            </div>
            <div className={classNames(style.lists)}>
                {listData.map(({ image, title, subtitle, to, primary }, index) => {
                    const direction = index % 2 ? 'to left' : 'to right', startColor = primary + '60'
                    const background = `linear-gradient(${direction}, ${startColor}, ${primary} 60%, ${primary})`
                    return (
                        <Link to={to} key={to} className={classNames(style.item)} style={{ background, borderColor: primary }}>
                            <img src={image} alt="" />
                            <div className={classNames(style.content)}>
                                <header>{title}</header>
                                <span>{subtitle}</span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </>
    )
}

export default HomePage
