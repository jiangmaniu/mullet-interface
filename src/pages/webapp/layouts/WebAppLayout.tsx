import { Outlet, useLocation } from '@umijs/max'
import { observer } from 'mobx-react'
import { useEffect } from 'react'

import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import useSwitchPcOrMobile from '@/hooks/useSwitchPcOrMobile'
import useSyncDataToWorker from '@/hooks/useSyncDataToWorker'
import TabBottomBar from '@/pages/webapp/components/TabBottomBar'
import { isMainTabbar } from '@/pages/webapp/utils/navigator'
import AddPwaAppModal from '../components/Base/AddPwaAppModal'

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
  useSwitchPcOrMobile()

  useEffect(() => {
    return () => {
      // 取消行情订阅
      ws.close()
      ws.closeWorker()
    }
  }, [])

  const Content = (
    <>
      <Outlet />
      <AddPwaAppModal />
    </>
  )

  // 主Tabbar页面使用该布局
  if (isMainTabbar(pathname)) {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex flex-col" style={{ flex: '1 1' }}>
          {Content}
        </div>
        <div style={{ flex: '0 1' }}>
          <TabBottomBar />
        </div>
      </div>
    )
  }

  // 其他子页面使用的布局
  return <div className="h-screen flex flex-col">{Content}</div>
}
export default observer(WebAppLayout)
