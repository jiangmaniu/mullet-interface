import { FormattedMessage } from '@umijs/max'
import classNames from 'classnames'
import { cloneDeep } from 'lodash'
import { observer } from 'mobx-react'
import { useRef } from 'react'

import Empty from '@/components/Base/Empty'
import ListItem from '@/components/Base/ListItem'
import { TRADE_TYPE } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { formatNum, formatTime, groupBy, toFixed } from '@/utils'

import PendingOrderCancelModal from '../Modal/PendingOrderCancelModal'
import ModifyPendingOrderModal from '../Modal/PendingOrderModifyModal'

type IProps = {
  style?: React.CSSProperties
  parentPopup?: any
  showActiveSymbol?: boolean
}

// 挂单记录
function PendingOrder({ style, parentPopup, showActiveSymbol }: IProps) {
  const { isPc } = useEnv()
  const { ws, global } = useStores()
  const { quotes, symbols } = ws
  const activeSymbolName = global.activeSymbolName
  const unit = 'USD'
  const pendingList = cloneDeep(ws.pendingList).sort((a, b) => b.utime - a.utime)

  let list = showActiveSymbol ? pendingList.filter((v) => v.symbol === activeSymbolName) : pendingList
  // @ts-ignore
  list = [{}, {}] // 测试

  const cancelPendingRef = useRef<any>(null)
  const modifyPendingRef = useRef<any>(null)

  const formatValue = (value: any) => <span className="font-num">{formatNum(value)}</span>

  const slSp = [
    { label: <FormattedMessage id="mt.zhisun" />, value: (item: any) => formatValue(toFixed(item?.sl, item?.digits)), unit },
    { label: <FormattedMessage id="mt.zhiying" />, value: (item: any) => formatValue(toFixed(item?.tp, item?.digits)), unit }
  ]

  const time = {
    label: <FormattedMessage id="mt.guadanshijian" />,
    value: (item: any) => {
      return formatTime(item.utime)
    }
  }
  const pendingPrice = {
    label: <FormattedMessage id="mt.guadanjia" />,
    value: (item: any) => formatValue(toFixed(item.price, item?.digits))
  }
  const orderNo = { label: <FormattedMessage id="mt.dingdanhao" />, value: (item: any) => `#${item.order}` }
  const vol = { label: <FormattedMessage id="mt.shoushu" />, value: (item: any) => item.vol }
  const typeItem = {
    label: <FormattedMessage id="common.type" />,
    valueClassName: '!font-bold',
    value: (item: any) => {
      return item.type === TRADE_TYPE.LIMIT_BUY || item.type === TRADE_TYPE.LIMIT_SELL ? (
        <FormattedMessage id="mt.xianjiaguadan" />
      ) : (
        <FormattedMessage id="mt.tingsundan" />
      )
    }
  }

  const pcList = [typeItem, time, orderNo, pendingPrice, ...slSp, vol]

  const mobileList = [vol, typeItem, orderNo, time]

  const fieldList = isPc ? pcList : mobileList

  const renderLabel = (item: any) => {
    // 处理内容
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
    return typeof item?.[key] === 'function' ? item?.[key](obj) : item[key]
  }

  const renderActionButton = (item: any) => {
    return (
      <div className="flex items-center max-xl:mt-3 max-xl:justify-between">
        <div
          className="mr-2 min-w-[70px] cursor-pointer rounded border-gray-250 px-2 py-[5px] text-center font-normal text-gray max-xl:w-[48%] max-xl:bg-sub-card max-xl:text-sm xl:border xl:text-xs"
          onClick={() => {
            parentPopup?.close()
            cancelPendingRef.current?.show(item)
          }}
        >
          <FormattedMessage id="mt.cexiao" />
        </div>
        <div
          className="min-w-[70px] cursor-pointer rounded border-gray-250 px-2 py-[5px] text-center font-normal text-gray max-xl:w-[48%] max-xl:bg-sub-card max-xl:text-sm xl:border xl:text-xs"
          onClick={() => {
            parentPopup?.close()
            modifyPendingRef.current?.show(item)
          }}
        >
          <FormattedMessage id="mt.xiugai" />
        </div>
      </div>
    )
  }

  return (
    <div style={style}>
      <div>
        {list.length > 0 &&
          list.map((v: any, idx) => {
            const symbolName = v.symbol
            // v.vol = toFixed(v?.vol / 10000)
            const isBuy = v.type === TRADE_TYPE.LIMIT_BUY || v.type === TRADE_TYPE.STOP_LIMIT_BUY
            // const price =
            //   v.type === TRADE_TYPE.LIMIT_SELL || v.type === TRADE_TYPE.STOP_LIMIT_SELL
            //     ? // @ts-ignore
            //       quotes[v.symbol]
            //       ? // @ts-ignore
            //         toFixed(quotes[v.symbol].ask, v.digits)
            //       : 0
            //     : // @ts-ignore
            //     quotes[v.symbol]
            //     ? // @ts-ignore
            //       toFixed(quotes[v.symbol].bid, v.digits)
            //     : 0
            // v.currentPrice = price // 现价
            return (
              <div key={idx} className="mb-3 rounded-xl border border-primary">
                <div className="flex items-center justify-between bg-sub-card/50 px-3 py-[6px]">
                  <div className="flex items-center">
                    <img width={22} height={22} alt="" src={`/img/coin-icon/${symbolName}.png`} className="rounded-full" />
                    <span className="pl-[6px] text-base font-semibold text-gray">{v.symbol}</span>
                    <span className={classNames('pl-[6px] text-sm font-medium', isBuy ? 'text-green' : 'text-red')}>
                      {isBuy ? <FormattedMessage id="mt.mairu" /> : <FormattedMessage id="mt.maichu" />} ·{' '}
                      <FormattedMessage id="mt.zhucang" />
                      20X
                    </span>
                  </div>
                  <div className="max-xl:hidden">{renderActionButton(v)}</div>
                </div>
                <div className="px-3 py-3">
                  <SwitchPcOrWapLayout
                    pcComponent={
                      <div className="grid grid-cols-4 gap-y-3 xxl:grid-cols-7">
                        {fieldList.map((item, idx) => (
                          <div key={idx} className="xxl:last:text-right">
                            {renderLabel(item)}
                            <span className={classNames('text-xs font-normal text-gray', renderProp(item, 'valueClassName', v))}>
                              {renderProp(item, 'value', v)}
                            </span>
                          </div>
                        ))}
                      </div>
                    }
                    wapComponent={
                      <>
                        <div className="flex items-center pb-1">
                          {renderLabel(pendingPrice)}
                          <span className="text-xs text-gray">{renderProp(pendingPrice, 'value', v)}</span>
                        </div>
                        <div className="my-2">
                          <span className="bg-gray-ef rounded-l bg-sub-card px-2 py-[2px] text-gray">
                            <FormattedMessage id="mt.zhiyingzhisun" />
                          </span>
                          <span className="bg-red px-2 py-[2px] text-white">{renderProp(slSp[0], 'value', v)}</span>
                          <span className="rounded-r bg-green px-2 py-[2px] text-white">{renderProp(slSp[1], 'value', v)}</span>
                        </div>
                        {groupBy(fieldList, 2).map((group, idx) => {
                          return (
                            <ListItem
                              key={idx}
                              left={
                                group?.[0]
                                  ? {
                                      value: renderProp(group?.[0], 'value', v),
                                      label: renderLabel(group?.[0])
                                    }
                                  : undefined
                              }
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
      </div>
      {list.length === 0 && (
        <div className="mb-6">
          <Empty />
        </div>
      )}
      {/* 取消挂单弹窗 */}
      <PendingOrderCancelModal ref={cancelPendingRef} />
      {/* 修改挂单弹窗 */}
      <ModifyPendingOrderModal ref={modifyPendingRef} pendingList={list} />
    </div>
  )
}

export default observer(PendingOrder)
