import type { ThemeConfig } from "antd";
import type { CustomTheme } from ".";


const antd: ThemeConfig = {
    token: {
        colorTextBase: 'rgba(0, 0, 0, .85)',
        colorPrimary: '#4dd0e1',
        colorBorder: '#26c6da',
    }
}

const custom: CustomTheme = {
    colorPrimary: '#4dd0e1',
    colorPrimaryDarker: '#26c6da',
    colorPrimaryLighter: '#e4f8fb',
    colorBorder: '#26c6da',
    colorBgContainer: 'white',
    colorBg: 'white',
    colorText: 'rgba(0, 0, 0, .7)',
    codeH1BgImage: 'url(/images/themes/h1bg-cyan.png)',
    codeH2IconImage: 'url(/images/themes/h2icon-cyan.png)',
    codeH3IconImage: 'url(/images/themes/h3icon-cyan.png)'
}


export {
    antd,
    custom
}
