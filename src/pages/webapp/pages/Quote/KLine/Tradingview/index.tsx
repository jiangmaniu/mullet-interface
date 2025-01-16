import { observer } from 'mobx-react'

import Tradingview from '@/components/Web/Tradingview'

type IProps = {
  style?: React.CSSProperties
}

const TradingViewComp = ({ style }: IProps) => {
  return (
    <div style={style} className="relative mb-3">
      <Tradingview />
    </div>
  )
}

export default observer(TradingViewComp)
