import type { ThemeConfig } from "antd";
import type { CustomTheme } from ".";


const antd: ThemeConfig = {
    token: {
        colorTextBase: 'white',
        colorPrimary: '#c353fa',
        colorBorder: '#ffeba7',
    }
}

const custom: CustomTheme = {
    colorPrimary: '#c353fa',
    colorPrimaryDarker: '#c353fa',
    colorPrimaryLighter: '#ebc3ff',
    colorBorder: '#ffeba7',
    colorBgContainer: '1f2029',
    colorBg: '2a2b38',
    colorText: 'white',
    codeH1BgImage: 'url(/images/themes/h1bg-purple.png)',
    codeH2IconImage: 'url(/images/themes/h2icon-purple.png)',
    codeH3IconImage: 'url(/images/themes/h3icon-purple.png)'
}


export {
    antd,
    custom
}
