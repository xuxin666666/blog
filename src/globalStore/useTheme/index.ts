import { useState, useEffect, useMemo, useRef } from 'react'
import { createGlobalStore } from 'hox'
import { useLocation } from 'react-router-dom'
import { ThemeConfig } from 'antd'

import { useHomePageListStore } from '../homePageList'
import { getHexColorLadder, getHexColorOpacs } from '@/utils/parseColor'



const addColor = (color: string, name: string) => {
    return getHexColorLadder(color).map((val, idx) => `--${name}-${idx}: ${val};`).join(' ') + `--${name}: ${color};`
}

const addColorOpac = (color: string, name: string) => {
    return getHexColorOpacs(color).map((val, idx) => `--${name}-o-${idx + 1}: ${val};`).join(' ')
}

const addStyle = (ele: Element, ...txt: string[]) => {
    ele.innerHTML = `body { ${txt.join(' ')} }`
}


export const [useThemeStore, getThemeStore] = createGlobalStore(() => {
    const location = useLocation()
    const {list: homePageList} = useHomePageListStore()
    const [primaryColor, setPrimaryColor] = useState('#4dd0e1')
    const style = useRef(document.createElement('style'))


    useEffect(() => {
        document.head.appendChild(style.current)
    }, [])

    useEffect(() => {
        let ans = '', primary = ''
        for(const item of homePageList) {
            if(location.pathname.startsWith(item.to) && item.to.length > ans.length) {
                ans = item.to
                if(item.primary) primary = item.primary
            }
        }
        // header.current.style.backgroundColor = primary ? primary + 'df' : '#043978'
        if(primary) setPrimaryColor(primary)
    }, [location.pathname, homePageList])

    const theme = useMemo<ThemeConfig | undefined>(() => {
        if(!primaryColor) return {
            cssVar: true,
            hashed: false
        }

        addStyle(
            style.current, 
            addColor(primaryColor, 'color-primary'), 
            addColorOpac(primaryColor, 'color-primary')
        )

        return {
            cssVar: true,
            hashed: false,
            token: {
                colorPrimary: primaryColor
            }
        }
    }, [primaryColor])

    return {
        theme
    }
})