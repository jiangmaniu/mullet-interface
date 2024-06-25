// eslint-disable-next-line simple-import-sort/imports
import { Button, Checkbox } from 'antd'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import InputNumber from '@/components/Base/InputNumber'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { goLogin } from '@/utils/navigator'
import { STORAGE_GET_TOKEN } from '@/utils/storage'
import { calcExpectedForceClosePrice, getCurrentQuote } from '@/utils/wsUtil'

import { ORDER_TYPE, TRADE_BUY_SELL } from '@/constants/enum'
import { message } from '@/utils/message'
import { FormattedMessage, useIntl } from '@umijs/max'
import { OP_BUY } from '..'
import BuyAndSellBtnGroup from '../../BuyAndSellBtnGroup'
import SelectMarginTypeOrLevelAge from './comp/SelectMarginTypeOrLevelAge'

type IProps = {
  type?: any
  popupRef?: any
  orderType?: any
}

// 限价单
export default observer(
  forwardRef(({ popupRef, type, orderType }: IProps, ref) => {
    const intl = useIntl()
    const { isPc, isMobileOrIpad } = useEnv()
    const { trade, ws } = useStores()
    const [checkedSpSl, setCheckedSpSl] = useState(false) // 勾选止盈止损
    const { availableMargin } = trade.getAccountBalance()
    const [tradeType, setTradeType] = useState(OP_BUY) // 交易方向：1买入 2卖出
    const [margin, setMargin] = useState(0)
    const [loading, setLoading] = useState(false)
    const marginType = trade.marginType

    useEffect(() => {
      setTradeType(type || OP_BUY)
    }, [type])

    // 对外暴露接口
    useImperativeHandle(ref, () => {
      return {
        tradeType,
        setTradeType
      }
    })

    let [priceValue, setPrice] = useState<any>(0) // 价格
    let [countValue, setCount] = useState<any>(0.01) // 手数
    let [spValue, setSp] = useState<any>(0) // 止盈
    let [slValue, setSl] = useState<any>(0) // 止损

    const isBuy = tradeType === OP_BUY

    // 实时计算预估强平价
    const expectedForceClosePrice = calcExpectedForceClosePrice({
      orderVolume: countValue,
      orderMargin: margin,
      orderType: isBuy ? ORDER_TYPE.STOP_LOSS_LIMIT_BUY_ORDER : ORDER_TYPE.STOP_LOSS_LIMIT_SELL_ORDER,
      buySell: tradeType === 1 ? 'BUY' : 'SELL'
    })

    const token = STORAGE_GET_TOKEN()
    const quoteInfo = getCurrentQuote()
    const symbolConf = quoteInfo.symbolConf
    const bid = Number(quoteInfo?.bid || 0)
    const ask = Number(quoteInfo?.ask || 0)
    const consize = quoteInfo?.consize
    const symbol = quoteInfo.symbol
    const d = quoteInfo?.digits
    // const stopl = symbols?.stopl * Math.pow(10, -d)
    const stoplValue = 1 // @TODO 这里如何计算当前报价的止损值
    const stopl = stoplValue * Math.pow(10, -d)
    const vmax = symbolConf?.maxTrade || 20
    const vmin = symbolConf?.minTrade || 0.01
    const step = Number(symbolConf?.tradeStep || 0) || Math.pow(10, -d)

    // 切换品种、买卖重置内容
    useEffect(() => {
      setSl(0)
      setSp(0)
      setCount(vmin)
      setPrice(0)
    }, [symbol, tradeType, orderType, vmin])

    // 格式化数据
    const sl: any = Number(slValue)
    const sp: any = Number(spValue)
    const count: any = Number(countValue)
    const price: any = Number(priceValue)

    let sl_scope: any, sp_scope: any, slProfit: any, spProfit: any, priceTip: any

    if (bid && ask) {
      // 买入
      if (isBuy) {
        priceTip = (bid - stopl).toFixed(d)
        sl_scope = price ? (price - stopl).toFixed(d) : 0
        sp_scope = price ? (price + stopl).toFixed(d) : 0

        slProfit = price && sl ? ((sl - price) * count * consize).toFixed(d) : 0

        spProfit = price && sp ? ((sp - price) * count * consize).toFixed(d) : 0
      } else {
        priceTip = (ask + stopl).toFixed(d)
        sl_scope = price ? (price + stopl).toFixed(d) : 0
        sp_scope = price ? (price - stopl).toFixed(d) : 0

        slProfit = price && sl ? ((price - sl) * count * consize).toFixed(d) : 0

        spProfit = price && sp ? ((price - sp) * count * consize).toFixed(d) : 0
      }
    }

    const orderParams = {
      symbol,
      buySell: isBuy ? TRADE_BUY_SELL.BUY : TRADE_BUY_SELL.SELL, // 订单方向
      orderVolume: count,
      stopLoss: sl ? parseFloat(sl) : undefined,
      takeProfit: sp ? parseFloat(sp) : undefined,
      leverageMultiple: trade.leverageMultiple || undefined,
      tradeAccountId: trade.currentAccountInfo?.id,
      marginType,
      limitPrice: priceValue,
      type: isBuy ? ORDER_TYPE.STOP_LOSS_LIMIT_BUY_ORDER : ORDER_TYPE.STOP_LOSS_LIMIT_SELL_ORDER // 订单类型
    } as Order.CreateOrder

    useEffect(() => {
      trade.calcMargin(orderParams).then((res: any) => {
        if (res) {
          setMargin(res)
        }
      })
    }, [isBuy, count, sl, sp, marginType, symbol, orderType, price])

    const onFinish = async () => {
      // sl_scope, sp_scope
      if (!token) {
        goLogin()
        return
      }
      const reg = /^\d+(\.\d{0,2})?$/
      if (!reg.test(count)) {
        message.info(intl.formatMessage({ id: 'mt.shousushuruyouwu' }))
        return
      }
      if (count < vmin || count > vmax) {
        message.info(intl.formatMessage({ id: 'mt.shousushuruyouwu' }))
        return
      }
      const slFlag = isBuy ? sl && sl > sl_scope : sl && sl < sl_scope
      if (slFlag) {
        message.info(intl.formatMessage({ id: 'mt.zhiyingzhisunshezhicuowu' }))
        return
      }
      const spFlag = isBuy ? sp && sp < sp_scope : sp && sp > sp_scope
      if (spFlag) {
        message.info(intl.formatMessage({ id: 'mt.zhiyingzhisunshezhicuowu' }))
        return
      }

      console.log('参数', orderParams)
      // ws.socket.send(JSON.stringify(res))
      // ws.setNewOrderFn(res)

      setLoading(true)
      const res = await trade.createOrder(orderParams).finally(() => {
        setLoading(false)
      })

      if (!res.success) {
        return
      }

      setPrice('')
      setCount(vmin)
      setSp('')
      setSl('')

      if (isMobileOrIpad) {
        // 关闭弹窗
        popupRef?.current?.close()
      }
    }

    return (
      <div className="mx-[10px] mt-3 flex flex-col justify-between h-[630px]">
        <div>
          {/* 全仓、逐仓、杠杆选择 */}
          <SelectMarginTypeOrLevelAge />

          <div className="relative flex items-center justify-center rounded-xl border border-primary p-[2px]">
            <BuyAndSellBtnGroup
              activeKey={tradeType}
              onChange={(key: any) => {
                setTradeType(key)
              }}
              type="popup"
            />
          </div>
          <div className="flex items-center justify-between mt-3 mb-1">
            <div className="mt-1 flex items-center justify-center pb-2">
              <span className="text-xs text-gray-secondary">
                <FormattedMessage id="mt.keyong" />
              </span>
              <span className="pl-2 text-xs text-gray !font-dingpro-medium">{formatNum(availableMargin)} USD</span>
            </div>
          </div>
          <InputNumber
            placeholder={intl.formatMessage({ id: 'mt.shurujiage' })}
            addonBefore={intl.formatMessage({ id: 'mt.jiage' })}
            rootClassName="!z-50 mb-3"
            classNames={{ input: 'text-center' }}
            value={priceValue}
            onChange={(value: any) => {
              setPrice(value)
            }}
            onAdd={() => {
              if (price && price >= 0) {
                const c = (((price + step) * 100) / 100).toFixed(d)
                setPrice(c)
              } else {
                setPrice(priceTip)
              }
            }}
            onMinus={() => {
              if (price && price > 0) {
                const c = (((price - step) * 100) / 100).toFixed(d)
                setPrice(c)
              } else {
                setPrice(priceTip)
              }
            }}
            tips={
              <span className="!font-dingpro-regular">
                {isBuy && (
                  <>
                    <FormattedMessage id="mt.mairujiafanwei" /> ≤ {formatNum(priceTip)} USD
                  </>
                )}
                {!isBuy && (
                  <>
                    <FormattedMessage id="mt.mairujiafanwei" /> ≥ {formatNum(priceTip)} USD
                  </>
                )}
              </span>
            }
          />
          <Checkbox
            onChange={(e: any) => {
              setCheckedSpSl(e.target.checked)
            }}
            className="max-xl:hidden !mb-3"
          >
            <span className="text-gray text-xs">
              <FormattedMessage id="mt.zhiyingzhisun" />
            </span>
          </Checkbox>
          {checkedSpSl && (
            <div className="flex items-center justify-between gap-x-3">
              <InputNumber
                placeholder={intl.formatMessage({ id: 'mt.zhiying' })}
                addonBefore={intl.formatMessage({ id: 'mt.zhiying' })}
                rootClassName="!z-40"
                width={65}
                classNames={{ input: 'text-center' }}
                value={spValue}
                onChange={(value: any) => {
                  setSp(value)
                }}
                onAdd={() => {
                  if (sp && sp > 0.01) {
                    const c = (((sp + step) * 100) / 100).toFixed(d)
                    setSp(c)
                  } else {
                    setSp(sp_scope)
                  }
                }}
                onMinus={() => {
                  if (sp && sp > 0.01) {
                    const c = (((sp - step) * 100) / 100).toFixed(d)
                    setSp(c)
                  } else {
                    setSp(sp_scope)
                  }
                }}
                tips={
                  <>
                    <div className="flex flex-col items-start w-full pl-[2px]">
                      <span className="!font-dingpro-regular pb-[2px]">
                        <FormattedMessage id="mt.fanwei" />
                        <span className="px-[2px]">{isBuy ? '≥' : '≤'}</span>
                        {formatNum(sp_scope)} USD
                      </span>
                      <span className="!font-dingpro-regular">
                        <FormattedMessage id="mt.yujiyingkui" />
                        <span className="pl-[2px]">{formatNum(spProfit)} USD</span>
                      </span>
                    </div>
                  </>
                }
              />
              <InputNumber
                placeholder={intl.formatMessage({ id: 'mt.zhisun' })}
                addonBefore={intl.formatMessage({ id: 'mt.zhisun' })}
                rootClassName="!z-30"
                width={65}
                classNames={{ input: 'text-center' }}
                value={slValue}
                onChange={(value) => {
                  setSl(value)
                }}
                onAdd={() => {
                  if (sl && sl > 0.01) {
                    const c = (((sl + step) * 100) / 100).toFixed(d)
                    setSl(c)
                  } else {
                    setSl(sl_scope)
                  }
                }}
                onMinus={() => {
                  if (sl && sl > 0.01) {
                    const c = (((sl - step) * 100) / 100).toFixed(d)
                    setSl(c)
                  } else {
                    setSl(sl_scope)
                  }
                }}
                tips={
                  <div className="flex flex-col items-start w-full pl-[2px]">
                    <span className="!font-dingpro-regular pb-[2px]">
                      <FormattedMessage id="mt.fanwei" />
                      <span className="px-[2px]">{isBuy ? '≤' : '≥'}</span>
                      {formatNum(sl_scope)} USD
                    </span>
                    <span className="!font-dingpro-regular">
                      <FormattedMessage id="mt.yujiyingkui" />
                      <span className="pl-[2px]">{formatNum(slProfit)} USD</span>
                    </span>
                  </div>
                }
              />
            </div>
          )}
          <InputNumber
            showAddMinus
            autoFocus={false}
            direction="column"
            classNames={{ input: '!text-lg !pl-[5px]', minus: '-top-[2px]', tips: '!top-[74px]' }}
            height={52}
            textAlign="left"
            rootClassName="mt-[14px]"
            label={<FormattedMessage id="mt.shoushu" />}
            unit={intl.formatMessage({ id: 'mt.lot' })}
            value={countValue}
            max={vmax}
            min={vmin}
            onChange={(value: any) => {
              setCount(value)
            }}
            onAdd={() => {
              if (count && (isBuy ? count < vmax : count <= 5)) {
                const c = (((count + step) * 100) / 100).toFixed(2)
                setCount(c)
              }
            }}
            onMinus={() => {
              if (count && (isBuy ? count > vmin : count > step)) {
                const c = (((count - step) * 100) / 100).toFixed(2)
                setCount(c)
              }
            }}
            tips={
              <>
                <FormattedMessage id="mt.shoushufanwei" />
                <span className="pl-1">
                  {vmin}-{vmax}
                </span>
              </>
            }
          />
        </div>
        <div>
          <Button
            type="primary"
            style={{ background: isBuy ? 'var(--color-green-700)' : 'var(--color-red-600)' }}
            className="!h-[44px] !rounded-lg !text-[13px]"
            block
            onClick={onFinish}
            loading={loading}
          >
            {isBuy ? <FormattedMessage id="mt.querenmairu" /> : <FormattedMessage id="mt.querenmairu" />} {count}{' '}
            <FormattedMessage id="mt.lot" />
          </Button>
          <div className="mt-4">
            <div className="flex items-center justify-between pb-[6px] w-full">
              <span className="text-xs text-gray-secondary">
                <FormattedMessage id="mt.yuguqiangpingjiage" />
              </span>
              <span className="text-xs text-gray !font-dingpro-medium">{expectedForceClosePrice} USD</span>
            </div>
            <div className="flex items-center justify-between pb-[6px] w-full">
              <span className="text-xs text-gray-secondary">
                <FormattedMessage id="mt.baozhengjin" />
              </span>
              <span className="text-xs text-gray !font-dingpro-medium">{formatNum(margin, { precision: d })} USD</span>
            </div>
            <div className="flex items-center justify-between pb-[6px] w-full">
              <span className="text-xs text-gray-secondary">
                <FormattedMessage id="mt.kekai" />
              </span>
              <span className="text-xs text-gray !font-dingpro-medium">
                {vmax} <FormattedMessage id="mt.lot" />
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  })
)
