import { useIntl, useLocation } from '@umijs/max'
import { TabBar } from 'antd-mobile'
import { observer } from 'mobx-react'
import { FC, useEffect } from 'react'

import Hidden from '@/components/Base/Hidden'
import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { TabbarActiveKey } from '@/mobx/global'

import Position from './Position'
import Quote from './Quote'
import Trade from './Trade'
import UserCenter from './UserCenter'

type IProps = {
  /**激活tabbar的key */
  activeKey?: TabbarActiveKey
}

/**H5 tabbar底部导航 */
const TabBottomBar: FC<IProps> = ({ activeKey }) => {
  const { global } = useStores()
  const { tabBarActiveKey, setTabBarActiveKey } = global
  const intl = useIntl()
  const { pathname } = useLocation()

  const renderTabIcon = (name: string, active: boolean) => {
    return <Iconfont name={name} width={28} height={28} color={active ? 'var(--color-text-primary)' : '#BFBFBF'} key={name} />
  }

  const tabs = [
    {
      key: 'Quote',
      title: intl.formatMessage({ id: 'app.tabBar.Quotes' }),
      icon: (active: boolean) => renderTabIcon('caidan-hangqing', active),
      component: <Quote />
    },
    {
      key: 'Trade',
      title: intl.formatMessage({ id: 'app.tabBar.Trade' }),
      icon: (active: boolean) => renderTabIcon('caidan-jiaoyi', active),
      component: <Trade />
    },
    {
      key: 'Position',
      title: intl.formatMessage({ id: 'app.tabBar.Position' }),
      icon: (active: boolean) => renderTabIcon('caidan-cangwei', active),
      component: <Position />
    },
    {
      key: 'UserCenter',
      title: intl.formatMessage({ id: 'app.tabBar.Account' }),
      icon: (active: boolean) => renderTabIcon('caidan-zhanghu', active),
      component: <UserCenter />
    }
  ]

  useEffect(() => {
    if (activeKey) {
      setTabBarActiveKey(activeKey)
    }
  }, [activeKey])

  const UserCenterPaths = ['/account', '/record', '/setting']

  useEffect(() => {
    // 如果在pc个人中心手动切换响应式，则激活个人中心Tabbar
    if (UserCenterPaths.some((item) => pathname.indexOf(item) !== -1)) {
      setTabBarActiveKey('UserCenter')
    }

    // 回显地址栏参数
    const activeTabKey = location.hash.replace('#', '') as TabbarActiveKey
    if (activeTabKey) {
      setTabBarActiveKey(activeTabKey)
    }
  }, [pathname])

  return (
    <div>
      {tabs.map((item, idx) => {
        return (
          <Hidden show={item.key === tabBarActiveKey} key={idx}>
            {item.component}
          </Hidden>
        )
      })}
      <div className="bottom-0 fixed w-full border-t border-[var(--tabs-border-color)]">
        <TabBar
          activeKey={tabBarActiveKey}
          safeArea
          onChange={(key) => {
            setTabBarActiveKey(key as TabbarActiveKey)
          }}
        >
          {tabs.map((item) => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </div>
    </div>
  )
}

export default observer(TabBottomBar)
