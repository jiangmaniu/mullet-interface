import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'

import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'

import SwitchAccount from '../../components/Account/SwitchAccount'
import { View } from '../../components/Base/View'
import QuoteTopTabbar from '../../components/Quote/QuoteTopTabbar'
import SelectSymbolModal, { SelectSymbolModalRef } from '../../components/Quote/SelectSymbolModal'
import Basiclayout from '../../layouts/BasicLayout'
import { navigateTo } from '../../utils/navigator'

function Quote() {
  const { cn, theme } = useTheme()
  const { trade } = useStores()
  const selectSymbolModalRef = useRef<SelectSymbolModalRef>(null)
  const [quoteVisible, setQuoteVisible] = useState(true)

  useEffect(() => {
    // 隐藏页面滚动条，否则和FlashList的虚拟滚动条冲突
    document.documentElement.style.overflowY = 'hidden'

    return () => {
      document.documentElement.style.overflowY = 'auto'
    }
  }, [])

  return (
    <Basiclayout bgColor="secondary" headerColor={theme.colors.backgroundColor.secondary}>
      <View style={cn('my-2')}>
        <SwitchAccount
          showRightSearchIcon
          onSearch={() => {
            // selectSymbolModalRef.current?.show('ALL')
            navigateTo('/app/quote/search')
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
