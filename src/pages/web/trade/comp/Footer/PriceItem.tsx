import { observer } from 'mobx-react'

import { cn } from '@/utils/cn'

import { useCurrentQuote } from '@/hooks/useCurrentQuote'

type IProps = {
  symbol: string
}

function PriceItem({ symbol }: IProps) {
  const res = useCurrentQuote(symbol)
  const per: any = res?.percent
  const bid = res?.bid

  return (
    <>
      <div className={cn('px-[3px] text-xs font-medium', per > 0 ? 'text-green' : 'text-red')}>
        {bid ? (per > 0 ? `+${per}%` : `${per}%`) : '--'}
      </div>
      <div className="px-[3px] text-xs font-medium text-weak">{bid}</div>
    </>
  )
}
export default observer(PriceItem)
