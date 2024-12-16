import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useEffect, useRef } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import SwitchAccount from '@/pages/webapp/components/Account/SwitchAccount'
import Header from '@/pages/webapp/components/Base/Header'
import { View } from '@/pages/webapp/components/Base/View'
import BuySellModal, { BuySellModalRef } from '@/pages/webapp/components/Trade/BuySellModal'
import BuySellButton from '@/pages/webapp/components/Trade/BuySellModal/BuySellButton'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { goBack } from '@/pages/webapp/utils/navigator'

import Tradingview from './Tradingview'

function KLine() {
  const intl = useIntl()
  const { cn, theme } = useTheme()
  const buySellRef = useRef<BuySellModalRef>(null)

  const { trade, ws } = useStores()
  const symbolInfo = trade.getActiveSymbolInfo()
  useEffect(() => {
    // socket
    setTimeout(() => {
      ws.checkSocketReady(() => {
        // 打开行情订阅
        ws.openTrade(
          // 构建参数
          ws.makeWsSymbolBySemi([symbolInfo])[0]
        )
      })
    })

    return () => {
      // 离开当前 tab 的时候，取消行情订阅
      ws.closeTrade()
    }
  }, [symbolInfo])

  return (
    <Basiclayout bgColor="secondary" className={cn('mt-2')}>
      <>
        <View className={cn('flex-row items-center')}>
          <View className={cn('bg-gray-80 rounded-full p-1 ml-3')} onClick={goBack}>
            <Iconfont name="huazhuan-xuanze" size={24} style={{ transform: 'rotate(180deg)' }} />
          </View>
          <View className={cn('flex-1')}>
            <SwitchAccount />
          </View>
        </View>
        <View className={cn('rounded-tl-[22px] rounded-tr-[22px] flex-1 mt-2 mb-3 pt-[10px]')} bgColor="primary">
          <Header />
          <Tradingview />
          <View className={cn('mx-3 mb-6')}>
            <BuySellButton
              onShow={() => {
                buySellRef.current?.show()
              }}
            />
          </View>
        </View>
        <BuySellModal ref={buySellRef} />
      </>
    </Basiclayout>
  )
}
export default observer(KLine)
