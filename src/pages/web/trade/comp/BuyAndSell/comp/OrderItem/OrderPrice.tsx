import { FormattedMessage, useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useMemo, useState } from 'react'

import InputNumber, { FloatTips } from '@/components/Base/InputNumber'
import useTrade from '@/hooks/useTrade'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'

const PriceRange = observer(({ showFloatTip, isFocus }: { showFloatTip?: boolean; isFocus?: boolean }) => {
  const { showPriceTipRedColor, isBuy, priceTip, priceRangeSymbol } = useTrade()

  const Content = (
    <span className={cn('!font-dingpro-regular', { '!text-red': showPriceTipRedColor, 'text-xs text-secondary': !showFloatTip })}>
      {isBuy ? <FormattedMessage id="mt.mairujiafanwei" /> : <FormattedMessage id="mt.maichujiafanwei" />} {priceRangeSymbol}{' '}
      {formatNum(priceTip)} USD
    </span>
  )

  return (
    <>
      {isFocus && showFloatTip && <FloatTips>{Content}</FloatTips>}
      {!showFloatTip && <span className="text-left">{Content}</span>}
    </>
  )
})

type IProps = {
  /**是否展示Label标签 */
  showLabel?: boolean
  showFloatTip?: boolean
}

// 订单价格
function OrderPrice({ showLabel, showFloatTip = true }: IProps) {
  const intl = useIntl()
  const { disabledTrade, orderPrice, setOrderPrice, isBuy, onPriceMinus, onPriceAdd } = useTrade()
  const [isFocus, setFocus] = useState(false)

  const renderPrice = useMemo(() => {
    return (
      <div className={cn('relative', { 'mb-3': !showFloatTip })}>
        <InputNumber
          // showAddMinus={false}
          placeholder={intl.formatMessage({ id: 'mt.shurujiage' })}
          // addonBefore={intl.formatMessage({ id: 'mt.jiage' })}
          label={showLabel ? intl.formatMessage({ id: 'mt.jiage' }) : ''}
          rootClassName={cn('!z-50 mb-3 mt-[14px]', { '!mb-1': !showFloatTip })}
          classNames={{ input: 'text-center' }}
          value={orderPrice}
          onChange={(value: any) => {
            setOrderPrice(value)
          }}
          onAdd={onPriceAdd}
          onMinus={onPriceMinus}
          disabled={disabledTrade}
          onFocus={() => {
            setFocus(true)
          }}
          onBlur={() => {
            setFocus(false)
          }}
        />
        <PriceRange showFloatTip={showFloatTip} isFocus={isFocus} />
      </div>
    )
  }, [isBuy, disabledTrade, orderPrice, onPriceAdd, onPriceMinus, isFocus, showFloatTip, setOrderPrice])

  return <>{renderPrice}</>
}

export default observer(OrderPrice)
