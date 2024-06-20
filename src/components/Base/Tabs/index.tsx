import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Tabs as AntdTabs, TabsProps } from 'antd'
import classNames from 'classnames'

import styles from './index.less'

export default function Tabs({
  hiddenBottomLine,
  showTopTabLine,
  type,
  tabBarGutter = 0,
  items = [],
  marginBottom = 16,
  ...res
}: TabsProps & { hiddenBottomLine?: boolean; showTopTabLine?: boolean; marginBottom?: number }) {
  let rootClassName = styles.tabs
  if (showTopTabLine) {
    rootClassName = styles.topTabs
  } else if (type === 'card') {
    rootClassName = styles.tabsCard
  }

  const itemsLen = items.length
  const className = useEmotionCss(({ token }) => {
    return {
      // 设置最后一个元素间距，通过:last-child设置不生效
      [`.ant-tabs-nav-list > .ant-tabs-tab:nth-child(${itemsLen})`]: {
        marginRight: itemsLen >= 5 ? `${tabBarGutter + 30}px` : 0
      },
      '.ant-tabs-nav': {
        marginBottom: `${marginBottom}px !important`
      },
      '.ant-tabs-tab-active .ant-tabs-tab-btn': {
        fontWeight: '600 !important'
      }
    }
  })

  return (
    <AntdTabs
      rootClassName={classNames(rootClassName, className, {
        'hide-tabbar-border': hiddenBottomLine
      })}
      type={type}
      tabBarGutter={tabBarGutter}
      items={items}
      {...res}
    />
  )
}
