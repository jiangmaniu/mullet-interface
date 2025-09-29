import { cloneDeep, merge } from 'lodash'
import colors from 'tailwindcss/colors'

import { extendColors, themeColorsMobile } from '../pages/webapp/theme/colors'
import { blue, getTailwindCssVarColor, gray, green, lightTheme, red, yellow } from './theme.config'

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
      // @ts-ignore
      // 加上默认值，否则没有颜色提示
      return `rgb(var(${variable},${lightTheme[variable]}))`
    }
    // @ts-ignore
    // 加上默认值，否则没有颜色提示
    return `rgba(var(${variable},${lightTheme[variable]}), ${opacityValue})`
  }
}

/**
 * ！！！请注意：不能在css变量包裹后的值的基础上设置透明度 例如 bg-green/10，可以使用bg-green-700/10
 * 使用了css变量的值，会丢失透明度，导致颜色透明度颜色不生效
 * 没有使用withOpacityValue包裹原因：
 * 1、需要把config中的十六进制转为rgb格式 例如 --color-primary: 255 115 179 不方便在代码中实时查看颜色
 * 2、不方便在antd中使用
 * 3、使用到css变量统一修改主题
 * 4、透明度失效问题，可以使用非css变量包裹的值即可
 */

const themeColor = {
  // 系统自带默认颜色
  ...colors,

  // 黄色系
  yellow: {
    ...colors.yellow,
    // 使用css变量覆盖pc和h5的同名变量
    ...getTailwindCssVarColor(yellow, 'yellow'),
    DEFAULT: 'var(--color-yellow)'
  },
  // 灰色系
  gray: {
    ...colors.gray,
    // 使用css变量覆盖pc和h5的同名变量
    ...getTailwindCssVarColor(gray, 'gray'),
    DEFAULT: 'var(--color-gray)'
  },
  // 绿色系
  green: {
    ...colors.green,
    // 使用css变量覆盖pc和h5的同名变量
    ...getTailwindCssVarColor(green, 'green'),
    DEFAULT: 'var(--color-green)'
  },
  // 红色系
  red: {
    ...colors.red,
    ...red,
    DEFAULT: `var(--color-red,${lightTheme['--color-red']})` // 默认值 text-red
  },
  // 蓝色系
  blue: {
    ...colors.blue,
    // 使用css变量覆盖pc和h5的同名变量
    ...getTailwindCssVarColor(blue, 'blue'),
    DEFAULT: 'var(--color-blue)'
  }
}

export default {
  // 默认居中容器 https://www.tailwindcss.cn/docs/container
  container: {
    center: true
  },
  colors: {
    // =========== 颜色覆盖 ==============
    ...merge(
      cloneDeep(themeColorsMobile), //h5主题变量
      // pc主题变量
      cloneDeep({
        // 品牌主色
        brand: {
          DEFAULT: `var(--color-brand-primary,${lightTheme['--color-brand-primary']})`, // 默认值 text-brand
          'text-primary': `var(--color-brand-text-primary,${lightTheme['--color-brand-text-primary']})` // 品牌主色-文字颜色
          // secondary: colorBrandSecondary // 品牌色-第二色-衍生色1
          // weak: lightTheme.colorBrandWeak // 品牌色-衍生色2
          // light: lightTheme.colorBrandLight // 品牌色-衍生色3
        },
        ...themeColor
      })
    )
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
    // 使用css变量，可以切换多套主题变量
    // ======== 使用css变量，方便切换主题，使用方法：text-primary ==============
    // 主题文字变量
    textColor: extendColors.textColor, //包含了pc和h5的同名css变量，通过切换class变化变量
    // 主题背景颜色变量
    backgroundColor: extendColors.backgroundColor, //包含了pc和h5的同名css变量，通过切换class变化变量
    borderColor: {
      // pc主题变量
      ...themeColor,
      // h5主题变量
      ...extendColors.borderColor
    },
    margin: {
      '7.5': '1.875rem',
      '5.5': '1.375rem',
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
    height: {
      '9.25': '2.25rem'
    },
    gap: {
      '4.5': '1.125rem',
      '15': '3.75rem',
      '18': '4.5rem',
      '21': '5.25rem'
    },
    keyframes: {
      'fade-out-up': {
        '0%': { opacity: '1', transform: 'translateY(0)' },
        '100%': { opacity: '0', transform: 'translateY(-16px)' }
      },
      'fade-in-down': {
        '0%': { opacity: '0', transform: 'translateY(-16px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' }
      },
      'border-beam': {
        '0%': { 'offset-distance': '0%' },
        '100%': { 'offset-distance': '100%' }
      }
    },
    animation: {
      'fade-out-up': 'fade-out-up 0.25s ease-in-out forwards',
      'fade-in-down': 'fade-in-down 0.25s ease-in-out forwards',
      'border-beam': 'border-beam calc(var(--duration) * 1s) infinite linear'
    }
  }
}
