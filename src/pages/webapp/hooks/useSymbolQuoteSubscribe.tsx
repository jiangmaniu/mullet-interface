import { useModel } from '@umijs/max'
import { useNetwork } from 'ahooks'
import { useEffect } from 'react'

import { useStores } from '@/context/mobxProvider'
import ws from '@/mobx/ws'

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

  const handleCLose = () => {
    // 当前 tab 下所有品种取消订阅
    ws.debounceBatchSubscribeSymbol()
  }
  const closeWs = () => {
    ws.close()
    ws.closeWorker()
  }

  useEffect(() => {
    // 如果网络断开，在连接需要重新重新建立新的连接
    if (!isOnline) {
      closeWs()
    }

    setTimeout(() => {
      handleSubscribeQuote()
    }, 300)

    // 页面不可见时候，关闭行情连接、worker线程
    if (!isFocused) {
      closeWs()
    }

    return () => {
      // 离开当前 tab 的时候，取消行情订阅
      handleCLose()
    }
  }, [isOnline, isFocused, list?.length])
}
