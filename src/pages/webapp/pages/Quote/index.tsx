import { observer } from 'mobx-react'
import { useRef, useState } from 'react'

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

  return (
    <Basiclayout bgColor="secondary" headerColor={theme.colors.backgroundColor.secondary}>
      <View style={cn('py-2 sticky top-[0px] z-[1] bg-secondary')}>
        <SwitchAccount
          showRightSearchIcon
          onSearch={() => {
            // selectSymbolModalRef.current?.show('ALL')
            navigateTo('/app/quote/search')
          }}
        />
      </View>
      <QuoteTopTabbar />
      <SelectSymbolModal ref={selectSymbolModalRef} from="Quote" beforeClose={() => setQuoteVisible(true)} />
    </Basiclayout>
  )
}

export default observer(Quote)
