import { cva } from 'class-variance-authority'
import { DOMAttributes } from 'react'

import { useTheme } from '@/context/themeProvider'

import type { extendColors } from '../../../theme/colors'
import { hasFlexClassName } from '../View'

export type ColorType = keyof (typeof extendColors)['textColor'] | 'red' | 'green' | 'white'

/**
 * 字体大小预设
 * @typedef {'xs' | 'sm' | '15' | 'base' | 'lg' | 'xl' | '2xl'} FontSize
 *  - `'xs'`: 12px
 *  - `'sm'`: 14px
 *  - `'15'`: 15px
 *  - `'base'`: 16px
 *  - `'lg'`: 18px
 *  - `'xl'`: 20px
 *  - `'2xl'`: 24px
 */
type FontSize =
  /** 10px */
  | 'xxs'
  /** 12px */
  | 'xs'
  /** 14px */
  | 'sm'
  /** 15px */
  | '15'
  /** 16px */
  | 'base'
  /** 18px */
  | 'lg'
  /** 20px */
  | 'xl'
  /** 22px */
  | '22'
  /** 24px */
  | '2xl'
  /** 28px */
  | '3xl'
  /** 30px */
  | '30'
type FontWeight =
  /** 100 */
  | 'thin'
  /** 200 */
  | 'extralight'
  /** 300 */
  | 'light'
  /** 400 */
  | 'normal'
  /** 500 */
  | 'medium'
  /** 600 */
  | 'semibold'
  /** 800 */
  | 'extrabold'
  /** bold */
  | 'bold'

// 字体行高
type Leading = FontSize

type Font =
  /** 数字字体常规 */
  | 'dingpro-regular'
  /** 数字字体加粗 */
  | 'dingpro-medium'

type IProps = DOMAttributes<any> & {
  /** 主题文字颜色类型 */
  color?: ColorType
  /** 文字大小预设 */
  size?: FontSize
  /** 字体行高，key与字体大小保持一致 */
  leading?: Leading
  /** 字体权重 */
  weight?: FontWeight
  /** 字体 */
  font?: Font
  children?: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

export const Text = (props: IProps) => {
  const { style, className, children, color, size, font, weight, leading, ...res } = props
  const { cn, theme } = useTheme()
  // 如果外部传入style是style={cn('')}形式，则将style内容传入到className合并
  const styleClassName = typeof style === 'string' ? style : undefined

  // cva 就会算出最终的 className
  const fontVariants = cva('', {
    // 声明字体的不同变体
    variants: {
      size: {
        xxs: 'text-[10px]',
        xs: 'text-xs',
        sm: 'text-sm',
        '15': 'text-[15px]', // 15px
        base: 'text-base', // 16px
        lg: 'text-lg', // 18px
        xl: 'text-xl', // 20px
        '22': 'text-[22px]', // 22px
        '2xl': 'text-2xl', // 24px
        '3xl': 'text-3xl', // 28px
        '30': 'text-[30px]' // 30px
      },
      // 字体行高
      leading: {
        xxs: 'leading-[10px]',
        xs: 'leading-3',
        sm: 'leading-[14px]',
        '15': 'leading-[15px]', // 15px
        base: 'leading-4', // 16px
        lg: 'leading-[18px]', // 18px
        xl: 'leading-5', // 20px
        '22': 'leading-[22px]', // 22px
        '2xl': 'leading-6', // 24px
        '3xl': 'leading-7', // 28px
        '30': 'leading-[30px]' // 30px
      },
      // 字体权重
      weight: {
        /** 100 */
        thin: 'font-thin',
        /** 200 */
        extralight: 'font-extralight',
        /** 300 */
        light: 'font-light',
        /** 400 */
        normal: 'font-normal',
        /** 500 */
        medium: 'font-medium',
        /** 600 */
        semibold: 'font-semibold',
        /** 800 */
        extrabold: 'font-extrabold',
        /** bold */
        bold: 'font-bold'
      },
      // 字体
      font: {
        /** 数字字体常规 */
        'dingpro-regular': 'font-dingpro-regular',
        /** 数字字体加粗 */
        'dingpro-medium': 'font-dingpro-medium'
      }
    },
    // 设置默认变体
    defaultVariants: {
      size: 'sm' // 默认14px
    }
  })

  // 获取主题色变量，设置文字颜色
  const colorsMap = {
    red: theme.colors.red.DEFAULT,
    green: theme.colors.green.DEFAULT,
    white: theme.colors.white.DEFAULT,
    ...theme.colors.textColor
  }

  const colorStyle = { color: colorsMap[color ?? 'primary'] as any }
  const fontSizeClassName = fontVariants({ size, font, weight, leading })

  return (
    <span
      className={cn(hasFlexClassName(cn(className, styleClassName)) && 'flex', fontSizeClassName, className, styleClassName)}
      style={{
        ...colorStyle,
        ...(typeof style === 'object' ? style : {})
      }}
      {...res}
    >
      {children}
    </span>
  )
}
