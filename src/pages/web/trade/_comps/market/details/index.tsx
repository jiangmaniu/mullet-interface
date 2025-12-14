import { Trans } from '@/libs/lingui/react/macro'

import { cn } from '@/libs/ui/lib/utils'
import { BNumber } from '@/libs/utils/number'
import { useTheme } from '@/context/themeProvider'
import { useCurrentQuote } from '@/hooks/useCurrentQuote'
import { useStores } from '@/context/mobxProvider'
import { transferWeekDay } from '@/constants/enum'
import { formatTimeStr } from '@/utils/business'
import SymbolIcon from '@/components/Base/SymbolIcon'

export const MarketDetails = () => {
  const { trade, ws } = useStores()
  const symbol = trade.activeSymbolName
  const activeSymbolInfo = trade.activeSymbolInfo
  const { theme } = useTheme()
  const quoteInfo = useCurrentQuote(symbol)
  const tradeTimeConf = quoteInfo?.tradeTimeConf as any[]
  const symbolConf = quoteInfo?.symbolConf

  const marketDetails = [
    {
      label: <Trans>多头未平仓合约</Trans>,
      value: BNumber.toFormatNumber(undefined, { volScale: 2, unit: 'SOL' })
    },
    {
      label: <Trans>累计交易量</Trans>,
      value: BNumber.toFormatNumber(undefined, { volScale: 2, unit: 'SOL' })
    },
    {
      label: <Trans>空头未平仓合约</Trans>,
      value: BNumber.toFormatNumber(undefined, { volScale: 2, unit: 'SOL' })
    }
  ]

  const contractRules: { label: React.ReactNode; value: React.ReactNode | string | number }[] = [
    {
      label: <Trans>合约单位</Trans>,
      value: symbolConf?.contractSize
    },
    {
      label: <Trans>合约单笔最小</Trans>,
      value: BNumber.toFormatNumber(undefined, { volScale: 2, unit: 'USDC' })
    },
    {
      label: <Trans>报价小数位</Trans>,
      value: quoteInfo?.digits
    },
    {
      label: <Trans>开仓费率</Trans>,
      value: BNumber.toFormatPercent(undefined, { volScale: undefined })
    },
    {
      label: <Trans>买入展期费率</Trans>,
      value: BNumber.toFormatPercent(undefined, { volScale: undefined })
    },
    {
      label: <Trans>平仓费率</Trans>,
      value: BNumber.toFormatPercent(undefined, { volScale: undefined })
    }
  ]

  if (!!tradeTimeConf?.length) {
    contractRules.push({
      label: <Trans>交易时间</Trans>,
      value: (
        <div className="text-right">
          {tradeTimeConf.map((item, index) => {
            return (
              <div key={index}>
                {transferWeekDay(item.weekDay)} {`${formatTimeStr(item.trade)}`}
              </div>
            )
          })}
        </div>
      )
    })
  }

  return (
    <div className="h-full relative">
      <div className={cn('-z-1 select-none absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 ')}>
        <img className={'w-[560px]'} src={theme.isDark ? '/platform/img/feature-water-logo.svg' : '/platform/img/feature-water-logo.svg'} />
      </div>

      <div className={cn('flex flex-col gap-2 p-3')}>
        <div className="text-important-1 flex items-center gap-2">
          <div className="size-6 rounded-full ">
            <SymbolIcon src={activeSymbolInfo?.imgUrl} width={24} height={24} className="size-6 rounded-full" />
          </div>
          <div>{symbol}</div>
        </div>

        <div className="text-paragraph-p3">
          <div> {activeSymbolInfo.remark}</div>

          <Trans>
            Solana
            是一种高性能的区块链平台，致力于为去中心化应用和加密货币提供快速、安全和可扩展的解决方案。该平台采用了创新的共识算法——Proof of
            History (PoH)，可以处理高达数万笔交易每秒 (TPS)，同时保持了去中心化和安全性。总的来说，Solana
            的目标是通过其独特的技术优势，实现区块链的大规模采用，服务于各种复杂的去中心化应用和全球金融系统。
          </Trans>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-3">
        <div className="text-important-1">市场详情</div>

        <div className="grid grid-cols-2 gap-x-16 gap-y-2">
          {marketDetails.map((rule, index) => {
            return (
              <div key={index} className="text-paragraph-p3 flex justify-between gap-2">
                <div className="text-content-4">{rule.label}</div>
                <div className="text-content-1">{rule.value}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 p-3">
        <div className="text-important-1">合约规则</div>

        <div className="grid grid-cols-2 gap-x-16 gap-y-2">
          {contractRules.map((rule, i) => {
            return (
              <div key={i} className="text-paragraph-p3 flex justify-between gap-2">
                <div className="text-content-4">{rule.label}</div>
                <div className="text-content-1">{rule.value}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
