'use client'

import { Trans } from '@/libs/lingui/react/macro'

import { BNumber } from '@/libs/utils/number'
import { useEffect, useRef, useState } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/libs/ui/components/tabs'
import { toJS } from 'mobx'
import useCurrentDepth from '@/hooks/useCurrentDepth'
import { observer } from 'mobx-react-lite'
import { useStores } from '@/context/mobxProvider'
import { parseSymbolLotsVolScale } from '@/helpers/parse/symbol/parse-lots-vol-scale'
import { LOTS_UNIT_LABEL } from '../../_options/trade'
import { Iconify } from '@/libs/ui/components/icons'
import { cn } from '@/libs/ui/lib/utils'
import { useCurrentQuote } from '@/hooks/useCurrentQuote'
import { EmptyNoData } from '@/components/empty/no-data'

enum DepthModeType {
  Both = 'Both',
  Ask = 'Ask',
  Bid = 'Bid'
}

export const OrderPriceDepthBooks = observer(() => {
  const { trade } = useStores()

  const quote = useCurrentQuote(trade.activeSymbolName)
  const currentAccountInfo = trade.currentAccountInfo

  const [mode, setMode] = useState(DepthModeType.Both)

  const MODE_OPTIONS = [
    {
      value: DepthModeType.Both,
      label: (
        <div className="grid grid-cols-2 grid-rows-2 gap-[2px] size-3">
          <div className="rounded-[1px] col-start-1 row-start-1 bg-market-fall"></div>
          <div className="rounded-[1px] col-start-1 row-start-2  bg-market-rise"></div>
          <div className="rounded-[1px] col-start-2 row-start-1 row-span-2  bg-brand-secondary-1"></div>
        </div>
      )
    },
    {
      value: DepthModeType.Ask,
      label: (
        <div className="grid grid-cols-2 grid-rows-2 gap-[2px] size-3">
          <div className="rounded-[1px] col-start-1  row-span-2 bg-market-fall"></div>
          <div className="rounded-[1px] col-start-2 row-span-2  bg-brand-secondary-1"></div>
        </div>
      )
    },
    {
      value: DepthModeType.Bid,
      label: (
        <div className="grid grid-cols-2 grid-rows-2 gap-[2px] size-3">
          <div className="rounded-[1px] col-start-1 row-span-2 bg-market-rise"></div>
          <div className="rounded-[1px] col-start-2  row-span-2  bg-brand-secondary-1"></div>
        </div>
      )
    }
  ]

  const depth = useCurrentDepth(trade.activeSymbolName)
  const showAll = mode !== DepthModeType.Both
  const activeSymbolInfo = trade.activeSymbolInfo

  const asks = toJS(depth?.asks || []).reverse()
  const bids = toJS(depth?.bids || [])

  // if ((!asks.length && !bids.length) || activeSymbolInfo.symbolConf?.depthOfMarket === 0) return

  return (
    <div className="bg-primary w-full rounded-large gap-medium p-xl py-medium flex h-full max-h-full flex-col">
      <Tabs
        variant={'icon'}
        className="gap-medium flex-1 h-full flex flex-col min-h-0 overflow-hidden"
        size={'sm'}
        value={mode}
        onValueChange={(value) => setMode(value)}
      >
        <TabsList className="flex-shrink-0">
          {MODE_OPTIONS.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 min-h-0 flex flex-col">
          {/* 表头 */}
          <div className="text-content-5 text-paragraph-p3 grid grid-cols-3 gap-2  py-1 flex-shrink-0">
            <div className="text-left">
              <Trans>价格</Trans>
            </div>
            <div className="text-left">
              <Trans>数量({LOTS_UNIT_LABEL})</Trans>
            </div>
            <div className="text-right">
              <Trans>累计({currentAccountInfo?.currencyUnit})</Trans>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex gap-medium flex-col">
            {/* 卖盘 */}
            {mode !== DepthModeType.Bid && <SellList mode={mode} />}

            {/* 当前价格 */}
            <div className="flex justify-between gap-2 py-0.5 flex-shrink-0">
              <div
                className={cn(
                  'flex gap-medium items-center',
                  BNumber.from(quote?.bidDiff)?.gt(0)
                    ? 'text-market-rise'
                    : BNumber.from(quote?.bidDiff)?.lt(0)
                    ? 'text-market-fall'
                    : 'text-content-1'
                )}
              >
                <div className="text-important-1">
                  {BNumber.toFormatNumber(quote?.bid, { volScale: trade.activeSymbolInfo.symbolDecimal })}
                </div>

                {!BNumber.from(quote?.bidDiff)?.eq(0) && (
                  <Iconify
                    icon="iconoir:arrow-up"
                    className={cn('size-4 text-current', {
                      'rotate-180': BNumber.from(quote?.bidDiff)?.lt(0)
                    })}
                  />
                )}
              </div>
            </div>

            {/* 买盘 */}
            {mode !== DepthModeType.Ask && <BuyList mode={mode} />}
          </div>
        </div>

        {/* 买卖比例条 */}
        <div className="flex-shrink-0">
          <BuySellRatioBar mode={mode} />
        </div>
      </Tabs>
    </div>
  )
})

const SellList = observer(({ mode }: { mode: DepthModeType }) => {
  const { trade } = useStores()
  const depth = useCurrentDepth(trade.activeSymbolName)
  const currentAccountInfo = trade.currentAccountInfo
  // asks 从下往上对应（倒数第一个 是买一） 作为卖盘展示在上面， 倒过来 从大到小（倒过来后，从后往前截取12条）(买价 卖盘)
  const asks = toJS(depth?.asks || []).reverse()

  const showAll = mode !== DepthModeType.Both

  // const list = showAll ? asks : asks.slice(-12)
  const list = asks

  const sellMaxValue = BNumber.max(...list.map((ask) => BNumber.from(ask.price).multipliedBy(ask.amount)))
  const activeSymbolInfo = trade.activeSymbolInfo

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [mode])

  return (
    <div className="flex-1 min-h-0 relative">
      {!list.length ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <EmptyNoData />
        </div>
      ) : (
        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto flex flex-col">
          <div className="mt-auto">
            <div>
              {list.map((ask, index) => {
                const value = BNumber.from(ask.price).multipliedBy(ask.amount)
                const sellDiffAmountParcent = BNumber.from(value).div(sellMaxValue).toPercent()
                return (
                  <div
                    key={`ask-${index}`}
                    className="relative w-full flex flex-col text-paragraph-p3 cursor-pointer  py-1.5 hover:bg-zinc-900/20"
                  >
                    <div className="absolute inset-0 py-0.5 ">
                      <div
                        className="ml-auto h-full bg-market-fall/15 transition-all"
                        style={{ width: `${sellDiffAmountParcent.toString()}%`, right: 0, left: 'auto' }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-market-fall relative z-10">
                        {BNumber.toFormatNumber(ask.price, { volScale: activeSymbolInfo.symbolDecimal })}
                      </div>
                      <div className="relative z-10 text-left text-white">
                        {BNumber.toFormatNumber(ask.amount, { volScale: parseSymbolLotsVolScale(activeSymbolInfo.symbolConf) })}
                      </div>
                      <div className="relative z-10 text-right text-white">
                        {BNumber.toFormatNumber(value, { volScale: currentAccountInfo.currencyDecimal })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

const BuyList = observer(({ mode }: { mode: DepthModeType }) => {
  const { trade } = useStores()
  const depth = useCurrentDepth(trade.activeSymbolName)
  const currentAccountInfo = trade.currentAccountInfo
  //  bids 从上往下对应（第一个 是卖一） 作为买盘展示在下面（卖价 买盘）
  const bids = toJS(depth?.bids || [])

  // const showAll = mode !== DepthModeType.Both

  // const list = showAll ? bids : bids.slice(0, 12)
  const list = bids.reverse()
  const bidMaxValue = BNumber.max(...list.map((bid) => BNumber.from(bid.price).multipliedBy(bid.amount)))
  const activeSymbolInfo = trade.activeSymbolInfo
  return (
    <div className="flex-1 min-h-0 relative">
      {!list.length ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <EmptyNoData />
        </div>
      ) : (
        <div className="absolute inset-0 overflow-y-auto">
          <div>
            {list.map((bid, index) => {
              const value = BNumber.from(bid.price).multipliedBy(bid.amount)
              const bidDiffAmountParcent = BNumber.from(value).div(bidMaxValue).toPercent()

              return (
                <div
                  key={`bid-${index}`}
                  className="relative w-full flex flex-col text-paragraph-p3 cursor-pointer  py-1.5 hover:bg-zinc-900/20"
                >
                  <div className="absolute inset-0 py-0.5 ">
                    <div
                      className="ml-auto h-full bg-market-rise/15 transition-all"
                      style={{ width: `${bidDiffAmountParcent.toString()}%`, right: 0, left: 'auto' }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-market-rise relative z-10">
                      {BNumber.toFormatNumber(bid.price, { volScale: activeSymbolInfo.symbolDecimal })}
                    </div>
                    <div className="relative z-10 text-left text-white">
                      {BNumber.toFormatNumber(bid.amount, { volScale: parseSymbolLotsVolScale(activeSymbolInfo.symbolConf) })}
                    </div>
                    <div className="relative z-10 text-right text-white">
                      {BNumber.toFormatNumber(value, { volScale: currentAccountInfo.currencyDecimal })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
})

type BuySellRatioBarProps = {
  mode: DepthModeType
}

const BuySellRatioBar = observer(({ mode }: BuySellRatioBarProps) => {
  const { trade } = useStores()
  const depth = useCurrentDepth(trade.activeSymbolName)
  const showAll = mode !== DepthModeType.Both

  const asks = toJS(depth?.asks || []).reverse()
  // const askList = showAll ? asks : asks.slice(-12)
  const askList = asks

  const bids = toJS(depth?.bids || [])
  // const bidList = showAll ? bids : bids.slice(0, 12)
  const bidList = bids

  const askTotalValue = askList.reduce((acc, ask) => {
    const value = BNumber.from(ask.price).multipliedBy(ask.amount)
    return acc.plus(value)
  }, BNumber.from(0))

  const bidTotalValue = bidList.reduce((acc, bid) => {
    const value = BNumber.from(bid.price).multipliedBy(bid.amount)
    return acc.plus(value)
  }, BNumber.from(0))

  const bothTotalValue = askTotalValue.plus(bidTotalValue)

  const buyPercent = bothTotalValue.gt(0) ? bidTotalValue.div(bothTotalValue) : BNumber.from(0.5)
  const sellPercent = bothTotalValue.gt(0) ? askTotalValue.div(bothTotalValue) : BNumber.from(0.5)
  const buyPercentWidth = BNumber.min(BNumber.max(buyPercent.toPercent(), 20), 80)
  const sellPercentWidth = BNumber.min(BNumber.max(sellPercent.toPercent(), 20), 80)

  return (
    <div className="relative flex w-full">
      {/* 买方（绿色）区域 */}
      <div className="relative transition-all" style={{ width: `${buyPercentWidth}%` }}>
        <div className="absolute z-0 top-0 left-0 h-full w-full text-market-rise/15">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            viewBox="0 0 128 20"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path
              d="M0 4C0 1.79086 1.79086 0 4 0H123.021C125.578 0 127.478 2.36549 126.927 4.86202L124.279 16.862C123.874 18.6949 122.25 20 120.373 20H4C1.79086 20 0 18.2091 0 16V4Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="relative z-10 flex items-center gap-0.5 rounded-xs justify-between">
          {/* B 图标 */}
          <div className="text-market-rise flex size-5 items-center justify-center rounded-xs border border-market-rise text-paragraph-p3">
            B
          </div>
          {/* 买方百分比 */}
          <span className="text-market-rise flex-1 text-paragraph-p3 text-center items-center">
            {BNumber.toFormatPercent(buyPercent, {
              volScale: 1,
              format: {
                roundingFunction: Math.round
              }
            })}
          </span>
        </div>
      </div>

      {/* 卖方（红色）区域 */}
      <div className="relative transition-all" style={{ width: `${sellPercentWidth}%` }}>
        <div className="absolute z-0 top-0 left-0 h-full w-full text-market-fall/15">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            viewBox="0 0 128 20"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path
              d="M127.023 16C127.023 18.2091 125.232 20 123.023 20H4.00172C1.44512 20 -0.455254 17.6345 0.0957031 15.138L2.74398 3.13798C3.14848 1.3051 4.77301 0 6.64999 0H123.023C125.232 0 127.023 1.79086 127.023 4V16Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="relative z-10 flex items-center rounded-xs justify-between gap-0.5">
          {/* 卖方百分比 */}
          <span className=" text-center text-market-fall text-paragraph-p3 flex-1 py-0.5">
            {BNumber.toFormatPercent(sellPercent, {
              volScale: 1,
              format: {
                roundingFunction: Math.round
              }
            })}
          </span>
          {/* S 图标 */}
          <div className="text-market-fall flex size-5 items-center justify-center rounded-xs border border-market-fall text-paragraph-p3">
            S
          </div>
        </div>
      </div>
    </div>
  )
})
