// eslint-disable-next-line simple-import-sort/imports
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'

import { URLS } from '@/constants'
import { getTradingViewLng } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import { Spin } from 'antd'

type IProps = {
  style?: React.CSSProperties
}

const TradingViewComp = ({ style }: IProps) => {
  const { isPc } = useEnv()
  const { lng } = useLang()
  const [tradeUrl, setTradeUrl] = useState('')
  const { trade } = useStores()
  const [loading, setLoading] = useState(false)

  const activeSymbolName = trade.activeSymbolName
  const symbolInfo = trade.getActiveSymbolInfo()
  const dataSourceCode = symbolInfo?.dataSourceCode
  const dataSourceSymbol = symbolInfo?.dataSourceSymbol

  useEffect(() => {
    if (dataSourceSymbol) {
      setLoading(true)
      setTradeUrl(`${URLS.tradingViewUrl}/?lang=${getTradingViewLng()}&name=${dataSourceSymbol}&dataSourceCode=${dataSourceCode}`)
    }
  }, [lng, activeSymbolName, dataSourceCode])

  return (
    <div style={style}>
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
            }, 300)
          }}
        />
      </Spin>
    </div>
  )
}

export default observer(TradingViewComp)
