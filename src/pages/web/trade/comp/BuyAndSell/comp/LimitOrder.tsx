// eslint-disable-next-line simple-import-sort/imports
import { Button, Checkbox } from 'antd'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import InputNumber from '@/components/Base/InputNumber'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import getCurrentQuote from '@/utils/getCurrentQuote'
import { goLogin } from '@/utils/navigator'
import { STORAGE_GET_TOKEN } from '@/utils/storage'

import { ORDER_TYPE, TRADE_BUY_SELL } from '@/constants/enum'
import { message } from '@/utils/message'
import { FormattedMessage, useIntl } from '@umijs/max'
import { OP_BUY } from '..'
import BuyAndSellBtnGroup from '../../BuyAndSellBtnGroup'
import LevelAge from './comp/LevelAge'
import SelectMarginType from './comp/SelectMarginType'

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
    const [isCrypto, setIsCrypto] = useState(true) // 是否是数字货币 @TODO 需要根据全局切换的品种名称来判断，切换不同的布局
    const [leverageMultiple, setLeverageMultiple] = useState(0) // 杠杆倍数
    const [marginType, setMarginType] = useState<API.MaiginType>('CROSS_MARGIN') // 保证金类型
    const accountTotalMargin = trade.getCurrentAccountMargin()
    const [tradeType, setTradeType] = useState(OP_BUY) // 交易方向：1买入 2卖出
    const [margin, setMargin] = useState(0)
    const [loading, setLoading] = useState(false)

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
      leverageMultiple,
      tradeAccountId: trade.currentAccountInfo?.id,
      marginType,
      limitPrice: priceValue,
      type: isBuy ? ORDER_TYPE.LIMIT_BUY_ORDER : ORDER_TYPE.LIMIT_SELL_ORDER // 订单类型
    } as Order.CreateOrder

    useEffect(() => {
      trade.calcMargin(orderParams).then((res) => {
        if (res) {
          setMargin(res)
        }
      })
    }, [isBuy, count, sl, sp, marginType, symbol, orderType])

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
      setCount(0.01)
      setSp('')
      setSl('')

      if (isMobileOrIpad) {
        // 关闭弹窗
        popupRef?.current?.close()
      }
    }

    return (
      <div className="mx-[10px] mt-3 flex flex-col justify-between h-[620px]">
        <div>
          {/* 全仓、逐仓选择 */}
          {isCrypto && (
            <SelectMarginType
              onChange={(value) => {
                setMarginType(value)
              }}
            />
          )}

          <div className="relative flex items-center justify-center rounded-xl border border-primary p-[2px]">
            <BuyAndSellBtnGroup
              activeKey={tradeType}
              onChange={(key: any) => {
                setTradeType(key)
              }}
              type="popup"
            />
          </div>
          {/* 杠杆倍数 */}
          <LevelAge
            // initialValue={10}
            onChange={(value) => {
              console.log('value', value)
              setLeverageMultiple(value)
            }}
          />
          <InputNumber
            placeholder={intl.formatMessage({ id: 'mt.shurujiage' })}
            rootClassName="!z-50 my-3"
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
          {isCrypto && (
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
          )}
          {/* 数字货币类型并且勾选了才展示止盈止损、非数字货币类型直接展示 */}
          {((isCrypto && checkedSpSl) || !isCrypto) && (
            <>
              <InputNumber
                placeholder={intl.formatMessage({ id: 'mt.zhiying' })}
                rootClassName="!z-40 mb-3"
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
                    <span className="!font-dingpro-regular">
                      <FormattedMessage id="mt.fanwei" />
                      &nbsp;
                      {isBuy ? '≥' : '≤'}&nbsp;
                      {formatNum(sp_scope)} USD
                    </span>
                    <span className="pl-1 !font-dingpro-regular">
                      <FormattedMessage id="mt.yujiyingkui" />
                      &nbsp;
                      {formatNum(spProfit)} USD
                    </span>
                  </>
                }
              />
              <InputNumber
                placeholder={intl.formatMessage({ id: 'mt.zhisun' })}
                rootClassName="!z-30"
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
                  <span className="!font-dingpro-regular">
                    <FormattedMessage id="mt.fanwei" /> {isBuy ? '≤' : '≥'} {formatNum(sl_scope)} USD{' '}
                    <FormattedMessage id="mt.yujiyingkui" /> {formatNum(slProfit)} USD
                  </span>
                }
              />
            </>
          )}
          <InputNumber
            direction="column"
            classNames={{ input: '!text-lg !pl-[5px]', minus: '-top-[2px]', tips: '!top-[76px]' }}
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
                const c = (((count + 0.01) * 100) / 100).toFixed(2)
                setCount(c)
              }
            }}
            onMinus={() => {
              if (count && (isBuy ? count > vmin : count > 0.01)) {
                const c = (((count - 0.01) * 100) / 100).toFixed(2)
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
          <div className="flex items-center justify-between max-xl:mt-6">
            <div className="mt-1 flex items-center justify-center pb-2">
              <span className="text-xs text-gray-secondary">
                <FormattedMessage id="mt.keyong" />
              </span>
              <span className="pl-2 text-xs text-gray !font-dingpro-medium">{formatNum(accountTotalMargin)}USD</span>
            </div>
            <div className="mt-1 flex items-center justify-center pb-1">
              <span className="text-xs text-gray !font-dingpro-medium">{formatNum(margin, { precision: d })}USD</span>
              <span className="text-xs text-gray-secondary pl-1">
                <FormattedMessage id="mt.baozhengjin" />
              </span>
            </div>
          </div>
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
        </div>
      </div>
    )
  })
)
