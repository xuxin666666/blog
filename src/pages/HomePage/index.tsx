import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import Slider from '@/components/Slider'
import { getPrimaryColor } from '@/utils/ImageColor'
import huaniaoFengyue from '@/assets/musics/HuaniaoFengyue.mp3'
import bayiyonglin from '@/assets/images/homePage/bayiyonglin.avif'
import bayunzi from '@/assets/images/homePage/bayunzi.avif'
import leimiliya from '@/assets/images/homePage/leimiliya.avif'
// import lingmeng from '@/assets/images/homePage/lingmeng.avif'
// import lumiya from '@/assets/images/homePage/lumiya.avif'
// import paqiuli from '@/assets/images/homePage/paqiuli.avif'
import qilunuo from '@/assets/images/homePage/qilunuo.avif'
import style from './index.module.less'
import { MusicPausingOutlined, MusicPlayingOutlined, DownArrowWiderOutlined } from '@/components/Icons'



interface IData {
    image: string
    title: string
    to: string
    primary: string
    subtitle?: string
}


const HomePage: React.FC = () => {
    const [playing, setPlaying] = useState(false)
    const [volumn, setVolumn] = useState(100)
    const audio = useRef(new Audio(huaniaoFengyue))
    const [listData, setListData] = useState<IData[]>([])

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

    useEffect(() => {
        const datas: IData[] = [
            { image: qilunuo, title: '文章', subtitle: '遨游于知识的海洋', to: '/articles', primary: '' },
            { image: leimiliya, title: '闲杂话语', subtitle: '没事发发牢骚', to: '/meaningless', primary: '' },
            { image: bayiyonglin, title: '找歌', subtitle: '寻一处心灵寄托', to: '/musics', primary: '' },
            { image: bayunzi, title: '未完待续', subtitle: '啊嘞，这就没了……', to: '/', primary: '' }
        ]
        const promises = datas.map(({ image }) => getPrimaryColor(image))
        Promise.all(promises).then((reses) => {
            reses.forEach((res, i) => {
                datas[i].primary = res
            })
            setListData(datas)
        })
    }, [])

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
