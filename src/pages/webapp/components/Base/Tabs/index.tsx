import { useEmotionCss } from '@ant-design/use-emotion-css'
import { TabProps, Tabs as TabsAntd, TabsProps } from 'antd-mobile'
import React, { CSSProperties } from 'react'

import { useTheme } from '@/context/themeProvider'

type TabItem = TabProps & { key: React.Key; value?: any }

type IProps = TabsProps & {
  /**列表项 */
  items: TabItem[]
  /**标签直接的间距 */
  tabBarGutter?: number
  tabPaddingBottom?: number
  style?: CSSProperties
  /**@name 隐藏tabbar下划线  */
  hiddenTabbarLine?: boolean
  /**@name 隐藏tabbar底部分割长线  */
  hiddenBottomLine?: boolean
  /**当前激活 tab 下划线的宽度，仅在 activeLineMode 为 'fixed' 时有效 */
  fixedActiveLineWidth?: number
  /**选项卡头文字的大小 */
  titleFontSize?: number
  /**当前激活 tab 下划线的高度 */
  activeLineHeight?: number
  /**当前激活 tab 下划线的圆角 */
  activeLineBorderRadius?: string
  /**当前激活 tab 下划线的颜色 */
  activeLineColor?: string
  /**当前激活 tab 选项文字颜色 */
  activeTitleColor?: string
}

/**
 * 可滚动的标签页
 */
export default function Tabs({
  items,
  tabBarGutter = 4,
  style,
  hiddenBottomLine = false,
  hiddenTabbarLine = false,
  tabPaddingBottom = 10,
  fixedActiveLineWidth = 30,
  titleFontSize = 16,
  activeLineHeight = 4,
  activeLineBorderRadius = `100px 100px 0px 0px`,
  activeLineColor,
  activeTitleColor,
  ...res
}: IProps) {
  const { theme } = useTheme()
  const className = useEmotionCss(({ token }) => {
    return {
      '&': hiddenBottomLine
        ? undefined
        : {
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '1px',
              width: '100%',
              backgroundColor: theme.colors.Tabs.borderColor
            }
          },
      '.adm-tabs-tab': {
        paddingBottom: tabPaddingBottom,
        margin: 0,
        color: theme.colors.textColor.secondary,
        fontWeight: '400 !important',
        width: '100%',
        textAlign: 'center'
      },
      '.adm-tabs-header': {
        borderBottom: 0
      },
      '.adm-tabs-tab-line': {
        display: hiddenTabbarLine ? 'none' : 'block',
        zIndex: 2
      },
      '.adm-tabs-tab-active': {
        color: 'var(--color-text-primary) !important',
        fontWeight: '500 !important'
      },
      '.adm-tabs-tab-list': {
        '.adm-tabs-tab-wrapper': {
          paddingRight: '12px !important',
          paddingLeft: '12px !important'
        }
      }
    }
  })

  return (
    <TabsAntd
      // @ts-ignore
      style={{
        '--active-title-color': activeTitleColor || theme.colors.textColor.primary,
        '--title-font-size': `${titleFontSize}px`,
        '--active-line-height': `${activeLineHeight}px`,
        '--fixed-active-line-width': `${fixedActiveLineWidth}px`,
        '--active-line-border-radius': activeLineBorderRadius,
        '--active-line-color': activeLineColor || theme.colors.textColor.primary,
        ...style
      }}
      stretch={false}
      className={className}
      activeLineMode="fixed"
      {...res}
    >
      {items.map((item, idx: number) => {
        return <TabsAntd.Tab key={item.key} style={{ marginRight: tabBarGutter, paddingBottom: 0, ...item.style }} title={item.title} />
      })}
    </TabsAntd>
  )
}
