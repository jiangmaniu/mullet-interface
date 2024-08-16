import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Tabs as AntdTabs, TabsProps } from 'antd'
import classNames from 'classnames'

export default function Tabs({
  hiddenBottomLine,
  showTopTabLine,
  type,
  tabBarGutter = 0,
  items = [],
  marginBottom = 0,
  paddingBottom = 12,
  ...res
}: TabsProps & { hiddenBottomLine?: boolean; showTopTabLine?: boolean; marginBottom?: number; paddingBottom?: number }) {
  const tabsClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-tabs-nav-operations': {
        paddingLeft: '0 !important'
      },
      '.ant-tabs-nav-more': {
        marginLeft: '0 !important'
      },
      '.ant-tabs-ink-bar': {
        height: '4px !important',
        borderRadius: '100px 100px 0px 0px !important'
      },
      '.ant-tabs-tab': {
        paddingBottom: `${paddingBottom}px !important`
      }
    }
  })

  // @ts-ignore
  const topTabsClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-tabs-ink-bar': {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '4px !important',
        background: 'var(--color-text-primary)',
        borderRadius: '0 0 100px 100px !important',
        visibility: 'visible !important'
      },
      '.ant-tabs-tab': {
        paddingBottom: '4px !important'
      }
    }
  })

  const tabsCardClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-tabs-nav-list': {
        position: 'relative'
      },
      '.ant-tabs-tab': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 160,
        background: '#f8fbfd !important',
        borderRadius: '16px 16px 0 0 !important',
        '&.ant-tabs-tab-active': {
          background: '#fff !important'
        }
      }
    }
  })

  let rootClassName = tabsClassName
  if (showTopTabLine) {
    rootClassName = topTabsClassName
  } else if (type === 'card') {
    rootClassName = tabsCardClassName
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
      // 隐藏tabbar底部边框线
      '.ant-tabs-nav::before': {
        borderBottom: hiddenBottomLine ? 'none !important' : '1px solid var(--tabs-border-color) !important'
      },
      '.ant-tabs-tab-active .ant-tabs-tab-btn': {
        fontFamily: 'pf-bold !important'
      },
      '&.ant-tabs': {
        width: '100%'
      }
    }
  })

  return <AntdTabs rootClassName={classNames(rootClassName, className)} type={type} tabBarGutter={tabBarGutter} items={items} {...res} />
}
