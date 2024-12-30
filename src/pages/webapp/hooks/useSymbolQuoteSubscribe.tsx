import { useModel } from '@umijs/max'
import { useNetwork } from 'ahooks'
import { useEffect } from 'react'

import { useStores } from '@/context/mobxProvider'
import ws from '@/mobx/ws'

import usePageVisibility from '@/hooks/usePageVisibility'
import useIsFocused from './useIsFocused'

type IProps = {
  /**当前品种列表 */
  list: Account.TradeSymbolListItem[]
}

// 按需订阅品种列表行情数据
export default function useSymbolQuoteSubscribe({ list }: IProps) {
  const networkState = useNetwork()
  const { kline, trade } = useStores()
  const { fetchUserInfo } = useModel('user')
  const isFocused = useIsFocused()
  const isOnline = networkState.online

  const handleSubscribeQuote = () => {
    if (isFocused && list?.length) {
      //  当前 tab 下所有类型全部订阅
      setTimeout(() => {
        // console.log('订阅行情')
        //  检查socket是否连接，如果未连接，则重新连接
        ws.checkSocketReady(() => {
          // 打开行情订阅
          ws.openSymbol(
            // 构建参数
            ws.makeWsSymbolBySemi(list)
          )
        })
      })
    }
  }

  useEffect(() => {
    // 如果网络断开，在连接需要重新重新建立新的连接
    if (!isOnline) {
      ws.close()
    }

    if (isOnline) {
      setTimeout(() => {
        handleSubscribeQuote()
      }, 200)
    }

    // return () => {
    //   // 当前 tab 下所有品种取消订阅
    //   ws.debounceBatchCloseSymbol()
    // }
  }, [isOnline, isFocused, list?.length])

  useEffect(() => {
    return () => {
      // 当前 tab 下所有品种取消订阅
      ws.debounceBatchCloseSymbol()
    }
  }, [])

  usePageVisibility(
    () => {
      // 用户从后台切换回前台时执行的操作
      handleSubscribeQuote()
    },
    () => {
      // 用户从前台切换到后台时执行的操作
    }
  )
}
