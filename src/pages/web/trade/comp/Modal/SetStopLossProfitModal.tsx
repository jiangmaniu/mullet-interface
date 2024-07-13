import { FormattedMessage, useIntl } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import Button from '@/components/Base/Button'
import InputNumber from '@/components/Base/InputNumber'
import Modal from '@/components/Base/Modal'
import Popup from '@/components/Base/Popup'
import { TRADE_BUY_SELL } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { formatNum } from '@/utils'
import { getBuySellInfo, getSymbolIcon } from '@/utils/business'
import { message } from '@/utils/message'
import { getCurrentQuote } from '@/utils/wsUtil'

import { IPositionItem } from '../TradeRecord/comp/PositionList'

type IProps = {
  list: IPositionItem[]
}

// 设置止盈止损
export default observer(
  forwardRef(({ list = [] }: IProps, ref) => {
    const intl = useIntl()
    const [tempItem, setTempItem] = useState({} as IPositionItem)
    const { ws, trade } = useStores()
    const { symbols, quotes } = ws as any
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const unit = 'USD'
    const [sl, setSl] = useState<any>('') // 止损
    const [sp, setSp] = useState<any>('') // 止盈

    const item = (list.find((v) => v.id === tempItem.id) || {}) as IPositionItem // 获取的是最新实时变化的
    const buySellInfo = getBuySellInfo(item)
    const isBuy = item.buySell === TRADE_BUY_SELL.BUY

    useEffect(() => {
      if (!sl) {
        setSl(Number(item.stopLoss || 0))
      }
      if (!sp) {
        setSp(Number(item.takeProfit || 0))
      }
    }, [item.stopLoss, item.takeProfit])

    const close = () => {
      setOpen(false)
      setSl('')
      setSp('')
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

    const symbol = item.symbol
    const quote = getCurrentQuote(symbol)
    const consize = quote.consize
    const bid = quote.bid
    const ask = quote.ask
    const d = item.symbolDecimal
    const step = Math.pow(10, -d) * 10
    // const stopl = symbolInfo ? symbolInfo.stopl * Math.pow(10, -d) * 10 : 0
    const symbolConf = quote.symbolConf
    const stopl = Number(symbolConf?.limitStopLevel || 1) * Math.pow(10, -d)
    let sl_scope: any = 0 // 止损范围
    let sp_scope: any = 0 // 止盈范围
    let slProfit: any // 止损-预计盈亏
    let spProfit: any // 止盈-预计盈亏
    const count: any = item.orderVolume
    const price: any = Number(item.currentPrice || 0)
    if (isBuy) {
      sl_scope = (price - stopl).toFixed(d)
      sp_scope = (price + stopl).toFixed(d)

      slProfit = sl ? ((sl - bid) * count * consize).toFixed(d) : 0
      spProfit = sp ? ((sp - bid) * count * consize).toFixed(d) : 0
    } else {
      sl_scope = (price + stopl).toFixed(d)
      sp_scope = (price - stopl).toFixed(d)

      slProfit = sl ? ((ask - sl) * count * consize).toFixed(d) : 0
      spProfit = sp ? ((ask - sp) * count * consize).toFixed(d) : 0
    }

    const onFinish = async () => {
      const msg = intl.formatMessage({ id: 'mt.zhiyingzhisunshezhicuowu' })

      const slFlag = isBuy ? sl && sl > sl_scope : sl && sl < sl_scope
      if (slFlag) {
        message.info(msg)
        setSl(item.stopLoss)
        return
      }
      const spFlag = isBuy ? sp && sp < sp_scope : sp && sp > sp_scope
      if (spFlag) {
        message.info(msg)
        setSp(item.takeProfit)
        return
      }

      const params = {
        bagOrderId: item.id,
        stopLoss: sl ? parseFloat(sl) : undefined,
        takeProfit: sp ? parseFloat(sp) : undefined
      } as Order.ModifyStopProfitLossParams

      console.log('参数', params)

      setLoading(true)
      const res = await trade.modifyStopProfitLoss(params).finally(() => {
        setLoading(false)
      })

      if (res.success) {
        close()
      }
    }

    const renderContent = () => {
      return (
        <>
          <div className="flex flex-col items-center justify-center">
            <div className="flex w-full flex-col pt-3">
              <div className="flex items-center justify-between max-xl:flex-col max-xl:items-start">
                <div className="flex items-center">
                  <img width={24} height={24} alt="" src={getSymbolIcon(item.imgUrl)} className="rounded-full border border-gray-90" />
                  <span className="pl-[6px] text-base font-semibold text-gray">{symbol}</span>
                  <span className={classNames('pl-1 text-sm', buySellInfo.colorClassName)}>· {buySellInfo.text}</span>
                </div>
                <div className="flex items-end justify-center flex-col">
                  <span className="text-sm text-gray">
                    {item.orderVolume}
                    <FormattedMessage id="mt.lot" />
                  </span>
                  <span className="text-sm text-gray-secondary">
                    <FormattedMessage id="mt.kaicangshoushu" />
                  </span>
                </div>
              </div>
              <div className="absolute left-0 top-[130px] w-full border border-dashed border-gray-250/70 xl:hidden"></div>
              <div className="my-3 xl:hidden"></div>
              <div className="flex w-full items-center pt-2">
                <div className="flex items-center max-xl:pt-2 xl:pl-4">
                  <span className="pr-3 text-sm text-gray-secondary">
                    <FormattedMessage id="mt.dangqianjiage" />
                  </span>
                  <span className="text-sm text-gray">
                    {item.currentPrice} {unit}
                  </span>
                </div>
                <div className="flex items-center justify-between pl-7">
                  <span className="pr-3 text-sm text-gray-secondary">
                    <FormattedMessage id="mt.guadanjiage" />
                  </span>
                  <span className="text-sm text-gray">
                    {item.startPrice} {unit}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-center pt-5">
              <InputNumber
                autoFocus={false}
                label={intl.formatMessage({ id: 'mt.zhisun' })}
                placeholder={intl.formatMessage({ id: 'mt.zhisun' })}
                rootClassName="!z-30"
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
                  <>
                    <span className="!font-dingpro-regular">
                      <FormattedMessage id="mt.fanwei" />
                      &nbsp;
                      {isBuy ? '≤' : '≥'}&nbsp;
                      {formatNum(sl_scope)} USD
                    </span>
                    <span className="pl-1 !font-dingpro-regular">
                      <FormattedMessage id="mt.yujiyingkui" />
                      &nbsp;
                      {formatNum(slProfit)} USD
                    </span>
                  </>
                }
              />
              <InputNumber
                autoFocus={false}
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
                  <span className="!font-dingpro-regular">
                    <FormattedMessage id="mt.fanwei" />
                    &nbsp; {isBuy ? '≥' : '≤'} {formatNum(sp_scope)} USD <FormattedMessage id="mt.yujiyingkui" />
                    &nbsp;
                    {formatNum(spProfit)} USD
                  </span>
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <Button block onClick={onFinish} type="primary" loading={loading}>
              <FormattedMessage id="common.queren" />
            </Button>
          </div>
        </>
      )
    }

    const titleDom = <FormattedMessage id="mt.zhiyingzhisun" />

    // 避免重复渲染
    if (!open) return

    return (
      <SwitchPcOrWapLayout
        pcComponent={
          <Modal open={open} onClose={close} title={titleDom} footer={null} width={460} centered>
            {renderContent()}
          </Modal>
        }
        wapComponent={
          <Popup open={open} onClose={close} contentStyle={{ paddingBottom: 30 }} title={titleDom} position="bottom">
            <div className="px-5">{renderContent()}</div>
          </Popup>
        }
      />
    )
  })
)
