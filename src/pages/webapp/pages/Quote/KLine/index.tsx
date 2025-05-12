import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import qs from 'qs'
import { useEffect, useRef } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import SwitchAccount from '@/pages/webapp/components/Account/SwitchAccount'
import { View } from '@/pages/webapp/components/Base/View'
import BuySellModal, { BuySellModalRef } from '@/pages/webapp/components/Trade/BuySellModal'
import BuySellButton from '@/pages/webapp/components/Trade/BuySellModal/BuySellButton'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'

import TradingviewWrapper from '@/components/Web/Tradingview/wrapper'
import usePageVisibility from '@/hooks/usePageVisibility'
import { useNetwork } from 'ahooks'
import Header from './Header'

function KLine() {
  const intl = useIntl()
  const { cn, theme } = useTheme()
  const buySellRef = useRef<BuySellModalRef>(null)
  const networkState = useNetwork()
  const isOnline = networkState.online

  const { trade, ws } = useStores()

  useEffect(() => {
    // 如果网络断开，在连接需要重新重新建立新的连接
    if (!isOnline) {
      ws.close()
    }

    if (isOnline) {
      setTimeout(() => {
        trade.subscribeCurrentAndPositionSymbol({ cover: true })
      }, 200)
    }

    return () => {
      // 离开当前页面的时候，取消行情订阅
      // ws.closeTrade()
      ws.closePosition()
    }
  }, [isOnline])

  usePageVisibility(
    () => {
      // 用户从后台切换回前台时执行的操作
      trade.subscribeCurrentAndPositionSymbol({ cover: true })
    },
    () => {
      // 用户从前台切换到后台时执行的操作
    }
  )

  const params = qs.parse(location.search, { ignoreQueryPrefix: true })

  // useEffect(() => {
  //   setTimeout(() => {
  //     // 再次请求最新数据。覆盖缓存数据
  //     stores.kline.forceRefreshKlineData()
  //   }, 150)
  // }, [])

  useEffect(() => {
    // 查询当前品种的ticker 高开低收信息
    trade.queryTradeSymbolTicker(trade.activeSymbolName)
  }, [trade.activeSymbolName])

  return (
    <Basiclayout
      bgColor="primary"
      headerColor={theme.colors.backgroundColor.secondary}
      headerClassName="bg-secondary"
      // header={
      //   <View className={cn('flex-row items-center px-3 py-[5px]')}>
      //     <View
      //       className={cn('bg-gray-80 rounded-full w-[30px] h-[30px] flex items-center justify-center ml-3')}
      //       onClick={() => {
      //         navigateTo(`/app/quote`, params)
      //       }}
      //     >
      //       <Iconfont name="huazhuan-xuanze" size={24} style={{ transform: 'rotate(180deg)' }} />
      //     </View>
      //     <View className={cn('flex-1')}>
      //       <SwitchAccount isRemainAtCurrentPage />
      //     </View>
      //   </View>
      // }
      footer={
        <View className="pb-3">
          <BuySellButton
            onShow={() => {
              buySellRef.current?.show()
            }}
          />
        </View>
      }
    >
      <>
        <View className={cn('flex-row items-center pt-2 pb-5 bg-secondary')}>
          <View
            className={cn('bg-gray-80 rounded-full w-[30px] h-[30px] flex items-center justify-center ml-3')}
            onClick={() => {
              navigateTo(`/app/quote`, params)
            }}
          >
            <Iconfont name="huazhuan-xuanze" size={24} style={{ transform: 'rotate(180deg)' }} />
          </View>
          <View className={cn('flex-1')}>
            <SwitchAccount isRemainAtCurrentPage />
          </View>
        </View>
        <View
          className={cn('flex flex-col relative -top-5 justify-between rounded-tl-[22px] rounded-tr-[22px] flex-1 mt-2 pt-[10px]')}
          bgColor="primary"
        >
          <Header />
          <TradingviewWrapper />
          {/* <View className={cn('mx-3')}>
            <BuySellButton
              onShow={() => {
                buySellRef.current?.show()
              }}
            />
          </View> */}
        </View>
        <BuySellModal ref={buySellRef} />
      </>
    </Basiclayout>
  )
}
export default observer(KLine)
