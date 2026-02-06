import { ColumnDef } from '@tanstack/react-table'

import SymbolIcon from '@/components/Base/SymbolIcon'
import { getEnum } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/utils/cn'
import { Trans } from '@/libs/lingui/react/macro'
import { GeneralTooltip } from '@/components/tooltip/general'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { formatAddress } from '@/libs/utils/format'
import { renderFallback } from '@/libs/utils/format/fallback'
import { BNumber } from '@/libs/utils/number'
import { observer } from 'mobx-react'
import { parseSymbolLotsVolScale } from '@/helpers/parse/symbol/parse-lots-vol-scale'

export const getColumns = ({ currentAccountInfo }: { currentAccountInfo: User.AccountItem }): ColumnDef<Order.OrderPageListItem>[] => {
  return [
    {
      accessorKey: 'category',
      header: () => (
        <span className="!pl-1">
          <Trans>品种</Trans>
        </span>
      ),
      size: 200,
      meta: {
        fixed: 'left'
      },
      cell: ({ row }) => <HistoryOrderSymbolInfoCell orderInfo={row.original} />
    },
    {
      accessorKey: 'type',
      header: () => <Trans>类型</Trans>,
      size: 160,
      cell: ({ row }) => {
        const typeEnum = getEnum().Enum.OrderType
        return (
          <span className="text-paragraph-p2 text-content-1">
            {renderFallback(typeEnum[row.original.type as keyof typeof typeEnum]?.text)}
          </span>
        )
      }
    },
    {
      accessorKey: 'price',
      header: () => (
        <>
          <Trans>请求价格</Trans> / <Trans>成交价</Trans>
        </>
      ),
      size: 200,
      cell: ({ row }) => <HistoryOrderPriceCell orderInfo={row.original} />
    },
    {
      accessorKey: 'orderVolume',
      header: () => <Trans>手数</Trans>,
      size: 100,
      cell: ({ row }) => {
        const lotVolScale = parseSymbolLotsVolScale(row.original.conf)
        return (
          <span className="text-paragraph-p2 text-content-1">
            {BNumber.toFormatNumber(row.original.orderVolume, { volScale: lotVolScale })}
          </span>
        )
      }
    },
    {
      accessorKey: 'handlingFees',
      header: () => (
        <>
          <Trans>手续费</Trans>({currentAccountInfo.currencyUnit})
        </>
      ),
      size: 150,
      cell: ({ row }) => <HandlingFees text={row.original.handlingFees} />
    },
    {
      accessorKey: 'id',
      header: () => <Trans>订单号</Trans>,
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
      accessorKey: 'createTime',
      header: () => <Trans>交易时间</Trans>,
      size: 180,
      cell: ({ row }) => <span className="text-paragraph-p2 text-content-1">{row.original.createTime}</span>
    },
    {
      accessorKey: 'status',
      header: () => (
        <div className="text-right">
          <Trans>状态</Trans>
        </div>
      ),
      size: 120,
      meta: {
        fixed: 'right'
      },
      cell: ({ row }) => (
        <div className="text-right">
          <span className="text-paragraph-p2 text-content-1">
            {renderFallback(getEnum().Enum.OrderStatus?.[row.original.status!]?.text)}
          </span>
        </div>
      )
    }
  ]
}

const HistoryOrderSymbolInfoCell = observer(({ orderInfo }: { orderInfo: Order.OrderPageListItem }) => {
  const { colorClassName, text2 } = getBuySellInfo(orderInfo)
  return (
    <div className="flex items-center gap-medium">
      <SymbolIcon src={orderInfo.imgUrl} width={24} height={24} />
      <div className="flex flex-col">
        <span className="text-paragraph-p2 text-content-1">{orderInfo.symbol}</span>
        <span className={cn('!text-paragraph-p3 text-content-4', colorClassName)}>{text2}</span>
      </div>
    </div>
  )
})

const HistoryOrderPriceCell = observer(({ orderInfo }: { orderInfo: Order.OrderPageListItem }) => {
  const { trade } = useStores()
  const currencyDecimal = trade.currentAccountInfo.currencyDecimal

  return (
    <div className="text-paragraph-p2 text-content-1">
      {orderInfo.type === 'MARKET_ORDER' ? (
        <span className="text-paragraph-p2 text-content-1">
          <Trans>市价</Trans>
        </span>
      ) : (
        BNumber.toFormatNumber(orderInfo.limitPrice, {
          volScale: currencyDecimal
        })
      )}

      {' / '}
      {BNumber.toFormatNumber(orderInfo?.tradePrice, {
        volScale: currencyDecimal
      })}
    </div>
  )
})

const HandlingFees = observer(({ text }: { text: string | number | undefined }) => {
  const { trade } = useStores()
  return (
    <span className="text-paragraph-p2 text-content-1">
      {BNumber.toFormatNumber(text, { volScale: trade.currentAccountInfo.currencyDecimal })}
    </span>
  )
})
