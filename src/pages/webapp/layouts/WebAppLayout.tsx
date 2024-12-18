import { Outlet, useLocation } from '@umijs/max'
import { observer } from 'mobx-react'
import { useEffect } from 'react'

import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import useSyncDataToWorker from '@/hooks/useSyncDataToWorker'
import TabBottomBar from '@/pages/webapp/components/TabBottomBar'
import { isMainTabbar } from '@/pages/webapp/utils/navigator'

/**
 * webapp页面的布局
 * @returns
 */
function WebAppLayout() {
  const { pathname } = useLocation()
  const { ws } = useStores()
  const { isPc } = useEnv()

  // 同步数据到worker线程
  useSyncDataToWorker()

  // 切换 pc 和移动端布局
  // useSwitchPcOrMobile()

  useEffect(() => {
    return () => {
      // 取消行情订阅
      ws.close()
      ws.closeWorker()
    }
  }, [])

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
export default observer(WebAppLayout)
