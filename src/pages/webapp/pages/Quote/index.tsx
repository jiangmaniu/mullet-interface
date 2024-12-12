import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'

import QuoteItem from '../../components/Quote/QuoteItem'

function Quote() {
  const { trade } = useStores()
  const symbolList = trade.symbolListAll

  return (
    <div className="mx-3">
      {symbolList.map((item, idx) => {
        return <QuoteItem item={item} key={idx} />
      })}
    </div>
  )
}

export default observer(Quote)
