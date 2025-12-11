import { Trans } from '@/components/t'
import { GeneralTooltip } from '@/components/tooltip'
import { useStores } from '@/context/mobxProvider'
import { useCurrentQuote } from '@/hooks/useCurrentQuote'
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
      return (
        <div className="flex items-center gap-2">
          <Iconify icon="iconoir:star" className="size-3.5" />

          <div className="">
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${symbolItem.imgUrl}`}
              alt={'symbol logo'}
              className="size-3.5 rounded-full"
            />
          </div>
          <GeneralTooltip align="center" content={symbolItem.remark}>
            <div className="text-paragraph-p2 text-content-1">{symbolItem.alias}</div>
          </GeneralTooltip>
        </div>
      )
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
      return <div>{BNumber.toFormatNumber(613428511.36, { volScale: 2, prefix: '$' })}</div>
    }
  },
  {
    key: 'openInterest',
    header: <Trans>未平仓合约</Trans>,
    cell: () => {
      return <div>{BNumber.toFormatNumber(154, { unit: 'SOL', volScale: 2 })}</div>
    }
  },
  {
    key: 'holdingCostRate',
    header: <Trans>展期费率</Trans>,
    cell: () => {
      return (
        <div>
          {BNumber.toFormatPercent(0.000001, { forceSign: true, volScale: undefined })} /{' '}
          {BNumber.toFormatPercent(0.000002, { volScale: undefined })}
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
