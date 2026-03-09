import { ColumnDef } from '@tanstack/react-table'

import { getEnum } from '@/constants/enum'
import { cn } from '@/libs/ui/lib/utils'
import { GeneralTooltip } from '@/components/tooltip'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { formatAddress } from '@/libs/utils/format'
import { Trans } from '@/libs/lingui/react/macro'
import { BNumber } from '@/libs/utils/number'
import { parseSymbolLotsVolScale } from '@/helpers/parse/symbol/parse-lots-vol-scale'
import SelectIcon from '@/components/Base/Svg/SelectIcon'

export const getHistoryPositionRecordDetailModalTableColumns = ({
  currentAccountInfo
}: {
  currentAccountInfo: User.AccountItem
}): ColumnDef<any>[] => {
  return [
    {
      accessorKey: 'id',
      header: () => <Trans>订单号</Trans>,
      size: 150,
      meta: {
        fixed: 'left'
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-1" style={{ paddingLeft: `${row.depth * 16}px` }}>
          <GeneralTooltip content={<>{row.original?.id}</>} triggerClassName="inline-block">
            <TooltipTriggerDottedText className="text-paragraph-p2 text-content-1">
              {formatAddress(row.original?.id, { prefix: 4, suffix: 3 })}
            </TooltipTriggerDottedText>
          </GeneralTooltip>
          {row.getCanExpand() && (
            <span className="flex cursor-pointer" onClick={row.getToggleExpandedHandler()}>
              <SelectIcon style={{ transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </span>
          )}
        </div>
      )
    },
    {
      accessorKey: 'symbol',
      header: () => <Trans>品种</Trans>,
      size: 100,
      cell: ({ row }) => <span className="text-paragraph-p2 text-content-1">{row.original.symbol || '--'}</span>
    },
    {
      accessorKey: 'direction',
      header: () => <Trans>方向</Trans>,
      size: 100,
      cell: ({ row }) => <span className="text-paragraph-p2 text-content-1">{row.original.direction || '--'}</span>
    },
    {
      accessorKey: 'orderVolume',
      header: () => <Trans>手数</Trans>,
      size: 120,
      cell: ({ row }) => {
        const record = row.original
        const lotVolScale = parseSymbolLotsVolScale(record.conf)
        return (
          <span className="text-paragraph-p2 text-content-1">{BNumber.toFormatNumber(record.orderVolume, { volScale: lotVolScale })}</span>
        )
      }
    },
    {
      accessorKey: 'price',
      header: () => <Trans>价格</Trans>,
      size: 200,
      cell: ({ row }) => <span className="text-paragraph-p2 text-content-1">{row.original.price}</span>
    },
    {
      accessorKey: 'createTime',
      header: () => <Trans>时间</Trans>,
      size: 190,
      cell: ({ row }) => <span className="text-paragraph-p2 text-content-1">{row.original.createTime || '--'}</span>
    },
    {
      accessorKey: 'type',
      header: () => <Trans>类型</Trans>,
      size: 150,
      cell: ({ row }) => {
        const typeText = getEnum().Enum.OrderType[row.original.type as string]?.text
        return <span className="text-paragraph-p2 text-content-1">{typeText || '--'}</span>
      }
    },
    {
      accessorKey: 'stopLossProfit',
      header: () => <Trans>止盈 / 止损</Trans>,
      size: 150,
      cell: ({ row }) => {
        const record = row.original
        return (
          <div className="text-paragraph-p2 text-content-1">
            <span className="!text-[13px] text-primary">
              {BNumber.toFormatNumber(record?.takeProfit, { volScale: record.symbolDecimal })}
            </span>
            <span className="dark:text-gray-95"> / </span>
            <span className="!text-[13px] text-primary">
              {BNumber.toFormatNumber(record?.stopLoss, { volScale: record.symbolDecimal })}
            </span>
          </div>
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
      cell: ({ row }) => (
        <span className="!text-[13px] text-primary">
          {BNumber.toFormatNumber(row.original.handlingFees, {
            volScale: currentAccountInfo.currencyDecimal,
            positive: false,
            forceSign: true
          })}
        </span>
      )
    },
    {
      accessorKey: 'interestFees',
      header: () => (
        <>
          <Trans>库存费</Trans>({currentAccountInfo.currencyUnit})
        </>
      ),
      size: 150,
      cell: ({ row }) => (
        <span className="!text-[13px] text-primary">
          {BNumber.toFormatNumber(row.original.interestFees, { volScale: currentAccountInfo.currencyDecimal })}
        </span>
      )
    },
    {
      accessorKey: 'profit',
      header: () => (
        <div className="text-right">
          <Trans>盈亏</Trans>({currentAccountInfo.currencyUnit})
        </div>
      ),
      size: 120,
      meta: {
        fixed: 'right'
      },
      cell: ({ row }) => {
        const profit = row.original.profit
        return (
          <div className="text-right">
            <span
              className={cn(
                '!font-dingpro-medium',
                BNumber.from(profit)?.gt(0) ? 'text-green' : BNumber.from(profit)?.lt(0) ? 'text-red' : 'text-content-1'
              )}
            >
              {BNumber.toFormatNumber(profit, {
                forceSign: true,
                positive: false,
                volScale: currentAccountInfo.currencyDecimal
              })}
            </span>
          </div>
        )
      }
    }
  ]
}
