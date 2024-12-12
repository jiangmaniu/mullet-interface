// 配色参考 https://www.tailwindcss.cn/docs/customizing-colors
import colors from 'tailwindcss/colors'

import { getColors, getTailwindCssVarColor, setRootVars } from '../../../theme/theme.config'

/** 灰色 色值50 - 900 阶梯加深 */
export const gray = {
  /** 一度灰-色块 */
  50: '#F7F7F7',
  /** 页面底色 */
  55: '#F8F9F9',
  /** 白-文字 */
  60: '#FEFEFE',
  /** 微-描边 */
  70: '#F0F0F0',
  /** 二度灰-色块 */
  80: '#EDEDED',
  85: '#F5F5F5',
  /** 三度灰-按钮禁用 */
  90: '#E1E1E1',
  /** 深-描边 */
  100: '#DADADA',
  /** 文字-次描述文本 */
  500: '#7B7E80',
  /** 文字-描述文本 */
  600: '#3E4042',
  /** 文字主色，不要使用#000 */
  900: '#222222', // 最深
  DEFAULT: '#222222' // 默认
}

/** 黄色 色值50 - 900 阶梯加深 */
export const yellow = {
  400: '#FFDA00',
  490: '#FCD535',
  500: '#FDD436',
  550: '#F5B52C',
  560: '#FFA90E',
  600: '#C49002',
  DEFAULT: '#C49002'
} as const

/** 红色 色值50 - 900 阶梯加深 */
export const red = {
  /** 默认全局红 */
  600: '#EB4848',
  DEFAULT: '#EB4848'
} as const

/** 绿色 色值50 - 900 阶梯加深 */
export const green = {
  /** 默认全局绿 */
  600: '#45A48A',
  DEFAULT: '#45A48A'
} as const

/** 蓝色 色值50 - 900 阶梯加深 */
export const blue = {
  /** 默认全局蓝 */
  700: '#183EFC',
  DEFAULT: '#183EFC'
} as const

/** 白色 */
export const white = {
  DEFAULT: '#fff'
} as const

/** 黑色 */
export const black = {
  // 设计稿不使用#000 使用222代替
  // 999: '#222',
  DEFAULT: gray.DEFAULT
} as const

/** 品牌色 */
export const brand = {
  DEFAULT: '#183EFC'
} as const

export const extendColors = {
  // ======== 使用css变量，方便切换主题，使用方法：text-primary ==============
  // 主题文字变量
  textColor: {
    brand: 'var(--color-brand-primary)', // #183EFC
    primary: 'var(--color-text-primary)', // 文字主色  #222222
    secondary: 'var(--color-text-secondary)', // 文字-描述文本  #3E4042
    weak: 'var(--color-text-weak)', // 文字-次描述文本  #7B7E80
    reverse: white.DEFAULT,
    reverse_weak: gray[85] // 相反色的 weak
  },
  // 主题背景颜色变量
  backgroundColor: {
    /** 页面背景颜色-白 #fff */
    primary: 'var(--bg-primary)',
    /** 页面背景颜色-灰 */
    secondary: gray[55],
    /** 透明 */
    transparent: 'transparent',
    /** 重色 */
    heavy: white.DEFAULT,
    reverse: gray[900]
  },
  // 边框样式
  borderColor: {
    /** 通用边框颜色-深 #DADADA */
    primary: 'var(--border-primary-color)',
    /** 通用边框颜色-浅 #F0F0F0 */
    weak: 'var(--border-weak-color)',
    /** 激活边框颜色 */
    active: 'var(--border-active-color,#222)'
  }
}

export const themeColorsMobile = {
  // 系统自带默认颜色
  ...colors,

  // 黄色系
  yellow: {
    ...colors.yellow,
    // 使用css变量覆盖pc和h5的同名变量
    ...getTailwindCssVarColor<typeof yellow>(yellow, 'yellow'),
    DEFAULT: 'var(--color-yellow)'
  },
  // 灰色系
  gray: {
    ...colors.gray,
    // 使用css变量覆盖pc和h5的同名变量
    ...getTailwindCssVarColor<typeof gray>(gray, 'gray'),
    DEFAULT: 'var(--color-gray)'
  },
  // 绿色系
  green: {
    ...colors.green,
    // 使用css变量覆盖pc和h5的同名变量
    ...getTailwindCssVarColor<typeof green>(green, 'green'),
    DEFAULT: 'var(--color-green)'
  },
  // 红色系
  red: {
    ...colors.red,
    // 使用css变量覆盖pc和h5的同名变量
    ...getTailwindCssVarColor<typeof red>(red, 'red'),
    DEFAULT: 'var(--color-red)'
  },
  // 蓝色系
  blue: {
    ...colors.blue,
    // 使用css变量覆盖pc和h5的同名变量
    ...getTailwindCssVarColor<typeof blue>(blue, 'blue'),
    DEFAULT: 'var(--color-blue)'
  },
  // 白色系
  white: {
    ...getTailwindCssVarColor<typeof white>(white, 'white'),
    DEFAULT: 'var(--color-white)'
  },
  // 黑色系
  black: {
    ...black
  },
  // 品牌色
  brand: {
    ...getTailwindCssVarColor<typeof brand>(brand, 'brand'),
    DEFAULT: 'var(--color-brand-primary)'
  },
  // 配置操作成功、失败颜色
  success: colors.green['600'],
  error: colors.red['600']
}

// 使用css变量覆盖pc同名变量
export const lightThemeVarsMobile = {
  // 移动端覆盖pc的主题变量
  '--color-text-secondary': gray[600], // 文字-描述文本
  '--color-text-weak': gray[500], // 文字-次描述文本

  // 边框
  /** 通用边框颜色-深 */
  '--border-primary-color': gray[100],
  /** 通用边框颜色-浅 */
  '--border-weak-color': gray[70],
  /** 激活边框颜色 */
  '--border-active-color': gray[900],

  // 默认颜色
  '--color-gray': gray.DEFAULT, // 默认全局黑
  '--color-green': green.DEFAULT, // 默认全局绿
  '--color-red': red.DEFAULT, // 默认全局红
  '--color-blue': blue.DEFAULT, // 默认全局蓝
  '--color-yellow': yellow['600'], // 默认全局黄
  '--color-white': white.DEFAULT, // 默认全局白

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

export const darkThemeVarsMobile = {
  // 移动端覆盖pc的主题变量
  '--color-text-secondary': gray[600], // 文字-描述文本
  '--color-text-weak': gray[500], // 文字-次描述文本

  // 边框
  /** 通用边框颜色-深*/
  '--border-primary-color': gray[100],
  /** 通用边框颜色-浅*/
  '--border-weak-color': gray[70],
  /** 激活边框颜色 */
  '--border-active-color': gray[900],

  // 默认颜色
  '--color-gray': gray.DEFAULT, // 默认全局黑
  '--color-green': green.DEFAULT, // 默认全局绿
  '--color-red': red.DEFAULT, // 默认全局红
  '--color-blue': blue.DEFAULT, // 默认全局蓝
  '--color-yellow': yellow['600'], // 默认全局黄
  '--color-white': white.DEFAULT // 默认全局白
}

// css变量注入页面中，通过var(--color-brand-primary)使用
// 定义全局主题变量
// 黑色主题，修改<html class="dark" /> 切换主题
// 为每个css变量添加!important，提高优先级
export const mobileCssVars = `
  :root[data-mode=h5-light] {
    ${setRootVars(lightThemeVarsMobile, true)};
    --rsbs-backdrop-bg: rgba(0, 0, 0, 0.6)
    --rsbs-bg: #fff;
    --rsbs-handle-bg: #ddd;
    --rsbs-max-w: auto;
    --rsbs-ml: env(safe-area-inset-left);
    --rsbs-mr: env(safe-area-inset-right);
  }
  :root[class=h5-dark] {
    ${setRootVars(darkThemeVarsMobile, true)}
    --rsbs-backdrop-bg: rgba(0, 0, 0, 0.6)
    --rsbs-bg: #fff;
    --rsbs-handle-bg: #ddd;
    --rsbs-max-w: auto;
    --rsbs-ml: env(safe-area-inset-left);
    --rsbs-mr: env(safe-area-inset-right);
  }
`
