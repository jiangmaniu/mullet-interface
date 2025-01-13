import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { getCurrentQuote } from '@/utils/wsUtil'

import { useRef } from 'react'
import { Text } from '../Base/Text'
import { View } from '../Base/View'
import SelectSymbolModal, { SelectSymbolModalRef } from './SelectSymbolModal'
import SymbolFavoriteIcon from './SymbolFavoriteIcon'
import SymbolIcon from './SymbolIcon'

type IProps = {
  /** 展示行情百分比 */
  showQuotePercent?: boolean
  onClick?: () => void
}

const TriggerDom = observer(({ showQuotePercent, onClick }: IProps) => {
  const { cn, theme } = useTheme()
  const intl = useIntl()
  const { trade } = useStores()
  const symbolInfo = trade.symbolListAll.find((item) => item.symbol === trade.activeSymbolName)
  const { activeSymbolName, symbolListAll } = trade
  const quoteInfo = getCurrentQuote()
  const bid = quoteInfo.bid
  const per: any = quoteInfo.percent

  return (
    <View className={cn('flex-row items-center')} onClick={onClick}>
      {activeSymbolName && symbolListAll?.length > 0 && (
        <>
          <View className={cn('flex-row items-center gap-x-2 pr-[2px]')}>
            <SymbolIcon width={22} height={22} src={symbolInfo?.imgUrl} />
            <Text size="lg" color="primary" font="pf-bold">
              {activeSymbolName}
            </Text>
          </View>
          <Iconfont name="xialacaidan" size={22} color={theme.isDark ? '#fff' : theme.colors.textColor.weak} />
          {showQuotePercent && (
            <Text size="sm" color={per < 0 ? 'red' : 'green'} weight="medium" className={cn('pl-1')}>
              {bid ? (per > 0 ? `+${per}%` : `${per}%`) : '--'}
            </Text>
          )}
        </>
      )}
    </View>
  )
})

function SelectSymbolBtn({ showQuotePercent }: IProps) {
  const { cn, theme } = useTheme()
  const selectSymbolModalRef = useRef<SelectSymbolModalRef>(null)

  return (
    <>
      <View className={cn('flex-row items-center justify-between')}>
        <TriggerDom showQuotePercent={showQuotePercent} onClick={() => selectSymbolModalRef.current?.show()} />
        <SymbolFavoriteIcon />
      </View>
      <SelectSymbolModal ref={selectSymbolModalRef} />
    </>
  )
}

export default observer(SelectSymbolBtn)
