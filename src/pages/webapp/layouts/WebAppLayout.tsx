import { Outlet, useIntl, useLocation, useModel } from '@umijs/max'
import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'
import usePageVisibility from '@/hooks/usePageVisibility'
import useSwitchPcOrMobile from '@/hooks/useSwitchPcOrMobile'
import useSyncDataToWorker from '@/hooks/useSyncDataToWorker'
import TabBottomBar from '@/pages/webapp/components/TabBottomBar'
import { isMainTabbar } from '@/pages/webapp/utils/navigator'
import { message } from '@/utils/message'
import { useNetwork } from 'ahooks'
import { useEffect } from 'react'
import AddPwaAppModal from '../components/Base/AddPwaAppModal'

/**
 * webapp页面的布局-布局总入口
 * @returns
 */
function WebAppLayout() {
  const { pathname } = useLocation()
  const { fetchUserInfo } = useModel('user')
  const { trade, ws, global } = useStores()
  const networkState = useNetwork()
  const intl = useIntl()
  const isOnline = networkState.online

  // 同步数据到worker线程
  useSyncDataToWorker()

  // 切换 pc 和移动端布局
  useSwitchPcOrMobile()

  useEffect(() => {
    if (!isOnline) {
      // 网络断开
      message.info(intl.formatMessage({ id: 'mt.duankailianjie' }))
    }
  }, [isOnline])

  // 关闭ws连接，切换页面激活状态，pageActive激活状态在useSyncDataToWorker中同步到worker线程
  usePageVisibility(
    () => {
      // 用户从后台切换回前台时执行的操作
      trade.setTradePageActive(true)

      // ws没有返回token失效状态，需要查询一次用户信息，看当前登录态是否失效，避免长时间没有操作情况
      fetchUserInfo(true)
    },
    () => {
      // 用户从前台切换到后台时执行的操作
      trade.setTradePageActive(false)

      // 关闭ws
      ws.close()
      // 关闭worker
      ws.closeWorker?.()
    }
  )

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
