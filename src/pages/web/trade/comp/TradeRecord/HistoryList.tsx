import { PageLoading, ProFormDateRangePicker, ProFormSelect } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'

import CustomTabs from '@/components/Base/CustomTabs'
import Empty from '@/components/Base/Empty'
import ListItem from '@/components/Base/ListItem'
import { TRADE_TYPE } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { formatNum, groupBy, toFixed } from '@/utils'
import { STORAGE_GET_TOKEN } from '@/utils/storage'

type IProps = {
  style?: React.CSSProperties
  showActiveSymbol?: boolean
}

// 历史记录
function HistoryList({ style, showActiveSymbol }: IProps) {
  const { isPc } = useEnv()
  const { ws, global } = useStores()
  const [historyList, setHistoryList] = useState([])
  const [list, setList] = useState([])
  const activeSymbolName = global.activeSymbolName
  const [loading, setLoading] = useState(false)
  const currentUnit = 'USD'
  const [tabKey, setTabKey] = useState('close') // 历史成交、历史挂单

  useEffect(() => {
    // setList(showActiveSymbol ? historyList.filter((v: any) => v.symbol === activeSymbolName) : historyList)
    // @TODO 测试
    // @ts-ignore
    setList([{}, {}])
  }, [showActiveSymbol, activeSymbolName, historyList.length])

  useEffect(() => {
    getCloseOrders()
  }, [global.currentAccount])

  // 获取历史平仓数据
  const getCloseOrders = async () => {
    if (!STORAGE_GET_TOKEN()) return
    const data = {
      pageIndex: 1,
      pageSize: 9999,
      Account: global.currentAccount
    }
    setLoading(true)
    // const rep = await user.getCloseOrders(data)
    // setLoading(false)
    // if (!rep.success) {
    //   message.error(rep.error.message)
    // } else {
    //   setHistoryList(rep.result.data)
    // }
  }

  const formatValue = (value: any) => <span className="font-num">{formatNum(value)}</span>

  const floatPL: any = {
    label: <FormattedMessage id="mt.yingkui" />,
    value: (item: any) => {
      const profitFormat = formatValue(item?.profit)
      return item.profit > 0 ? <>+{profitFormat}</> : profitFormat
    },
    valueClassName: (item: any) => `${item?.profit > 0 ? '!text-green' : '!text-red'} xl:!text-[16px] max-xl:!text-lg !font-bold`,
    unit: currentUnit,
    unitClassName: (item: any) => `${item?.profit > 0 ? '!text-green' : '!text-red'}`
  }
  const time = {
    label: tabKey === 'close' ? <FormattedMessage id="mt.chengjiaoshijian" /> : <FormattedMessage id="mt.guadanshijian" />,
    value: (item: any) => {
      return item.closeTime?.replace('T', ' ')
    }
  }
  const vol = { label: <FormattedMessage id="mt.shoushu" />, value: (item: any) => item.lot }
  const typeItem = {
    label: <FormattedMessage id="common.type" />,
    valueClassName: '!font-bold',
    value: (item: any) => {
      return item.type === TRADE_TYPE.LIMIT_BUY || item.type === TRADE_TYPE.LIMIT_SELL ? (
        <FormattedMessage id="mt.xianjiadan" />
      ) : (
        <FormattedMessage id="mt.shijiadan" />
      )
    }
  }
  const orderSwaps = {
    label: <FormattedMessage id="mt.lixi" />,
    value: (item: any) => formatValue(parseFloat(item.orderSwaps).toFixed(2)),
    unit: currentUnit
  }
  const orderNo = { label: <FormattedMessage id="mt.dingdanhao" />, value: (item: any) => `${item.orderId}` }
  const closePrice = {
    label: tabKey === 'close' ? <FormattedMessage id="mt.pingcangjia" /> : <FormattedMessage id="mt.guadanjia" />,
    // @TODO
    value: (item: any) => formatValue(item.closePrice),
    unit: currentUnit
  }
  const openPrice = {
    label: <FormattedMessage id="mt.kaicangjia" />,
    value: (item: any) => formatValue(item?.openPrice),
    unit: currentUnit
  }
  const commission = { label: <FormattedMessage id="mt.shouxufei" />, value: (item: any) => toFixed(item.commission), unit: currentUnit }
  const slSp = [
    { label: <FormattedMessage id="mt.zhisun" />, value: (item: any) => formatValue(toFixed(item?.sl, item?.digits)), unit: currentUnit },
    { label: <FormattedMessage id="mt.zhiying" />, value: (item: any) => formatValue(toFixed(item?.tp, item?.digits)), unit: currentUnit }
  ]

  // const pcList = [time, openPrice, closePrice, vol, orderSwaps, orderNo, commission, floatPL]
  // const mobileList = [vol, orderNo, openPrice, closePrice, orderSwaps, commission, time]
  const pcList = [
    typeItem,
    time,
    orderNo,
    openPrice,
    closePrice,
    commission,
    ...slSp,
    vol,
    ...(tabKey === 'close' ? [commission, floatPL] : [])
  ]
  const mobileList = [typeItem, vol, orderNo, openPrice, closePrice, commission, ...slSp, time]

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

  const filterClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-select-selector,.ant-picker-range': {
        borderRadius: '16px !important'
      }
    }
  })

  return (
    <div style={style}>
      <div className="flex items-center justify-between mb-4">
        <CustomTabs
          items={[
            { label: <FormattedMessage id="mt.lishichengjiao" />, key: 'close' },
            { label: <FormattedMessage id="mt.lishiguadan" />, key: 'pending' }
          ]}
          onChange={(key) => {
            setTabKey(key)
          }}
          activeKey={tabKey}
        />
        <div className={classNames('flex items-center gap-x-3', filterClassName)}>
          <ProFormSelect
            options={[
              {
                label: 'BTC',
                value: '1'
              },
              {
                label: 'GOLD',
                value: '2'
              }
            ]}
            fieldProps={{
              // value: '1',
              optionItemRender: (item: any) => {
                return (
                  <div className="flex items-center">
                    <img src="/img/coin-icon/AAVEUSDT.png" alt="" className="w-[20px] h-[20px] rounded-full" />
                    <span className="text-sub pl-1">{item.label}</span>
                  </div>
                )
              },
              onChange: (value) => {
                // @TODO 根据选择的值，筛选历史记录
              }
            }}
          />
          <ProFormDateRangePicker />
        </div>
      </div>
      <div>
        {list.length > 0 &&
          !loading &&
          list.map((v: any, idx) => (
            <div key={idx} className="mb-3 rounded-xl border border-primary">
              <div className="flex items-center justify-between bg-sub-card/50 px-3 py-[6px]">
                <div className="flex items-center">
                  <img width={22} height={22} alt="" src={`/img/coin-icon/${v.symbol}.png`} className="rounded-full" />
                  <span className="pl-[6px] text-base font-semibold text-gray">{v.symbol}</span>
                  <span className={classNames('pl-[6px] text-sm font-medium', v.command === 'OP_SELL' ? 'text-red' : 'text-green')}>
                    {v.command === 'OP_SELL' ? <FormattedMessage id="mt.maichupingcang" /> : <FormattedMessage id="mt.mairupingcang" />}·{' '}
                    <FormattedMessage id="mt.zhucang" />
                    20X
                  </span>
                </div>
                {/* 分享海报位置icon */}
                {/* <div className="flex items-center">
                <Image src='' width={} height={}  alt='' />
              </div> */}
              </div>
              <div className="px-3 py-3">
                <SwitchPcOrWapLayout
                  pcComponent={
                    <div className={classNames('grid gap-y-3 xl:grid-cols-6', tabKey === 'close' ? 'xxl:grid-cols-11' : 'xxl:grid-cols-9')}>
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
                      <div className={classNames('flex flex-col items-start', floatPL.className)}>
                        <span className={classNames('text-xs font-normal text-gray', renderProp(floatPL, 'valueClassName', v))}>
                          {renderProp(floatPL, 'value', v)}
                          {floatPL.unit && (
                            <span className={classNames('pl-1 text-xs text-gray-secondary', renderProp(floatPL, 'unitClassName', v))}>
                              {floatPL.unit}
                            </span>
                          )}
                        </span>
                        {renderLabel(floatPL)}
                      </div>
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
          ))}
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

export default observer(HistoryList)
