import { Outlet, useIntl, useLocation, useModel } from '@umijs/max'
import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'
import usePageVisibility from '@/hooks/usePageVisibility'
import useSyncDataToWorker from '@/hooks/useSyncDataToWorker'
import TabBottomBar from '@/pages/webapp/components/TabBottomBar'
import { isMainTabbar } from '@/pages/webapp/utils/navigator'
import { checkPageShowTime } from '@/utils/business'
import { message } from '@/utils/message'
import { useNetwork } from 'ahooks'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
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

  useEffect(() => {
    checkPageShowTime()

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

      // 避免多次刷新
      if (!checkPageShowTime()) return
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

  function handleTouchStart(event: TouchEvent) {
    if (event.touches.length > 1) {
      event.preventDefault() // 禁止双指缩放
    }
  }

  function handleGestureStart(event: TouchEvent) {
    event.preventDefault() // 禁止双指放大手势
  }

  useEffect(() => {
    document.body.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.body.addEventListener('gesturestart', handleGestureStart as EventListener)

    window.addEventListener('load', function () {
      // 在移动端 Safari 中，通过滚动来触发地址栏隐藏
      setTimeout(function () {
        window.scrollTo(0, 1) // 滚动一点让地址栏消失
      }, 0)
    })

    return () => {
      document.body.removeEventListener('touchstart', handleTouchStart)
      document.body.removeEventListener('gesturestart', handleGestureStart as EventListener)
    }
  }, [])

  // useEffect(() => {
  //   // 注意：iOS10以后版本不接受meta标签，可以通过js监听手势控制来实现禁止页面缩放
  //   // 添加事件监听
  //   document.body.addEventListener(
  //     'touchmove',
  //     (e) => {
  //       e.preventDefault()
  //     },
  //     { passive: false }
  //   ) // passive: false 是必须的，否则 preventDefault 不会生效

  //   // 禁用右键菜单、拖拽、选择和复制等功能
  //   document.body.addEventListener('contextmenu', (e) => e.preventDefault())
  //   document.body.addEventListener('dragstart', (e) => e.preventDefault())
  //   document.body.addEventListener('selectstart', (e) => e.preventDefault())
  //   document.body.addEventListener('select', () => {
  //     document.getSelection()?.empty()
  //   })
  //   document.body.addEventListener('copy', () => {
  //     document.getSelection()?.empty()
  //   })
  //   document.body.addEventListener('beforecopy', (e) => e.preventDefault())

  //   return () => {
  //     // 清理触摸事件
  //     document.body.removeEventListener('touchmove', (e) => {
  //       e.preventDefault()
  //     })

  //     // 清理其他事件
  //     document.body.removeEventListener('contextmenu', (e) => e.preventDefault())
  //     document.body.removeEventListener('dragstart', (e) => e.preventDefault())
  //     document.body.removeEventListener('selectstart', (e) => e.preventDefault())
  //     document.body.removeEventListener('select', () => {
  //       document.getSelection()?.empty()
  //     })
  //     document.body.removeEventListener('copy', () => {
  //       document.getSelection()?.empty()
  //     })
  //     document.body.removeEventListener('beforecopy', (e) => e.preventDefault())
  //   }
  // }, [])

  const Content = (
    <>
      <Outlet />
      <AddPwaAppModal />
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
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
  // return <div className="h-screen flex flex-col">{Content}</div>
  return <>{Content}</>
}
export default observer(WebAppLayout)
