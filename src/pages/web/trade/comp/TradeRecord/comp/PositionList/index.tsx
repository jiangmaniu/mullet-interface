/* eslint-disable simple-import-sort/imports */
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from '@umijs/max'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { useRef, useState } from 'react'

import Empty from '@/components/Base/Empty'
import ListItem from '@/components/Base/ListItem'
import { TRADE_BUY_SELL } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { copyContent, formatNum, formatTime, groupBy, toFixed } from '@/utils'
import { getBuySellInfo, getSymbolIcon } from '@/utils/business'
import { covertProfit } from '@/utils/wsUtil'

import useCurrentQuote from '@/hooks/useCurrentQuote'
import ClosePositionConfirmModal from '../../../Modal/ClosePositionConfirmModal'
import SetStopLossProfitModal from '../../../Modal/SetStopLossProfitModal'
import AddOrExtractMarginModal from './comp/AddOrExtractMarginModal'

export type IPositionItem = Order.BgaOrderPageListItem & {
  /**格式化浮动盈亏 */
  profitFormat: string
  /**现价 */
  currentPrice: number | string
  /**收益率 */
  yieldRate: string
  /**强平价 */
  forceClosePrice: number
}

type IProps = {
  style?: React.CSSProperties
  parentPopup?: any
  showActiveSymbol?: boolean
}

// 持仓记录
function Position({ style, parentPopup, showActiveSymbol }: IProps) {
  const { isPc } = useEnv()
  const { ws, trade } = useStores()
  const { lng } = useLang()
  const { quotes } = ws
  const isZh = lng === 'zh-TW'
  const intl = useIntl()
  const [modalInfo, setModalInfo] = useState({} as IPositionItem)

  const closePositionRef = useRef<any>(null)
  const stopLossProfitRef = useRef<any>(null)

  const unit = 'USD'
  const tradeList = trade.positionList as IPositionItem[]

  const activeSymbolName = trade.activeSymbolName
  let list = showActiveSymbol ? tradeList.filter((v) => v.symbol === activeSymbolName) : tradeList

  const formatValue = (value: any) => <span className="!font-dingpro-medium">{formatNum(value)}</span>

  // 计算收益率
  const calcYieldRate = (item: IPositionItem) => {
    const conf = item.conf as Symbol.SymbolConf
    const contractSize = Number(conf?.contractSize || 0)
    const orderVolume = Number(item.orderVolume || 0)
    const orderMargin = Number(item.orderMargin || 0) // 开仓保证金
    const price = Number(item.currentPrice || 0) // 现价
    const startPrice = Number(item.startPrice || 0)
    const yieldBuy = (price - startPrice) * contractSize * orderVolume
    const yieldSell = (startPrice - price) * contractSize * orderVolume
    const yieldValue = item.buySell === 'BUY' ? yieldBuy : yieldSell
    return yieldValue && orderMargin ? toFixed((yieldValue / orderMargin) * 100) + '%' : '0.00%'
  }

  // 计算强平价
  const calcForceClosePrice = (item: IPositionItem) => {
    // 多仓预估强平价 =(保证金余额 - 面值*张数*开仓均价)/(面值*张数*(维持保证金率 + 手续费率 - 1))
    // 空仓预估强平个 =(保证金余额 + 面值*张数*开仓均价)/(面值*张数*(维持保证金率 + 手续费率 + 1
    // 维持保证金率:用户维持当前仓位所需的最低保证金率
    // 维持保证金=您的仓位价值*维持保证金率
    // 仓位价值=当前价格（区分买卖价格）*手数*合约大小
    // 维持保证金率=读取后台设置的（强制平仓比例）代替
    // 面值*张数=当前价格（买或卖）*合约大小*手数
    // 市价（限价）手续费/当前合约价值（手数*合约大小*当前价格(买价或卖价)）*100% = 手续费率 （计算模式：货币形式，如果后台手续费百分比形式：直接获取市价/限价手续费，看哪种单）
    const conf = item.conf as Symbol.SymbolConf
    const contractSize = Number(conf?.contractSize || 0)
    const orderVolume = Number(item.orderVolume || 0)
    // 区分全仓、逐仓保证金
    const orderMargin = item.marginType === 'ISOLATED_MARGIN' ? Number(item.orderMargin || 0) : trade.currentAccountInfo?.margin || 0
    const currentPrice = Number(item.currentPrice || 0)
    const startPrice = Number(item.startPrice || 0)
    const marginRate = item.compelCloseRatio // 强制平仓比例
    const feeConfList =
      conf.transactionFeeConf?.type === 'trade_vol' ? conf.transactionFeeConf?.trade_vol : conf.transactionFeeConf?.trade_hand // 手续费配置列表
    const feeConfItem = (feeConfList || []).filter((v) => orderVolume >= v.from && orderVolume <= v.to)?.[0]
    const feeComputeMode = feeConfItem?.compute_mode // 手续费计算模式
    const marketFee = Number(feeConfItem?.market_fee || 0) // 市价手续费
    let feeRate = 0
    if (feeComputeMode === 'percentage') {
      // 后台品种配置的手续费，选择百分比形式：手续费率 = 市价手续费(限价)
      feeRate = marketFee / 100 // 读取市价手续费的百分比值
    } else if (feeComputeMode === 'currency') {
      // 后台品种配置的手续费，选择货币形式：手续费率 = 市价(限价)手续费 / 合约价值（当前价格*合约大小*手数） * 100%
      feeRate = marketFee / (currentPrice * contractSize * orderVolume)
    }
    const number = currentPrice * contractSize * orderVolume
    const buyForceClosePrice = (orderMargin - number * startPrice) / (number * marginRate * feeRate - 1)
    const sellForceClosePrice = (orderMargin + number * startPrice) / (number * marginRate * feeRate + 1)
    const forceClosePrice = item.buySell === 'BUY' ? buyForceClosePrice : sellForceClosePrice

    return formatNum(forceClosePrice, { precision: item.symbolDecimal })
  }

  const slSp = [
    {
      label: <FormattedMessage id="mt.zhisun" />,
      value: (item: IPositionItem) => formatValue(toFixed(item?.stopLoss, item?.symbolDecimal))
    },
    {
      label: <FormattedMessage id="mt.zhiying" />,
      value: (item: IPositionItem) => formatValue(toFixed(item?.takeProfit, item?.symbolDecimal))
    }
  ]

  const floatPL = {
    label: <FormattedMessage id="mt.fudongyingkui" />,
    value: (item: any) => {
      const profitFormat = formatValue(item?.profitFormat)
      return item.profit > 0 ? <>+{profitFormat}</> : profitFormat
    },
    valueClassName: (item: IPositionItem) => `${Number(item?.profit) > 0 ? '!text-green' : '!text-red'} !text-[16px]`,
    className: 'xxl:text-right',
    unit,
    unitClassName: (item: IPositionItem) => {
      return Number(item?.profit) > 0 ? '!text-green' : 'text-red'
    }
  }
  const time = {
    label: <FormattedMessage id="mt.jiaoyishijian" />,
    key: 'time',
    value: (item: IPositionItem) => {
      return formatTime(item?.createTime)
    }
  }
  const vol = { label: <FormattedMessage id="mt.shoushu" />, value: (item: IPositionItem) => item.orderVolume }
  const openPrice = {
    label: <FormattedMessage id="mt.kaicangjia" />,
    value: (item: IPositionItem) => formatValue(toFixed(item?.startPrice, item.symbolDecimal))
  }
  const currentPrice = {
    label: <FormattedMessage id="mt.xianjia" />,
    value: (item: any) => formatValue(item.currentPrice)
  }
  const fee = { label: <FormattedMessage id="mt.shouxufei" />, value: (item: IPositionItem) => toFixed(item.handlingFees) }
  const orderNo = { label: <FormattedMessage id="mt.chicangdanhao" />, value: (item: IPositionItem) => `${item.id}` }
  const margin = {
    label: <FormattedMessage id="mt.baozhengjin" />,
    key: 'margin',
    value: (item: IPositionItem) => (
      <span className="items-center inline-flex">
        <span className="pr-2">{toFixed(item.orderMargin, item.symbolDecimal)}</span>
        {/* 逐仓才可以追加保证金 */}
        {item.marginType === 'ISOLATED_MARGIN' && (
          <span>
            {/* 追加保证金 */}
            <AddOrExtractMarginModal
              trigger={
                <PlusCircleOutlined
                  className="cursor-pointer"
                  onClick={() => {
                    setModalInfo(item)
                  }}
                />
              }
              info={modalInfo}
              onClose={() => {
                setModalInfo({} as IPositionItem)
              }}
              type="AddMargin"
            />
            {/* 提取逐仓保证金 */}
            <AddOrExtractMarginModal
              trigger={
                <MinusCircleOutlined
                  className="cursor-pointer ml-3"
                  onClick={() => {
                    setModalInfo(item)
                  }}
                />
              }
              info={modalInfo}
              onClose={() => {
                setModalInfo({} as IPositionItem)
              }}
              type="ExtractMargin"
            />
          </span>
        )}
      </span>
    )
  }
  const interestFees = { label: <FormattedMessage id="mt.kucunfei" />, value: (item: IPositionItem) => toFixed(item.interestFees) }
  const yieldRate = {
    label: <FormattedMessage id="mt.shouyilv" />,
    value: (item: IPositionItem) => item.yieldRate
  }
  const forceClosePrice = { label: <FormattedMessage id="mt.qiangpingjia" />, value: (item: IPositionItem) => item.forceClosePrice }

  const pcList = [openPrice, margin, vol, ...slSp, forceClosePrice, fee, interestFees, yieldRate, floatPL]
  const mobileList = [time, vol, openPrice, margin, fee, interestFees, forceClosePrice, yieldRate, orderNo]

  const fieldList = isPc ? pcList : mobileList

  const renderLabel = (item: any) => {
    return <span className="pr-1 text-xs font-normal text-gray-secondary">{item?.label}</span>
  }

  /**
   * 渲染属性值
   * @param {*} item 配置item
   * @param {*} key 配置item key
   * @param {*} obj 数据item
   * @returns
   */
  const renderProp = (item: any, key: any, obj: any) => {
    // 移动端时间加上提示
    if (item?.key === 'time' && !isPc) {
      const value = formatTime(obj?.utime)
      return (
        <Tooltip placement="top" title={value}>
          <span className="mr-2 text-xs font-normal text-gray-secondary">{value}</span>
        </Tooltip>
      )
    }
    return typeof item?.[key] === 'function' ? item?.[key]?.(obj) : item?.[key]
  }

  const renderActionButton = (item: any) => {
    return (
      <div className="flex items-center max-xl:mt-3 max-xl:justify-between">
        <div
          className="mr-2 min-w-[70px] cursor-pointer rounded border-gray-250 px-2 py-[5px] text-center font-normal text-gray max-xl:w-[48%] max-xl:bg-sub-card max-xl:text-sm xl:border xl:text-xs"
          onClick={() => {
            parentPopup?.close()
            closePositionRef.current?.show(item)
          }}
        >
          <FormattedMessage id="mt.pingcang" />
        </div>
        <div
          className="min-w-[70px] cursor-pointer rounded border-gray-250 px-2 py-[5px] text-center font-normal text-gray max-xl:w-[48%] max-xl:bg-sub-card max-xl:text-sm xl:border xl:text-xs"
          onClick={() => {
            parentPopup?.close()
            stopLossProfitRef.current?.show(item)
          }}
        >
          <FormattedMessage id="mt.zhiyingzhisun" />
        </div>
      </div>
    )
  }

  return (
    <div style={style}>
      {list.length > 0 &&
        list.map((v: IPositionItem, idx: number) => {
          const symbol = v.dataSourceSymbol as string
          const quoteInfo = useCurrentQuote(symbol)
          const digits = v.symbolDecimal || 2
          const currentPrice = v.buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.ask : quoteInfo?.bid

          v.currentPrice = currentPrice // 现价，根据买卖方向获取当前价格
          const profit = covertProfit(symbol, v) as number // 浮动盈亏
          v.profit = profit || v.profit // 避免出现闪动
          v.profitFormat = Number(v.profit) > 0 ? '+' + toFixed(v.profit) : toFixed(v.profit) // 格式化的
          v.orderVolume = toFixed(v.orderVolume, digits) // 手数格式化
          v.startPrice = toFixed(v.startPrice, digits) // 开仓价格格式化
          v.yieldRate = calcYieldRate(v) // 收益率
          v.forceClosePrice = toFixed(calcForceClosePrice(v), digits) // 强平价

          const buySellInfo = getBuySellInfo(v)
          return (
            <div key={idx} className="mb-3 rounded-xl border border-primary">
              <div className="flex items-center justify-between bg-sub-card/50 px-3 py-[6px]">
                <div className="flex items-center">
                  <img width={22} height={22} alt="" src={getSymbolIcon(v.imgUrl)} className="rounded-full" />
                  <span className="pl-[6px] text-base font-semibold text-gray">{v.symbol}</span>
                  <span className={classNames('pl-[6px] text-sm font-medium', buySellInfo.colorClassName)}>{buySellInfo.text}</span>
                  {/*爆仓信号灯暂时不做 */}
                  {/* <div className="ml-3">
                    <Signal />
                  </div> */}
                  {/* pc显示 */}
                  <div className="flex items-center max-xl:hidden">
                    <div
                      className="flex cursor-pointer items-center pl-[30px]"
                      onClick={() => {
                        copyContent(v.id, intl.formatMessage({ id: 'mt.fuzhichenggong' }))
                      }}
                    >
                      <span className="text-xs text-gray-weak">ID</span>
                      <span className="px-[6px] text-xs text-gray-secondary">{v.id}</span>
                      <img src="/img/copy-icon.png" width={16} height={16} alt="" />
                    </div>
                    <div className="flex items-center pl-[30px]">
                      <img src="/img/time.png" width={16} height={16} alt="" />
                      <span className="pl-[6px] text-xs text-gray-secondary">{formatTime(v.createTime)}</span>
                    </div>
                  </div>
                </div>
                <div className="max-xl:hidden">{renderActionButton(v)}</div>
              </div>
              <div className="px-3 py-3">
                <SwitchPcOrWapLayout
                  pcComponent={
                    <div className={classNames('grid gap-y-3 xl:grid-cols-6 xxl:grid-cols-10')}>
                      {fieldList.map((item: any, idx) => {
                        return (
                          <div
                            className={classNames(
                              'text-left xxl:first:w-[160px] xxl:first:!text-left xxl:[&:not(:first-child,:last-child)]:pl-6 xxl:[&:nth-child(2)]:pl-0',
                              item.className
                            )}
                            key={idx}
                          >
                            {renderLabel(item)}
                            <span className={classNames('text-xs font-normal text-gray', renderProp(item, 'valueClassName', v))}>
                              {renderProp(item, 'value', v)}
                              {item.unit && (
                                <span className={classNames('text-xs text-gray-secondary', renderProp(item, 'unitClassName', v))}>
                                  &nbsp;{item.unit}
                                </span>
                              )}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  }
                  wapComponent={
                    <>
                      <div className={classNames('flex items-center', floatPL.className)}>
                        {renderLabel(floatPL)}
                        <span className={classNames('text-xs font-normal text-gray', renderProp(floatPL, 'valueClassName', v))}>
                          {renderProp(floatPL, 'value', v)}
                          {floatPL.unit && (
                            <span className={classNames('text-xs text-gray-secondary', renderProp(floatPL, 'unitClassName', v))}>
                              &nbsp;{floatPL.unit}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="my-2">
                        <span className="bg-gray-ef rounded-l bg-sub-card px-2 py-[2px] text-gray">
                          <FormattedMessage id="mt.zhiyingzhisun" />
                        </span>
                        <span className="bg-red px-2 py-[2px] text-white">{renderProp(slSp[0], 'value', v)}</span>
                        <span className="rounded-r bg-green px-2 py-[2px] text-white">{renderProp(slSp[1], 'value', v)}</span>
                      </div>
                      {isZh &&
                        groupBy(fieldList, 3).map((group, idx) => {
                          return (
                            <ListItem
                              key={idx}
                              left={{
                                value: renderProp(group?.[0], 'value', v),
                                label: renderLabel(group?.[0])
                              }}
                              center={{
                                value: renderProp(group?.[1], 'value', v),
                                label: renderLabel(group?.[1])
                              }}
                              right={{
                                value: renderProp(group?.[2], 'value', v),
                                label: renderLabel(group?.[2])
                              }}
                            />
                          )
                        })}
                      {!isZh &&
                        groupBy(fieldList, 2).map((group, idx) => {
                          return (
                            <ListItem
                              key={idx}
                              left={{
                                value: renderProp(group?.[0], 'value', v),
                                label: renderLabel(group?.[0])
                              }}
                              right={
                                group?.[1]
                                  ? {
                                      value: renderProp(group?.[1], 'value', v),
                                      label: renderLabel(group?.[1])
                                    }
                                  : undefined
                              }
                            />
                          )
                        })}
                      {renderActionButton(v)}
                    </>
                  }
                />
              </div>
            </div>
          )
        })}
      {list.length === 0 && (
        <div className="mb-6">
          <Empty />
        </div>
      )}
      {/* 平仓修改确认弹窗 */}
      <ClosePositionConfirmModal ref={closePositionRef} />
      {/* 设置止损止盈弹窗 */}
      <SetStopLossProfitModal ref={stopLossProfitRef} />
    </div>
  )
}

export default observer(Position)
