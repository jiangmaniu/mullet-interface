import { observer } from 'mobx-react'

import QuoteFlashList from './QuoteFlashList'

function QuoteTopTabbar() {
  return (
    <div className="pb-[50px]">
      <QuoteFlashList />
    </div>
  )
}

export default observer(QuoteTopTabbar)
