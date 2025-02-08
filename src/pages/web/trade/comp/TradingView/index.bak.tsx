// eslint-disable-next-line simple-import-sort/imports
import { observer } from 'mobx-react'
import { useMemo, useState } from 'react'

import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import { getEnv } from '@/env'
import { Spin } from 'antd'

type IProps = {
  style?: React.CSSProperties
}

const TradingViewComp = ({ style }: IProps) => {
  const ENV = getEnv()
  const { isPc } = useEnv()
  const { lng } = useLang()
  const [tradeUrl, setTradeUrl] = useState('')
  const { trade } = useStores()
  const [loading, setLoading] = useState(false)

  const activeSymbolName = trade.activeSymbolName
  const symbolInfo = trade.getActiveSymbolInfo(trade.activeSymbolName, trade.symbolListAll)
  const dataSourceCode = symbolInfo?.dataSourceCode
  const dataSourceSymbol = symbolInfo?.dataSourceSymbol

  // useEffect(() => {
  //   if (dataSourceSymbol) {
  //     setLoading(true)
  //     setTradeUrl(
  //       `${
  //         ENV.tradingViewUrl
  //       }/?lang=${getTradingViewLng()}&dataSourceSymbol=${dataSourceSymbol}&dataSourceCode=${dataSourceCode}&symbolName=${
  //         symbolInfo?.symbol
  //       }`
  //     )
  //   }
  // }, [lng, activeSymbolName, dataSourceCode])

  const iframeDom = useMemo(() => {
    return (
      <Spin spinning={loading} size="large">
        <iframe
          src={tradeUrl}
          style={{
            border: 'none',
            height: isPc ? '591px' : 'calc(100vh - 260px)',
            width: '100%',
            visibility: loading ? 'hidden' : 'visible'
          }}
          onLoad={() => {
            setTimeout(() => {
              setLoading(false)
            }, 100)
          }}
        />
      </Spin>
    )
  }, [tradeUrl, loading])

  return <div style={style}>{iframeDom}</div>
}

export default observer(TradingViewComp)
