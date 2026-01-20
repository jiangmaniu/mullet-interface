import { ColumnDef } from '@tanstack/react-table'
import { observer } from 'mobx-react'
import { useRef } from 'react'

import SymbolIcon from '@/components/Base/SymbolIcon'
import { getEnum } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/libs/ui/lib/utils'
import { BNumber } from '@/libs/utils/number'
import { Trans } from '@/libs/lingui/react/macro'
import { Button } from '@/libs/ui/components/button'
import { HistoryPositionRecordDetailModal } from './_comps/modal/history-position-record-detail-modal'
import { GeneralTooltip } from '@/components/tooltip'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { formatAddress } from '@/libs/utils/format'

export const getColumns = ({ currentAccountInfo }: { currentAccountInfo: User.AccountItem }): ColumnDef<Order.BgaOrderPageListItem>[] => {
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
      cell: ({ row }) => <HistoryPositionSymbolInfoCell recordInfo={row.original} />
    },
    {
      accessorKey: 'startPrice',
      header: () => <Trans>开仓均价</Trans>,
      size: 120,
      cell: ({ row }) => BNumber.toFormatNumber(row.original.startPrice, { volScale: row.original.symbolDecimal })
    },
    {
      accessorKey: 'orderVolume',
      header: () => <Trans>手数</Trans>,
      size: 100,
      cell: ({ row }) => (
        <span className="text-paragraph-p2 text-content-1">{row.original.orderVolume}</span>
      )
    },
    {
      accessorKey: 'Fees',
      header: () => (
        <>
          <Trans>手续费({currentAccountInfo.currencyUnit})</Trans> / <Trans>库存费({currentAccountInfo.currencyUnit})</Trans>
        </>
      ),
      size: 220,
      cell: ({ row }) => <HistoryPositionFeesCell positionRecord={row.original} />
    },
    {
      accessorKey: 'stopLossProfit',
      header: () => (
        <>
          <Trans>止盈</Trans> / <Trans>止损</Trans>
        </>
      ),
      size: 200,
      cell: ({ row }) => (
        <div>
          <span className="!text-[13px] text-primary">
            {row.original?.takeProfit ? formatNum(row.original?.takeProfit, { precision: row.original.symbolDecimal }) : '--'}
          </span>
          <span className="dark:text-gray-95"> / </span>
          <span className="!text-[13px] text-primary">
            {row.original?.stopLoss ? formatNum(row.original?.stopLoss, { precision: row.original.symbolDecimal }) : '--'}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'profit',
      header: () => (
        <>
          <Trans>盈亏</Trans>({currentAccountInfo.currencyUnit})
        </>
      ),
      size: 120,
      cell: ({ row }) => (
        <span
          className={cn(
            '!font-dingpro-medium',
            BNumber.from(row.original.profit)?.gt(0)
              ? 'text-green'
              : BNumber.from(row.original.profit)?.lt(0)
              ? 'text-red'
              : 'text-content-1'
          )}
        >
          {BNumber.toFormatNumber(row.original.profit, {
            volScale: currentAccountInfo.currencyDecimal,
            positive: false,
            forceSign: true
          })}
        </span>
      )
    },
    {
      accessorKey: 'tradeAccountId',
      header: () => <Trans>交易账号</Trans>,
      size: 150,
      cell: ({ row }) => <span className="text-paragraph-p2 text-content-1">{row.original.tradeAccountId}</span>
    },
    {
      accessorKey: 'id',
      header: () => <Trans>持仓单号</Trans>,
      size: 150,
      cell: ({ row }) => (
        <GeneralTooltip content={<>{row.original?.id}</>} triggerClassName="inline-block">
          <TooltipTriggerDottedText className="text-paragraph-p2 text-content-1">
            {formatAddress(row.original?.id, { prefix: 4, suffix: 3 })}
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      )
    },
    {
      accessorKey: 'createTime',
      header: () => <Trans>开仓时间</Trans>,
      size: 190,
      cell: ({ row }) => <span className="text-paragraph-p2 text-content-1">{row.original.createTime}</span>
    },
    {
      accessorKey: 'status',
      header: () => <Trans>状态</Trans>,
      size: 150,
      cell: ({ row }) => {
        const typeEnum = getEnum().Enum.BGAStatus
        const text = typeEnum[row.original.status as keyof typeof typeEnum]?.text || row.original.status
        return <span className="text-paragraph-p2 text-content-1">{text}</span>
      }
    },
    {
      id: 'option',
      header: () => (
        <div className="text-right">
          <Trans>操作</Trans>
        </div>
      ),
      size: 100,
      meta: {
        fixed: 'right'
      },
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <div>
            <HistoryPositionActionDetail record={row.original} />
          </div>
        </div>
      )
    }
  ]
}

const HistoryPositionSymbolInfoCell = observer(({ recordInfo }: { recordInfo: Order.BgaOrderPageListItem }) => {
  const { colorClassName, text2 } = getBuySellInfo(recordInfo)
  return (
    <div className="flex items-center gap-medium">
      <SymbolIcon src={recordInfo.imgUrl} width={24} height={24} />
      <div className="flex flex-col">
        <span className="text-paragraph-p2 text-content-1">{recordInfo.symbol}</span>
        <span className={cn('text-paragraph-p3 text-content-4', colorClassName)}>{text2}</span>
      </div>
    </div>
  )
})

const HistoryPositionFeesCell = observer(({ positionRecord }: { positionRecord: Order.BgaOrderPageListItem }) => {
  const handlingFees = positionRecord?.handlingFees
  const interestFees = positionRecord?.interestFees

  const { trade } = useStores()
  const precision = trade.currentAccountInfo.currencyDecimal

  return (
    <div className="text-paragraph-p2 text-content-1">
      {BNumber.toFormatNumber(handlingFees, {
        volScale: precision,
        positive: false
      })}
      {' / '}
      {BNumber.toFormatNumber(interestFees, {
        volScale: precision,
        positive: false
      })}
    </div>
  )
})

const HistoryPositionActionDetail = ({ record }: { record: Order.BgaOrderPageListItem }) => {
  const HistoryPositionRecordDetailModalRef = useRef<any>(null)
  return (
    <div>
      <Button
        variant="primary"
        size="sm"
        color="default"
        onClick={() => {
          HistoryPositionRecordDetailModalRef?.current?.show()
        }}
      >
        <Trans>明细</Trans>
      </Button>

      <HistoryPositionRecordDetailModal ref={HistoryPositionRecordDetailModalRef} record={record} />
    </div>
  )
}
