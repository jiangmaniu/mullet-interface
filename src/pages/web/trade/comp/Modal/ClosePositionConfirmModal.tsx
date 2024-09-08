import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import Button from '@/components/Base/Button'
import InputNumber from '@/components/Base/InputNumber'
import Modal from '@/components/Base/Modal'
import Popup from '@/components/Base/Popup'
import SymbolIcon from '@/components/Base/SymbolIcon'
import Slider from '@/components/Web/Slider'
import { ORDER_TYPE, TRADE_BUY_SELL } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { toFixed } from '@/utils'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/utils/cn'
import { message } from '@/utils/message'
import { getCurrentQuote } from '@/utils/wsUtil'

import { IPositionItem } from '../TradeRecord/comp/PositionList'

type IProps = {
  list: IPositionItem[]
}

// 平仓操作弹窗
export default observer(
  forwardRef(({ list = [] }: IProps, ref) => {
    const intl = useIntl()
    const { ws, global, trade } = useStores()
    const { fetchUserInfo } = useModel('user')
    const [count, setCount] = useState<any>('')
    const [open, setOpen] = useState(false)
    const [tempItem, setTempItem] = useState({} as IPositionItem)
    const [sliderValue, setSliderValue] = useState(0)
    const [submitLoading, setSubmitLoading] = useState(false)
    const unit = 'USD'
    const item = (list.find((v) => v.id === tempItem.id) || {}) as IPositionItem // 获取的是最新实时变化的
    const symbol = item.symbol
    const orderVolume = Number(item.orderVolume || 0) // 手数
    const conf = item?.conf as Symbol.SymbolConf
    const vmin = conf?.minTrade || 0.01

    const buySellInfo = getBuySellInfo(item)

    const quote = getCurrentQuote(symbol)

    useEffect(() => {
      setCount(orderVolume)
    }, [orderVolume])

    const close = () => {
      setOpen(false)
      setTempItem({} as IPositionItem)
    }

    const show = (item: any) => {
      setOpen(true)
      setTempItem(item)
    }

    // 对外暴露接口
    useImperativeHandle(ref, () => {
      return {
        show,
        close
      }
    })

    const onFinish = async () => {
      const reg = /^\d+(\.\d{0,2})?$/
      if (!count) return message.info(intl.formatMessage({ id: 'common.qingshuru' }))
      if (!reg.test(count)) {
        message.info(intl.formatMessage({ id: 'mt.shoushushuruyouwu' }))
        return
      }
      if (count > orderVolume) {
        message.info(intl.formatMessage({ id: 'mt.shoushushuruyouwu' }))
        return
      }
      if (count < 0.01) {
        message.info(intl.formatMessage({ id: 'mt.zuixiaopingcangshoushuwei0.01shou' }))
        return
      }
      // 平仓下一个反方向的单
      const params = {
        symbol,
        buySell: item.buySell === TRADE_BUY_SELL.BUY ? TRADE_BUY_SELL.SELL : TRADE_BUY_SELL.BUY, // 订单方向
        orderVolume: count,
        tradeAccountId: item.tradeAccountId,
        executeOrderId: item.id, // 持仓单号
        type: ORDER_TYPE.MARKET_ORDER // 订单类型
      } as Order.CreateOrder

      setSubmitLoading(true)
      const res = await trade.createOrder(params).finally(() => {
        setSubmitLoading(false)
      })

      if (res.success) {
        // 关闭弹窗
        close()

        // 更新账户余额信息
        fetchUserInfo()
      }
    }

    useEffect(() => {
      setSliderValue((count / orderVolume) * 100)
    }, [count])

    const renderContent = () => {
      return (
        <>
          <div className="flex flex-col items-center justify-center">
            <div className="flex w-full items-center justify-between pt-3">
              <div className="flex items-center">
                <SymbolIcon src={item.imgUrl} />
                <span className="pl-[6px] text-base font-semibold text-primary">{symbol}</span>
                <span className={cn('pl-1 text-sm', buySellInfo.colorClassName)}>· {buySellInfo.text}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className={cn('pb-2 text-lg font-bold', Number(item?.profit) > 0 ? 'text-green' : 'text-red')}>
                  {item.profitFormat} {unit}
                </span>
                <span className="text-xs text-secondary">
                  <FormattedMessage id="mt.fudongyingkui" />
                </span>
              </div>
            </div>
            <div className="absolute left-0 top-[130px] w-full border border-dashed border-gray-250/70"></div>
            <div className="my-4"></div>
            <div className="flex w-full items-center">
              <div className="flex items-center justify-between">
                <span className="pr-3 text-sm text-secondary">
                  <FormattedMessage id="mt.kaicangjiage" />
                </span>
                <span className="text-sm text-primary">
                  {item.startPrice} {unit}
                </span>
              </div>
              <div className="flex items-center justify-between pl-5">
                <span className="pr-3 text-sm text-secondary">
                  <FormattedMessage id="mt.pingcangjiage" />
                </span>
                <span className={cn('text-sm', quote?.bidDiff > 0 ? 'text-green' : 'text-red')}>
                  {item.currentPrice}&nbsp;{unit}
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col items-center pt-5">
              <InputNumber
                showFloatTips={false}
                placeholder={intl.formatMessage({ id: 'mt.pingcangshoushu' })}
                className="h-[38px]"
                classNames={{ input: 'text-center' }}
                value={count}
                onChange={(value) => {
                  if (value > orderVolume) return
                  setCount(value)
                }}
                onAdd={() => {
                  if (count >= orderVolume) return
                  const c = (Number(count) + 0.01).toFixed(2)
                  setCount(c)
                }}
                onMinus={() => {
                  if (count <= 0.01) return
                  const c = (Number(count) - 0.01).toFixed(2)
                  setCount(c)
                }}
                max={orderVolume}
                min={0.01}
              />
              <div className="my-2 w-full">
                <Slider
                  onChange={(value: any) => {
                    // 可平仓手数*百分比
                    const vol = toFixed((value / 100) * orderVolume, 2)
                    // 不能小于最小手数
                    setCount(vol < vmin ? vmin : vol)
                    setSliderValue(value)
                  }}
                  // value={Number((count / orderVolume) * 100)}
                  value={sliderValue}
                />
              </div>
              <div className="flex items-center pt-2">
                <span className="text-xs text-secondary">
                  <FormattedMessage id="mt.kepingcangshoushu" />
                </span>
                <span className="pl-3 text-xs text-primary">
                  {orderVolume}
                  <FormattedMessage id="mt.lot" />
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 pt-4 max-xl:pt-8">
            <Button className="!w-[45%]" onClick={close}>
              <FormattedMessage id="common.cancel" />
            </Button>
            <Button
              className={cn('flex-1', { 'pointer-events-none !bg-gray-250': !count })}
              onClick={onFinish}
              type="primary"
              loading={submitLoading}
            >
              <FormattedMessage id="mt.quedingpingcang" />
            </Button>
          </div>
        </>
      )
    }

    const titleDom = <FormattedMessage id="mt.pingcang" />

    // 避免重复渲染
    if (!open) return

    return (
      <>
        <SwitchPcOrWapLayout
          pcComponent={
            <Modal title={titleDom} open={open} onClose={close} footer={null} width={460} centered>
              {renderContent()}
            </Modal>
          }
          wapComponent={
            <Popup title={titleDom} open={open} onClose={close} contentStyle={{ paddingBottom: 30 }} position="bottom">
              <div className="px-5">{renderContent()}</div>
            </Popup>
          }
        />
      </>
    )
  })
)
