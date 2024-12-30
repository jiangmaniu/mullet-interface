import { useIntl, useLocation } from '@umijs/max'
import { TabBar } from 'antd-mobile'
import { observer } from 'mobx-react'
import { FC, useEffect } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { TabbarActiveKey } from '@/mobx/global'
import { getPathname } from '@/utils/navigator'

import Position from '../../pages/Position'
import Quote from '../../pages/Quote'
import Trade from '../../pages/Trade'
import UserCenter from '../../pages/UserCenter'
import { isMainTabbar, navigateTo } from '../../utils/navigator'

type IProps = {
  /**激活tabbar的key */
  activeKey?: TabbarActiveKey
}

/**H5 tabbar底部导航 */
const TabBottomBar: FC<IProps> = ({ activeKey }) => {
  const { global, kline } = useStores()
  const { tabBarActiveKey, setTabBarActiveKey } = global
  const intl = useIntl()
  const { pathname } = useLocation()
  const { setMode, theme } = useTheme()
  const { isDark } = theme

  const renderTabIcon = (name: string, active: boolean) => {
    return <Iconfont name={name} width={28} height={28} color={active ? 'var(--color-text-primary)' : '#BFBFBF'} key={name} />
  }

  const tabs = [
    {
      key: '/app/quote',
      title: intl.formatMessage({ id: 'app.tabBar.Quotes' }),
      icon: (active: boolean) => renderTabIcon('caidan-hangqing', active),
      component: <Quote />
    },
    {
      key: '/app/trade',
      title: intl.formatMessage({ id: 'app.tabBar.Trade' }),
      icon: (active: boolean) => renderTabIcon('caidan-jiaoyi', active),
      component: <Trade />
    },
    {
      key: '/app/position',
      title: intl.formatMessage({ id: 'app.tabBar.Position' }),
      icon: (active: boolean) => renderTabIcon('caidan-cangwei', active),
      component: <Position />
    },
    {
      key: '/app/user-center',
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
      setTabBarActiveKey('/app/user-center')
    }

    // 激活Tabbar
    if (isMainTabbar(pathname)) {
      setTabBarActiveKey(getPathname(pathname) as TabbarActiveKey)
    }
  }, [pathname])

  return (
    <div className="bottom-0 z-[3] bg-primary fixed w-full border-t border-[var(--tabs-border-color)]">
      <TabBar
        activeKey={tabBarActiveKey}
        safeArea
        onChange={(key) => {
          setTabBarActiveKey(key as TabbarActiveKey)
          navigateTo(key)
        }}
      >
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </div>
  )
}

export default observer(TabBottomBar)
