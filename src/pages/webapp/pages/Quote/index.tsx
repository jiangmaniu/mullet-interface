import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'

import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'

import SwitchAccount from '../../components/Account/SwitchAccount'
import { View } from '../../components/Base/View'
import QuoteTopTabbar from '../../components/Quote/QuoteTopTabbar'
import SelectSymbolModal, { SelectSymbolModalRef } from '../../components/Quote/SelectSymbolModal'
import Basiclayout from '../../layouts/BasicLayout'

function Quote() {
  const { cn, theme } = useTheme()
  const { trade } = useStores()
  const selectSymbolModalRef = useRef<SelectSymbolModalRef>(null)
  const [quoteVisible, setQuoteVisible] = useState(true)

  useEffect(() => {
    // 隐藏页面滚动条，否则和FlashList冲突
    document.documentElement.style.overflowY = 'hidden'
  }, [])

  return (
    <Basiclayout bgColor="secondary">
      <View style={cn('my-2')}>
        <SwitchAccount
          showRightSearchIcon
          onSearch={() => {
            selectSymbolModalRef.current?.show('ALL')
            // @TODO 待开发
            // navigateTo("/app/quote/search")
          }}
        />
      </View>
      <View className={cn('border-b')} borderColor="weak" />
      <QuoteTopTabbar />
      <SelectSymbolModal ref={selectSymbolModalRef} from="Quote" beforeClose={() => setQuoteVisible(true)} />
    </Basiclayout>
  )
}

export default observer(Quote)
