import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useLocation, useModel } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { useEffect, useRef } from 'react'

import { useStores } from '@/context/mobxProvider'
import usePageVisibility from '@/hooks/usePageVisibility'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { push } from '@/utils/navigator'
import { STORAGE_GET_TRADE_PAGE_SHOW_TIME, STORAGE_SET_TRADE_PAGE_SHOW_TIME } from '@/utils/storage'

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
  const { fetchUserInfo } = useModel('user')
  const { pathname } = useLocation()

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
    // 缓存时间大于30分钟、初次载入
    if ((updateTime && Date.now() - updateTime > 30 * 60 * 1000) || !updateTime) {
      STORAGE_SET_TRADE_PAGE_SHOW_TIME(Date.now())
      return true
    }
    return false
  }

  useEffect(() => {
    checkPageShowTime()

    return () => {
      // 取消订阅深度报价
      ws.subscribeDepth(true)

      // 重置tradingview实例，否则报错
      kline.tvWidget = null as any
    }
  }, [])

  useEffect(() => {
    onSubscribeExchangeRateQuote()
  }, [trade.activeSymbolName])

  usePageVisibility(
    () => {
      console.log('Page is visible')

      // 避免k线多次刷新
      if (!checkPageShowTime()) return

      console.log('======开始刷新k线======')

      // 用户从后台切换回前台时执行的操作
      ws.reconnect()

      onSubscribeExchangeRateQuote()

      // ws没有返回token失效状态，需要查询一次用户信息，看当前登录态是否失效，避免长时间没有操作情况
      fetchUserInfo(true)

      // 重置k线实例
      // @ts-ignore
      kline.tvWidget = null
    },
    () => {
      console.log('Page is hidden')

      // 避免k线多次刷新
      if (!checkPageShowTime()) return

      // 用户从前台切换到后台时执行的操作
      // @ts-ignore
      kline.tvWidget = null

      // 关闭ws行情跳动
      ws.close()
    }
  )

  const borderTopClassName = useEmotionCss(({ token }) => {
    return {
      '&::after': {
        content: "''",
        background: '#E8E8E8',
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
            <div className={classNames('flex items-start justify-between relative dark:bg-dark-page', borderTopClassName)}>
              {/* 交易记录 */}
              <div style={{ width: 'calc(100vw - 303px)' }} className={classNames('flex-1')}>
                <TradeRecord />
              </div>
              <div className={classNames('w-[300px] min-h-[270px] relative')}>
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
                <BtnGroup
                  onBuy={() => {
                    buyAndSellRef.current.show(1)
                  }}
                  onSell={() => {
                    buyAndSellRef.current.show(2)
                  }}
                  type="footer"
                  sellBgColor="var(--color-red-600)"
                />
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
    </>
  )
})
