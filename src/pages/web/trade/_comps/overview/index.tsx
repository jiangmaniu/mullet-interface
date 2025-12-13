'use client'

import { Trans } from '@/libs/lingui/react/macro'
import { useEffect } from 'react'
import { FormattedMessage } from '@umijs/max'

import { GeneralTooltip } from '@/components/tooltip/general'
import { cn } from '@/libs/ui/lib/utils'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { BNumber } from '@/libs/utils/number'
import { useCurrentQuote } from '@/hooks/useCurrentQuote'

import { SymbolSelector } from './symbol-selector'
import { useStores } from '@/context/mobxProvider'

export function Overview() {
  return (
    <div className="bg-primary flex h-[60px] items-center gap-6 rounded-lg px-3">
      <div className="flex items-center gap-5">
        <SymbolSelector />

        <CurrentPrice />
      </div>
      <div className="border-zinc-large h-4 border-r"></div>
      <DataOverview />
    </div>
  )
}

const CurrentPrice = () => {
  const res = useCurrentQuote()
  const { ws, trade } = useStores()
  const symbol = trade.activeSymbolName

  const isPriceChangePositive = BNumber.from(res?.percent)?.gt(0)
  const isMarketOpen = trade.isMarketOpen(symbol)

  return (
    <div className="flex items-center">
      <div
        className={cn('text-[24px] font-bold', {
          'text-market-rise': isPriceChangePositive,
          'text-market-fall': !isPriceChangePositive
        })}
      >
        {BNumber.toFormatNumber(res?.bid, { volScale: 2 })}
      </div>

      {!isMarketOpen && (
        <span className="text-sm leading-6 px-[6px] rounded-[6px] text-red-600 bg-red-600/10 dark:text-red-650 dark:bg-red-650/10 ml-2">
          <FormattedMessage id="mt.xiushizhong" />
        </span>
      )}
    </div>
  )
}

const DataOverview = () => {
  const res = useCurrentQuote()

  const isPriceChangePositive = BNumber.from(res?.percent)?.gt(0)
  const options = [
    {
      label: <Trans>预言机价格</Trans>,
      value: BNumber.toFormatNumber(183.52)
    },
    {
      label: <Trans>24 小时变化</Trans>,
      value: (
        <div
          className={cn('', {
            'text-market-rise': isPriceChangePositive,
            'text-market-fall': !isPriceChangePositive
          })}
        >
          {BNumber.toFormatNumber(res?.bidDiff, { forceSign: true, positive: false, volScale: 2 })} /{' '}
          {BNumber.toFormatPercent(res?.percent, { forceSign: true, isRaw: false })}
        </div>
      )
    },
    {
      label: <Trans>24小时最高价</Trans>,
      value: BNumber.toFormatNumber(res?.high)
    },
    {
      label: <Trans>24小时最低价</Trans>,
      value: BNumber.toFormatNumber(res?.low)
    },
    {
      label: (
        <GeneralTooltip content={<Trans>需要提供提示文本</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>24小时交易量</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: BNumber.toFormatNumber(undefined, { volScale: 2, prefix: '$' })
    },
    {
      label: (
        <GeneralTooltip
          content={
            <Trans>
              展期费是指您在每日结算时为继续持有未平仓合约而支付的费用，计算方式为“持仓名义价值 ×
              日费率”，平台将在每日自动扣除，请您注意账户余额充足以避免持仓受影响。
            </Trans>
          }
        >
          <TooltipTriggerDottedText>
            <Trans>展期费率</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: (
        <div>
          {BNumber.toFormatPercent(undefined, { forceSign: true, volScale: undefined, isRaw: false })} /{' '}
          {BNumber.toFormatPercent(undefined, { volScale: undefined, isRaw: false })}
        </div>
      )
    },

    {
      label: (
        <GeneralTooltip content={<Trans>需要提供提示文本</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>持仓量</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: BNumber.toFormatNumber(undefined, { unit: 'SOL', volScale: 2 })
    }
  ]
  return (
    <div className="flex gap-6">
      {options.map((item, index) => (
        <div key={index} className="text-paragraph-p3 flex flex-col gap-1">
          <div className="text-content-4">{item.label}</div>
          <div className="text-content-1">{item.value}</div>
        </div>
      ))}
    </div>
  )
}
