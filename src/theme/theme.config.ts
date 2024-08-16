// 配色参考 https://www.tailwindcss.cn/docs/customizing-colors

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b})`
}

const transferHexToRgb = (obj: any) => {
  const result: any = {}
  Object.keys(obj).forEach((key) => {
    result[key] = hexToRgb(obj[key])
  })

  return result
}

// 灰色 色值50 - 950 阶梯加深
export const gray = {
  50: '#F7F7F7', // 最浅
  60: '#f6f6f6',
  70: '#fafafa',
  80: '#fbfbfb',
  90: '#F3F3F3',
  95: '#F4F4F4',
  120: '#F8F8F8',
  125: '#f9f9f9',
  130: '#f0f0f0',
  150: '#EFEFEF',
  160: '#EDEDED',
  180: '#EEEEEE',
  185: '#E4E4E4',
  190: '#E8E8E8',
  195: '#E6E6E6',
  200: '#E1E1E1',
  220: '#D9DDE3',
  250: '#DADADA',
  260: '#D8D8D8',
  300: '#D8D8D8',
  340: '#C8C8C8',
  360: '#C3C3C3',
  370: '#C4C4C4',
  380: '#b1b1b1',
  400: '#9BA6AD',
  450: '#9E9E9E',
  500: '#9C9C9C',
  550: '#929292',
  570: '#767E8A',
  580: '#424242',
  600: '#6A7073',
  620: '#454548',
  650: '#514F4F',
  651: '#2E3337',
  652: '#2E2E39',
  653: '#303030',
  655: '#2B2F34',
  656: '#2E2E39',
  660: '#1D2025',
  665: '#2B2E39',
  670: '#2E3338',
  680: '#23262A',
  690: '#262626',
  700: '#29292C',
  720: '#1D2125',
  730: '#1A1C1F',
  740: '#070707',
  750: '#1E2226',
  800: '#191C20',
  900: '#222222',
  950: '#000000' // 最深
} as const

// 黄色 色值50 - 900 阶梯加深
export const yellow = {
  400: '#FFDA00',
  490: '#FCD535',
  500: '#FDD436',
  550: '#F5B52C',
  560: '#FFA90E',
  600: '#C49002'
} as const

// 红色 色值50 - 900 阶梯加深
export const red = {
  100: '#FFDDE2',
  500: '#FA2E4C',
  600: '#C54747',
  650: '#F95050',
  700: '#FF3D3D'
} as const

// 绿色 色值50 - 900 阶梯加深
export const green = {
  100: '#D6FFF4',
  600: '#29BE95',
  700: '#45A48A'
} as const

// 蓝色 色值50 - 900 阶梯加深
export const blue = {
  50: '#F8FBFD',
  400: '#4775EE',
  500: '#3253F6',
  700: '#183EFC'
} as const

// 品牌色
export const colorBrandPrimary = blue['700']
// export const colorBrandSecondary = blue['500']

// 文字
export const colorTextPrimary = gray['900']
export const colorTextSecondary = gray['600']
export const colorTextWeak = gray['500']

// 其他
export const bgColorBase = gray['50']

export const colorWhite = '#fff'

// 定义全局使用的平方常规字体，优先使用pf-medium当做常规字体
export const fontFamily =
  "pf-medium, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"

// 获取系列颜色
const getColors = (colors: any, name: any) => {
  const result = {}
  Object.keys(colors).forEach((key: string) => {
    // @ts-ignore
    result[`--color-${name}-${key}`] = colors[key]
  })
  return result
}

export const ThemeVarsConst = {
  // brand
  '--color-brand-primary': colorBrandPrimary, // 品牌主色
  '--color-brand-text-primary': colorBrandPrimary, // 品牌主色-文字颜色
  // '---color-brand-secondary': colorBrandSecondary, // 品牌主色-第二色-衍生色1
  // '---color-brand-weak': colorBrandWeak, // 品牌主色-衍生色2
  // '---color-brand-light': colorBrandLight // 品牌主色-衍生色3

  // text
  '--color-text-primary': colorTextPrimary, // 文字主色
  '--color-text-secondary': colorTextSecondary, // 文字-第二色-衍生色1
  '--color-text-weak': colorTextWeak, // 文字-衍生色2
  // '--color-text-light': colorTextLight, // 文字-第二色-衍生色3

  // button
  '--btn-primary': colorBrandPrimary, // 按钮主色
  '--btn-default-border': gray['200'], // 默认按钮边框
  '--btn-disabled-bg': gray['150'], // 禁用背景色

  // input
  '--input-bg': colorWhite, // 输入框背景色
  '--input-disabled-bg': gray['150'], // 输入框禁用置灰背景色
  '--input-disabled-border': gray['150'], // 输入框禁用置灰背景色
  '--input-border': gray['200'], // 输入边框颜色
  '--input-border-hover': gray['500'], // 输入框hover边框颜色
  '--input-placeholder-text-color': colorTextSecondary, // placeholder文字颜色

  // tabs
  '--tabs-active-bg': bgColorBase, // 激活背景
  '--tabs-border-color': gray['130'], // tabs组件底部边框线颜色

  // select
  '--select-border': gray['200'], // 边框
  '--select-border-hover': gray['500'], // 边框hover
  '--select-bg': colorWhite, // 选择组件背景颜色
  '--select-dropdown-bg': colorWhite, // 选择展开的区域背景颜色
  '--select-item-hover-bg': gray['70'], // 选项hover背景颜色

  // modal
  '--modal-bg': colorWhite, // 弹窗背景颜色
  '--modal-header-bg': blue['50'], // 头部背景颜色
  '--modal-border-color': gray['200'], // 弹窗悬浮框边框颜色
  '--modal-input-border-color': gray['200'], // 弹窗上的输入框边框颜色
  '--modal-mask-bg': 'rgba(0,0,0,0.5)',

  // divider
  '--divider-line-color': gray['190'], // 分割线条颜色

  // dropdown
  '--dropdown-bg': colorWhite, // 背景颜色
  '--dropdown-border-color': gray['200'], // 弹窗悬浮框边框颜色
  '--dropdown-item-hover-bg': gray['70'], // 选项hover背景颜色

  // border
  '--border-primary-color': gray['200'], // 通用边框颜色
  // '--border-weak-color': gray['80'], // 通用边框颜色
  // '--border-light-color': gray['80'], // 通用边框颜色

  // 页面颜色
  '--bg-primary': colorWhite, // 页面背景
  '--bg-base-gray': bgColorBase, // 页面背景-灰色

  // 头部渐变颜色
  '--card-gradient-header-bg': 'linear-gradient(1deg, #FFFFFF 10%, #CDE2FF 100%)', // 卡片渐变背景颜色

  // list
  '--list-item-disabled': 'rgb(246,246,246, 0.4)', // 列表项目禁用颜色
  '--list-hover-primary-bg': gray['125'], // hover主要颜色
  '--list-hover-light-bg': gray['80'], // hover-淡一点的颜色

  // 字体
  '--font-family': fontFamily,

  // 深度进度条颜色
  '--depth-buy-bg': green['100'], // 买
  '--depth-sell-bg': red['100'], // 卖

  // 默认颜色
  '--color-gray': gray['900'], // 默认全局黑
  '--color-green': green['700'], // 默认全局绿
  '--color-red': red['600'], // 默认全局红
  '--color-blue': blue['700'], // 默认全局蓝
  '--color-yellow': yellow['600'], // 默认全局黄
  '--color-white': colorWhite, // 默认全局白

  // 灰色系
  ...getColors(gray, 'gray'),

  // 黄色系
  ...getColors(yellow, 'yellow'),

  // 红色系
  ...getColors(red, 'red'),

  // 绿色系
  ...getColors(green, 'green'),

  // 蓝色系
  ...getColors(blue, 'blue')
}

// 黑色主色变量
export const ThemeDarkVarsConst = {
  ...ThemeVarsConst, // 继承

  // brand
  '--color-brand-primary': blue['500'], // 品牌主色
  '--color-brand-text-primary': blue['400'], // 品牌主色-文字颜色
  // '--color-brand-secondary': colorBrandSecondary, // 品牌主色-第二色-衍生色1
  // '--color-brand-weak': colorBrandWeak, // 品牌主色-衍生色2
  // '--color-brand-light': colorBrandLight // 品牌主色-衍生色3

  // text
  '--color-text-primary': gray['95'], // 文字主色-正文
  '--color-text-secondary': gray['570'], // 文字-第二色-衍生色1
  '--color-text-weak': gray['570'], // 文字-衍生色2
  // '--color-text-light': colorTextLight, // 文字-第二色-衍生色3

  // button
  '--btn-primary': blue['500'], // 按钮主色
  '--btn-default-border': gray['656'], // 默认按钮边框
  '--btn-disabled-bg': gray['651'], // 禁用背景色

  // input
  '--input-bg': gray['750'], // 输入框背景色
  '--input-disabled-bg': gray['651'], // 输入框禁用置灰背景色
  '--input-disabled-border': gray['650'], // 输入框禁用置灰背景色
  '--input-border': gray['650'], // 输入框、选择框边框颜色
  '--input-border-hover': gray['370'], // 输入框、选择框边框颜色
  '--input-placeholder-text-color': gray['570'], // placeholder文字颜色

  // tabs
  '--tabs-active-bg': gray['670'], // 激活背景
  '--tabs-border-color': gray['700'], // tabs组件底部边框线颜色

  // select
  '--select-border': gray['665'], // 边框
  '--select-border-hover': gray['665'], // 边框hover
  '--select-bg': gray['750'], // 选择组件背景颜色
  '--select-dropdown-bg': gray['680'], // 选择展开的区域背景颜色
  '--select-item-hover-bg': gray['655'], // 选项hover背景颜色

  // modal
  '--modal-bg': gray['730'], // 弹窗背景颜色
  '--modal-header-bg': blue['50'], // 头部背景颜色
  '--modal-border-color': gray['690'], // 弹窗悬浮框边框颜色
  '--modal-input-border-color': gray['653'], // 弹窗上的输入框边框颜色
  '--modal-mask-bg': 'rgba(7,7,7,0.7)',

  // divider
  '--divider-line-color': gray['700'], // 边框分割线条颜色

  // dropdown
  '--dropdown-bg': gray['680'], // 背景颜色
  '--dropdown-border-color': gray['665'], // 弹窗悬浮框边框颜色
  '--dropdown-item-hover-bg': gray['655'], // 选项hover背景颜色

  // border
  '--border-primary-color': gray['700'], // 通用边框颜色

  // hover
  '--hover-primary-bg': 'rgba(225, 225, 225, .2)', // hover颜色

  // 页面背景
  '--bg-primary': gray['800'],
  '--bg-base-gray': gray['800'], // 页面背景-灰色

  // list
  '--list-item-disabled': gray['651'], // 列表项目禁用颜色
  '--list-hover-bg': gray['660'], // 列表项hover背景颜色

  '--list-hover-primary-bg': gray['660'], // hover主要颜色
  '--list-hover-light-bg': gray['655'], // hover-淡一点的颜色

  // 深度进度条颜色
  '--depth-buy-bg': 'rgba(41, 190, 149, 0.3)', // 买
  '--depth-sell-bg': 'rgba(250, 46, 76, 0.2)', // 卖

  // 头部渐变颜色
  '--card-gradient-header-bg': gray['730'], // 卡片渐变背景颜色

  // 默认颜色
  '--color-gray': gray['95'], // 默认全局黑
  '--color-green': green['600'], // 全局绿
  '--color-red': red['650'] // 全局红
}

const setRootVars = (themeVars: any) => {
  let vars = ''
  Object.keys(themeVars).forEach((key) => {
    vars += `${key}: ${themeVars[key]};\n`
  })
  return vars
}

// css变量注入页面中，通过var(--color-brand-primary)使用
// 定义全局主题变量
// 黑色主题，修改<html class="dark" /> 切换主题
export const cssVars = `
  :root {
    ${setRootVars(ThemeVarsConst)}
  }
  :root[class=dark] {
    ${setRootVars(ThemeDarkVarsConst)}
    color-scheme: dark;
  }
`
