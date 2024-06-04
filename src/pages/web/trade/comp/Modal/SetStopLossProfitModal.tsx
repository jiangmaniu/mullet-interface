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

type IProps = {
  tradeList?: any[]
}

// 设置止盈止损
export default observer(
  forwardRef(({ tradeList = [] }: IProps, ref) => {
    const intl = useIntl()
    const [tempItem, setTempItem] = useState<any>({})
    const { ws } = useStores()
    const { symbols, quotes } = ws as any
    const [open, setOpen] = useState(false)

    const unit = 'USD'
    const [sl, setSl] = useState<any>('') // 止损
    const [sp, setSp] = useState<any>('') // 止盈

    // 获取实时的数据
    const item = tradeList.find((v) => v.position === tempItem.position) || {}

    useEffect(() => {
      if (!sl) {
        setSl(item.sl)
      }
      if (!sp) {
        setSp(item.tp)
      }
    }, [item.sl, item.tp])

    const close = () => {
      setOpen(false)
      setSl('')
      setSp('')
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
    const symbolInfo = symbols[symbol]
    const quote = quotes[symbol]
    const d = item.digits
    const step = Math.pow(10, -d) * 10
    const stopl = symbolInfo ? symbolInfo.stopl * Math.pow(10, -d) * 10 : 0
    let sl_scope: any = 0 // 止损范围
    let sp_scope: any = 0 // 止盈范围
    let slProfit: any // 止损-预计盈亏
    let spProfit: any // 止盈-预计盈亏
    const count: any = item.number
    const price: any = parseFloat(item.currentPrice) || 0
    if (item.action === TRADE_TYPE.MARKET_BUY) {
      sl_scope = (price - stopl).toFixed(d)
      sp_scope = (price + stopl).toFixed(d)

      slProfit = sl ? ((sl - quote?.bid) * count * symbolInfo?.consize).toFixed(d) : 0
      spProfit = sp ? ((sp - quote?.bid) * count * symbolInfo?.consize).toFixed(d) : 0
    } else {
      sl_scope = (price + stopl).toFixed(d)
      sp_scope = (price - stopl).toFixed(d)

      slProfit = sl ? ((quote?.ask - sl) * count * symbolInfo?.consize).toFixed(d) : 0
      spProfit = sp ? ((quote?.ask - sp) * count * symbolInfo?.consize).toFixed(d) : 0
    }

    const onFinish = () => {
      // 1卖出，0买入
      if (item.action === TRADE_TYPE.MARKET_BUY) {
        if (sl && sl > sl_scope) {
          setSl(item.sl)
          message.error(intl.formatMessage({ id: 'mt.zhiyingzhisunshezhicuowu' }))
          return
        }
        if (sp && sp < sp_scope) {
          setSp(item.sp)
          message.error(intl.formatMessage({ id: 'mt.zhiyingzhisunshezhicuowu' }))
          return
        }
      } else {
        if (sl && sl < sl_scope) {
          setSl(item.sl)
          message.error(intl.formatMessage({ id: 'mt.zhiyingzhisunshezhicuowu' }))
          return
        }
        if (sp && sp > sp_scope) {
          setSp(item.sp)
          message.error(intl.formatMessage({ id: 'mt.zhiyingzhisunshezhicuowu' }))
          return
        }
      }

      const res = {
        cmd: 'MSG_TYPE.POSITION_MODIFY',
        sl: sl ? parseFloat(sl) : 0,
        tp: sp ? parseFloat(sp) : 0,
        ticket: item.position
      }

      console.log('参数', res)

      // ws.socket.send(JSON.stringify(res))
      // ws.sendPositionModification(res)

      close()
    }

    const renderContent = () => {
      return (
        <>
          <div className="flex flex-col items-center justify-center">
            <div className="flex w-full flex-col pt-3">
              <div className="flex items-center justify-between max-xl:flex-col max-xl:items-start">
                <div className="flex items-center">
                  <img width={24} height={24} alt="" src={`/img/coin-icon/${symbol}.png`} className="rounded-full" />
                  <span className="pl-[6px] text-base font-semibold text-gray">{symbol}</span>
                  <span className={classNames('pl-1 text-sm', item.action === 0 ? 'text-green' : 'text-red')}>
                    · {item.action === 0 ? <FormattedMessage id="mt.mairu" /> : <FormattedMessage id="mt.maichu" />} ·{' '}
                    <FormattedMessage id="mt.zhucang" />
                    20X
                  </span>
                </div>
                <div className="flex items-end justify-center flex-col">
                  <span className="text-sm text-gray">
                    {item.number}
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
                    {item.price} {unit}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-center pt-5">
              <InputNumber
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
                    <span className="font-num">
                      <FormattedMessage id="mt.fanwei" />
                      &nbsp;
                      {item.action === TRADE_TYPE.MARKET_BUY ? '≤' : '≥'}&nbsp;
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
                    &nbsp; {item.action === TRADE_TYPE.MARKET_BUY ? '≥' : '≤'} {formatNum(sp_scope)} USD{' '}
                    <FormattedMessage id="mt.yujiyingkui" />
                    &nbsp;
                    {formatNum(spProfit)} USD
                  </span>
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <Button block onClick={onFinish} type="primary">
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
