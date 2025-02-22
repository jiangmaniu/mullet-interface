import React, { isValidElement } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'

import { navigateTo } from '@/pages/webapp/utils/navigator'
import { Text } from '../Text'
import { View } from '../View'

export interface IlistItemProps {
  /** 列表图标 */
  icon?: string | React.ReactNode
  /** 列表图标颜色 */
  iconColor?: string
  /** 标题 */
  title: string
  subTitle?: string
  value?: string | number
  /** 右侧副文本 */
  subText?: React.ReactNode
  href?: string
  params?: { [key: string]: any }
  rightIcon?: any
  onPress?: () => void
  renderExtraElement?: () => React.ReactNode
  /** 第一个无上边框 */
  first?: boolean
  /** 是否被选中 */
  active?: boolean
  hiddenRightIcon?: boolean
  styles?: {
    container?: React.CSSProperties
    iconStyle?: React.CSSProperties
    itemStyle?: React.CSSProperties
    titleStyle?: React.CSSProperties
    subTextStyle?: React.CSSProperties
    rightIconStyle?: React.CSSProperties
  }
}

const ListItem: React.FC<IlistItemProps> = ({
  icon,
  iconColor,
  title,
  subTitle,
  subText,
  renderExtraElement,
  styles,
  first,
  rightIcon,
  hiddenRightIcon,
  href,
  params,
  onPress
}) => {
  const { cn, theme } = useTheme()

  const _iconColor = iconColor ?? theme.colors.textColor.secondary
  return (
    <View
      onClick={() => {
        onPress?.()
        if (href) {
          navigateTo(href, params)
        }
      }}
      bgColor="primary"
      borderColor="weak"
      className={cn('h-[60px] px-3 flex flex-row items-center rounded-lg')}
      style={{ backgroundColor: theme.colors.backgroundColor.heavy, ...styles?.container }}
    >
      {!!icon && isValidElement(icon)
        ? icon
        : // @ts-ignore
          icon && <Iconfont name={icon} size={20} color={_iconColor} style={{ marginRight: 8, ...styles?.iconStyle }} />}
      <View className={cn('flex-1 h-full flex flex-row justify-between items-center')} style={styles?.itemStyle}>
        <View style={styles?.titleStyle}>
          <Text className={cn({ fontSize: 16 })} style={styles?.titleStyle}>
            {title}
          </Text>
          {!!subTitle && <Text style={{ fontSize: '10px', lineHeight: '12px', color: theme.colors.textColor.weak }}>{subTitle}</Text>}
        </View>
        {isValidElement(renderExtraElement?.()) ? (
          renderExtraElement?.()
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', ...styles?.subTextStyle }}>
            {!!subText && (
              <Text style={{ fontSize: '14px', color: theme.colors.textColor.weak, marginRight: 11, ...styles?.subTextStyle }}>
                {subText}
              </Text>
            )}
            {!hiddenRightIcon && <Iconfont name="quancangxiala" size={16} color={theme.colors.textColor.secondary} />}
          </View>
        )}
      </View>
    </View>
  )
}

export default ListItem
