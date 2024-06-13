import { observer } from 'mobx-react'
import { useEffect, useRef } from 'react'

import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'

import BuyAndSell from './comp/BuyAndSell'
import BtnGroup from './comp/BuyAndSellBtnGroup'
import Center from './comp/Center'
import Footer from './comp/Footer'
import HeaderStatisInfo from './comp/HeaderStatisInfo'
import BalanceEmptyModal from './comp/Modal/BalanceEmptyModal'
import Sidebar from './comp/Sidebar'
import TradeRecord from './comp/TradeRecord'
import TradingView from './comp/TradingView'
import DeepPrice from './comp/Widget/DeepPrice'
import FloatTradeBox from './comp/Widget/FloatTradeBox'

export default observer(() => {
  const sidebarRef = useRef()
  const buyAndSellRef = useRef<any>(null)
  const { ws, trade } = useStores()

  useEffect(() => {
    // 订阅深度报价
    ws.subscribeDepth()

    return () => {
      // 取消订阅深度报价
      ws.subscribeDepth(true)
    }
  }, [])

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
              <DeepPrice />
              {/* 买卖交易区 */}
              <BuyAndSell />
            </div>
            {/* 交易记录 */}
            <TradeRecord />
            {/* 底部固定状态栏 */}
            <Footer />
            {/* 浮动交易窗口 */}
            <FloatTradeBox />
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
