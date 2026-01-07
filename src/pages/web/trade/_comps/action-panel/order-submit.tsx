import { Button } from '@/libs/ui/components/button'
import { Trans } from '@/libs/lingui/react/macro'
import { observer } from 'mobx-react'
import { OrderConfirmModal } from '../modal/order-confirm-modal'
import { useState } from 'react'
import { useStores } from '@/context/mobxProvider'
import { FormattedMessage } from '@umijs/max'
import { MinusCircleOutlined } from '@ant-design/icons'
import useTrade from '@/hooks/useTrade'
import { LOTS_UNIT_LABEL } from '../../_options/trade'

export const TradeActionPanelOrderSubmit = observer(() => {
  const [isOrderConfirmModalOpen, setIsOrderConfirmModalOpen] = useState(false)
  const { trade } = useStores()
  const { orderVolume, isBuy, loading, onSubmitOrder, hasQuote, disabledBtn, disabledTrade, symbol } = useTrade()
  const recordModalItem = trade.recordModalItem

  // 禁用交易
  const disabledSubmitBtn = recordModalItem.id ? false : disabledBtn
  const isMarketOpen = trade.isMarketOpen()

  const BuySellButton = (
    <>
      {isBuy ? <Trans>确认买入</Trans> : <Trans>确认卖出</Trans>} {orderVolume} {LOTS_UNIT_LABEL}
    </>
  )

  const handleSubmitOrder = () => {
    // setIsOrderConfirmModalOpen(true)
    onSubmitOrder()
  }

  return (
    <div>
      {/* 下单按钮 */}
      <Button
        block
        variant="primary"
        color="primary"
        size="md"
        disabled={disabledSubmitBtn}
        loading={loading}
        onClick={() => {
          handleSubmitOrder()
        }}
      >
        {hasQuote ? (
          <>
            {!disabledTrade && isMarketOpen && BuySellButton}
            {disabledTrade && <Trans>账户禁止交易</Trans>}
            {!isMarketOpen && !disabledTrade && (
              <div className="flex items-center">
                <MinusCircleOutlined style={{ fontSize: 14, paddingRight: 6 }} />
                <Trans>修改中</Trans>
              </div>
            )}
          </>
        ) : (
          BuySellButton
        )}
      </Button>

      <OrderConfirmModal
        isOpen={isOrderConfirmModalOpen}
        onClose={() => {
          setIsOrderConfirmModalOpen(false)
        }}
        onConfirm={() => {
          console.log('onConfirm')
        }}
      />
    </div>
  )
})
