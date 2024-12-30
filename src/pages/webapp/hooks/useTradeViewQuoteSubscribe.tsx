import { useModel } from '@umijs/max'
import { useNetwork } from 'ahooks'
import { useEffect } from 'react'

import { useStores } from '@/context/mobxProvider'
import ws from '@/mobx/ws'

import usePageVisibility from '@/hooks/usePageVisibility'
import useIsFocused from './useIsFocused'

// 交易区订阅行情
export default function useTradeViewQuoteSubscribe() {
  const networkState = useNetwork()
  const { kline, trade } = useStores()
  const { fetchUserInfo } = useModel('user')
  const isFocused = useIsFocused()
  const isOnline = networkState.online

  const onSubscribeExchangeRateQuote = () => {
    // 订阅当前激活的汇率品种行情
    setTimeout(() => {
      ws.subscribeExchangeRateQuote()
    }, 1000)
  }

  const symbolInfo = trade.getActiveSymbolInfo(trade.activeSymbolName, trade.symbolListAll)

  const handleSubscribeTrade = () => {
    // 重置交易状态
    trade.resetTradeAction()
    trade.setOrderType('MARKET_ORDER')

    if (!symbolInfo) return

    // socket
    setTimeout(() => {
      ws.checkSocketReady(() => {
        // 打开行情订阅
        ws.openTrade(
          // 构建参数
          ws.makeWsSymbolBySemi([symbolInfo])[0]
        )
        onSubscribeExchangeRateQuote()
      })
    })
  }

  useEffect(() => {
    // 如果网络断开，在连接需要重新重新建立新的连接
    if (!isOnline) {
      ws.close()
    }

    if (isOnline) {
      setTimeout(() => {
        handleSubscribeTrade()
      }, 200)
    }

    return () => {
      // 离开当前页面的时候，取消行情订阅
      ws.closeTrade()
    }
  }, [symbolInfo, isOnline, isFocused])

  usePageVisibility(
    () => {
      // 用户从后台切换回前台时执行的操作
      handleSubscribeTrade()
    },
    () => {
      // 用户从前台切换到后台时执行的操作
    }
  )
}
