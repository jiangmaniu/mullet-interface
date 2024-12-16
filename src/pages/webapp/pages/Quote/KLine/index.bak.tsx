import { useRef } from 'react'

import Tradingview from '@/components/Web/Tradingview'
import BuyAndSell from '@/pages/web/trade/comp/BuyAndSell'
import BuyAndSellBtnGroup from '@/pages/web/trade/comp/BuyAndSellBtnGroup'
import HeaderStatisInfo from '@/pages/web/trade/comp/HeaderStatisInfo'
import Sidebar from '@/pages/web/trade/comp/Sidebar'
import TradeRecord from '@/pages/web/trade/comp/TradeRecord'

export default function KLine() {
  const sidebarRef = useRef()
  const buyAndSellRef = useRef<any>(null)

  return (
    <div className="min-h-[100vh] bg-white">
      <HeaderStatisInfo sidebarRef={sidebarRef} />
      <Tradingview />
      <div
        className="fixed bottom-0 left-0 flex w-full items-center justify-center rounded-t-xl bg-white"
        style={{ boxShadow: '0px -2px 20px 0px rgba(182,182,182,0.2)' }}
      >
        {/* 底部浮动按钮 */}
        <div className="relative flex flex-1 items-center justify-center py-2">
          <BuyAndSellBtnGroup type="footer" sellBgColor="var(--color-red-600)" />
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
  )
}
