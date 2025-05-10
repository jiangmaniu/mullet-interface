import { useStores } from '@/context/mobxProvider'
import usePageVisibility from '@/hooks/usePageVisibility'
import { checkPageShowTime } from '@/utils/business'
import { PageLoading } from '@ant-design/pro-components'
import { observer } from 'mobx-react'
import { Suspense, lazy, useEffect, useState } from 'react'

type IProps = {
  style?: React.CSSProperties
}

const TradingViewComp = lazy(() => import('./index'))

// 交易图表组件加载容器
const TradingviewWrapper = ({ style }: IProps) => {
  const { kline } = useStores()
  const [forceUpdateKey, setForceUpdateKey] = useState(0)

  useEffect(() => {
    return () => {
      // 重置tradingview实例
      kline.destroyed()
    }
  }, [])

  usePageVisibility(
    () => {
      const shouldForceUpdate = checkPageShowTime(1 * 60 * 1000)
      // console.log('页面回到前台')
      setForceUpdateKey(shouldForceUpdate ? forceUpdateKey + 1 : forceUpdateKey)

      if (kline.tvWidget && !shouldForceUpdate) {
        kline.tvWidget.onChartReady(() => {
          kline.forceRefreshKlineData()
        })
      }
    },
    () => {
      // console.log('页面切换到后台')
      kline.lastbar = {}
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
