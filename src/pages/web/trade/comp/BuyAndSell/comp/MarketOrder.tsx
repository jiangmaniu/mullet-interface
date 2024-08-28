// eslint-disable-next-line simple-import-sort/imports
import { Button, Form } from 'antd'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useState, useTransition } from 'react'

import InputNumber from '@/components/Base/InputNumber'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { goLogin } from '@/utils/navigator'
import { STORAGE_GET_TOKEN } from '@/utils/storage'

import Checkbox from '@/components/Base/Checkbox'
import { ORDER_TYPE } from '@/constants/enum'
import { message } from '@/utils/message'
import { calcExchangeRate, calcExpectedForceClosePrice, calcExpectedMargin, getCurrentQuote, getMaxOpenVolume } from '@/utils/wsUtil'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import classNames from 'classnames'
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
    const vmax = maxOpenVolume // 当前账户保证金最大可开手数
    const vmin = symbolConf?.minTrade || 0.01
    const step = Number(symbolConf?.tradeStep || 0) || Math.pow(10, -d)

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

        sl_scope = (ask - stopl).toFixed(d)
        // 买入止损最小值

        sp_scope = (ask + stopl).toFixed(d)

        slProfit = sl ? ((sl - ask) * count * consize).toFixed(d) : 0

        spProfit = sp ? ((sp - ask) * count * consize).toFixed(d) : 0
      } else {
        // 卖出止损最小值

        sl_scope = (bid + stopl).toFixed(d)
        // 卖出止损最大值

        sp_scope = (bid - stopl).toFixed(d)

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
      // if (count < vmin || count > vmax) {
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
    const disabledBtn = trade.disabledTrade || (sp && sp < sp_scope) || (sl && sl > sl_scope)
    // 禁用交易
    const disabledTrade = trade.disabledTrade

    return (
      <Form form={form}>
        <div className="mx-[10px] mt-3 flex flex-col justify-between h-[630px]">
          <div>
            {/* 全仓、逐仓、杠杆选择 */}
            <SelectMarginTypeOrLevelAge />

            <div className="relative flex items-center justify-center rounded-xl border border-primary dark:border-gray-580 p-[2px]">
              <BuyAndSellBtnGroup type="popup" />
            </div>

            <div className="flex items-center justify-between mt-3 mb-1">
              <div className="mt-1 flex items-center justify-center pb-2">
                <span className="text-xs text-secondary">
                  <FormattedMessage id="mt.keyong" />
                </span>
                <span className="pl-2 text-xs text-primary !font-dingpro-medium">{formatNum(availableMargin)} USD</span>
              </div>
            </div>

            <InputNumber
              placeholder={intl.formatMessage({ id: 'mt.yidangqianzuixinjia' })}
              rootClassName="!z-50 mb-3"
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
                    <div className={classNames('flex items-start gap-x-2 w-full pl-[2px]', { '!text-red': sp && sp < sp_scope })}>
                      <span className="!font-dingpro-regular pb-[2px]">
                        <FormattedMessage id="mt.fanwei" />
                        <span className="px-[2px]">{isBuy ? '≥' : '≤'}</span>
                        {formatNum(sp_scope)} USD
                      </span>
                      <span className="!font-dingpro-regular">
                        <FormattedMessage id="mt.yujiyingkui" />
                        <span className="pl-[2px]">
                          {formatNum(
                            calcExchangeRate({
                              value: spProfit,
                              unit: symbolConf?.profitCurrency,
                              buySell
                            })
                          )}{' '}
                          USD
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
                    <div className={classNames('flex gap-x-2 items-start w-full pl-[2px]', { '!text-red': sl && sl > sl_scope })}>
                      <span className="!font-dingpro-regular pb-[2px]">
                        <FormattedMessage id="mt.fanwei" />
                        <span className="px-[2px]">{isBuy ? '≤' : '≥'}</span>
                        {formatNum(sl_scope)} USD
                      </span>
                      <span className="!font-dingpro-regular">
                        <FormattedMessage id="mt.yujiyingkui" />
                        <span className="pl-[2px]">
                          {formatNum(
                            calcExchangeRate({
                              value: slProfit,
                              unit: symbolConf?.profitCurrency,
                              buySell
                            })
                          )}{' '}
                          USD
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
              classNames={{ input: '!text-lg !pl-[5px]', minus: '-top-[2px]', tips: '!top-[74px]' }}
              height={52}
              textAlign="left"
              placeholder={intl.formatMessage({ id: 'mt.shoushu' })}
              label={isBuy ? intl.formatMessage({ id: 'mt.mairushoushu' }) : intl.formatMessage({ id: 'mt.maichushoushu' })}
              unit={intl.formatMessage({ id: 'mt.lot' })}
              value={countValue}
              max={vmax}
              min={vmin}
              onChange={(value) => {
                setCount(value || '')
              }}
              onAdd={() => {
                if (count && (isBuy ? count < vmax : count < 30)) {
                  const c = (((count + step) * 100) / 100).toFixed(2)
                  setCount(c)
                } else {
                  // setCount(1)
                  setCount(vmax)
                }
              }}
              onMinus={() => {
                if (count && count > step) {
                  const c = (((count - step) * 100) / 100).toFixed(2)
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
              disabled={disabledTrade}
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
              disabled={disabledBtn}
            >
              {isBuy ? <FormattedMessage id="mt.querenmairu" /> : <FormattedMessage id="mt.querenmaichu" />} {count}{' '}
              <FormattedMessage id="mt.lot" />
            </Button>
            <div className="mt-4">
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
