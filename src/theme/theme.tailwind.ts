import colors from 'tailwindcss/colors'

import { black, blue, borderColor, colorPrimary, gray, green, red, ThemeDarkVarsConst, yellow } from './theme.config'

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

// 该方法是为了颜色基础类可以提供设置透明度的快捷方式
function withOpacityValue(variable: any) {
  // 返回一个函数，透明度为可选参数，这样在 HTML 元素中使用颜色基础类时，既可以采用 text-blue-500 方式，也支持 text-blue-500/20 快捷同时设置透明度的形式
  return ({ opacityValue }: any) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgba(var(${variable}), ${opacityValue})`
  }
}

// 请注意：使用了css变量的值，没有使用withOpacityValue继承透明度(改动太大)，则透明度不能这样写text-gray/10，其他值可以正常写

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
    DEFAULT: 'var(--color-yellow)' // 默认值 text-yellow
  },
  // 灰色系
  gray: {
    ...colors.gray,
    ...gray,
    // 文字颜色
    DEFAULT: 'var(--color-text-primary)', // 默认值，文字主色 text-gray
    // DEFAULT: gray['900'], // 默认值，文字主色 text-gray
    secondary: 'var(--color-text-secondary)', // 文字-第二色-衍生色1
    weak: 'var(--color-text-weak)' // 文字-衍生色2
    // light: colorTextLight,// 文字-衍生色3
  },
  // 绿色系
  green: {
    ...colors.green,
    ...green,
    DEFAULT: 'var(--color-green)' // 默认值 text-green
  },
  // 红色系
  red: {
    ...colors.red,
    ...red,
    DEFAULT: 'var(--color-red)' // 默认值 text-red
  },
  // 蓝色系
  blue: {
    ...colors.blue,
    ...blue,
    DEFAULT: 'var(--color-blue)' // 默认值 text-blue
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
      'input-border': ThemeDarkVarsConst['--input-border'], // 输入框边框
      'modal-border': ThemeDarkVarsConst['--border-modal-color'] // 弹窗悬浮框边框颜色
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
    // 使用css变量，方便切换主题，使用方法：text-base-primary
    textColor: {
      'base-primary': 'var(--color-text-primary)',
      'base-secondary': 'var(--color-text-secondary)',
      'base-weak': 'var(--color-text-weak)'
    },
    backgroundColor: {
      'base-primary': 'var(--page-bg)', // 页面背景颜色
      'base-hover': 'var(--hover-bg)' // hover背景颜色
    },
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
