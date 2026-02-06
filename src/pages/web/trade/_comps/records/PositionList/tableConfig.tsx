
import { ColumnDef } from '@tanstack/react-table'
import { observer } from 'mobx-react'
import { Trans } from '@/libs/lingui/react/macro'
import { FormattedMessage } from '@umijs/max'
import { Button, IconButton } from '@/libs/ui/components/button'
import { Iconify } from '@/libs/ui/components/icons'
import SymbolIcon from '@/components/Base/SymbolIcon'
import SelectIcon from '@/components/Base/Svg/SelectIcon'
import { cn } from '@/libs/ui/lib/utils'
import { getBuySellInfo } from '@/utils/business'
import { toFixed } from '@/utils'
import { BNumber } from '@/libs/utils/number'
import { LOTS_UNIT_LABEL } from '../../../_options/trade'
import { TradeOrderDirectionEnum } from '../../../_options/order'
import { useStores } from '@/context/mobxProvider'
import { renderFallback } from '@/libs/utils/format/fallback'
import { GeneralTooltip } from '@/components/tooltip'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { formatAddress } from '@/libs/utils/format/common'
import { parseSymbolLotsVolScale } from '@/helpers/parse/symbol/parse-lots-vol-scale'
import CurrentPrice from './comp/CurrentPrice'
import MarginRate from './comp/MarginRate'
import ProfitYieldRate from './comp/ProfitYieldRate'
import RowTotalProfitYieldRate from './comp/RowTotalProfitYieldRate'
import { IPositionItem } from './index'

export const getColumns = (actions: {
  onClose: (record: IPositionItem) => void
  onTpSl: (record: IPositionItem) => void
  onMargin: (record: IPositionItem) => void
}): ColumnDef<IPositionItem>[] => {
  return [
    {
      accessorKey: 'category',
      header: () => (
        <span className="!pl-1">
          <Trans>品种</Trans>
        </span>
      ),
      size: 160,
      enablePinning: true,
      meta: {
        fixed: 'left'
      },
      cell: ({ row }) => {
        return <PositionSymbolInfo positionInfo={row.original} row={row} />
      }
    },
    {
      accessorKey: 'orderVolume',
      header: () => (
        <>
          <Trans>开仓数量</Trans>({LOTS_UNIT_LABEL})
        </>
      ),
      size: 110,
      cell: ({ row }) => {
        const hasChildren = (row.original.childrenList?.length || 0) > 1
        if (row.depth === 0 && hasChildren) return null

        return <PositionAmount positionInfo={row.original} />
      }
    },
    {
      accessorKey: 'price',
      header: () => (
        <>
          <Trans>开仓均价</Trans> / <Trans>标记价</Trans>
        </>
      ),
      size: 200,
      cell: ({ row }) => {
        const hasChildren = (row.original.childrenList?.length || 0) > 1
        if (row.depth === 0 && hasChildren) return null
        return <PositionPriceCell positionInfo={row.original} />
      }
    },
    {
      accessorKey: 'margin',
      header: () => (
        <>
          <Trans>保证金</Trans> / <Trans>保证金率</Trans>
        </>
      ),
      size: 220,
      cell: ({ row }) => {
        return (
          <PositionMarginCell
            positionInfo={row.original}
            onEdit={() => actions.onMargin(row.original)}
            isGroupParent={row.depth === 0 && (row.original.childrenList?.length || 0) > 1}
          />
        )
      }
    },
    {
      accessorKey: 'stopLossProfit',
      header: () => <Trans>止盈 / 止损</Trans>,
      size: 220,
      cell: ({ row }) => {
        const hasChildren = (row.original.childrenList?.length || 0) > 1
        if (row.depth === 0 && hasChildren) return null

        return <PositionTpSlCell positionInfo={row.original} onEdit={() => actions.onTpSl(row.original)} />
      }
    },
    {
      id: 'Fees', // Custom ID since not a direct accessor
      header: () => <Trans>手续费 / 库存费</Trans>,
      size: 220,
      cell: ({ row }) => {
        return (
          <PositionFeesCell positionInfo={row.original} isGroupParent={row.depth === 0 && (row.original.childrenList?.length || 0) > 1} />
        )
      }
    },
    {
      accessorKey: 'id',
      header: () => <Trans>持仓单号</Trans>,
      size: 200,
      cell: ({ row }) => {
        const hasChildren = (row.original.childrenList?.length || 0) > 1
        if (row.depth === 0 && hasChildren) return null
        return <PositionIdCell positionInfo={row.original} />
      }
    },
    {
      accessorKey: 'createTime',
      header: () => <Trans>交易时间</Trans>,
      size: 180,
      cell: ({ row }) => <span className="!text-[13px] text-primary">{row.original.createTime}</span>
    },
    {
      accessorKey: 'profit',
      header: () => {
        // Note: Inside the hook we can't easily access `trade.currentAccountInfo.currencyUnit` unless we call useStores inside the component or pass it in.
        // But `header` can be a component.
        return <ProfitHeader />
      },
      size: 150,
      enablePinning: true,
      meta: {
        fixed: 'right'
      },
      cell: ({ row }) => {
        if (row.depth === 0 && row.original.childrenList?.length) {
          // Note: The original code passed `childrenList` to `RowTotalProfitYieldRate`
          return <RowTotalProfitYieldRate childrenList={row.original.childrenList} />
        }
        return <ProfitYieldRate item={row.original} />
      }
    },
    {
      id: 'option',
      header: () => <Trans>操作</Trans>,
      size: 92,
      enablePinning: true,
      meta: {
        fixed: 'right'
      },
      cell: ({ row }) => {
        const hasChildren = (row.original.childrenList?.length || 0) > 1
        if (row.depth === 0 && hasChildren) return null

        return (
          <div className="flex gap-2 justify-end">
            <Button
              variant={'primary'}
              size="sm"
              color={'default'}
              onClick={(e) => {
                e.stopPropagation()
                actions.onClose(row.original)
              }}
            >
              <Trans>平仓</Trans>
            </Button>
          </div>
        )
      }
    }
  ]
}

const ProfitHeader = observer(() => {
  const { trade } = useStores()
  return <Trans>浮动盈亏({trade.currentAccountInfo.currencyUnit}) / 收益率</Trans>
})

// --- Cell Components ---

const PositionTpSlCell = observer(({ positionInfo, onEdit }: { positionInfo: IPositionItem; onEdit: () => void }) => {
  const isBuy = positionInfo?.buySell === TradeOrderDirectionEnum.BUY

  return (
    <div className="flex gap-medium items-center">
      <div className={'text-paragraph-p2 text-content-1'}>
        {renderFallback(
          <span className="text-market-rise">
            {BNumber.toFormatNumber(positionInfo?.takeProfit, {
              volScale: positionInfo?.symbolDecimal,
              prefix: isBuy ? '≥' : '≤'
            })}
          </span>,
          { verify: !!positionInfo?.takeProfit }
        )}{' '}
        /{' '}
        {renderFallback(
          <span className="text-market-fall">
            {BNumber.toFormatNumber(positionInfo?.stopLoss, {
              volScale: positionInfo?.symbolDecimal,
              prefix: isBuy ? '≤' : '≥'
            })}
          </span>,
          { verify: !!positionInfo?.stopLoss }
        )}
      </div>

      <IconButton
        variant={'ghost'}
        className="p-0.5 rounded-1"
        onClick={(e) => {
          e.stopPropagation()
          onEdit()
        }}
      >
        <Iconify icon="iconoir:edit" className="size-4" />
      </IconButton>
    </div>
  )
})

const PositionFeesCell = observer(({ positionInfo, isGroupParent }: { positionInfo: IPositionItem; isGroupParent: boolean }) => {
  // original: isOneLevel && Number(positionInfo?.childrenList?.length) ? positionInfo.totalHandlingFees : positionInfo.handlingFees
  const handlingFees = isGroupParent ? positionInfo.totalHandlingFees : positionInfo.handlingFees
  const interestFees = isGroupParent ? positionInfo.totalInterestFees : positionInfo.interestFees

  const { trade } = useStores()
  const precision = trade.currentAccountInfo.currencyDecimal
  const unit = trade.currentAccountInfo.currencyUnit

  return (
    <div className="text-paragraph-p2 text-content-1">
      {BNumber.toFormatNumber(handlingFees, {
        volScale: precision,
        positive: false,
        unit: unit
      })}
      {' / '}
      {BNumber.toFormatNumber(interestFees, {
        volScale: precision,
        positive: false,
        unit: unit
      })}
    </div>
  )
})

const PositionPriceCell = observer(({ positionInfo }: { positionInfo: IPositionItem }) => {
  return (
    <div className="text-paragraph-p2 text-content-1">
      {BNumber.toFormatNumber(positionInfo?.startPrice, {
        volScale: positionInfo?.symbolDecimal,
        positive: false
      })}
      {' / '}
      <CurrentPrice item={positionInfo} />
    </div>
  )
})

const PositionMarginCell = observer(
  ({ positionInfo, onEdit, isGroupParent }: { positionInfo: IPositionItem; onEdit: () => void; isGroupParent?: boolean }) => {
    const { trade } = useStores()
    const buySellInfo = getBuySellInfo(positionInfo)

    return (
      <div className="text-paragraph-p2 text-content-1">
        <div className="flex gap-1">
          <div>
            {BNumber.toFormatNumber(positionInfo?.orderMargin, {
              volScale: trade.currentAccountInfo.currencyDecimal,
              unit: trade.currentAccountInfo.currencyUnit
            })}
            {' / '}
            <span className={cn('text-content-4')}>{buySellInfo.marginTypeText}</span>
          </div>

          {positionInfo.marginType === 'ISOLATED_MARGIN' && (
            <div>
              <IconButton
                variant={'ghost'}
                className="p-0.5 rounded-1"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
              >
                <Iconify icon="iconoir:edit" className="size-4" />
              </IconButton>
            </div>
          )}
        </div>
        <div>
          (<MarginRate item={positionInfo} />)
        </div>
      </div>
    )
  }
)

const PositionAmount = observer(({ positionInfo }: { positionInfo: IPositionItem }) => {
  const lotVolScale = parseSymbolLotsVolScale(positionInfo.conf)
  return (
    <div className="text-paragraph-p2 text-content-1">
      {BNumber.toFormatNumber(positionInfo?.orderVolume, {
        volScale: lotVolScale,
        positive: true
      })}
    </div>
  )
})

const PositionSymbolInfo = observer(({ positionInfo, row }: { positionInfo: IPositionItem; row: any }) => {
  const { colorClassName, text } = getBuySellInfo(positionInfo)
  const childrenListLen = Number(positionInfo?.childrenList?.length)

  // Parent Row with Children
  if (row.depth === 0 && childrenListLen > 1) {
    return (
      <div className="flex items-center">
        <div className="flex items-center gap-medium">
          <SymbolIcon src={positionInfo.imgUrl} width={24} height={24} />
          <span className="text-paragraph-p2 text-content-1">{positionInfo.alias}</span>
        </div>
        <div className="flex items-center">
          <div className="bg-gray-200 dark:bg-gray-700 flex items-center font-pf-bold text-primary text-xs flex-shrink justify-center rounded w-[18px] h-[18px] mx-2 p-1">
            {childrenListLen}
          </div>

          <span className="flex">
            <SelectIcon style={{ transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </span>
        </div>
      </div>
    )
  }

  // Child Row
  if (row.depth > 0) {
    const buySellInfo = getBuySellInfo(positionInfo)
    return (
      <div className="flex items-center">
        <div className="flex flex-col pl-[32px]">
          <span className={cn('text-paragraph-p3', buySellInfo.colorClassName)}>{buySellInfo.text}</span>
        </div>
      </div>
    )
  }

  // Standard Row (No Children)
  return (
    <div className="flex items-center gap-medium">
      <SymbolIcon src={positionInfo.imgUrl} width={24} height={24} />
      <div className="flex flex-col">
        <span className="text-paragraph-p2 text-content-1">{positionInfo.alias}</span>
        <span className={cn('text-paragraph-p3 text-content-4', colorClassName)}>{text}</span>
      </div>
    </div>
  )
})

const PositionIdCell = observer(({ positionInfo }: { positionInfo: IPositionItem }) => {
  return (
    <div>
      <GeneralTooltip content={<>{positionInfo?.id}</>} triggerClassName="inline-block">
        <TooltipTriggerDottedText className="text-paragraph-p2 text-content-1">
          {formatAddress(positionInfo?.id, { prefix: 3, suffix: 3 })}
        </TooltipTriggerDottedText>
      </GeneralTooltip>
    </div>
  )
})
