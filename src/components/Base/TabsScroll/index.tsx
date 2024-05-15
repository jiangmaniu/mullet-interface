import { useEmotionCss } from '@ant-design/use-emotion-css'
import { TabProps, Tabs, TabsProps } from 'antd-mobile'
import React, { CSSProperties } from 'react'

type TabItem = TabProps & { key: React.Key }

type IProps = TabsProps & {
  /**列表项 */
  tabList: TabItem[]
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
export default function TabsScroll({
  tabList,
  tabBarGutter,
  style,
  hiddenBottomLine = true,
  hiddenTabbarLine,
  tabPaddingBottom = 0,
  ...res
}: IProps) {
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
              backgroundColor: '#E6E6E6'
            }
          },
      '.adm-tabs-tab': {
        paddingBottom: tabPaddingBottom,
        margin: 0
      },
      '.adm-tabs-header': {
        borderBottom: 0
      },
      '.adm-tabs-tab-wrapper': {
        padding: 0
      },
      '.adm-tabs-tab-line': {
        borderRadius: '100px 100px 0px 0px',
        display: hiddenTabbarLine ? 'none' : 'block',
        zIndex: 2
      }
    }
  })

  return (
    // @ts-ignore
    <Tabs style={{ '--active-line-height': '0px', '--adm-color-border': 'none', ...style }} stretch={false} className={className} {...res}>
      {tabList.map((item, idx: number) => {
        return <Tabs.Tab key={item.key} style={{ marginRight: tabBarGutter, paddingBottom: 0, ...item.style }} title={item.title} />
      })}
    </Tabs>
  )
}
