import { useStores } from '@/context/mobxProvider'
import usePageVisibility from '@/hooks/usePageVisibility'
import { checkPageShowTime } from '@/utils/business'
import { STORAGE_SET_TRADE_PAGE_SHOW_TIME } from '@/utils/storage'
import { PageLoading } from '@ant-design/pro-components'
import { useNetwork } from 'ahooks'
import { observer } from 'mobx-react'
import { Suspense, lazy, useEffect, useRef, useState } from 'react'

type IProps = {
  style?: React.CSSProperties
}

const TradingViewComp = lazy(() => import('./index'))

// 交易图表组件加载容器
const TradingviewWrapper = ({ style }: IProps) => {
  const { kline, ws } = useStores()
  const [forceUpdateKey, setForceUpdateKey] = useState(0)
  const switchSymbolLoading = kline.switchSymbolLoading
  const loadingTimerRef = useRef<NodeJS.Timeout>()
  const networkState = useNetwork()
  const isOnline = networkState.online

  // 监听switchSymbolLoading状态，如果超过10s则强制刷新
  useEffect(() => {
    if (switchSymbolLoading) {
      // 清除之前的定时器
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current)
      }
      // 设置新的定时器
      loadingTimerRef.current = setTimeout(() => {
        console.log('切换品种超时，强制刷新')
        // 只有在强制刷新次数不超过3次时才刷新
        setForceUpdateKey((prev) => {
          // 如果已经刷新了3次或以上，则不再刷新
          if (prev >= 3) {
            console.log('已强制刷新3次，不再刷新')
            return prev
          }
          return prev + 1
        })
        kline.setSwitchSymbolLoading(false)
      }, 10 * 1000)
    } else {
      // 如果loading结束，清除定时器
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current)
      }
    }

    // 组件卸载时清除定时器
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current)
      }
    }
  }, [switchSymbolLoading])

  useEffect(() => {
    // 记录初始化的时间
    STORAGE_SET_TRADE_PAGE_SHOW_TIME(Date.now())

    return () => {
      // 重置tradingview实例
      kline.destroyed()
    }
  }, [])

  useEffect(() => {
    setForceUpdateKey((prev) => prev + 1)
  }, [isOnline])

  usePageVisibility(
    () => {
      const shouldForceUpdate = checkPageShowTime(1 * 60 * 1000)
      // console.log('页面回到前台')
      // setForceUpdateKey(shouldForceUpdate ? forceUpdateKey + 1 : forceUpdateKey)
      setForceUpdateKey(forceUpdateKey + 1)

      // if (kline.tvWidget && !shouldForceUpdate) {
      //   kline.tvWidget.onChartReady(() => {
      //     kline.forceRefreshKlineData()
      //   })
      // }
    },
    () => {
      // console.log('页面切换到后台')
      // STORAGE_SET_TRADE_PAGE_SHOW_TIME(Date.now())
      kline.destroyed()
      // 清空ws的quotes
      ws.quotes = new Map()
    }
  )

  return (
    <div style={{ ...style }}>
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <PageLoading />
          </div>
        }
      >
        {/* 通过key强制刷新组件 */}
        <TradingViewComp key={forceUpdateKey} />
      </Suspense>
    </div>
  )
}

export default observer(TradingviewWrapper)
