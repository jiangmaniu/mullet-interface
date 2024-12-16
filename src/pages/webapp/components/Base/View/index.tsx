import { DOMAttributes } from 'react'

import { useTheme } from '@/context/themeProvider'

import type { extendColors } from '../../../theme/colors'

type BorderColorType = keyof (typeof extendColors)['borderColor']

type BgColorType = keyof (typeof extendColors)['backgroundColor']

type IProps = DOMAttributes<any> & {
  /** 主题背景颜色类型 */
  bgColor?: BgColorType
  /** 主题边框颜色类型 */
  borderColor?: BorderColorType
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  disabled?: boolean
  /**兼容app事件 */
  onPress?: () => void
}

// 检测样式中是否包含flex相关的信息，兼容rn复制过来的代码没有写flex属性
export const hasFlexClassName = (className: any) => {
  const flexProps = ['items-', 'justify-', 'align-', 'content-']

  // 检查className中是否包含flex相关类名
  const hasFlexClass = className?.split(' ').some((cls: any) => flexProps.some((prop) => cls.startsWith(prop)))

  return hasFlexClass
}

export const View = (props: IProps) => {
  const { onPress, onClick, disabled, style, className, children, bgColor, borderColor, ...res } = props
  const { cn, theme } = useTheme()
  // 如果外部传入style是style={cn('')}形式，则将style内容传入到className合并
  const styleClassName = typeof style === 'string' ? style : undefined

  const bgColorStyle = bgColor ? { backgroundColor: theme.colors.backgroundColor[bgColor] as any } : undefined
  const borderColorStyle = borderColor ? { borderColor: theme.colors.borderColor[borderColor] as any } : undefined

  return (
    <div
      className={cn(hasFlexClassName(className) && 'flex', disabled && 'pointer-events-none', className, styleClassName)}
      style={{
        ...bgColorStyle,
        ...borderColorStyle,
        ...(typeof style === 'object' ? style : {})
      }}
      onClick={onClick || onPress}
      {...res}
    >
      {children}
    </div>
  )
}
