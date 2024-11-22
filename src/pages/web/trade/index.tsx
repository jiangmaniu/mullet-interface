import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useLocation, useModel } from '@umijs/max'
import { useNetwork } from 'ahooks'
import { observer } from 'mobx-react'
import { useEffect, useRef } from 'react'

import { ModalLoading } from '@/components/Base/Lottie/Loading'
import { ADMIN_HOME_PAGE } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import usePageVisibility from '@/hooks/usePageVisibility'
import useSyncDataToWorker from '@/hooks/useSyncDataToWorker'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { cn } from '@/utils/cn'
import { push } from '@/utils/navigator'
import { STORAGE_GET_TRADE_PAGE_SHOW_TIME, STORAGE_GET_TRADE_THEME, STORAGE_SET_TRADE_PAGE_SHOW_TIME } from '@/utils/storage'

import BuyAndSell from './comp/BuyAndSell'
import BtnGroup from './comp/BuyAndSellBtnGroup'
import Center from './comp/Center'
import Footer from './comp/Footer'
import HeaderStatisInfo from './comp/HeaderStatisInfo'
import BalanceEmptyModal from './comp/Modal/BalanceEmptyModal'
import Sidebar from './comp/Sidebar'
import TradeRecord from './comp/TradeRecord'
import TradingView from './comp/TradingView'
import DepthPrice from './comp/Widget/DepthPrice'
import Liquidation from './comp/Widget/Liquidation'

export default observer(() => {
  const sidebarRef = useRef()
  const buyAndSellRef = useRef<any>(null)
  const { ws, trade, kline } = useStores()
  const { initialState } = useModel('@@initialState')
  const { fetchUserInfo } = useModel('user')
  const { pathname } = useLocation()
  const { setTheme } = useTheme()
  const currentUser = initialState?.currentUser

  const networkState = useNetwork()
  const isOnline = networkState.online

  // 同步数据到worker线程
  const syncData = useSyncDataToWorker()

  useEffect(() => {
    if (!currentUser?.accountList?.length) {
      push(ADMIN_HOME_PAGE)
    }
  }, [currentUser])

  useEffect(() => {
    // 设置交易页面主题变量为全局主题
    setTheme(STORAGE_GET_TRADE_THEME())
    return () => {
      // 重置全局主题
      setTheme('light')
    }
  }, [pathname])

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

  const checkPageShowTime = () => {
    // 记录上次进入时间
    const updateTime = STORAGE_GET_TRADE_PAGE_SHOW_TIME()
    // 缓存时间大于5分钟、初次载入
    if ((updateTime && Date.now() - updateTime > 5 * 60 * 1000) || !updateTime) {
      STORAGE_SET_TRADE_PAGE_SHOW_TIME(Date.now())
      return true
    }
    return false
  }

  useEffect(() => {
    checkPageShowTime()

    // 如果网络断开，在连接需要重新重新建立新的连接
    if (!isOnline) {
      ws.close()
    }
    if (isOnline) {
      setTimeout(() => {
        // 重新建立新连接
        ws.connect()
        // 重置tradingview实例
        kline.destroyed()
      }, 300)
    }

    return () => {
      // 取消订阅深度报价
      ws.subscribeDepth(true)

      // 关闭worker
      ws.closeWorker?.()

      // 关闭ws连接
      ws.close()

      // 重置tradingview实例
      kline.destroyed()
    }
  }, [isOnline])

  useEffect(() => {
    onSubscribeExchangeRateQuote()
  }, [trade.activeSymbolName])

  usePageVisibility(
    () => {
      // 用户从后台切换回前台时执行的操作
      ws.connect()

      trade.setTradePageActive(true)

      onSubscribeExchangeRateQuote()

      // 避免k线多次刷新
      if (!checkPageShowTime()) return

      // ws没有返回token失效状态，需要查询一次用户信息，看当前登录态是否失效，避免长时间没有操作情况
      fetchUserInfo(true)

      // 重置tradingview实例
      kline.destroyed()
    },
    () => {
      // 用户从前台切换到后台时执行的操作

      trade.setTradePageActive(false)

      // 关闭ws
      ws.close()
      // 关闭worker
      ws.closeWorker?.()

      // 避免k线多次刷新
      if (!checkPageShowTime()) return

      // 重置tradingview实例
      kline.destroyed()
    }
  )

  const borderTopClassName = useEmotionCss(({ token }) => {
    return {
      '&::after': {
        content: "''",
        background: 'var(--divider-line-color)',
        width: '100%',
        height: 0.5,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 10
      }
    }
  })

  return (
    <>
      <SwitchPcOrWapLayout
        pcComponent={
          <div className="mb-8">
            {/* 交易 */}
            <div className="flex">
              <Sidebar />
              {/* 中间区域 */}
              <Center />
              {/* 深度报价 */}
              <DepthPrice />
              {/* 买卖交易区 */}
              <BuyAndSell />
            </div>
            <div className={cn('flex items-start justify-between relative bg-primary', borderTopClassName)}>
              {/* 交易记录 */}
              <div style={{ width: 'calc(100vw - 303px)' }} className={cn('flex-1')}>
                <TradeRecord />
              </div>
              <div className={cn('w-[300px] min-h-[270px] relative')}>
                <Liquidation />
              </div>
            </div>
            {/* 底部固定状态栏 */}
            <Footer />
            {/* 浮动交易窗口 */}
            {/* <FloatTradeBox /> */}
          </div>
        }
        wapComponent={
          <div className="min-h-[100vh] bg-white">
            <HeaderStatisInfo sidebarRef={sidebarRef} />
            <TradingView />
            <div
              className="fixed bottom-0 left-0 flex w-full items-center justify-center rounded-t-xl bg-white"
              style={{ boxShadow: '0px -2px 20px 0px rgba(182,182,182,0.2)' }}
            >
              {/* 底部浮动按钮 */}
              <div className="relative flex flex-1 items-center justify-center py-2">
                <BtnGroup type="footer" sellBgColor="var(--color-red-600)" />
              </div>
              <TradeRecord
                trigger={
                  <div className="mr-[15px] flex h-[46px] w-[46px] items-center justify-center rounded-xl border border-primary px-2">
                    <img src="/img/record-icon.png" width={32} height={32} alt="" />
                  </div>
                }
              />
            </div>
            <Sidebar ref={sidebarRef} />
            <BuyAndSell ref={buyAndSellRef} />
          </div>
        }
      />
      <BalanceEmptyModal />
      <ModalLoading open={trade.switchAccountLoading} tips={<FormattedMessage id="mt.qiehuanzhanghuzhong" />} />
    </>
  )
})
