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
        fontWeight: '400 !important'
      },
      '.adm-tabs-header': {
        borderBottom: 0
      },
      '.adm-tabs-tab-line': {
        borderRadius: '100px 100px 0px 0px',
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
      style={{ '--title-font-size': '16px', '--active-line-height': '4px', ...style }}
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
