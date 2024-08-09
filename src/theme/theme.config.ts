// 配色参考 https://www.tailwindcss.cn/docs/customizing-colors

// 灰色 色值50 - 900 阶梯加深
export const gray = {
  50: '#F7F7F7', // 最浅
  60: '#f6f6f6',
  80: '#fbfbfb',
  90: '#F3F3F3',
  95: '#F4F4F4',
  100: '#f6f6f6',
  120: '#F8F8F8',
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
  380: '#b1b1b1',
  400: '#9BA6AD',
  450: '#9E9E9E',
  500: '#9C9C9C',
  550: '#929292',
  570: '#767E8A',
  600: '#6A7073',
  650: '#514F4F',
  700: '#29292C',
  750: '#1E2226',
  800: '#191C20',
  900: '#051C2C' // 最深
} as const

// 黄色 色值50 - 900 阶梯加深
export const yellow = {
  490: '#FCD535',
  500: '#FDD436',
  550: '#F5B52C',
  560: '#FFA90E',
  600: '#C49002'
} as const

// 红色 色值50 - 900 阶梯加深
export const red = {
  600: '#C54747',
  650: '#F95050',
  700: '#FF3D3D'
} as const

// 绿色 色值50 - 900 阶梯加深
export const green = {
  600: '#29BE95',
  700: '#45A48A'
} as const

// 蓝色 色值50 - 900 阶梯加深
export const blue = {
  700: '#183EFC'
} as const

export const black = {
  800: '#222222',
  900: '#110E23'
}

// 品牌色
export const colorPrimary = blue['700']
// export const colorPrimarySecondary = blue['500']

// 文字
export const colorTextPrimary = gray['900']
export const colorTextSecondary = gray['600']
export const colorTextWeak = gray['500']

// 其他
export const borderColor = gray['200']
export const grayLight = gray['50']
export const hoverBg = 'rgba(225, 225, 225, .2)'
export const bgColorBase = gray['50']
export const pageContainerHeaderBg = '#F8FBFD'

export const colorSoftWhite = 'rgba(250, 250, 250, 1)'
export const colorWhite = '#fff'
export const colorBlack = '#000'

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
  // 品牌颜色
  '--color-primary': colorPrimary, // 品牌主色
  // '--color-primary-secondary': colorPrimarySecondary, // 品牌主色-第二色-衍生色1
  // '--color-primary-weak': colorPrimaryWeak, // 品牌主色-衍生色2
  // '--color-primary-light': colorPrimaryLight // 品牌主色-衍生色3

  // 文字颜色
  '--color-text-primary': colorTextPrimary, // 文字主色
  '--color-text-secondary': colorTextSecondary, // 文字-第二色-衍生色1
  '--color-text-weak': colorTextWeak, // 文字-衍生色2
  // '--color-text-light': colorTextLight, // 文字-第二色-衍生色3

  // 按钮颜色
  '--btn-primary': colorPrimary, // 按钮主色
  '--btn-disable-bg': gray['150'], // 禁用置灰背景色

  // 链接颜色
  '--link-color': colorPrimary,

  // 边框
  '--border-color': borderColor, // 边框颜色

  // 页面颜色
  '--page-bg': bgColorBase, // 页面背景
  '--card-bg': bgColorBase, // 卡片背景
  '--active-bg': bgColorBase, // 激活背景
  '--placeholder-bg': bgColorBase, // 输入框背景
  '--hover-bg': hoverBg, // hover颜色
  '--page-container-header-bg': pageContainerHeaderBg, // 容器头部背景颜色
  '--color-green': green['700'], // 全局绿
  '--color-red': red['600'], // 全局红

  '--card-gradient-bg': 'linear-gradient(1deg, #FFFFFF 50%, #E6F1FF 100%)', // 卡片渐变背景颜色
  '--card-gradient-header-bg': 'linear-gradient(1deg, #FFFFFF 10%, #CDE2FF 100%)', // 卡片渐变背景颜色

  '--color-white': colorWhite,
  '--color-black': colorBlack,
  '--font-family': fontFamily, // 字体

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

  // 重写变量覆盖
  '--color-primary': gray['95'], // 文字主色-正文
  '--color-text-secondary': gray['570'], // 文字-第二色-衍生色1
  '--color-text-weak': gray['570'], // 文字-衍生色2
  '--border-color': gray['700'], // 边框颜色
  '--page-bg': gray['800'], // 页面背景
  '--color-green': green['600'], // 全局绿
  '--color-red': red['650'], // 全局红
  '--placeholder-bg': gray['750'], // 输入框底色背景
  '--input-border': gray['650'] // 输入框边框
}

const setRootVars = (themeVars: any) => {
  let vars = ''
  Object.keys(themeVars).forEach((key) => {
    vars += `${key}: ${themeVars[key]};\n`
  })
  return vars
}

// css变量注入页面中，通过var(--color-primary)使用
// 定义全局主题变量
// 黑色主题，修改<html data-theme="dark" /> 切换主题
export const cssVars = `
  :root {
    ${setRootVars(ThemeVarsConst)}
  }
  :root[data-theme=dark] {
    ${setRootVars(ThemeDarkVarsConst)}
  }
`
