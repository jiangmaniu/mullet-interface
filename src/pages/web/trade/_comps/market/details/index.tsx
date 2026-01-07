import { t, Trans } from '@/libs/lingui/react/macro'

import { cn } from '@/libs/ui/lib/utils'
import { BNumber } from '@/libs/utils/number'
import { useTheme } from '@/context/themeProvider'
import { useCurrentQuote } from '@/hooks/useCurrentQuote'
import { useStores } from '@/context/mobxProvider'
import { transferWeekDay } from '@/constants/enum'
import { formatTimeStr } from '@/utils/business'
import { renderFallback } from '@/libs/utils/format/fallback'
import { LOTS_UNIT_LABEL } from '../../../_options/trade'

export const MarketDetails = () => {
  const { trade, ws } = useStores()
  const symbol = trade.activeSymbolName

  const quoteInfo = useCurrentQuote(symbol)
  const tradeTimeConf = quoteInfo?.tradeTimeConf as any[]
  const symbolConf = quoteInfo?.symbolConf
  const holdingCostConf = quoteInfo?.holdingCostConf
  const transactionFeeConf = quoteInfo?.transactionFeeConf
  const prepaymentConf = quoteInfo?.prepaymentConf
  const marginMode = prepaymentConf?.mode // 保证金模式
  const showPencent = holdingCostConf?.type !== 'pointMode' // 以百分比模式

  const contractAttributes: { label: React.ReactNode; value: React.ReactNode | string | number }[] = [
    {
      label: <Trans>合约单位</Trans>,
      value: symbolConf?.contractSize
    },
    {
      label: <Trans>货币单位</Trans>,
      value: symbolConf?.baseCurrency
    },
    {
      label: <Trans>报价小数位</Trans>,
      value: quoteInfo?.digits
    },
    {
      label: <Trans>单笔交易手数</Trans>,
      value: (
        <div>
          {BNumber.toFormatNumber(symbolConf?.minTrade, { volScale: 2 })}
          {LOTS_UNIT_LABEL}-{BNumber.toFormatNumber(symbolConf?.maxTrade, { volScale: 2 })}
          {LOTS_UNIT_LABEL}
        </div>
      )
    },
    {
      label: <Trans>手数差值</Trans>,
      value: (
        <div>
          {BNumber.toFormatNumber(symbolConf?.tradeStep, { volScale: 2 })}
          {LOTS_UNIT_LABEL}
        </div>
      )
    },
    {
      label: <Trans>隔夜利息（多单）</Trans>,
      value: (
        <>
          {renderFallback(
            showPencent
              ? BNumber.toFormatPercent(holdingCostConf?.buyBag, { isRaw: false, positive: false })
              : BNumber.toFormatNumber(holdingCostConf?.buyBag, {
                  positive: false,
                  unit: `(${t`点模式`})`
                }),
            {
              verify: holdingCostConf?.isEnable
            }
          )}
        </>
      )
    },
    {
      label: <Trans>隔夜利息（空单）</Trans>,
      value: (
        <>
          {renderFallback(
            showPencent
              ? BNumber.toFormatPercent(holdingCostConf?.sellBag, { isRaw: false, positive: false })
              : BNumber.toFormatNumber(holdingCostConf?.sellBag, {
                  positive: false,
                  unit: `(${t`点模式`})`
                }),
            {
              verify: holdingCostConf?.isEnable
            }
          )}
        </>
      )
    },
    {
      label: <Trans>现价k和停损距离</Trans>,
      value: symbolConf?.limitStopLevel
    },
    {
      label: <Trans>市价手续费</Trans>,
      value: <>{BNumber.toFormatPercent(transactionFeeConf?.trade_vol?.[0]?.market_fee, { isRaw: false })}</>
    },
    {
      label: <Trans>现价手续费</Trans>,
      value: <>{BNumber.toFormatPercent(transactionFeeConf?.trade_vol?.[0]?.limit_fee, { isRaw: false })}</>
    },
    // 保证金-固定保证金模式
    ...(marginMode === 'fixed_margin'
      ? [
          {
            label: <Trans>初始保证金</Trans>,
            value: (
              <>
                {BNumber.toFormatNumber(prepaymentConf?.fixed_margin?.initial_margin, {
                  volScale: 2,
                  unit: symbolConf?.prepaymentCurrency
                })}
                /{LOTS_UNIT_LABEL}
              </>
            )
          },
          {
            label: <Trans>开仓保证金</Trans>,
            value: (
              <>
                {!prepaymentConf?.fixed_margin?.locked_position_margin ? (
                  <Trans>收取单边最大</Trans>
                ) : (
                  <>
                    {(prepaymentConf?.fixed_margin?.locked_position_margin || 0).toFixed(2)} {symbolConf?.prepaymentCurrency}/
                    {LOTS_UNIT_LABEL}
                  </>
                )}
              </>
            )
          }
        ]
      : [])
  ]

  return (
    <div className="h-full relative">
      {/* <div className={cn('select-none absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 ')}>
        <img className={'w-[560px]'} src={theme.isDark ? '/platform/img/feature-water-logo.svg' : '/platform/img/feature-water-logo.svg'} />
      </div> */}

      <div className="relative z-10">
        <div className={cn('p-xl gap-xl flex flex-col ')}>
          <div className={cn('text-important-1 text-content-1')}>
            <Trans>合约属性</Trans>
          </div>
          <div className={cn('grid  grid-rows-[repeat(3,fit-content(100%))] gap-x-10 grid-cols-5 gap-y-xl')}>
            {contractAttributes.map((item, index) => {
              return (
                <div key={index} className="flex flex-col gap-small">
                  <div className={cn('text-content-1 text-paragraph-p1')}>{item.value}</div>
                  <div className={cn('text-content-4 text-paragraph-p3')}>{item.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {!!tradeTimeConf?.length && (
          <div className={cn('p-xl gap-xl flex flex-col ')}>
            <div className={cn('text-important-1 text-content-1')}>
              <Trans>交易时间（GMT+8）</Trans>
            </div>
            <div className={cn('grid  grid-rows-[repeat(3,fit-content(100%))] gap-x-10 grid-cols-3 gap-y-xl')}>
              {tradeTimeConf.map((item, index) => {
                return (
                  <div key={index} className="flex justify-between gap-small">
                    <div className={cn('text-content-4 text-paragraph-p1 ')}>{transferWeekDay(item.weekDay)}</div>
                    <div className={cn('text-content-4 text-paragraph-p1')}>{formatTimeStr(item.trade)}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
