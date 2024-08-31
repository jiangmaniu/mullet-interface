import { FormattedMessage, useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import Button from '@/components/Base/Button'
import InputNumber from '@/components/Base/InputNumber'
import Modal from '@/components/Base/Modal'
import Popup from '@/components/Base/Popup'
import SymbolIcon from '@/components/Base/SymbolIcon'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'
import { message } from '@/utils/message'
import { calcExchangeRate, getCurrentQuote } from '@/utils/wsUtil'

import { IPendingItem } from '../TradeRecord/comp/PendingList'
import OpenTips from './OpenTipsModal'

type IProps = {
  list: IPendingItem[]
}

// 修改挂单
export default observer(
  forwardRef(({ list = [] }: IProps, ref) => {
    const intl = useIntl()
    const [tempItem, setTempItem] = useState({} as IPendingItem)
    const { ws, trade } = useStores()
    const [price, setPrice] = useState<any>('')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const [sl, setSl] = useState<any>('') // 止损
    const [sp, setSp] = useState<any>('') // 止盈

    const item = (list.find((v) => v.id === tempItem.id) || {}) as IPendingItem // 获取的是最新实时变化的

    const close = () => {
      setOpen(false)
      setSl('')
      setSp('')
      setPrice('')
      setTempItem({} as IPendingItem)
    }

    const show = (item: IPendingItem) => {
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

    useEffect(() => {
      if (!price) {
        setPrice(item.limitPrice) // 挂单价
      }
      if (!sl) {
        setSl(Number(item.stopLoss || 0))
      }
      if (!sp) {
        setSp(Number(item.takeProfit || 0))
      }
    }, [item.limitPrice, item.stopLoss, item.takeProfit])

    const symbol = item.symbol
    const dataSourceSymbol = item?.dataSourceSymbol
    const quoteInfo = getCurrentQuote(dataSourceSymbol)
    const symbolConf = item?.conf
    const consize = quoteInfo?.consize
    const d = quoteInfo.digits
    const step = Math.pow(10, -d) * 10
    const stopl = Number(item?.conf?.limitStopLevel || 1) * Math.pow(10, -d)
    let sl_scope: any = 0 // 止损范围
    let sp_scope: any = 0 // 止盈范围
    let slProfit: any // 止损-预计盈亏
    let spProfit: any // 止盈-预计盈亏
    const count = item.orderVolume || 0 // 手数
    const isBuy = item.buySell === 'BUY'
    if (isBuy) {
      sl_scope = (parseFloat(price) - stopl).toFixed(d)
      sp_scope = (parseFloat(price) + stopl).toFixed(d)

      slProfit = price && sl ? ((sl - price) * count * consize).toFixed(d) : 0
      spProfit = price && sp ? ((sp - price) * count * consize).toFixed(d) : 0
    } else {
      sp_scope = (parseFloat(price) - stopl).toFixed(d)
      sl_scope = (parseFloat(price) + stopl).toFixed(d)

      slProfit = price && sl ? ((price - sl) * count * consize).toFixed(d) : 0
      spProfit = price && sp ? ((price - sp) * count * consize).toFixed(d) : 0
    }
    const price_now = Number(item.currentPrice || 0) // 现价
    let priceTip: any = 0
    if (isBuy) {
      //买入挂单: 限价买入、停损买入
      priceTip = item.type === 'LIMIT_BUY_ORDER' ? (price_now - stopl).toFixed(d) : (price_now + stopl).toFixed(d)
    } else {
      //卖出挂单：限价卖出、停损卖出
      priceTip = item.type === 'LIMIT_SELL_ORDER' ? (price_now + stopl).toFixed(d) : (price_now - stopl).toFixed(d)
    }

    const onFinish = async (values: any) => {
      console.log('values', values)
      const msg = intl.formatMessage({ id: 'mt.zhiyingzhisunshezhicuowu' })

      const slFlag = isBuy ? sl && sl > sl_scope : sl && sl < sl_scope

      if (slFlag) {
        message.info(msg)
        return
      }
      const spFlag = isBuy ? sp && sp < sp_scope : sp && sp > sp_scope
      if (spFlag) {
        message.info(msg)
        return
      }

      const params = {
        orderId: item.id,
        stopLoss: parseFloat(sl),
        takeProfit: parseFloat(sp),
        limitPrice: parseFloat(price)
      } as Order.UpdatePendingOrderParams

      console.log('参数', params)

      setLoading(true)
      const res = await trade.modifyPendingOrder(params).finally(() => {
        setLoading(false)
      })

      if (res.success) {
        // 关闭当前弹窗
        close()
      }
    }

    // 禁用交易按钮
    const disabledBtn = isBuy
      ? (sp && sp < sp_scope) || (sl && sl > sl_scope) || (price && price < priceTip)
      : (sp && sp > sp_scope) || (sl && sl < sl_scope) || (price && price > priceTip)

    const renderContent = () => {
      return (
        <>
          <div className="max-xl:px-4">
            <div className="flex flex-col items-center justify-center">
              <div className="flex w-full flex-col pt-3">
                <div className="flex items-center">
                  <SymbolIcon src={item?.imgUrl} width={24} height={24} />
                  <span className="pl-[6px] text-base font-semibold text-primary">{symbol}</span>
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
              <div className="flex w-full flex-col items-center pt-5">
                <InputNumber
                  label={<FormattedMessage id="mt.jiage" />}
                  placeholder={intl.formatMessage({ id: 'mt.shurujiage' })}
                  rootClassName="!z-40"
                  className="h-[38px]"
                  classNames={{ input: 'text-center', tips: '!top-[56px] pt-3' }}
                  value={price}
                  onChange={(value) => {
                    setPrice(value)
                  }}
                  onAdd={() => {
                    if (price) {
                      const c = (((parseFloat(price) + step) * 100) / 100).toFixed(d)
                      setPrice(c)
                    } else {
                      setPrice(priceTip)
                    }
                  }}
                  onMinus={() => {
                    if (price) {
                      const c = (((parseFloat(price) - step) * 100) / 100).toFixed(d)
                      setPrice(c)
                    } else {
                      setPrice(priceTip)
                    }
                  }}
                  tips={
                    <div
                      className={cn('!font-dingpro-regular', {
                        '!text-red': isBuy ? price && price < priceTip : price && price > priceTip
                      })}
                    >
                      <FormattedMessage id="mt.fanwei" />
                      &nbsp;
                      {item.type === 'LIMIT_BUY_ORDER'
                        ? '≤'
                        : item.type === 'LIMIT_SELL_ORDER'
                        ? '≥'
                        : item.type === 'STOP_LOSS_LIMIT_BUY_ORDER'
                        ? '≥'
                        : item.type === 'STOP_LOSS_LIMIT_SELL_ORDER'
                        ? '≤'
                        : null}{' '}
                      {priceTip}
                    </div>
                  }
                />
                <InputNumber
                  label={intl.formatMessage({ id: 'mt.zhisun' })}
                  placeholder={intl.formatMessage({ id: 'mt.zhisun' })}
                  rootClassName="!z-30 mt-4"
                  className="h-[38px]"
                  classNames={{ input: 'text-center', tips: '!top-[56px] pt-3' }}
                  value={sl}
                  onChange={(value) => {
                    setSl(value)
                  }}
                  onAdd={() => {
                    if (sl && sl > 0.01) {
                      const c = (((parseFloat(sl) + step) * 100) / 100).toFixed(d)
                      setSl(c)
                    } else {
                      setSl(sl_scope)
                    }
                  }}
                  onMinus={() => {
                    if (sl && sl > 0.01) {
                      const c = (((parseFloat(sl) - step) * 100) / 100).toFixed(d)
                      setSl(c)
                    } else {
                      setSl(sl_scope)
                    }
                  }}
                  tips={
                    <div className={cn('!font-dingpro-regular', { '!text-red': isBuy ? sl && sl > sl_scope : sl && sl < sl_scope })}>
                      <span>
                        <FormattedMessage id="mt.fanwei" />
                        &nbsp;
                        {isBuy ? '≤' : '≥'}&nbsp;
                        {formatNum(sl_scope)} USD
                      </span>
                      <span className="pl-1 !font-dingpro-regular">
                        <FormattedMessage id="mt.yujiyingkui" />
                        &nbsp;
                        {formatNum(
                          calcExchangeRate({
                            value: slProfit,
                            unit: symbolConf?.profitCurrency,
                            buySell: item.buySell
                          })
                        )}{' '}
                        USD
                      </span>
                    </div>
                  }
                />
                <InputNumber
                  label={intl.formatMessage({ id: 'mt.zhiying' })}
                  placeholder={intl.formatMessage({ id: 'mt.zhiying' })}
                  className="h-[38px]"
                  rootClassName="!z-20 mt-4"
                  classNames={{ input: 'text-center', tips: '!top-[56px] pt-3' }}
                  value={sp}
                  onChange={(value) => {
                    setSp(value)
                  }}
                  onAdd={() => {
                    if (sp && sp > 0.01) {
                      const c = (((parseFloat(sp) + step) * 100) / 100).toFixed(d)
                      setSp(c)
                    } else {
                      setSp(sp_scope)
                    }
                  }}
                  onMinus={() => {
                    if (sp && sp > 0.01) {
                      const c = (((parseFloat(sp) - step) * 100) / 100).toFixed(d)
                      setSp(c)
                    } else {
                      setSp(sp_scope)
                    }
                  }}
                  tips={
                    <span className={cn('!font-dingpro-regular', { '!text-red': isBuy ? sp && sp < sp_scope : sp && sp > sp_scope })}>
                      <FormattedMessage id="mt.fanwei" />
                      &nbsp; {isBuy ? '≥' : '≤'} {formatNum(sp_scope)} USD <FormattedMessage id="mt.yujiyingkui" />
                      &nbsp;{' '}
                      {formatNum(
                        calcExchangeRate({
                          value: spProfit,
                          unit: symbolConf?.profitCurrency,
                          buySell: item.buySell
                        })
                      )}{' '}
                      USD
                    </span>
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <Button
                block
                onClick={onFinish}
                className={cn({
                  'pointer-events-none !bg-gray-250': !price
                })}
                type="primary"
                loading={loading}
                disabled={disabledBtn}
              >
                <FormattedMessage id="common.queren" />
              </Button>
            </div>
          </div>
        </>
      )
    }

    const titleDom = <FormattedMessage id="mt.xiugaiguadan" />

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
              {renderContent()}
            </Popup>
          }
        />
        <OpenTips />
      </>
    )
  })
)
