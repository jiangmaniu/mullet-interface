import SymbolIcon from '@/components/Base/SymbolIcon'
import { Trans } from '@/components/t'
import { GeneralTooltip } from '@/components/tooltip'
import { useStores } from '@/context/mobxProvider'
import { useCurrentQuote } from '@/hooks/useCurrentQuote'
import { IconButton } from '@/libs/ui/components/button'
import { Iconify } from '@/libs/ui/components/icons'
import { cn } from '@/libs/ui/lib/utils'
import { BNumber } from '@/libs/utils/number'

export const symbolColumns: {
  key: string
  header: React.ReactNode
  cell: (symbolItem: Account.TradeSymbolListItem) => React.ReactNode
}[] = [
  {
    key: 'symbol',
    header: <Trans>交易对</Trans>,
    cell: (symbolItem) => {
      return <SymbolInfo symbolInfo={symbolItem} />
    }
  },
  {
    key: 'price',
    header: <Trans>价格</Trans>,
    cell: (symbolInfo) => {
      return <SymbolPrice symbolInfo={symbolInfo} />
    }
  },

  {
    key: 'h24Change',
    header: <Trans>24H 涨幅</Trans>,
    cell: (symbolInfo) => {
      return <H24Change symbolInfo={symbolInfo} />
    }
  },
  {
    key: 'volume',
    header: <Trans>交易量</Trans>,
    cell: () => {
      return <div>{BNumber.toFormatNumber(undefined, { volScale: 2, prefix: '$' })}</div>
    }
  },
  {
    key: 'openInterest',
    header: <Trans>未平仓合约</Trans>,
    cell: () => {
      return <div>{BNumber.toFormatNumber(undefined, { unit: 'SOL', volScale: 2 })}</div>
    }
  },
  {
    key: 'holdingCostRate',
    header: <Trans>展期费率</Trans>,
    cell: () => {
      return (
        <div>
          {BNumber.toFormatPercent(undefined, { forceSign: true, volScale: undefined })} /{' '}
          {BNumber.toFormatPercent(undefined, { volScale: undefined })}
        </div>
      )
    }
  }
]

const SymbolPrice = ({ symbolInfo }: { symbolInfo: Account.TradeSymbolListItem }) => {
  const res = useCurrentQuote(symbolInfo.symbol)
  const bidDiff = BNumber.from(res?.bidDiff)
  return (
    <div className={cn(bidDiff?.gt(0) ? 'text-market-rise' : bidDiff?.lt(0) ? 'text-market-fall' : 'text-content-1')}>
      {BNumber.toFormatNumber(res?.bid, { volScale: 2 })}
    </div>
  )
}

const H24Change = ({ symbolInfo }: { symbolInfo: Account.TradeSymbolListItem }) => {
  const res = useCurrentQuote(symbolInfo.symbol)
  const percent = BNumber.from(res?.percent)

  return (
    <div
      className={cn(
        'text-paragraph-p2 text-content-1',
        cn(percent?.gt(0) ? 'text-market-rise' : percent?.lt(0) ? 'text-market-fall' : 'text-content-1')
      )}
    >
      {BNumber.toFormatPercent(percent, { forceSign: true })}
    </div>
  )
}

const SymbolInfo = ({ symbolInfo }: { symbolInfo: Account.TradeSymbolListItem }) => {
  const { trade } = useStores()
  const isFavorite = trade.favoriteList.some((item) => item.symbol === symbolInfo.symbol)

  return (
    <div className="flex items-center gap-2">
      <GeneralTooltip align="center" content={isFavorite ? '移除自选' : '添加自选'}>
        <div>
          {String(isFavorite)}
          <Iconify
            onClick={(e) => {
              trade.toggleSymbolFavorite(symbolInfo.symbol)
              e.stopPropagation()
            }}
            icon="iconoir:star"
            className={cn('block size-3.5 cursor-pointer', isFavorite ? 'text-brand-primary' : 'text-brand-secondary-1', {})}
          />
        </div>
      </GeneralTooltip>

      <div className="size-3.5 rounded-full">
        <SymbolIcon src={symbolInfo?.imgUrl} width={14} height={14} className="size-3.5 rounded-full" />
      </div>

      <GeneralTooltip align="center" content={symbolInfo.remark}>
        <div className="text-paragraph-p2 text-content-1">{symbolInfo.alias}</div>
      </GeneralTooltip>
    </div>
  )
}
