import Color from 'color'


export const getHexColorLadder = (color: string) => {
    const ans: string[] = []
    for(let i = 10; i >= 2; i -= 2) ans.push(Color(color).lighten(i / 10).hex())
    ans.push(color)
    for(let i = 1; i <= 4; i += 1) ans.push(Color(color).darken(i / 10).hex())
    return ans
}

export const getHexColorOpacs = (color: string) => {
    const ans: string[] = []
    for(let i = 9; i >= 1; i--) ans.push(Color(color).fade(i / 10).hexa())
    return ans
}