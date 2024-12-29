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

  const Content = (
    <>
      <Outlet />
      <AddPwaAppModal />
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/* QQ强制全屏 */}
        <meta name="fullscreen" content="yes" />
        {/* UC强制全屏 */}
        <meta name="x5-fullscreen" content="true" />
        {/* IE/Edge浏览器 */}
        {/* <meta name="msapplication-square70x70logo" content="img/icons/book-72.png" />
        <meta name="msapplication-square150x150logo" content="img/icons/book-144.png" />
        <meta name="msapplication-square310x310logo" content="img/icons/book-256.png" /> */}
        {/* ios适配 */}
        {/* <link rel="apple-touch-icon" href="/custom_icon.png" /> */}
        {/* 不同分辨率的适配： */}
        {/* <link rel="apple-touch-icon" href="touch-icon-iphone.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="touch-icon-ipad.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="touch-icon-iphone-retina.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="touch-icon-ipad-retina.png" /> */}
        {/* apple-touch-startup-image：启动画面 */}
        {/* <link rel="apple-touch-startup-image" href="/launch.png" /> */}
      </Helmet>
    </>
  )

  // 主Tabbar页面使用该布局
  if (isMainTabbar(pathname)) {
    return (
      <div>
        <div style={{ position: 'relative' }}>{Content}</div>
        <TabBottomBar />
      </div>
    )
  }

  // 其他子页面使用的布局
  return <>{Content}</>
}
export default observer(WebAppLayout)
