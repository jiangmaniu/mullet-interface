import { ProColumns } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'

import StandardTable from '@/components/Admin/StandardTable'
import { getEnum } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import { formatNum, toFixed } from '@/utils'
import { getBuySellInfo, getSymbolIcon } from '@/utils/business'

type Item = Order.TradeRecordsPageListItem

type IProps = {
  style?: React.CSSProperties
  showActiveSymbol?: boolean
  selectSymbol?: string
}

// 历史记录
function HistoryClose({ style, showActiveSymbol, selectSymbol }: IProps) {
  const { isPc } = useEnv()
  const { ws, trade } = useStores()
  const { recordListClassName } = useStyle()
  const [list, setList] = useState([] as Order.TradeRecordsPageListItem[])
  const activeSymbolName = trade.activeSymbolName
  const [loading, setLoading] = useState(false)
  const currentUnit = 'USD'
  const historyList = trade.historyCloseList
  const intl = useIntl()

  useEffect(() => {
    // setList(showActiveSymbol ? historyList.filter((v) => v.symbol === activeSymbolName) : historyList)
    setList(selectSymbol ? historyList.filter((v: any) => v.symbol === selectSymbol) : historyList)
  }, [showActiveSymbol, activeSymbolName, historyList.length, selectSymbol])

  const getList = () => {
    setLoading(true)
    trade.getHistoryList().finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    getList()
  }, [trade.currentAccountInfo?.id])

  const columns: ProColumns<Order.TradeRecordsPageListItem>[] = [
    {
      title: (
        <span className="!pl-1">
          <FormattedMessage id="mt.pinlei" />
        </span>
      ), // 与 antd 中基本相同，但是支持通过传入一个方法
      dataIndex: 'category',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      fixed: 'left',
      width: 180,
      renderText(text, record, index, action) {
        const buySellInfo = getBuySellInfo(record)
        return (
          <div className="flex items-center">
            <img width={26} height={26} alt="" src={getSymbolIcon(record.imgUrl)} className="rounded-full" />
            <div className="flex flex-col pl-4">
              <span className="text-base font-semibold text-gray">{record.symbol}</span>
              <span className={classNames('text-xs font-medium pt-[2px]', buySellInfo.colorClassName)}>{buySellInfo.text}</span>
            </div>
          </div>
        )
      }
    },
    {
      title: <FormattedMessage id="common.type" />,
      dataIndex: 'type',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 120,
      align: 'left',
      className: '!text-[13px] text-gray',
      renderText(text, record, index, action) {
        return getEnum().Enum.OrderInOut?.[record.inOut!]?.text || '-'
      }
    },
    {
      title: <FormattedMessage id="mt.kaicangjia" />,
      dataIndex: 'startPrice',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 150,
      renderText(text, record, index, action) {
        return <span className="!text-[13px] text-gray !font-dingpro-medium">{formatNum(text)} USD</span>
      }
    },
    {
      title: <FormattedMessage id="mt.chengjiaojia" />,
      dataIndex: 'tradePrice',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 150,
      renderText(text, record, index, action) {
        return <span className="!text-[13px] text-gray !font-dingpro-medium">{formatNum(text)} USD</span>
      }
    },
    {
      title: <FormattedMessage id="mt.shoushu" />,
      dataIndex: 'tradingVolume',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 150,
      align: 'left',
      renderText(text, record, index, action) {
        return <span className="!text-[13px] text-gray">{formatNum(text)}</span>
      }
    },
    {
      title: <FormattedMessage id="mt.shouxufei" />,
      dataIndex: 'handlingFees',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 150,
      renderText(text, record, index, action) {
        return <span className="!text-[13px] text-gray !font-dingpro-medium">{formatNum(text)} USD</span>
      }
    },
    {
      title: <FormattedMessage id="mt.jiaoyishijian" />,
      dataIndex: 'createTime',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 180,
      className: '!text-[13px] text-gray'
    },
    {
      title: <FormattedMessage id="mt.chengjiaodanhao" />,
      dataIndex: 'id',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 200
    },
    {
      title: <FormattedMessage id="mt.yingkui" />,
      dataIndex: 'profit',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 160,
      align: 'right',
      fixed: 'right',
      renderText(text, record, index, action) {
        const profit = record.profit
        const flag = Number(profit) > 0
        const color = flag ? 'text-green' : 'text-red'
        const profitFormat = formatNum(profit)
        return (
          <>
            {profit ? (
              <span className={classNames('font-[800] !font-dingpro-medium', color)}>{flag ? '+' + profitFormat : profitFormat} USD</span>
            ) : (
              '0.00'
            )}
          </>
        )
      }
    }
  ]

  const dataSource = list.map((v) => {
    const digits = v.symbolDecimal || 2
    v.tradePrice = toFixed(v.tradePrice, digits)
    v.startPrice = toFixed(v.startPrice, digits)
    v.handlingFees = toFixed(v.handlingFees, digits)
    v.tradingVolume = toFixed(v.tradingVolume, digits)
    v.profit = toFixed(v.profit, digits)

    return v
  })

  return (
    <>
      <StandardTable
        columns={columns}
        // ghost
        showOptionColumn={false}
        dataSource={dataSource}
        stripe={false}
        hasTableBordered
        hideSearch
        cardBordered={false}
        bordered={false}
        className={recordListClassName}
        cardProps={{
          bodyStyle: { padding: 0 },
          headStyle: { borderRadius: 0 },
          className: ''
        }}
        rowClassName={(record, i) => {
          return record.buySell === 'BUY' ? 'table-row-green' : 'table-row-red'
        }}
        size="small"
        loading={loading}
        pageSize={20}
      />
    </>
  )
}

export default observer(HistoryClose)
