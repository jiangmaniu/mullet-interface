import { observer } from 'mobx-react'
import { useEffect } from 'react'

import { useStores } from '@/context/mobxProvider'

import Basiclayout from '../../components/Base/BasicLayout'
import QuoteTopTabbar from '../../components/Quote/QuoteTopTabbar'

function Quote() {
  const { trade } = useStores()

  useEffect(() => {
    // 隐藏页面滚动条，否则和FlashList冲突
    document.documentElement.style.overflowY = 'hidden'
  }, [])

  return (
    <Basiclayout bgColor="secondary">
      <QuoteTopTabbar />
    </Basiclayout>
  )
}

export default observer(Quote)
