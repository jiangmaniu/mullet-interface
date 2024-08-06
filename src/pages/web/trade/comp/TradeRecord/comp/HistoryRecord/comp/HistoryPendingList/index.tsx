import { ProColumns } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'

import StandardTable from '@/components/Admin/StandardTable'
import SymbolIcon from '@/components/Base/SymbolIcon'
import { getEnum, ORDER_TYPE } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import { formatNum, toFixed } from '@/utils'
import { getBuySellInfo } from '@/utils/business'

type IHistoryPendingItem = Order.OrderPageListItem & {
  isLimitOrder?: boolean
}

type IProps = {
  style?: React.CSSProperties
  showActiveSymbol?: boolean
  selectSymbol?: string
}

// 历史挂单列表
function HistoryPendingList({ style, showActiveSymbol, selectSymbol }: IProps) {
  const { isPc } = useEnv()
  const { ws, trade } = useStores()
  const { recordListClassName } = useStyle()
  const [list, setList] = useState([] as IHistoryPendingItem[])
  const [loading, setLoading] = useState(false)
  const intl = useIntl()
  const activeSymbolName = trade.activeSymbolName
  const historyList = trade.historyPendingList

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

  const columns: ProColumns<IHistoryPendingItem>[] = [
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
            <SymbolIcon src={record?.imgUrl} />
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
        return record.type === ORDER_TYPE.LIMIT_BUY_ORDER || record.type === ORDER_TYPE.LIMIT_SELL_ORDER ? (
          <FormattedMessage id="mt.xianjiadan" />
        ) : (
          <FormattedMessage id="mt.tingsundan" />
        )
      }
    },
    {
      title: (
        <>
          <FormattedMessage id="mt.guadanjia" />
        </>
      ),
      dataIndex: 'limitPrice',
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
        return <span className="!text-[13px] text-gray">{formatNum(text)}</span>
      }
    },
    {
      title: (
        <>
          <FormattedMessage id="mt.chengjiaojia" />
        </>
      ),
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
        return <span className="!text-[13px] text-gray">{formatNum(text)}</span>
      }
    },
    {
      title: <FormattedMessage id="mt.shoushu" />,
      dataIndex: 'orderVolume',
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
      title: (
        <>
          <FormattedMessage id="mt.shouxufei" />
          (USD)
        </>
      ),
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
        return <span className="!text-[13px] text-gray">{formatNum(text)}</span>
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
      title: <FormattedMessage id="mt.dingdanhao" />,
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
      title: <FormattedMessage id="common.status" />,
      dataIndex: 'status',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 150,
      align: 'right',
      fixed: 'right',
      className: '!text-[13px] text-gray',
      renderText(text, record, index, action) {
        return <span>{getEnum().Enum.OrderStatus?.[record.status!]?.text || '-'}</span>
      }
    }
  ]

  const dataSource = list.map((v) => {
    const digits = v.symbolDecimal || 2
    const isLimitOrder = v.type === ORDER_TYPE.LIMIT_BUY_ORDER || v.type === ORDER_TYPE.LIMIT_SELL_ORDER // 限价单
    v.isLimitOrder = isLimitOrder
    v.limitPrice = toFixed(v.limitPrice, digits)
    v.tradePrice = toFixed(v.tradePrice, digits)
    v.handlingFees = toFixed(v.handlingFees, digits)
    v.orderVolume = toFixed(v.orderVolume, digits)

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
        pageSize={10}
      />
    </>
  )
}

export default observer(HistoryPendingList)
