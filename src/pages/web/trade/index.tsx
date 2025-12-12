import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, getIntl, useLocation, useModel } from '@umijs/max'
import { useNetwork, useTitle } from 'ahooks'
import { observer } from 'mobx-react'
import { useEffect, useRef } from 'react'

import { ModalLoading } from '@/components/Base/Lottie/Loading'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import usePageVisibility from '@/hooks/usePageVisibility'
import useSyncDataToWorker from '@/hooks/useSyncDataToWorker'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { cn } from '@/utils/cn'
import { push } from '@/utils/navigator'
import { STORAGE_GET_TRADE_THEME, STORAGE_SET_TRADE_PAGE_SHOW_TIME } from '@/utils/storage'

import { checkPageShowTime } from '@/utils/business'
import BuyAndSell from './comp/BuyAndSell'
import Center from './comp/Center'
import Footer from './comp/Footer'
import BalanceEmptyModal from './comp/Modal/BalanceEmptyModal'
import Sidebar from './comp/Sidebar'
import TradeRecord from './comp/TradeRecord'
import DepthPrice from './comp/Widget/DepthPrice'
import Liquidation from './comp/Widget/Liquidation'
import { Overview } from './_comps/overview'
import { AccountDetails } from './_comps/account'
import { TradeLayout } from './_comps/layout'
import { TradeLayoutKey } from './_comps/layout/types'

export default observer(() => {
  const sidebarRef = useRef()
  const buyAndSellRef = useRef<any>(null)
  const { ws, trade, kline } = useStores()
  const { initialState } = useModel('@@initialState')
  const { fetchUserInfo } = useModel('user')
  const { pathname } = useLocation()
  const { setMode } = useTheme()
  const currentUser = initialState?.currentUser

  const networkState = useNetwork()
  const isOnline = networkState.online

  useTitle(`${trade.activeSymbolName} | ${getIntl().formatMessage({ id: 'menu.trade' })}`)

  // 同步数据到worker线程
  useSyncDataToWorker()

  // useEffect(() => {
  //   if (!currentUser?.accountList?.length) {
  //     push(ADMIN_HOME_PAGE)
  //   }
  // }, [currentUser])

  // useEffect(() => {
  //   // 设置交易页面主题变量为全局主题
  //   setMode(STORAGE_GET_TRADE_THEME())
  //   return () => {
  //     // 重置全局主题
  //     setMode('light')
  //   }
  // }, [pathname])

  const onSubscribeExchangeRateQuote = () => {
    // 订阅当前激活的汇率品种行情
    setTimeout(() => {
      ws.subscribeExchangeRateQuote()
    }, 1000)
  }

  useEffect(() => {
    if (trade.currentAccountInfo?.status === 'DISABLED' || trade.currentAccountInfo?.enableConnect === false) {
      push('/account')
    }
  }, [pathname, trade.currentAccountInfo])

  useEffect(() => {
    // 提前初始化worker
    ws.initWorker()
  }, [])

  useEffect(() => {
    checkPageShowTime()

    // 如果网络断开，在连接需要重新重新建立新的连接
    if (!isOnline) {
      ws.close()
    }
    if (isOnline) {
      // 重新建立新连接
      ws.connect()
    }

    return () => {
      // 关闭ws连接
      ws.close()
    }
  }, [isOnline])

  useEffect(() => {
    onSubscribeExchangeRateQuote()

    // 查询当前品种的ticker 高开低收信息
    trade.queryTradeSymbolTicker(trade.activeSymbolName)
  }, [trade.activeSymbolName])

  usePageVisibility(
    () => {
      // 用户从后台切换回前台时执行的操作
      ws.connect()

      trade.setTradePageActive(true)

      onSubscribeExchangeRateQuote()

      // 避免多次刷新
      if (!checkPageShowTime()) return

      // ws没有返回token失效状态，需要查询一次用户信息，看当前登录态是否失效，避免长时间没有操作情况
      fetchUserInfo(true)
    },
    () => {
      // 用户从前台切换到后台时执行的操作

      trade.setTradePageActive(false)

      // 关闭ws
      ws.close()

      STORAGE_SET_TRADE_PAGE_SHOW_TIME(Date.now())
    }
  )

  return (
    <>
      <SwitchPcOrWapLayout
        pcComponent={
          <div className="p-2">
            <div className="flex gap-2">
              <div className="flex flex-1 gap-2 flex-col">
                <Overview />
                {/* 交易 */}
                <div className="flex flex-1">
                  <Sidebar />
                  {/* 中间区域 */}
                  <Center />
                  {/* 深度报价 */}
                  <DepthPrice />
                </div>
              </div>

              <div className="flex w-max gap-2 min-w-[280px]  flex-col">
                <AccountDetails />

                {/* 买卖交易区 */}
                <BuyAndSell />
              </div>
            </div>

            <div className={cn('flex items-start justify-between relative bg-primary')}>
              {/* 交易记录 */}
              <div style={{ width: 'calc(100vw - 303px)' }} className={cn('flex-1')}>
                <TradeRecord />
              </div>
              <div className={cn('w-[300px] min-h-[270px] relative')}>{/* <Liquidation /> */}</div>
            </div>
            {/* 底部固定状态栏 */}
            <Footer />
            {/* 浮动交易窗口 */}
            {/* <FloatTradeBox /> */}
          </div>

          // <TradeLayout
          //   slots={{
          //     [TradeLayoutKey.Tabs]: <div className="h-full">{/* <TradingPairTabs /> */}</div>,
          //     [TradeLayoutKey.Overview]: (
          //       <div className="h-full">
          //         <Overview />
          //       </div>
          //     ),
          //     [TradeLayoutKey.Tradingview]: <div className="h-full">{/* <TradeMarket /> */}</div>,
          //     [TradeLayoutKey.Orderbooks]: <div className="h-full">{/* <OrderBooks /> */}</div>,
          //     [TradeLayoutKey.Account]: <div className="h-full">{/* <AccountDetails /> */}</div>,
          //     [TradeLayoutKey.Action]: <div className="h-full">{/* <TradeAction /> */}</div>,
          //     [TradeLayoutKey.Position]: <div className="h-full">{/* <Records /> */}</div>
          //   }}
          // />
        }
        wapComponent={<div></div>}
      />
      <BalanceEmptyModal />
      <ModalLoading open={trade.switchAccountLoading} tips={<FormattedMessage id="mt.qiehuanzhanghuzhong" />} />
    </>
  )
})
