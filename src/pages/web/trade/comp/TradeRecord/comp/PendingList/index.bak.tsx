import { FormattedMessage } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { useRef } from 'react'

import Empty from '@/components/Base/Empty'
import ListItem from '@/components/Base/ListItem'
import { ORDER_TYPE, TRADE_BUY_SELL } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { formatNum, formatTime, groupBy, toFixed } from '@/utils'
import { getBuySellInfo, getSymbolIcon } from '@/utils/business'
import { getCurrentQuote } from '@/utils/wsUtil'

import PendingOrderCancelModal from '../../../Modal/PendingOrderCancelModal'
import ModifyPendingOrderModal from '../../../Modal/PendingOrderModifyModal'

export type IPendingItem = Order.OrderPageListItem & {
  /**现价 */
  currentPrice: number
  /**是否是限价单 */
  isLimitOrder: boolean
}

type IProps = {
  style?: React.CSSProperties
  parentPopup?: any
  showActiveSymbol?: boolean
}

// 挂单记录
function PendingList({ style, parentPopup, showActiveSymbol }: IProps) {
  const { isPc } = useEnv()
  const { ws, trade } = useStores()
  const unit = 'USD'

  let list = trade.pendingList as IPendingItem[]

  const cancelPendingRef = useRef<any>(null)
  const modifyPendingRef = useRef<any>(null)

  const formatValue = (value: any) => <span className="!font-dingpro-medium">{formatNum(value)}</span>

  const slSp = [
    {
      label: <FormattedMessage id="mt.zhisun" />,
      value: (item: IPendingItem) => formatValue(toFixed(item?.stopLoss, item?.symbolDecimal))
    },
    {
      label: <FormattedMessage id="mt.zhiying" />,
      value: (item: IPendingItem) => formatValue(toFixed(item?.takeProfit, item?.symbolDecimal))
    }
  ]

  const time = {
    label: <FormattedMessage id="mt.guadanshijian" />,
    value: (item: IPendingItem) => {
      return formatTime(item.createTime)
    }
  }
  const pendingPrice = {
    label: <FormattedMessage id="mt.guadanjia" />,
    value: (item: IPendingItem) => formatValue(toFixed(item?.limitPrice, item?.symbolDecimal))
  }
  const orderNo = { label: <FormattedMessage id="mt.dingdanhao" />, value: (item: IPendingItem) => `#${item.id}` }
  const vol = { label: <FormattedMessage id="mt.shoushu" />, value: (item: IPendingItem) => item.orderVolume }
  const typeItem = {
    label: <FormattedMessage id="common.type" />,
    valueClassName: '!font-bold',
    value: (item: IPendingItem) => {
      return item.isLimitOrder ? <FormattedMessage id="mt.xianjiaguadan" /> : <FormattedMessage id="mt.tingsundan" />
    }
  }

  const pcList = [typeItem, time, orderNo, pendingPrice, ...slSp, vol]

  const mobileList = [vol, typeItem, orderNo, time]

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
          list.map((v: IPendingItem, idx) => {
            const dataSourceSymbol = v.dataSourceSymbol as string
            const quoteInfo = getCurrentQuote(dataSourceSymbol)
            const digits = v.symbolDecimal || 2
            const currentPrice = v.buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.ask : quoteInfo?.bid
            const isLimitOrder = v.type === ORDER_TYPE.LIMIT_BUY_ORDER || v.type === ORDER_TYPE.LIMIT_SELL_ORDER // 限价单

            v.currentPrice = currentPrice // 现价，根据买卖方向获取当前价格
            v.orderVolume = toFixed(v.orderVolume, digits) // 手数格式化
            v.isLimitOrder = isLimitOrder

            const buySellInfo = getBuySellInfo(v)
            return (
              <div key={idx} className="mb-3 rounded-xl border border-primary">
                <div className="flex items-center justify-between bg-sub-card/50 px-3 py-[6px]">
                  <div className="flex items-center">
                    <img width={22} height={22} alt="" src={getSymbolIcon(v.imgUrl)} className="rounded-full border border-gray-90" />
                    <span className="pl-[6px] text-base font-semibold text-gray">{v.symbol}</span>
                    <span className={classNames('pl-[6px] text-sm font-medium', buySellInfo.colorClassName)}>{buySellInfo.text}</span>
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
      <ModifyPendingOrderModal ref={modifyPendingRef} list={[]} />
    </div>
  )
}

export default observer(PendingList)
