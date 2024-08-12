import { PageLoading } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'

import Empty from '@/components/Base/Empty'
import ListItem from '@/components/Base/ListItem'
import SymbolIcon from '@/components/Base/SymbolIcon'
import { getEnum, ORDER_TYPE } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { copyContent, formatNum, formatTime, groupBy, toFixed } from '@/utils'
import { getBuySellInfo } from '@/utils/business'

type Item = Order.OrderPageListItem

type IProps = {
  style?: React.CSSProperties
  showActiveSymbol?: boolean
  selectSymbol?: string
}

// 历史挂单列表
function HistoryPendingList({ style, showActiveSymbol, selectSymbol }: IProps) {
  const { isPc } = useEnv()
  const { ws, trade } = useStores()
  const [list, setList] = useState([] as Order.OrderPageListItem[])
  const activeSymbolName = trade.activeSymbolName
  const [loading, setLoading] = useState(false)
  const currentUnit = 'USD'
  const historyList = trade.historyPendingList
  const intl = useIntl()

  useEffect(() => {
    // setList(showActiveSymbol ? historyList.filter((v) => v.symbol === activeSymbolName) : historyList)
    setList(selectSymbol ? historyList.filter((v: any) => v.symbol === selectSymbol) : historyList)
  }, [showActiveSymbol, activeSymbolName, historyList.length, selectSymbol])

  const getList = () => {
    setLoading(true)
    // 查询历史挂单
    trade.getHistoryPendingList().finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    getList()
  }, [trade.currentAccountInfo?.id])

  const formatValue = (value: any) => <span className="!font-dingpro-medium">{formatNum(value)}</span>

  const time = {
    label: <FormattedMessage id="mt.guadanshijian" />,
    value: (item: Item) => {
      return item.createTime
    }
  }
  const vol = { label: <FormattedMessage id="mt.shoushu" />, value: (item: Item) => toFixed(item.tradingVolume, item.symbolDecimal) }
  const typeItem = {
    label: <FormattedMessage id="common.type" />,
    valueClassName: '!font-bold',
    value: (item: Item) => {
      return item.type === ORDER_TYPE.LIMIT_BUY_ORDER || item.type === ORDER_TYPE.LIMIT_SELL_ORDER ? (
        <FormattedMessage id="mt.xianjiadan" />
      ) : (
        <FormattedMessage id="mt.tingsundan" />
      )
    }
  }
  const orderNo = { label: <FormattedMessage id="mt.dingdanhao" />, value: (item: Item) => `${item.id}` }
  const closePrice = {
    label: <FormattedMessage id="mt.guadanjia" />,
    value: (item: Item) => formatValue(toFixed(item.limitPrice, item.symbolDecimal)),
    unit: currentUnit
  }
  const openPrice = {
    label: <FormattedMessage id="mt.chengjiaojia" />,
    value: (item: Item) => formatValue(toFixed(item?.tradePrice, item.symbolDecimal)),
    unit: currentUnit
  }
  const commission = {
    label: <FormattedMessage id="mt.shouxufei" />,
    value: (item: Item) => toFixed(item.handlingFees, item.symbolDecimal),
    unit: currentUnit
  }

  const orderStatus = {
    label: <FormattedMessage id="common.status" />,
    value: (item: any) => getEnum().Enum.OrderStatus?.[item?.status]?.text || '-'
  }

  const pcList = [typeItem, openPrice, closePrice, commission, vol, orderStatus]
  const mobileList = [typeItem, vol, orderNo, openPrice, closePrice, commission, time]

  const fieldList = isPc ? pcList : mobileList

  const renderLabel = (item: any) => {
    // return (
    //   <Tooltip placement="top" title={item?.value}>
    //     <span className="text-gray-secondary mr-2 border-b border-dashed text-xs font-normal">{item?.label}</span>
    //   </Tooltip>
    // )
    return <span className="text-xs font-normal text-gray-secondary xl:mr-2">{item?.label}</span>
  }

  /**
   * 渲染属性值
   * @param {*} item 配置item
   * @param {*} key 配置item key
   * @param {*} obj 数据item
   * @returns
   */
  const renderProp = (item: any, key: any, obj: any) => {
    return typeof item?.[key] === 'function' ? item?.[key]?.(obj) : item?.[key]
  }

  return (
    <div style={style}>
      <div>
        {list.length > 0 &&
          !loading &&
          list.map((v: any, idx) => {
            const buySellInfo = getBuySellInfo(v)
            const isLimitOrder = v.type === ORDER_TYPE.LIMIT_BUY_ORDER || v.type === ORDER_TYPE.LIMIT_SELL_ORDER // 限价单
            v.isLimitOrder = isLimitOrder
            return (
              <div key={idx} className="mb-3 rounded-xl border border-primary">
                <div className="flex items-center justify-between bg-gray-50/50 px-3 py-[6px]">
                  <div className="flex items-center">
                    <SymbolIcon src={v?.imgUrl} width={22} height={22} />
                    <span className="pl-[6px] text-base font-semibold text-gray">{v.symbol}</span>
                    <span className={classNames('pl-[6px] text-sm font-medium', buySellInfo.colorClassName)}>{buySellInfo.text}</span>
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
                  {/* 分享海报位置icon */}
                  {/* <div className="flex items-center">
                  <Image src='' width={} height={}  alt='' />
                </div> */}
                </div>
                <div className="px-3 py-3">
                  <SwitchPcOrWapLayout
                    pcComponent={
                      <div className={classNames('grid gap-y-3 xl:grid-cols-6 xxl:grid-cols-6')}>
                        {fieldList.map((item: any, idx) => (
                          <div className={classNames('xxl:last:text-right', item.className)} key={idx}>
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
                        {groupBy(fieldList, 3).map((group, idx) => {
                          return (
                            <ListItem
                              key={idx}
                              left={{
                                value: renderProp(group?.[0], 'value', v),
                                label: renderLabel(group[0])
                              }}
                              center={
                                group[1]
                                  ? {
                                      value: renderProp(group?.[1], 'value', v),
                                      label: renderLabel(group[1])
                                    }
                                  : undefined
                              }
                              right={
                                group[2]
                                  ? {
                                      value: renderProp(group?.[2], 'value', v),
                                      label: renderLabel(group[2])
                                    }
                                  : undefined
                              }
                            />
                          )
                        })}
                      </>
                    }
                  />
                </div>
              </div>
            )
          })}
      </div>
      {list.length === 0 && !loading && (
        <div className="mb-6">
          <Empty />
        </div>
      )}
      {loading && <PageLoading className="h-[100px]" />}
    </div>
  )
}

export default observer(HistoryPendingList)
