import { Outlet, useLocation } from '@umijs/max'

import useSwitchPcOrMobile from '@/hooks/useSwitchPcOrMobile'
import TabBottomBar from '@/pages/webapp/components/TabBottomBar'
import { isMainTabbar } from '@/pages/webapp/utils/navigator'

/**
 * webapp页面的布局
 * @returns
 */
export default function WebAppLayout() {
  const { pathname } = useLocation()

  useSwitchPcOrMobile() // 切换 pc 和移动端布局

  // 主Tabbar页面使用该布局
  if (isMainTabbar(pathname)) {
    return (
      <div className="h-screen flex flex-col">
        <div style={{ flex: '1 1' }}>
          <Outlet />
        </div>
        <div style={{ flex: '0 1' }}>
          <TabBottomBar />
        </div>
      </div>
    )
  }

  // 其他子页面使用的布局
  return (
    <div className="h-screen flex flex-col">
      <Outlet />
    </div>
  )
}
