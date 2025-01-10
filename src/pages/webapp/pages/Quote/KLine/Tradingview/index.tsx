import { observer } from 'mobx-react'

import Loading from '@/components/Base/Lottie/Loading'
import { getTradingViewLng } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import ENV from '@/env'
import { STORAGE_GET_TOKEN } from '@/utils/storage'
import { useIntl } from '@umijs/max'
import { useEffect, useMemo, useState } from 'react'
import { isAndroid } from 'react-device-detect'

type IProps = {
  style?: React.CSSProperties
}

const TradingViewComp = ({ style }: IProps) => {
  const { isPc, isPwaApp } = useEnv()
  const { lng } = useLang()
  const { theme, cn } = useTheme()
  const { trade } = useStores()
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  const intl = useIntl()
  const isDark = theme.isDark

  const symbol = trade.activeSymbolName
  const symbolInfo = trade.symbolListAll.find((item) => item.symbol === symbol)
  const dataSourceCode = symbolInfo?.dataSourceCode
  const dataSourceSymbol = symbolInfo?.dataSourceSymbol
  const accountGroupId = trade.currentAccountInfo.accountGroupId

  const token = STORAGE_GET_TOKEN()
  // hideWatermarkLogo: 0隐藏
  // watermarkLogoUrl 水印图片地址 网络图片地址
  const watermarkLogoUrl =
    ENV.klineWatermarkLogo && process.env.NODE_ENV === 'production'
      ? `${location.origin}${isDark ? ENV.klineWatermarkLogoDark : ENV.klineWatermarkLogo}`
      : '' // 网络图片地址 水印图片尺寸大小 522 × 146
  const klineUrl = `${
    ENV.tradingViewUrl
  }?locale=${getTradingViewLng()}&symbolName=${symbol}&dataSourceCode=${dataSourceCode}&dataSourceSymbol=${dataSourceSymbol}&colorType=${
    theme.direction + 1
  }&accountGroupId=${accountGroupId}&token=${token}&hideWatermarkLogo=1&watermarkLogoUrl=${watermarkLogoUrl}`

  useEffect(() => {
    setLoading(true)
    setUrl(klineUrl)
  }, [klineUrl])

  const iframeDom = useMemo(() => {
    let height = 0
    if (isPwaApp) {
      height = isAndroid ? 240 : 260
    } else {
      height = 240
    }
    return (
      <iframe
        src={url}
        style={{
          border: 'none',
          // 不要使用100vh safari视口有问题
          height: isPc ? '591px' : document.documentElement.clientHeight - height,
          width: '100%',
          visibility: loading ? 'hidden' : 'visible'
        }}
        width={'100%'}
        height={'100%'}
        onLoad={() => {
          setTimeout(() => {
            setLoading(false)
          }, 100)
        }}
      />
    )
  }, [url, loading, isPwaApp])

  return (
    <div style={style} className="relative mb-3">
      {iframeDom}
      {loading && (
        <div className={cn('absolute top-[50%] transform translate-y-[-50%] left-0 right-0 flex justify-center items-center z-0')}>
          <Loading width={300} height={300} />
        </div>
      )}
    </div>
  )
}

export default observer(TradingViewComp)
