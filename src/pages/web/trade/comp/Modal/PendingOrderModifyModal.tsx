import { FormattedMessage, useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react'

import Button from '@/components/Base/Button'
import Modal from '@/components/Base/Modal'
import Popup from '@/components/Base/Popup'
import SymbolIcon from '@/components/Base/SymbolIcon'
import { useStores } from '@/context/mobxProvider'
import useTrade from '@/hooks/useTrade'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { RecordModalItem } from '@/mobx/trade'
import { cn } from '@/utils/cn'
import { message } from '@/utils/message'

import OrderPrice from '../BuyAndSell/comp/OrderItem/OrderPrice'
import SetSpSl from '../BuyAndSell/comp/OrderItem/SetSpSl'
import { IPendingItem } from '../TradeRecord/comp/PendingList'
import OpenTips from './OpenTipsModal'

const ConfirmButton = observer(({ item, close }: { item: IPendingItem; close: () => void }) => {
  const intl = useIntl()
  const { trade } = useStores()
  const [loading, setLoading] = useState(false)
  const { slFlag, spFlag, orderPrice, stopLoss, takeProfit } = useTrade({ limitStopItem: item })

  const disabledBtn = spFlag || slFlag

  const onFinish = useCallback(
    async (values: any) => {
      console.log('values', values)
      const msg = intl.formatMessage({ id: 'mt.zhiyingzhisunshezhicuowu' })

      if (slFlag) {
        message.info(msg)
        return
      }

      if (spFlag) {
        message.info(msg)
        return
      }

      const params = {
        orderId: item.id,
        stopLoss: stopLoss ? Number(stopLoss) : undefined,
        takeProfit: takeProfit ? Number(takeProfit) : undefined,
        limitPrice: parseFloat(orderPrice)
      } as Order.UpdatePendingOrderParams

      console.log('修改挂单参数', params)

      setLoading(true)
      const res = await trade.modifyPendingOrder(params).finally(() => {
        setLoading(false)
      })

      if (res.success) {
        // 关闭当前弹窗
        close()
      }
    },
    [item, stopLoss, takeProfit, orderPrice, slFlag, spFlag, intl, close]
  )

  return (
    <Button
      block
      onClick={onFinish}
      className={cn({
        'pointer-events-none !bg-gray-250 dark:!bg-gray-651': !orderPrice
      })}
      type="primary"
      loading={loading}
      disabled={disabledBtn}
    >
      <FormattedMessage id="common.queren" />
    </Button>
  )
})

// 修改挂单
export default observer(
  forwardRef((props, ref) => {
    const intl = useIntl()
    const [item, setItem] = useState({} as IPendingItem)
    const { trade } = useStores()
    const [open, setOpen] = useState(false)

    const close = useCallback(() => {
      setOpen(false)
      setItem({} as IPendingItem)
      trade.resetTradeAction()
      trade.setRecordModalItem({} as RecordModalItem)
    }, [])

    const show = useCallback((item: IPendingItem) => {
      setOpen(true)
      setItem(item)
    }, [])

    // 对外暴露接口
    useImperativeHandle(ref, () => {
      return {
        show,
        close
      }
    })

    const renderContent = useMemo(() => {
      const isBuy = item.buySell === 'BUY'
      return (
        <>
          <div className="max-xl:px-4">
            <div className="flex flex-col items-center justify-center">
              <div className="flex w-full flex-col pt-3">
                <div className="flex items-center">
                  <SymbolIcon src={item?.imgUrl} width={24} height={24} />
                  <span className="pl-[6px] text-base font-semibold text-primary">{item.alias || item.symbol}</span>
                  <span className={cn('pl-1 text-sm text-green', isBuy ? 'text-green' : 'text-red')}>
                    · {isBuy ? <FormattedMessage id="mt.mairu" /> : <FormattedMessage id="mt.maichu" />}
                  </span>
                </div>
                <div className="flex w-full items-center pt-2">
                  <div className="flex items-center justify-between">
                    <span className="pr-3 text-sm text-secondary">
                      <FormattedMessage id="common.type" />
                    </span>
                    <span className="text-sm text-primary">
                      {item.isLimitOrder ? <FormattedMessage id="mt.xianjiaguadan" /> : <FormattedMessage id="mt.tingsundan" />}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pl-5">
                    <span className="pr-3 text-sm text-secondary">
                      <FormattedMessage id="mt.guadanshoushu" />
                    </span>
                    <span className="text-sm text-primary">
                      {item.orderVolume}
                      <FormattedMessage id="mt.lot" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full pt-5">
                <OrderPrice showLabel showFloatTip={false} />
                <SetSpSl showLabel />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <ConfirmButton item={item} close={close} />
            </div>
          </div>
        </>
      )
    }, [item, close])

    const titleDom = <FormattedMessage id="mt.xiugaiguadan" />

    // 避免重复渲染
    if (!open) return

    return (
      <>
        <SwitchPcOrWapLayout
          pcComponent={
            <Modal title={titleDom} open={open} onClose={close} footer={null} width={460} centered>
              {renderContent}
            </Modal>
          }
          wapComponent={
            <Popup title={titleDom} open={open} onClose={close} contentStyle={{ paddingBottom: 30 }} position="bottom">
              {renderContent}
            </Popup>
          }
        />
        <OpenTips />
      </>
    )
  })
)
