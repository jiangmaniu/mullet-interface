import { observer } from 'mobx-react'

import { useEffect, useMemo, useState } from 'react'

import Loading from '@/components/Base/Lottie/Loading'
import { getTradingViewLng } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import ENV from '@/env'
import { STORAGE_GET_TOKEN } from '@/utils/storage'
import { useIntl } from '@umijs/max'

type IProps = {
  style?: React.CSSProperties
}

const TradingViewComp = ({ style }: IProps) => {
  const { isPc } = useEnv()
  const { lng } = useLang()
  const { theme, cn } = useTheme()
  const { trade } = useStores()
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const intl = useIntl()

  const symbol = trade.activeSymbolName
  const symbolInfo = trade.symbolListAll.find((item) => item.symbol === symbol)
  const dataSourceCode = symbolInfo?.dataSourceCode
  const dataSourceSymbol = symbolInfo?.dataSourceSymbol
  const accountGroupId = trade.currentAccountInfo.accountGroupId

  useEffect(() => {
    setLoading(true)
    const token = STORAGE_GET_TOKEN()
    // hideWatermarkLogo: 0隐藏
    // watermarkLogoUrl 水印图片地址 网络图片地址
    const watermarkLogoUrl = ENV.klineWatermarkLogo ? `${location.origin}/${ENV.klineWatermarkLogo}` : '' // 网络图片地址 水印图片尺寸大小 522 × 146
    const url = `${
      ENV.tradingViewUrl
    }?locale=${getTradingViewLng()}&symbolName=${symbol}&dataSourceCode=${dataSourceCode}&dataSourceSymbol=${dataSourceSymbol}&colorType=${
      theme.direction + 1
    }&accountGroupId=${accountGroupId}&token=${token}&hideWatermarkLogo=1&watermarkLogoUrl=${watermarkLogoUrl}`
    // console.log('url', url)
    setUrl(url)
  }, [symbol, intl.locale, symbolInfo])

  const iframeDom = useMemo(() => {
    return (
      <iframe
        src={url}
        style={{
          border: 'none',
          height: isPc ? '591px' : 'calc(100vh - 240px)',
          width: '100%',
          visibility: loading ? 'hidden' : 'visible'
        }}
        onLoad={() => {
          setTimeout(() => {
            setLoading(false)
          }, 100)
        }}
      />
    )
  }, [url, loading])

  return (
    <div style={style} className="relative mb-3">
      {iframeDom}
      {loading && (
        <div className={cn('absolute top-28 left-0 right-0 flex justify-center items-center z-0')}>
          <Loading />
        </div>
      )}
    </div>
  )
}

export default observer(TradingViewComp)
