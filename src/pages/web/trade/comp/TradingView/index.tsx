// import Tradingview from '@/components/Web/Tradingview'
import { PageLoading } from '@ant-design/pro-components'
import { Suspense, lazy } from 'react'

type IProps = {
  style?: React.CSSProperties
}

const Tradingview = lazy(() => import('@/components/Web/Tradingview'))

const TradingViewComp = ({ style }: IProps) => {
  return (
    <div style={{ ...style }}>
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <PageLoading />
          </div>
        }
      >
        <Tradingview />
      </Suspense>
    </div>
  )
}

export default TradingViewComp
