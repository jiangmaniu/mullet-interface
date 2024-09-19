// eslint-disable-next-line simple-import-sort/imports
import { Button, Form } from 'antd'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useState, useTransition } from 'react'

import InputNumber from '@/components/Base/InputNumber'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import { formatNum, getPrecisionByNumber } from '@/utils'
import { goLogin } from '@/utils/navigator'
import { STORAGE_GET_TOKEN } from '@/utils/storage'

import Checkbox from '@/components/Base/Checkbox'
import { ORDER_TYPE } from '@/constants/enum'
import { cn } from '@/utils/cn'
import { message } from '@/utils/message'
import { calcExchangeRate, calcExpectedForceClosePrice, calcExpectedMargin, getCurrentQuote, getMaxOpenVolume } from '@/utils/wsUtil'
import { MinusCircleOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import BuyAndSellBtnGroup from '../../BuyAndSellBtnGroup'
import SelectMarginTypeOrLevelAge from './comp/SelectMarginTypeOrLevelAge'

type IProps = {
  popupRef?: any
}

// 市价单
export default observer(
  forwardRef(({ popupRef }: IProps, ref) => {
    const [isPending, startTransition] = useTransition() // 切换内容，不阻塞渲染，提高整体响应性
    const { isPc, isMobileOrIpad } = useEnv()
    const { trade, ws } = useStores()
    const { fetchUserInfo } = useModel('user')
    const [form] = Form.useForm()
    const intl = useIntl()
    const [checkedSpSl, setCheckedSpSl] = useState(false) // 不勾选止盈止损
    const { availableMargin } = trade.getAccountBalance()
    const [margin, setMargin] = useState(0)
    const [loading, setLoading] = useState(false)
    const { marginType, buySell, orderType } = trade

    const [countValue, setCount] = useState<any>(0.01) // 手数
    const [spValue, setSp] = useState<any>(0) // 止盈
    const [slValue, setSl] = useState<any>(0) // 止损

    const isBuy = buySell === 'BUY'

    const token = STORAGE_GET_TOKEN()
    const quoteInfo = getCurrentQuote()
    const symbolConf = quoteInfo.symbolConf
    const bid = Number(quoteInfo?.bid || 0)
    const ask = Number(quoteInfo?.ask || 0)
    const consize = quoteInfo?.consize
    const symbol = quoteInfo.symbol
    const d = quoteInfo?.digits
    const stopl = Number(symbolConf?.limitStopLevel || 1) * Math.pow(10, -d)
    const maxOpenVolume = getMaxOpenVolume({ buySell }) || 0
    const vmaxShow = symbolConf?.maxTrade || 20 // 配置最大可开手数，展示值
    const vmax = symbolConf?.maxTrade as number
    const vmin = symbolConf?.minTrade || 0.01
    const step = Number(symbolConf?.tradeStep || 0) || Math.pow(10, -d) // 手数步长
    // 根据品种小数点位数计算步长，独立于手数步长step。获取计算的小数位倒数第二位开始作为累加步长
    // 限价、止盈止损、停损挂单，加减时，连动报价小数位倒数第二位
    const step2 = Math.pow(10, -(d - 1)) || step
    const countPrecision = getPrecisionByNumber(symbolConf?.minTrade) // 手数精度

    // 实时计算预估强平价
    const expectedForceClosePrice = calcExpectedForceClosePrice({
      orderVolume: countValue,
      orderMargin: margin,
      orderType: 'MARKET_ORDER',
      buySell
    })

    // 实时计算下单时预估保证金
    const expectedMargin = calcExpectedMargin({
      buySell,
      orderVolume: countValue,
      orderType: 'MARKET_ORDER'
    })

    // 切换品种、买卖重置内容
    useEffect(() => {
      setSl(0)
      setSp(0)
      setCount(vmin)
    }, [symbol, buySell, orderType, vmin])

    useEffect(() => {
      // 取消勾选了止盈止损，重置值
      if (!checkedSpSl) {
        setSp(0)
        setSl(0)
      }
    }, [checkedSpSl])

    // 格式化数据
    const sl: any = Number(slValue)
    const sp: any = Number(spValue)
    const count: any = Number(countValue)

    let sl_scope: any, sp_scope: any, slProfit: any, spProfit: any

    if (bid && ask) {
      // 买入
      if (isBuy) {
        // 买入止损最大值
        sl_scope = (bid - stopl).toFixed(d) // 止损范围
        // 买入止损最小值
        sp_scope = (bid + stopl).toFixed(d) // 止盈范围
        // 预计盈亏
        slProfit = sl ? ((sl - ask) * count * consize).toFixed(d) : 0
        spProfit = sp ? ((sp - ask) * count * consize).toFixed(d) : 0
      } else {
        // 卖出止损最小值
        sl_scope = (ask + stopl).toFixed(d) // 止损范围
        // 卖出止损最大值
        sp_scope = (ask - stopl).toFixed(d) // 止盈范围
        // 预计盈亏
        slProfit = sl ? ((bid - sl) * count * consize).toFixed(d) : 0
        spProfit = sp ? ((bid - sp) * count * consize).toFixed(d) : 0
      }
    }

    const orderParams = {
      symbol,
      buySell, // 订单方向
      orderVolume: count,
      stopLoss: sl ? parseFloat(sl) : undefined,
      takeProfit: sp ? parseFloat(sp) : undefined,
      // 浮动杠杆默认1
      leverageMultiple: quoteInfo?.prepaymentConf?.mode === 'float_leverage' ? trade.leverageMultiple || 1 : undefined,
      tradeAccountId: trade.currentAccountInfo?.id,
      marginType,
      type: ORDER_TYPE.MARKET_ORDER // 订单类型
    } as Order.CreateOrder

    // useEffect(() => {
    //   if (orderType === 1) {
    //     trade.calcMargin(orderParams).then((res: any) => {
    //       setMargin(res)
    //     })
    //   }
    // }, [isBuy, count, sl, sp, marginType, symbol, orderType, trade.leverageMultiple])

    const onFinish = async () => {
      // sl_scope, sp_scope
      if (!token) {
        goLogin()
        return
      }
      const reg = /^\d+(\.\d{0,2})?$/
      if (!count) {
        message.info(intl.formatMessage({ id: 'mt.qingshurushoushu' }))
        return
      }
      // if (!Number(maxOpenVolume)) {
      //   return message.info(intl.formatMessage({ id: 'mt.dangqianzhanghuyuebuzu' }))
      // }
      // if (count < vmin || count > maxOpenVolume) {
      //   message.info(intl.formatMessage({ id: 'mt.shoushushuruyouwu' }))
      //   return
      // }
      const slFlag = isBuy ? sl && sl > sl_scope : sl && sl < sl_scope
      if (slFlag && sl) {
        message.info(intl.formatMessage({ id: 'mt.zhiyingzhisunshezhicuowu' }))
        return
      }
      const spFlag = isBuy ? sp && sp < sp_scope : sp && sp > sp_scope
      if (spFlag && sp) {
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

      if (res.success) {
        setCount(vmin)
        setSp('')
        setSl('')

        if (isMobileOrIpad) {
          // 关闭弹窗
          popupRef?.current?.close()
        }

        // 更新账户余额信息
        fetchUserInfo()
      }
    }

    // 禁用交易按钮
    const disabledBtn = trade.disabledTrade() || (sp && sp < sp_scope) || (sl && sl > sl_scope)
    // 禁用交易
    const disabledTrade = trade.disabledTrade()

    return (
      <Form form={form}>
        <div className="mx-[10px] mt-3 flex flex-col justify-between h-[630px]">
          <div>
            {/* 全仓、逐仓、杠杆选择 */}
            <SelectMarginTypeOrLevelAge />

            <div className="relative flex items-center justify-center rounded-xl border border-primary p-[2px]">
              <BuyAndSellBtnGroup type="popup" />
            </div>

            <InputNumber
              placeholder={intl.formatMessage({ id: 'mt.yidangqianzuixinjia' })}
              rootClassName="!z-50 mb-3 mt-[14px]"
              classNames={{ input: 'text-center' }}
              disabled
              // showAddMinus={false}
            />
            <Checkbox
              onChange={(e: any) => {
                setCheckedSpSl(e.target.checked)
              }}
              className="max-xl:hidden !mb-3 mt-1"
              checked={checkedSpSl}
            >
              <span className="text-primary text-xs">
                <FormattedMessage id="mt.zhiyingzhisun" />
              </span>
            </Checkbox>
            {checkedSpSl && (
              <>
                <InputNumber
                  showFloatTips={false}
                  placeholder={intl.formatMessage({ id: 'mt.zhiying' })}
                  rootClassName="!z-40 mb-3"
                  classNames={{ input: 'text-center' }}
                  value={spValue}
                  onChange={(value: any) => {
                    setSp(value)
                  }}
                  name="sp"
                  form={form}
                  onAdd={() => {
                    if (sp && sp > 0.01) {
                      const c = (((sp + step2) * 100) / 100).toFixed(d)
                      setSp(c)
                    } else {
                      setSp(sp_scope)
                    }
                  }}
                  onMinus={() => {
                    if (sp && sp > 0.01) {
                      const c = (((sp - step2) * 100) / 100).toFixed(d)
                      setSp(c)
                    } else {
                      setSp(sp_scope)
                    }
                  }}
                  tips={
                    <div className={cn('flex items-start gap-x-2 w-full pl-[2px]', { '!text-red': sp && sp < sp_scope })}>
                      <span className="!font-dingpro-regular pb-[2px]">
                        <FormattedMessage id="mt.fanwei" />
                        <span className="px-[2px]">{isBuy ? '≥' : '≤'}</span>
                        <span className="dark:text-primary">{formatNum(sp_scope)} USD</span>
                      </span>
                      <span className="!font-dingpro-regular">
                        <FormattedMessage id="mt.yujiyingkui" />
                        <span className="pl-[2px]">
                          <span className="dark:text-primary">
                            {formatNum(
                              calcExchangeRate({
                                value: spProfit,
                                unit: symbolConf?.profitCurrency,
                                buySell
                              }),
                              { precision: 2 }
                            )}{' '}
                            USD
                          </span>
                        </span>
                      </span>
                    </div>
                  }
                  disabled={disabledTrade}
                />
                <InputNumber
                  showFloatTips={false}
                  placeholder={intl.formatMessage({ id: 'mt.zhisun' })}
                  rootClassName="!z-30 !mb-3"
                  classNames={{ input: 'text-center' }}
                  value={slValue}
                  onChange={(value: any) => {
                    setSl(value)
                  }}
                  onAdd={() => {
                    if (sl && sl > 0.01) {
                      const c = (((sl + step2) * 100) / 100).toFixed(d)
                      setSl(c)
                    } else {
                      setSl(sl_scope)
                    }
                  }}
                  onMinus={() => {
                    if (sl && sl > 0.01) {
                      const c = (((sl - step2) * 100) / 100).toFixed(d)
                      setSl(c)
                    } else {
                      setSl(sl_scope)
                    }
                  }}
                  tips={
                    <div className={cn('flex gap-x-2 items-start w-full pl-[2px]', { '!text-red': sl && sl > sl_scope })}>
                      <span className="!font-dingpro-regular pb-[2px]">
                        <FormattedMessage id="mt.fanwei" />
                        <span className="px-[2px]">{isBuy ? '≤' : '≥'}</span>
                        <span className="dark:text-primary">{formatNum(sl_scope)} USD</span>
                      </span>
                      <span className="!font-dingpro-regular">
                        <FormattedMessage id="mt.yujiyingkui" />
                        <span className="pl-[2px]">
                          <span className="dark:text-primary">
                            {formatNum(
                              calcExchangeRate({
                                value: slProfit,
                                unit: symbolConf?.profitCurrency,
                                buySell
                              }),
                              { precision: 2 }
                            )}{' '}
                            USD
                          </span>
                        </span>
                      </span>
                    </div>
                  }
                  disabled={disabledTrade}
                />
              </>
            )}
            <InputNumber
              showAddMinus
              autoFocus={false}
              direction="column"
              classNames={{ input: '!text-lg !pl-[5px]', minus: '-top-[2px]', tips: '!top-[70px]' }}
              height={52}
              textAlign="left"
              placeholder={intl.formatMessage({ id: 'mt.shoushu' })}
              label={isBuy ? intl.formatMessage({ id: 'mt.mairushoushu' }) : intl.formatMessage({ id: 'mt.maichushoushu' })}
              unit={intl.formatMessage({ id: 'mt.lot' })}
              value={countValue}
              max={vmax}
              min={vmin}
              precision={countPrecision}
              hiddenPrecision={false}
              onChange={(value) => {
                setCount(value || '')
              }}
              onAdd={() => {
                if (count && (isBuy ? count < vmax : count < 30)) {
                  const c = (((count + step) * 100) / 100).toFixed(countPrecision)
                  setCount(c)
                } else {
                  // setCount(1)
                  setCount(vmax)
                }
              }}
              onMinus={() => {
                if (count && count > step) {
                  const c = (((count - step) * 100) / 100).toFixed(countPrecision)
                  setCount(c)
                } else {
                  // setCount(1)
                  setCount(step)
                }
              }}
              tips={
                <>
                  <FormattedMessage id="mt.shoushufanwei" />
                  <span className="pl-1">
                    {vmin}-{vmaxShow}
                  </span>
                </>
              }
              disabled={disabledTrade || trade.disabledTradeAction()}
            />
          </div>
          <div>
            <Button
              type="primary"
              style={{ background: isBuy ? 'var(--color-green-700)' : 'var(--color-red-600)' }}
              className="!h-[44px] !rounded-lg !text-[13px]"
              block
              onClick={() => {
                startTransition(() => {
                  onFinish()
                })
              }}
              loading={loading}
              disabled={disabledBtn || trade.disabledTradeAction()}
            >
              {trade.isMarketOpen() ? (
                <>
                  {!disabledTrade && (
                    <>
                      {isBuy ? <FormattedMessage id="mt.querenmairu" /> : <FormattedMessage id="mt.querenmaichu" />} {count}{' '}
                      <FormattedMessage id="mt.lot" />
                    </>
                  )}
                  {disabledTrade && <FormattedMessage id="mt.zhanghubeijinyong" />}
                </>
              ) : (
                <div className="flex items-center">
                  <MinusCircleOutlined style={{ fontSize: 14, paddingRight: 6 }} />
                  <FormattedMessage id="mt.xiushizhong" />
                </div>
              )}
            </Button>
            <div className="mt-4">
              <div className="flex items-center justify-between pb-[6px] w-full">
                <span className="text-xs text-secondary">
                  <FormattedMessage id="mt.keyong" />
                </span>
                <span className="pl-2 text-xs text-primary !font-dingpro-medium">{formatNum(availableMargin)} USD</span>
              </div>
              {/* <div className="flex items-center justify-between pb-[6px] w-full">
                <span className="text-xs text-secondary">
                  <FormattedMessage id="mt.yuguqiangpingjia" />
                </span>
                <span className="text-xs text-primary !font-dingpro-medium">{expectedForceClosePrice || '-'}</span>
              </div> */}
              <div className="flex items-center justify-between pb-[6px] w-full">
                <span className="text-xs text-secondary">
                  <FormattedMessage id="mt.yugubaozhengjin" />
                </span>
                <span className="text-xs text-primary !font-dingpro-medium">
                  {expectedMargin ? formatNum(expectedMargin, { precision: 2 }) + 'USD' : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-[6px] w-full">
                <span className="text-xs text-secondary">
                  <FormattedMessage id="mt.kekai" />
                </span>
                <span className="text-xs text-primary !font-dingpro-medium">
                  {maxOpenVolume} <FormattedMessage id="mt.lot" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Form>
    )
  })
)
