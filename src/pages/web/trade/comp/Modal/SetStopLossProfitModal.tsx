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
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/utils/cn'
import { message } from '@/utils/message'

import SetSpSl from '../BuyAndSell/comp/OrderItem/SetSpSl'
import { IPositionItem } from '../TradeRecord/comp/PositionList'
import CurrentPrice from '../TradeRecord/comp/PositionList/comp/CurrentPrice'

const ConfirmButton = observer(({ item, close }: { item: IPositionItem; close: () => void }) => {
  const intl = useIntl()
  const { trade } = useStores()
  const [loading, setLoading] = useState(false)
  const { setSl, setSp, slFlag, spFlag, takeProfit, stopLoss, disabledBtnByCondition } = useTrade({ marketItem: item })

  const onFinish = useCallback(async () => {
    const msg = intl.formatMessage({ id: 'mt.zhiyingzhisunshezhicuowu' })

    if (slFlag) {
      message.info(msg)
      setSl(item.stopLoss)
      return
    }
    if (spFlag) {
      message.info(msg)
      setSp(item.takeProfit)
      return
    }

    const params = {
      bagOrderId: item.id,
      stopLoss: stopLoss ? Number(stopLoss) : undefined,
      takeProfit: takeProfit ? Number(takeProfit) : undefined
    } as Order.ModifyStopProfitLossParams

    console.log('设置市价单止盈止损参数', params)

    setLoading(true)
    const res = await trade.modifyStopProfitLoss(params).finally(() => {
      setLoading(false)
    })

    if (res.success) {
      close()
    }
  }, [stopLoss, takeProfit, item, spFlag, slFlag])

  return (
    <Button block onClick={onFinish} type="primary" loading={loading} disabled={disabledBtnByCondition}>
      <FormattedMessage id="common.queren" />
    </Button>
  )
})

// 设置止盈止损
export default observer(
  forwardRef((props, ref) => {
    const intl = useIntl()
    const [item, setItem] = useState({} as IPositionItem)
    const { ws, trade } = useStores()
    const [open, setOpen] = useState(false)

    const buySellInfo = getBuySellInfo(item)

    const close = useCallback(() => {
      setOpen(false)
      setItem({} as IPositionItem)
      trade.resetTradeAction()
      trade.setRecordModalItem({} as RecordModalItem)
    }, [])

    const show = useCallback((item: any) => {
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
      return (
        <>
          <div className="flex flex-col items-center justify-center">
            <div className="flex w-full flex-col pt-3">
              <div className="flex items-center justify-between max-xl:flex-col max-xl:items-start">
                <div className="flex items-center">
                  <SymbolIcon src={item?.imgUrl} width={24} height={24} />
                  <span className="pl-[6px] text-base font-semibold text-primary">{item.alias || item.symbol}</span>
                  <span className={cn('pl-1 text-sm', buySellInfo.colorClassName)}>· {buySellInfo.text}</span>
                </div>
                <div className="flex items-end justify-center flex-col">
                  <span className="text-sm text-primary">
                    {item.orderVolume}
                    <FormattedMessage id="mt.lot" />
                  </span>
                  <span className="text-sm text-secondary">
                    <FormattedMessage id="mt.kaicangshoushu" />
                  </span>
                </div>
              </div>
              <div className="absolute left-0 top-[130px] w-full border border-dashed border-gray-50 dark:border-gray-610 xl:hidden"></div>
              <div className="my-3 xl:hidden"></div>
              <div className="flex w-full items-center pt-2">
                <div className="flex items-center max-xl:pt-2">
                  <span className="pr-3 text-sm text-secondary">
                    <FormattedMessage id="mt.dangqianjiage" />
                  </span>
                  <span className="text-sm text-primary">
                    <CurrentPrice item={item} />
                  </span>
                </div>
                <div className="flex items-center justify-between pl-7">
                  <span className="pr-3 text-sm text-secondary">
                    <FormattedMessage id="mt.kaicangjunjia" />
                  </span>
                  <span className="text-sm text-primary">{item.startPrice}</span>
                </div>
              </div>
            </div>
            <div className="w-full pt-5">
              <SetSpSl showLabel />
            </div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <ConfirmButton item={item} close={close} />
          </div>
        </>
      )
    }, [item, buySellInfo, close])

    const titleDom = <FormattedMessage id="mt.zhiyingzhisun" />

    // 避免重复渲染
    if (!open) return

    return (
      <SwitchPcOrWapLayout
        pcComponent={
          <Modal open={open} onClose={close} title={titleDom} footer={null} width={500} centered>
            {renderContent}
          </Modal>
        }
        wapComponent={
          <Popup open={open} onClose={close} contentStyle={{ paddingBottom: 30 }} title={titleDom} position="bottom">
            <div className="px-5">{renderContent}</div>
          </Popup>
        }
      />
    )
  })
)
