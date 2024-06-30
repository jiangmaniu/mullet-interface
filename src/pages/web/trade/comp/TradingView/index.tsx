import Tradingview from '@/components/Web/Tradingview'

type IProps = {
  style?: React.CSSProperties
}

const TradingViewComp = ({ style }: IProps) => {
  return (
    <div style={{ ...style }}>
      <Tradingview />
    </div>
  )
}

export default TradingViewComp
