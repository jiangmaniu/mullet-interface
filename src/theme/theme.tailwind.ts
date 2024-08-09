import colors from 'tailwindcss/colors'

import {
  bgColorBase,
  black,
  blue,
  borderColor,
  colorPrimary,
  colorTextSecondary,
  colorTextWeak,
  gray,
  green,
  hoverBg,
  pageContainerHeaderBg,
  red,
  ThemeDarkVarsConst,
  yellow
} from './theme.config'

// https://github.com/tailwindlabs/tailwindcss/issues/4690#issuecomment-1046087220
// 对于任何将 Tailwind 的完整默认颜色传播到 theme.colors 的人，都会收到警告
// Tailwind 已弃用了多个颜色名称并重命名了它们，但已将弃用的名称保留在颜色对象中以实现向后兼容性。这些已弃用的颜色可能会在未来版本中删除，届时警告将不会显示
// 同时，如果您需要将完整的默认颜色对象扩展到 theme.colors 并希望抑制警告，只需在导入后删除已弃用的颜色即可
// @ts-ignore
delete colors['lightBlue']
// @ts-ignore
delete colors['warmGray']
// @ts-ignore
delete colors['trueGray']
// @ts-ignore
delete colors['coolGray']
// @ts-ignore
delete colors['blueGray']

const themeColor = {
  // 系统自带默认颜色
  ...colors,

  black: {
    DEFAULT: colors.black,
    800: black[800],
    900: black[900]
  },

  // 黄色系
  yellow: {
    ...colors.yellow,
    ...yellow,
    DEFAULT: yellow['600'] // 默认值 text-yellow
  },
  // 灰色系
  gray: {
    ...colors.gray,
    ...gray,
    // 文字颜色
    DEFAULT: gray['900'], // 默认值，文字主色 text-gray
    secondary: colorTextSecondary, // 文字-第二色-衍生色1
    weak: colorTextWeak // 文字-衍生色2
    // light: colorTextLight,// 文字-衍生色3
  },
  // 绿色系
  green: {
    ...colors.green,
    ...green,
    DEFAULT: green['700'] // 默认值 text-green
  },
  // 红色系
  red: {
    ...colors.red,
    ...red,
    DEFAULT: red['600'] // 默认值 text-red
  },
  // 蓝色系
  blue: {
    ...colors.blue,
    ...blue,
    DEFAULT: blue['700'] // 默认值 text-blue
  }
}

export default {
  // 默认居中容器 https://www.tailwindcss.cn/docs/container
  container: {
    center: true
  },
  colors: {
    // 品牌主色
    primary: {
      DEFAULT: colorPrimary // 默认值 text-primary
      // secondary: colorPrimarySecondary // 品牌色-第二色-衍生色1
      // weak: ThemeVarsConst.colorPrimaryWeak // 品牌色-衍生色2
      // light: ThemeVarsConst.colorPrimaryLight // 品牌色-衍生色3
    },

    // 辅助颜色-自定义命名
    sub: {
      disable: gray['150'], // 禁用颜色
      hover: hoverBg, // hover背景
      card: bgColorBase, // 卡片背景
      headerBg: pageContainerHeaderBg
    },

    // 黑色主题变量
    dark: {
      page: ThemeDarkVarsConst['--page-bg'], // 页面背景颜色
      text: ThemeDarkVarsConst['--color-text-primary'], // 文字主色-正文
      'text-secondary': ThemeDarkVarsConst['--color-text-secondary'], // 文字-第二色-衍生色1
      'text-weak': ThemeDarkVarsConst['--color-text-weak'], // 文字-衍生色2
      green: ThemeDarkVarsConst['--color-green'], // 全局绿
      red: ThemeDarkVarsConst['--color-red'], // 全局红
      placeholder: ThemeDarkVarsConst['--placeholder-bg'] // 输入框底色背景
    },

    // =========== 颜色覆盖 ==============
    ...themeColor
  },
  // 边框样式
  borderColor: {
    ...themeColor,
    primary: borderColor,

    // 黑色主题变量
    dark: {
      border: ThemeDarkVarsConst['--border-color'], // 边框颜色
      'input-border': ThemeDarkVarsConst['--input-border'] // 输入框边框
    }
  },
  // 响应式
  screens: {
    sm: '576px', // 屏幕 ≥ 576px  小于576px写法eg. max-sm:bg-primary 其他类似
    md: '768px', // 屏幕 ≥ 768px
    lg: '992px', // 屏幕 ≥ 992px
    xl: '1200px', // 屏幕 ≥ 1200px
    xxl: '1600px' // 屏幕 ≥ 1600px
  },
  fontFamily: {
    // 平方中等、加粗字体
    'pf-medium': ['pf-medium'],
    'pf-bold': ['pf-bold'],
    // 数字常规、加粗字体
    'dingpro-regular': ['dingpro-regular'],
    'dingpro-medium': ['dingpro-medium'],
    // 鸿蒙常规、加粗、细体
    'hms-regular': ['hms-regular'],
    'hms-bold': ['hms-bold'],
    'hms-thin': ['hms-thin']
  },
  extend: {
    boxShadow: {
      custom: '0px 2px 70px 0px rgba(80,80,80,0.07)',
      dropdown: '0px 2px 50px 8px rgba(200,200,200,0.3)'
    },
    margin: {
      '7.5': '1.875rem',
      '4.5': '1.125rem'
    },
    // padding
    padding: {
      '5': '1.25rem',
      '5.5': '1.375rem',
      '6.5': '1.875rem'
    },
    width: {
      '1120': '70rem',
      '1300': '81.25rem'
    },
    gap: {
      '4.5': '1.125rem',
      '15': '3.75rem',
      '18': '4.5rem',
      '21': '5.25rem'
    }
  }
}
