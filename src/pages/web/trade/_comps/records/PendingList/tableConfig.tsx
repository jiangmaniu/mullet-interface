import { ColumnDef } from '@tanstack/react-table'
import { observer } from 'mobx-react'

import SymbolIcon from '@/components/Base/SymbolIcon'
import { ORDER_TYPE } from '@/constants/enum'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/utils/cn'
import { t, Trans } from '@/libs/lingui/react/macro'
import { Button } from '@/libs/ui/components/button'
import { GeneralTooltip } from '@/components/tooltip/general'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { formatAddress } from '@/libs/utils/format'
import { renderFallback } from '@/libs/utils/format/fallback'
import { BNumber } from '@/libs/utils/number'
import { useNiceModal } from '@/components/providers/nice-modal-provider/hooks'
import { SecondaryConfirmationGlobalModalProps } from '@/components/providers/nice-modal-provider/global-modal'
import { GLOBAL_MODAL_ID } from '@/components/providers/nice-modal-provider/register'
import { Iconify } from '@/libs/ui/components/icons'
import { useStores } from '@/context/mobxProvider'
import { TradeOrderDirectionEnum } from '../../../_options/order'
import { parseSymbolLotsVolScale } from '@/helpers/parse/symbol/parse-lots-vol-scale'
import { LOTS_UNIT_LABEL } from '../../../_options/trade'
import CurrentPrice from '../PositionList/_comps/CurrentPrice'

import { IPendingItem } from './index'

export const getColumns = ({ onEdit }: { onEdit: (record: IPendingItem) => void }): ColumnDef<IPendingItem>[] => {
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
      cell: ({ row }) => <PendingSymbolCell pendingOrderInfo={row.original} />
    },
    {
      accessorKey: 'type',
      header: () => <Trans>类型</Trans>,
      size: 120,
      cell: ({ row }) => <PendingTypeCell pendingOrderInfo={row.original} />
    },
    {
      accessorKey: 'price',
      header: () => (
        <>
          <Trans>挂单价</Trans> / <Trans>标记价</Trans>
        </>
      ),
      size: 210,
      cell: ({ row }) => <PendingPriceCell pendingOrderInfo={row.original} />
    },
    {
      accessorKey: 'orderVolume',
      header: () => (
        <>
          <Trans>数量</Trans>({LOTS_UNIT_LABEL})
        </>
      ),
      size: 120,
      cell: ({ row }) => <PendingAmountCell pendingOrderInfo={row.original} />
    },
    {
      accessorKey: 'stopLossProfit',
      header: () => (
        <>
          <Trans>止盈</Trans> / <Trans>止损</Trans>
        </>
      ),
      size: 230,
      cell: ({ row }) => <PendingTpSlCell pendingOrderInfo={row.original} />
    },
    {
      accessorKey: 'id',
      header: () => <Trans>订单号</Trans>,
      size: 150,
      cell: ({ row }) => <PendingIdCell pendingOrderInfo={row.original} />
    },
    {
      accessorKey: 'createTime',
      header: () => <Trans>交易时间</Trans>,
      size: 180,
      cell: ({ row }) => <span className="text-paragraph-p2 text-content-1">{row.original.createTime}</span>
    },
    {
      id: 'option',
      header: () => (
        <div className="text-right">
          <Trans>操作</Trans>
        </div>
      ),
      size: 160,
      meta: {
        fixed: 'right'
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-medium justify-end">
          <Button variant={'primary'} color={'default'} size={'sm'} onClick={() => onEdit(row.original)}>
            <Trans>编辑</Trans>
          </Button>

          <PendingCancelOrderAction pendingOrderInfo={row.original} />
        </div>
      )
    }
  ]
}

const PendingSymbolCell = observer(({ pendingOrderInfo }: { pendingOrderInfo: IPendingItem }) => {
  const { colorClassName, text2 } = getBuySellInfo(pendingOrderInfo)
  return (
    <div className="flex items-center gap-medium">
      <SymbolIcon src={pendingOrderInfo.imgUrl} width={24} height={24} />
      <div className="flex flex-col">
        <span className="text-paragraph-p2 text-content-1">{pendingOrderInfo.alias}</span>
        <span className={cn('!text-paragraph-p3 text-content-4', colorClassName)}>{text2}</span>
      </div>
    </div>
  )
})

const PendingTypeCell = observer(({ pendingOrderInfo }: { pendingOrderInfo: IPendingItem }) => {
  return (
    <div className="text-paragraph-p2 text-content-1">
      {pendingOrderInfo?.type === ORDER_TYPE.LIMIT_BUY_ORDER ? <Trans>限价挂单</Trans> : <Trans>停损单</Trans>}
    </div>
  )
})

const PendingPriceCell = observer(({ pendingOrderInfo }: { pendingOrderInfo: IPendingItem }) => {
  return (
    <div className="text-paragraph-p2 text-content-1">
      {BNumber.toFormatNumber(pendingOrderInfo?.limitPrice, {
        volScale: pendingOrderInfo?.symbolDecimal
      })}
      {' / '}
      <CurrentPrice item={pendingOrderInfo} />
    </div>
  )
})

const PendingAmountCell = observer(({ pendingOrderInfo }: { pendingOrderInfo: IPendingItem }) => {
  const lotVolScale = parseSymbolLotsVolScale(pendingOrderInfo.conf)
  return (
    <div className="text-paragraph-p2 text-content-1">
      {BNumber.toFormatNumber(pendingOrderInfo?.orderVolume, {
        volScale: lotVolScale
      })}
    </div>
  )
})

const PendingTpSlCell = observer(({ pendingOrderInfo }: { pendingOrderInfo: IPendingItem }) => {
  const isBuy = pendingOrderInfo?.buySell === TradeOrderDirectionEnum.BUY

  return (
    <div className="flex gap-medium items-center">
      <div className={'text-paragraph-p2 text-content-1'}>
        {renderFallback(
          <span className="text-market-rise">
            {BNumber.toFormatNumber(pendingOrderInfo?.takeProfit, {
              volScale: pendingOrderInfo?.symbolDecimal,
              //止盈：买入方向 ≥，卖出方向 ≤
              prefix: isBuy ? '≥' : '≤'
            })}
          </span>,
          { verify: !!pendingOrderInfo?.takeProfit }
        )}{' '}
        /{' '}
        {renderFallback(
          <span className="text-market-fall">
            {BNumber.toFormatNumber(pendingOrderInfo?.stopLoss, {
              volScale: pendingOrderInfo?.symbolDecimal,
              // 止损：买入方向 ≤，卖出方向 ≥
              prefix: isBuy ? '≤' : '≥'
            })}
          </span>,
          { verify: !!pendingOrderInfo?.stopLoss }
        )}
      </div>
    </div>
  )
})

const PendingIdCell = observer(({ pendingOrderInfo }: { pendingOrderInfo: IPendingItem }) => {
  return (
    <div>
      <GeneralTooltip content={<>{pendingOrderInfo?.id}</>} triggerClassName="inline-block">
        <TooltipTriggerDottedText className="text-paragraph-p2 text-content-1">
          {formatAddress(pendingOrderInfo?.id, { prefix: 3, suffix: 3 })}
        </TooltipTriggerDottedText>
      </GeneralTooltip>
    </div>
  )
})

const PendingCancelOrderAction = observer(({ pendingOrderInfo }: { pendingOrderInfo: IPendingItem }) => {
  const { trade } = useStores()

  const secondaryConfirmationDialog = useNiceModal<SecondaryConfirmationGlobalModalProps>(GLOBAL_MODAL_ID.SecondaryConfirmation, {
    title: t`取消挂单`,
    message: (
      <div className="flex flex-col items-center gap-xs">
        <div>
          <Iconify icon="iconoir:info-circle-solid" className="size-10 text-status-warning" />
        </div>
        <div className="text-paragraph-p1  text-center text-content-1">
          <Trans>确定取消该挂单？</Trans>
        </div>
      </div>
    ),
    confirm: {
      cb: async () => {
        await trade.cancelOrder({ id: pendingOrderInfo.id })
        return true
      }
    }
  })

  return (
    <div>
      <Button
        onClick={() => {
          secondaryConfirmationDialog.show()
        }}
      >
        <Trans>取消</Trans>
      </Button>
    </div>
  )
})
