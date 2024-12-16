import { useIntl } from '@umijs/max'
import { cva, type VariantProps } from 'class-variance-authority'
import { debounce } from 'lodash'
import React, { DOMAttributes, isValidElement } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import { navigateTo } from '@/pages/webapp/utils/navigator'

import ActivityIndicator from '../Loading/ActivityIndicator'
import { Text } from '../Text'
import { View } from '../View'

// cva 就会算出最终的 className
const buttonVariants = cva('flex px-2 flex-row items-center justify-center rounded-lg', {
  // 声明了组件的不同变体
  variants: {
    // 按钮类型
    type: {
      default: 'border border-gray-70',
      primary: 'bg-brand !text-white',
      warnning: 'bg-yellow-500 !text-white',
      danger: 'bg-red !text-white',
      success: 'bg-green !text-white ',
      gray: 'bg-gray-50 !text-gray-500 dark:!text-gray-500 border border-gray-70'
    },
    // 按钮尺寸
    size: {
      // 对应设计稿按钮大小命名
      default: 'h-[40px]',
      xs: 'h-[30px] text-xs rounded-[6px]', // 小按钮
      small: 'h-[34px] text-sm', // 小按钮
      middle: 'h-[44px]', // 中等
      large: 'h-[46px]' // 大按钮
    }
  },
  // 设置了默认变体
  defaultVariants: {
    type: 'default',
    size: 'default'
  }
})

export type ButtonType = VariantProps<typeof buttonVariants>

export type ButtonProps = DOMAttributes<any> &
  ButtonType & {
    /** 按钮文字样式 */
    textStyle?: React.CSSProperties
    /** 按钮文字类名 */
    textClassName?: string
    /** 按钮样式 */
    style?: React.CSSProperties
    className?: string
    /** 按钮外层容器样式 */
    containerStyle?: React.CSSProperties
    containerClassName?: string
    children?: React.ReactNode
    /** 是否禁用 */
    disabled?: boolean
    /** 按钮loading动画 */
    loading?: boolean
    /** 路由参数 */
    params?: any
    /** 跳转路由地址 */
    href?: string
    /** icon图标在按钮文字中的方向 居左 居右显示 */
    iconDirection?: 'left' | 'right'
    /** iconfont name */
    icon?: string
    /** iconfont 尺寸 */
    iconProps?: { size?: number; color?: string | string[] }
    /** 按钮高度 */
    height?: number
    /** 防抖时间 ms */
    debounceTime?: number
    /** 是否防抖 */
    isDebounce?: boolean
  }

const ButtonWrapper: React.FC<ButtonProps> = (
  {
    style: buttonStyle,
    className,
    textStyle,
    textClassName,
    containerStyle,
    containerClassName,
    type,
    size,
    children,
    params = {},
    disabled,
    onClick,
    href,
    iconDirection = 'right',
    icon,
    iconProps,
    loading,
    height,
    debounceTime = 300,
    isDebounce = true
  },
  ref
) => {
  const intl = useIntl()
  const { cn, theme } = useTheme()
  const buttonClassName = buttonVariants({ type, size })
  const isIconLeft = iconDirection === 'left' // 图标在文字左边

  const debounceFn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (disabled || loading) return
    // 初始化点击事件
    if (onClick) {
      onClick?.(e)
    }
    // 根据href跳转页面
    if (typeof href === 'string' && href) {
      navigateTo(href, params)
    }
  }

  // 点击事件
  const handlePress = isDebounce ? debounce(debounceFn, debounceTime) : debounceFn

  /** 提取cva算出最终的className分开设置到text,view组件上 eg.
   *  buttonClassName：flex items-center justify-center rounded-lg bg-green text-white text-lg h-10
      btnTextClassName：text-white text-lg
      btnWrapperClassName：flex items-center justify-center rounded-lg bg-green h-10
   */
  const [btnTextClassName, btnWrapperClassName] = buttonClassName
    .split(' ')
    .reduce(
      (acc: any, className: any) => {
        // text-开头的设置到text组件上
        if (className.startsWith('text-') || className.startsWith('!text-')) {
          acc[0].push(className)
        } else {
          // 其他设置到view组件上
          acc[1].push(className)
        }
        return acc
      },
      [[], []]
    )
    .map((classes: any) => classes.join(' '))

  // 图标
  const IconDom = icon ? (
    <Iconfont name={icon} size={22} color={type === 'primary' && !disabled ? '#fff' : theme.colors.textColor.primary} {...iconProps} />
  ) : null

  return (
    <View
      onClick={handlePress}
      className={cn(containerClassName)}
      style={{ pointerEvents: disabled || loading ? 'none' : 'auto', ...containerStyle }}
    >
      <View
        className={cn(btnWrapperClassName, className)}
        style={{
          ...(disabled ? { backgroundColor: theme.colors.Button.disabledBg } : {}),
          ...(!height ? { height } : {}),
          ...(buttonStyle || {})
        }}
      >
        {!loading && (
          <>
            {!isValidElement(children) ? (
              <>
                {isIconLeft && IconDom}
                <Text
                  className={cn(
                    'text-base',
                    btnTextClassName,
                    icon && [isIconLeft ? 'pl-[2px]' : 'pr-[2px]'], // icon距离文字间距
                    textClassName
                  )}
                  style={{
                    ...(disabled ? { color: theme.colors.textColor.primary } : {}),
                    ...textStyle
                  }}
                >
                  {children}
                </Text>
                {!isIconLeft && IconDom}
              </>
            ) : (
              children
            )}
          </>
        )}
        {loading && <ActivityIndicator size={20} color={type === 'primary' ? '#fff' : theme.colors.textColor.primary} />}
      </View>
    </View>
  )
}

const Button: React.FC<ButtonProps> = ({ ...props }) => {
  return <ButtonWrapper {...props} />
}

export default Button
