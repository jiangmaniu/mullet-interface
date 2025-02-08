import { useNetwork } from 'ahooks'
import { useCallback, useEffect } from 'react'

import ws, { SymbolWSItem } from '@/mobx/ws'

import { useStores } from '@/context/mobxProvider'
import useIsFocused from './useIsFocused'

type IProps = {
  /**是否显示 */
  visible?: boolean
  /**关闭订阅时候，避免下列品种列表 */
  avoidList?: SymbolWSItem[]
}

/**
 * 20250206，改成订阅整个列表
 */

// 按需订阅品种列表行情数据
export default function useSymbolQuoteSubscribe({ visible }: IProps) {
  const networkState = useNetwork()
  const isFocused = useIsFocused()
  const isOnline = networkState.online
  const { trade } = useStores()

  const handleSubscribeQuote = useCallback(() => {
    if (isFocused && trade.symbolListAll?.length) {
      console.log('useSymbolQuoteSubscribe 订阅全部行情')
      //  当前 tab 下所有类型全部订阅
      setTimeout(() => {
        // console.log('订阅行情')
        //  检查socket是否连接，如果未连接，则重新连接
        ws.checkSocketReady(() => {
          // 打开行情订阅
          ws.openSymbol({
            // 构建参数
            symbols: ws.makeWsSymbolBySemi(trade.symbolListAll)
          })
        })
      })
    }
  }, [isFocused, trade.symbolListAll?.length])

  useEffect(() => {
    if (!visible) return

    // 如果网络断开，在连接需要重新重新建立新的连接
    if (!isOnline) {
      ws.close()
    }

    if (isOnline) {
      handleSubscribeQuote()
    }

    // return () => {
    //   // 当前 tab 下所有品种取消订阅
    //   ws.debounceBatchCloseSymbol()
    // }
  }, [isOnline, handleSubscribeQuote, visible])

  // useEffect(() => {
  //   return close
  // }, [])

  // usePageVisibility(
  //   () => {
  //     // 用户从后台切换回前台时执行的操作
  //     handleSubscribeQuote()
  //   },
  //   () => {
  //     // 用户从前台切换到后台时执行的操作
  //   }
  // )
}
