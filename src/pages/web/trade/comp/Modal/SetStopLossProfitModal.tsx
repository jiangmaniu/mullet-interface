import { FormattedMessage, useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import Button from '@/components/Base/Button'
import InputNumber from '@/components/Base/InputNumber'
import Modal from '@/components/Base/Modal'
import Popup from '@/components/Base/Popup'
import SymbolIcon from '@/components/Base/SymbolIcon'
import { TRADE_BUY_SELL } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { formatNum } from '@/utils'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/utils/cn'
import { message } from '@/utils/message'
import { calcExchangeRate, getCurrentQuote } from '@/utils/wsUtil'

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
    // const step = Math.pow(10, -d) * 10
    // 根据品种小数点位数计算步长，独立于手数步长step。获取计算的小数位倒数第二位开始作为累加步长
    // 限价、止盈止损、停损挂单，加减时，连动报价小数位倒数第二位
    const step = Math.pow(10, -(d - 1)) || Math.pow(10, -d) * 10
    // const stopl = symbolInfo ? symbolInfo.stopl * Math.pow(10, -d) * 10 : 0
    const symbolConf = item?.conf
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

      slProfit = sl ? ((sl - ask) * count * consize).toFixed(d) : 0
      spProfit = sp ? ((sp - ask) * count * consize).toFixed(d) : 0
    } else {
      sl_scope = (price + stopl).toFixed(d)
      sp_scope = (price - stopl).toFixed(d)

      slProfit = sl ? ((bid - sl) * count * consize).toFixed(d) : 0
      spProfit = sp ? ((bid - sp) * count * consize).toFixed(d) : 0
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

    // 禁用交易按钮
    const disabledBtn = isBuy ? (sp && sp < sp_scope) || (sl && sl > sl_scope) : (sp && sp > sp_scope) || (sl && sl < sl_scope)

    const renderContent = () => {
      return (
        <>
          <div className="flex flex-col items-center justify-center">
            <div className="flex w-full flex-col pt-3">
              <div className="flex items-center justify-between max-xl:flex-col max-xl:items-start">
                <div className="flex items-center">
                  <SymbolIcon src={item?.imgUrl} width={24} height={24} />
                  <span className="pl-[6px] text-base font-semibold text-primary">{symbol}</span>
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
              <div className="absolute left-0 top-[130px] w-full border border-dashed border-gray-250/70 dark:border-gray-610 xl:hidden"></div>
              <div className="my-3 xl:hidden"></div>
              <div className="flex w-full items-center pt-2">
                <div className="flex items-center max-xl:pt-2 xl:pl-4">
                  <span className="pr-3 text-sm text-secondary">
                    <FormattedMessage id="mt.dangqianjiage" />
                  </span>
                  <span className="text-sm text-primary">
                    {item.currentPrice} {unit}
                  </span>
                </div>
                <div className="flex items-center justify-between pl-7">
                  <span className="pr-3 text-sm text-secondary">
                    <FormattedMessage id="mt.kaicangjunjia" />
                  </span>
                  <span className="text-sm text-primary">
                    {item.startPrice} {unit}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-center pt-5">
              <InputNumber
                autoFocus={false}
                showFloatTips={false}
                label={intl.formatMessage({ id: 'mt.zhiying' })}
                placeholder={intl.formatMessage({ id: 'mt.zhiying' })}
                className="h-[38px]"
                rootClassName="!z-20"
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
                    &nbsp;
                    {formatNum(
                      calcExchangeRate({
                        value: spProfit,
                        unit: symbolConf?.profitCurrency,
                        buySell: item.buySell
                      }),
                      trade.currentAccountInfo.currencyDecimal
                    )}{' '}
                    USD
                  </span>
                }
              />
              <InputNumber
                autoFocus={false}
                showFloatTips={false}
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
                    <span className="!font-dingpro-regular">
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
                        }),
                        trade.currentAccountInfo.currencyDecimal
                      )}{' '}
                      USD
                    </span>
                  </div>
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <Button block onClick={onFinish} type="primary" loading={loading} disabled={disabledBtn}>
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
