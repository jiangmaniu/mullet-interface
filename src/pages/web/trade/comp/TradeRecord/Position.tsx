import { FormattedMessage, useIntl } from '@umijs/max'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import { cloneDeep } from 'lodash'
import { observer } from 'mobx-react'
import { useRef } from 'react'

import Empty from '@/components/Base/Empty'
import ListItem from '@/components/Base/ListItem'
import { TRADE_TYPE } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { copyContent, formatNum, formatTime, groupBy, toFixed } from '@/utils'

import ClosePositionConfirmModal from '../Modal/ClosePositionConfirmModal'
import SetStopLossProfitModal from '../Modal/SetStopLossProfitModal'
import Signal from './comp/Signal'

type IProps = {
  style?: React.CSSProperties
  parentPopup?: any
  showActiveSymbol?: boolean
}

// 持仓记录
function Position({ style, parentPopup, showActiveSymbol }: IProps) {
  const { isPc } = useEnv()
  const { ws, global } = useStores()
  const { lng } = useLang()
  const { quotes, symbols } = ws
  const isZh = lng === 'zh-TW'
  const intl = useIntl()

  const closePositionRef = useRef<any>(null)
  const stopLossProfitRef = useRef<any>(null)

  const unit = 'USD'
  const tradeList = cloneDeep(ws.tradeList).sort((a, b) => b.utime - a.utime)

  const activeSymbolName = global.activeSymbolName
  let list = showActiveSymbol ? tradeList.filter((v) => v.symbol === activeSymbolName) : tradeList
  // @ts-ignore
  list = [{}, {}] // 测试

  const formatValue = (value: any) => <span className="font-num">{formatNum(value)}</span>

  const slSp = [
    { label: <FormattedMessage id="mt.zhisun" />, value: (item: any) => formatValue(toFixed(item?.sl, item?.digits)), unit },
    { label: <FormattedMessage id="mt.zhiying" />, value: (item: any) => formatValue(toFixed(item?.tp, item?.digits)), unit }
  ]

  const floatPL = {
    label: <FormattedMessage id="mt.fudongyingkui" />,
    value: (item: any) => {
      const profitFormat = formatValue(item?.profitFormat)
      return item.profit > 0 ? <>+{profitFormat}</> : profitFormat
    },
    valueClassName: (item: any) => `${item?.profit > 0 ? '!text-green' : '!text-red'} !text-[16px]`,
    className: 'xxl:text-right',
    unit,
    unitClassName: (item: any) => {
      return item?.profit > 0 ? '!text-green' : 'text-red'
    }
  }
  const time = {
    label: <FormattedMessage id="mt.jiaoyishijian" />,
    key: 'time',
    value: (item: any) => {
      return formatTime(item?.utime)
    }
  }
  const vol = { label: <FormattedMessage id="mt.shoushu" />, value: (item: any) => item?.number }
  const openPrice = { label: <FormattedMessage id="mt.kaicangjia" />, value: (item: any) => formatValue(item?.price) }
  const currentPrice = {
    label: <FormattedMessage id="mt.xianjia" />,
    value: (item: any) => formatValue(item.currentPrice)
  }
  const interest = { label: <FormattedMessage id="mt.lixi" />, value: (item: any) => toFixed(item.storage) || 0.0 }
  const fee = { label: <FormattedMessage id="mt.shouxufei" />, value: (item: any) => toFixed(item.storage) || 0.0 }
  const orderNo = { label: <FormattedMessage id="mt.chicangdanhao" />, value: (item: any) => `#${item.position}` }
  const margin = { label: <FormattedMessage id="mt.baozhengjin" />, value: (item: any) => `#${item.margin}` }
  const stock = { label: <FormattedMessage id="mt.kucunfei" />, value: (item: any) => `#${item.stock}` }
  const yieldRate = { label: <FormattedMessage id="mt.shouyilv" />, value: (item: any) => `#${item.stock}` }
  const baocangPrice = { label: <FormattedMessage id="mt.qiangpingjia" />, value: (item: any) => `#${item.stock}` }

  // const pcList = [vol, openPrice, currentPrice, ...slSp, interest, floatPL]
  // const mobileList = [time, vol, openPrice, currentPrice, interest, orderNo]
  const pcList = [openPrice, margin, vol, ...slSp, baocangPrice, fee, stock, yieldRate, floatPL]
  const mobileList = [time, vol, openPrice, margin, fee, stock, baocangPrice, yieldRate, orderNo]

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
        list.map((v: any, idx) => {
          const symbolName = v.symbol
          // @ts-ignore
          // if (!quotes[symbolName] || !symbols[symbolName]) return
          // const digits = v.digits
          // const price =
          //   v.action === TRADE_TYPE.MARKET_SELL
          //     ? // @ts-ignore
          //       quotes[symbolName]
          //       ? // @ts-ignore
          //         toFixed(quotes[symbolName].ask, digits)
          //       : 0
          //     : // @ts-ignore
          //     quotes[symbolName]
          //     ? // @ts-ignore
          //       toFixed(quotes[symbolName].bid, digits)
          //     : 0

          // v.price = toFixed(v.price, digits) // 开仓价
          // v.currentPrice = toFixed(price, digits) // 现价
          // const profit = covertProfit(quotes, symbols, v) // 浮动盈亏
          // v.profit = profit
          // // @ts-ignore
          // v.profitFormat = profit > 0 ? '+' + toFixed(profit) : toFixed(profit)
          // v.number = toFixed(v?.vol / 10000) // 可平仓手数

          return (
            <div key={idx} className="mb-3 rounded-xl border border-primary">
              <div className="flex items-center justify-between bg-sub-card/50 px-3 py-[6px]">
                <div className="flex items-center">
                  <img width={22} height={22} alt="" src={`/img/coin-icon/${symbolName}.png`} className="rounded-full" />
                  <span className="pl-[6px] text-base font-semibold text-gray">{v.symbol}</span>
                  <span
                    className={classNames('pl-[6px] text-sm font-medium', v.action === TRADE_TYPE.MARKET_BUY ? 'text-green' : 'text-red')}
                  >
                    {v.action === TRADE_TYPE.MARKET_BUY ? <FormattedMessage id="mt.mairu" /> : <FormattedMessage id="mt.maichu" />}·{' '}
                    <FormattedMessage id="mt.zhucang" />
                    20X
                  </span>
                  <div className="ml-3">
                    {/* @TODO 爆仓信号灯 规则是怎么样的 */}
                    <Signal />
                  </div>
                  {/* pc显示 */}
                  <div className="flex items-center max-xl:hidden">
                    <div
                      className="flex cursor-pointer items-center pl-[30px]"
                      onClick={() => {
                        copyContent(v.position, intl.formatMessage({ id: 'mt.fuzhichenggong' }))
                      }}
                    >
                      <span className="text-xs text-gray-weak">ID</span>
                      <span className="px-[6px] text-xs text-gray-secondary">{v.position}</span>
                      <img src="/img/copy-icon.png" width={16} height={16} alt="" />
                    </div>
                    <div className="flex items-center pl-[30px]">
                      <img src="/img/time.png" width={16} height={16} alt="" />
                      <span className="pl-[6px] text-xs text-gray-secondary">{formatTime(v.utime)}</span>
                    </div>
                  </div>
                </div>
                <div className="max-xl:hidden">{renderActionButton(v)}</div>
              </div>
              <div className="px-3 py-3">
                <SwitchPcOrWapLayout
                  pcComponent={
                    <div className="grid gap-y-3 xl:grid-cols-6 xxl:grid-cols-10">
                      {fieldList.map((item: any, idx) => (
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
                      ))}
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
      <ClosePositionConfirmModal ref={closePositionRef} tradeList={tradeList} />
      {/* 设置止损止盈弹窗 */}
      <SetStopLossProfitModal ref={stopLossProfitRef} tradeList={tradeList} />
    </div>
  )
}

export default observer(Position)
