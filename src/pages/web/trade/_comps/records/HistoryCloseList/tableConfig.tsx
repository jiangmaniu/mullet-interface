import { ColumnDef } from '@tanstack/react-table'
import { observer } from 'mobx-react'

import SymbolIcon from '@/components/Base/SymbolIcon'
import ExplorerLink from '@/components/Wallet/ExplorerLink'
import { getEnum } from '@/constants/enum'
import { useLang } from '@/context/languageProvider'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/libs/ui/lib/utils'
import { BNumber } from '@/libs/utils/number'
import { Trans } from '@/libs/lingui/react/macro'
import { formatAddress } from '@/libs/utils/format'
import { GeneralTooltip } from '@/components/tooltip'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { renderFallback } from '@/libs/utils/format/fallback'
import { parseSymbolLotsVolScale } from '@/helpers/parse/symbol/parse-lots-vol-scale'

export const getColumns = ({
  currentAccountInfo
}: {
  currentAccountInfo: User.AccountItem
}): ColumnDef<Order.TradeRecordsPageListItem>[] => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { lng } = useLang()
  const isZh = lng === 'zh-TW'
  const currencyDecimal = currentAccountInfo.currencyDecimal
  const currencyUnit = currentAccountInfo.currencyUnit

  return [
    {
      accessorKey: 'category',
      header: () => (
        <span className="!pl-1">
          <Trans>品种</Trans>
        </span>
      ),
      size: 230,
      meta: {
        fixed: 'left'
      },
      cell: ({ row }) => <HistoryOrderSymbolInfoCell orderInfo={row.original} />
    },
    {
      accessorKey: 'type',
      header: () => <Trans>交易类型</Trans>,
      size: 120,
      cell: ({ row }) => (
        <span className="text-paragraph-p2 text-content-1">{renderFallback(getEnum().Enum.OrderInOut?.[row.original.inOut!]?.text)}</span>
      )
    },
    {
      accessorKey: 'price',
      header: () => (
        <>
          <Trans>开仓均价</Trans> / <Trans>成交价</Trans>
        </>
      ),
      size: 200,
      cell: ({ row }) => <HistoryOrderPriceCell orderInfo={row.original} />
    },
    {
      accessorKey: 'tradingVolume',
      header: () => <Trans>手数</Trans>,
      size: 100,
      cell: ({ row }) => {
        const lotVolScale = parseSymbolLotsVolScale(row.original.conf)
        return (
          <span className="text-paragraph-p2 text-content-1">
            {BNumber.toFormatNumber(row.original.tradingVolume, { volScale: lotVolScale })}
          </span>
        )
      }
    },
    {
      accessorKey: 'marginType',
      header: () => <Trans>保证金类型</Trans>,
      size: 140,
      cell: ({ row }) => {
        const typeEnum = getEnum().Enum.MarginType
        const text = typeEnum[row.original.marginType as keyof typeof typeEnum]?.text || row.original.marginType
        return <span className="text-paragraph-p2 text-content-1">{text}</span>
      }
    },
    {
      accessorKey: 'id',
      header: () => <Trans>成交单号</Trans>,
      size: 140,
      cell: ({ row }) => (
        <div>
          <GeneralTooltip content={<>{row.original.id}</>} triggerClassName="inline-block">
            <TooltipTriggerDottedText className="text-paragraph-p2 text-content-1">
              {formatAddress(row.original.id, { prefix: 3, suffix: 3 })}
            </TooltipTriggerDottedText>
          </GeneralTooltip>
        </div>
      )
    },
    {
      accessorKey: 'signature',
      header: () => <Trans>交易签名</Trans>,
      size: 180,
      cell: ({ row }) => (
        <>
          {renderFallback(
            <span className="text-content-1 text-paragraph-p2">
              <ExplorerLink path={`tx/${row.original.signature}`} address={row.original.signature} />
            </span>,
            {
              verify: !!row.original.signature
            }
          )}
        </>
      )
    },
    {
      accessorKey: 'createTime',
      header: () => <Trans>交易时间</Trans>,
      size: 180,
      cell: ({ row }) => <span className="text-paragraph-p2 text-content-1">{row.original.createTime}</span>
    },
    {
      accessorKey: 'profit',
      header: () => (
        <div className="text-right">
          <Trans>盈亏</Trans>({currencyUnit})
        </div>
      ),
      size: isZh ? 120 : 140,
      meta: {
        fixed: 'right'
      },
      cell: ({ row }) => {
        const profit = row.original.profit
        return (
          <div className="text-right">
            <span
              className={cn(
                'text-paragraph-p2',
                BNumber.from(profit)?.gt(0) ? 'text-market-rise' : BNumber.from(profit)?.lt(0) ? 'text-market-fall' : 'text-content-1'
              )}
            >
              {BNumber.toFormatNumber(profit, { forceSign: true, positive: false, volScale: currencyDecimal })}
            </span>
          </div>
        )
      }
    }
  ]
}

const HistoryOrderSymbolInfoCell = observer(({ orderInfo }: { orderInfo: Order.TradeRecordsPageListItem }) => {
  const { colorClassName, text2 } = getBuySellInfo(orderInfo)
  return (
    <div className="flex items-center gap-medium">
      <SymbolIcon src={orderInfo.imgUrl} width={24} height={24} />
      <div className="flex flex-col">
        <span className="text-paragraph-p2 text-content-1">{orderInfo.symbol}</span>
        <span className={cn('text-paragraph-p3 text-content-4', colorClassName)}>{text2}</span>
      </div>
    </div>
  )
})

const HistoryOrderPriceCell = observer(({ orderInfo }: { orderInfo: Order.TradeRecordsPageListItem }) => {
  return (
    <div className="text-paragraph-p2 text-content-1">
      {BNumber.toFormatNumber(orderInfo?.startPrice, {
        volScale: orderInfo?.symbolDecimal
      })}
      {' / '}
      {BNumber.toFormatNumber(orderInfo?.tradePrice, {
        volScale: orderInfo?.symbolDecimal
      })}
    </div>
  )
})
