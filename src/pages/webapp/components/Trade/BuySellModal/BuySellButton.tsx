import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { formatNum } from '@/utils'
import { getCurrentQuote } from '@/utils/wsUtil'

import { useI18n } from '@/pages/webapp/hooks/useI18n'
import Button from '../../Base/Button'
import { Text } from '../../Base/Text'
import { View } from '../../Base/View'

type IProps = {
  /** 按钮展示位置 弹窗、页面底部 */
  position?: 'modal' | 'footer'
  onShow?: () => void
}

function BuySellButton({ position = 'footer', onShow }: IProps) {
  const { cn } = useTheme()
  const { trade } = useStores()
  const { t } = useI18n()
  const { buySell, setBuySell, orderQuickPlaceOrderChecked } = trade
  const isShowModal = position === 'modal'

  const quoteInfo = getCurrentQuote()
  const hasQuote = quoteInfo.hasQuote

  const showBuySellModal = () => {
    onShow?.()
  }

  const jumpTrade = () => {
    navigateTo('/app/trade')
  }

  return (
    <View className={cn('flex-row items-center flex-1 justify-center gap-x-3')}>
      <Button
        type="danger"
        size="large"
        containerClassName={cn('flex-1')}
        onClick={() => {
          setBuySell('SELL')
          setTimeout(() => {
            if (!orderQuickPlaceOrderChecked) {
              jumpTrade()
              return
            }
            if (!isShowModal) {
              showBuySellModal()
            }
          }, 50)
        }}
        height={40}
        isDebounce={false}
        className={cn(isShowModal && buySell === 'BUY' && 'bg-gray-80')}
        textClassName={cn('font-dingpro-medium', isShowModal && buySell === 'BUY' && '!text-weak')}
      >
        {t('mt.kaikong')} {hasQuote ? formatNum(quoteInfo.bid) : '--'}
      </Button>
      <View className={cn('items-center justify-center bg-gray-85 px-1 rounded-[6px] z-[1] min-w-[36px] absolute dark:bg-white')}>
        <Text color="primary" size="sm" className={cn('leading-[22px]')}>
          {quoteInfo.spread || 0}
        </Text>
      </View>
      <Button
        type="success"
        size="large"
        containerClassName={cn('flex-1')}
        onClick={() => {
          setBuySell('BUY')
          setTimeout(() => {
            if (!orderQuickPlaceOrderChecked) {
              jumpTrade()
              return
            }
            if (!isShowModal) {
              showBuySellModal()
            }
          }, 50)
        }}
        height={40}
        isDebounce={false}
        className={cn(isShowModal && buySell === 'SELL' && 'bg-gray-80')}
        textClassName={cn('font-dingpro-medium', isShowModal && buySell === 'SELL' && '!text-weak')}
      >
        {t('mt.kaiduo')} {formatNum(quoteInfo.ask)}
      </Button>
    </View>
  )
}

export default observer(BuySellButton)
