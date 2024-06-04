import { FormattedMessage, useIntl } from '@umijs/max'
import { message } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import Button from '@/components/Base/Button'
import InputNumber from '@/components/Base/InputNumber'
import Modal from '@/components/Base/Modal'
import Popup from '@/components/Base/Popup'
import { TRADE_TYPE } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { formatNum } from '@/utils'

import OpenTips from './OpenTipsModal'

type IProps = {
  pendingList?: any[]
}

// 修改挂单
export default observer(
  forwardRef(({ pendingList = [] }: IProps, ref) => {
    const intl = useIntl()
    const [tempItem, setTempItem] = useState<any>({})
    const { ws } = useStores()
    const { symbols } = ws as any
    const [price, setPrice] = useState<any>('')
    const [open, setOpen] = useState(false)

    const [sl, setSl] = useState<any>('') // 止损
    const [sp, setSp] = useState<any>('') // 止盈

    // 获取实时的数据
    const item = pendingList?.find((v: any) => v.order === tempItem.order) || {}

    const close = () => {
      setOpen(false)
      setSl('')
      setSp('')
      setPrice('')
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

    useEffect(() => {
      if (!price) {
        setPrice(item.price) // 开仓价
      }
      if (!sl) {
        setSl(item.sl)
      }
      if (!sp) {
        setSp(item.tp)
      }
    }, [item.sl, item.tp, item.price])

    const symbol = item.symbol
    const symbolInfo = symbols[symbol]
    const d = item.digits
    const step = Math.pow(10, -d) * 10
    const stopl = symbolInfo ? symbolInfo.stopl * Math.pow(10, -d) * 10 : 0
    let sl_scope: any = 0 // 止损范围
    let sp_scope: any = 0 // 止盈范围
    let slProfit: any // 止损-预计盈亏
    let spProfit: any // 止盈-预计盈亏
    const count = item.vol
    const isBuy = item.type === TRADE_TYPE.LIMIT_BUY || item.type === TRADE_TYPE.STOP_LIMIT_BUY
    if (isBuy) {
      sl_scope = (parseFloat(price) - stopl).toFixed(d)
      sp_scope = (parseFloat(price) + stopl).toFixed(d)

      slProfit = price && sl ? ((sl - price) * count * symbolInfo.consize).toFixed(d) : 0
      spProfit = price && sp ? ((sp - price) * count * symbolInfo.consize).toFixed(d) : 0
    } else {
      sp_scope = (parseFloat(price) - stopl).toFixed(d)
      sl_scope = (parseFloat(price) + stopl).toFixed(d)

      slProfit = price && sl ? ((price - sl) * count * symbolInfo.consize).toFixed(d) : 0
      spProfit = price && sp ? ((price - sp) * count * symbolInfo.consize).toFixed(d) : 0
    }
    const price_now = item.currentPrice // 现价
    let priceTip: any = 0
    if (isBuy) {
      //买入挂单
      priceTip =
        item.type === TRADE_TYPE.LIMIT_BUY ? (parseFloat(price_now) - stopl).toFixed(d) : (parseFloat(price_now) + stopl).toFixed(d)
    } else {
      //卖出挂单
      priceTip =
        item.type === TRADE_TYPE.LIMIT_SELL ? (parseFloat(price_now) + stopl).toFixed(d) : (parseFloat(price_now) - stopl).toFixed(d)
    }

    const onFinish = (values: any) => {
      console.log('values', values)
      if (isBuy) {
        if (sl && sl > sl_scope) {
          message.error(intl.formatMessage({ id: 'mt.zhiyingzhisunshezhicuowu' }))
          return
        }
        if (sp && sp < sp_scope) {
          message.error(intl.formatMessage({ id: 'mt.zhiyingzhisunshezhicuowu' }))
          return
        }
      } else {
        if (sl && sl < sl_scope) {
          message.error(intl.formatMessage({ id: 'mt.zhiyingzhisunshezhicuowu' }))
          return
        }
        if (sp && sp > sp_scope) {
          message.error(intl.formatMessage({ id: 'mt.zhiyingzhisunshezhicuowu' }))
          return
        }
      }
      const res = {
        cmd: 'MSG_TYPE.PENDING_MODIFY',
        sl: parseFloat(sl),
        tp: parseFloat(sp),
        ticket: item.order,
        price: parseFloat(price)
      }

      // ws.socket.send(JSON.stringify(res))
      // ws.sendOrderCancellationFn(res)

      // 关闭当前弹窗
      close()
    }

    const renderContent = () => {
      return (
        <>
          <div className="max-xl:px-4">
            <div className="flex flex-col items-center justify-center">
              <div className="flex w-full flex-col pt-3">
                <div className="flex items-center">
                  <img width={24} height={24} alt="" src={`/img/coin-icon/${symbol}.png`} className="rounded-full" />
                  <span className="pl-[6px] text-base font-semibold text-gray">{symbol}</span>
                  <span className={classNames('pl-1 text-sm text-green', isBuy ? 'text-green' : 'text-red')}>
                    · {isBuy ? <FormattedMessage id="mt.mairu" /> : <FormattedMessage id="mt.maichu" />}
                  </span>
                </div>
                <div className="flex w-full items-center pt-2">
                  <div className="flex items-center justify-between">
                    <span className="pr-3 text-sm text-gray-secondary">
                      <FormattedMessage id="common.type" />
                    </span>
                    <span className="text-sm text-gray">
                      {item.type === TRADE_TYPE.LIMIT_BUY || item.type === TRADE_TYPE.LIMIT_SELL ? (
                        <FormattedMessage id="mt.xianjiaguadan" />
                      ) : (
                        <FormattedMessage id="mt.tingsundan" />
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pl-5">
                    <span className="pr-3 text-sm text-gray-secondary">
                      <FormattedMessage id="mt.guadanshoushu" />
                    </span>
                    <span className="text-sm text-gray">
                      {item.vol}
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
                    <>
                      <FormattedMessage id="mt.fanwei" />
                      &nbsp;
                      {item.type === TRADE_TYPE.LIMIT_BUY
                        ? '≤'
                        : item.type === TRADE_TYPE.LIMIT_SELL
                        ? '≥'
                        : item.type === TRADE_TYPE.STOP_LIMIT_BUY
                        ? '≥'
                        : item.type === TRADE_TYPE.STOP_LIMIT_SELL
                        ? '≤'
                        : null}{' '}
                      {priceTip}
                    </>
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
                    <>
                      <span className="font-num">
                        <FormattedMessage id="mt.fanwei" />
                        &nbsp;
                        {isBuy ? '≤' : '≥'}&nbsp;
                        {formatNum(sl_scope)} USD
                      </span>
                      <span className="pl-1 font-num">
                        <FormattedMessage id="mt.yujiyingkui" />
                        &nbsp;
                        {formatNum(slProfit)} USD
                      </span>
                    </>
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
                    <span className="font-num">
                      <FormattedMessage id="mt.fanwei" />
                      &nbsp; {isBuy ? '≥' : '≤'} {formatNum(sp_scope)} USD <FormattedMessage id="mt.yujiyingkui" />
                      &nbsp; {formatNum(spProfit)} USD
                    </span>
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <Button
                block
                onClick={onFinish}
                className={classNames({
                  'pointer-events-none !bg-gray-250': !price
                })}
                type="primary"
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
