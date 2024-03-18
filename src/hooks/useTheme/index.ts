import { useState, useEffect } from 'react'
import store from 'store'
import * as cyan from '@/theme/cyan.theme'
import * as purple from '@/theme/purple.theme'
import { parseHexColor, toRgbaString } from '@/utils/parseColor'
import type { ThemeConfig } from 'antd'
import type { CustomTheme } from '@/theme'


interface IMapThemeItem {
    antd: ThemeConfig
    custom: CustomTheme
}
interface IMapThemes {
    [key: string]: IMapThemeItem
}
type ITheme = keyof IMapThemes


const mapThemes: IMapThemes = {
    cyan,
    purple
}

function hasStyle(classname: string) {
    if(import.meta.env.MODE === 'development') return false

    for (const item of document.styleSheets) {
        // @ts-ignore
        if (item.cssRules[0]?.selectorText === `.${classname}`) {
            return true
        }
    }
    return false
}

function themeToCSSVar(customTheme: object) {
    let str = ''
    for (const key in customTheme) {
        // @ts-ignore
        const val = customTheme[key]
        str += `--${key}: ${val};`
        if(key === 'colorPrimary') {
            [2, 3, 5, 8].forEach(i => {
                str += `--${key}Opac${i}: ${toRgbaString({...parseHexColor(val), a: i / 10})};`
            })
        }
    }
    return str
}
const themeKey = 'custom-theme'

/**
 * 切换主题
 * @returns `[theme, changeTheme, mapThemes]`
 */
const useTheme = (): [IMapThemeItem, (sel: ITheme) => void, IMapThemes] => {
    const [theme, setTheme] = useState<ITheme>(store.get(themeKey, 'cyan'))

    useEffect(() => {
        const classname = `_ft-custom-theme-${theme}`
        
        const style = document.createElement('style')
        if (!hasStyle(classname)) {
            style.innerText = `.${classname}{${themeToCSSVar(mapThemes[theme].custom)}}`
            document.head.appendChild(style)
        }
        
        document.body.classList.add(classname)
        store.set(themeKey, theme)
        return () => {
            document.body.classList.remove(classname)
            if(import.meta.env.MODE === 'development') {
                style.remove()
            }
        }
    }, [theme])


    const changeTheme = (sel: ITheme) => {
        if (!Object.hasOwn(mapThemes, sel)) return
        if (theme === sel) return
        setTheme(sel)
    }

    return [mapThemes[theme], changeTheme, mapThemes]
}

export default useTheme