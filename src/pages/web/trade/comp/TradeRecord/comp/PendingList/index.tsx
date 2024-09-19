import { ProColumns } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { useRef } from 'react'

import StandardTable from '@/components/Admin/StandardTable'
import SymbolIcon from '@/components/Base/SymbolIcon'
import { ORDER_TYPE, TRADE_BUY_SELL } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import { formatNum, toFixed } from '@/utils'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/utils/cn'
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
}

// 挂单记录
function PendingList({ style, parentPopup }: IProps) {
  const { isPc } = useEnv()
  const { ws, trade } = useStores()
  const { recordListClassName } = useStyle()
  const showActiveSymbol = trade.showActiveSymbol

  let pendingList = trade.pendingList as IPendingItem[]
  let list = showActiveSymbol ? pendingList.filter((v) => v.symbol === trade.activeSymbolName) : pendingList
  const cancelPendingRef = useRef<any>(null)
  const modifyPendingRef = useRef<any>(null)

  const columns: ProColumns<IPendingItem>[] = [
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
              <span className="text-base font-semibold text-primary">{record.symbol}</span>
              <span className={cn('text-xs font-medium pt-[2px]', buySellInfo.colorClassName)}>{buySellInfo.text}</span>
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
      className: '!text-[13px] text-primary',
      renderText(text, record, index, action) {
        return record.isLimitOrder ? <FormattedMessage id="mt.xianjiaguadan" /> : <FormattedMessage id="mt.tingsundan" />
      }
    },
    {
      title: <FormattedMessage id="mt.biaojijia" />,
      dataIndex: 'currentPrice',
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
        return (
          <span className={cn('!text-[13px]', record.buySell === 'BUY' ? 'text-green' : 'text-red')}>
            {formatNum(record.currentPrice, { precision: record.symbolDecimal })}
          </span>
        )
      }
    },
    {
      title: <FormattedMessage id="mt.guadanjia" />,
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
        return <span className="!text-[13px] text-primary">{formatNum(text, { precision: record.symbolDecimal })}</span>
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
        return <span className="!text-[13px] text-primary">{text}</span>
      }
    },
    {
      title: <FormattedMessage id="mt.zhiyingzhisun2" />,
      dataIndex: 'stopLossProfit',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 180,
      renderText(text, record, index, action) {
        const AddDom = (
          <span className="font-pf-bold">
            <FormattedMessage id="mt.tianjia" />
          </span>
        )
        return (
          <div
            className="cursor-pointer"
            onClick={() => {
              modifyPendingRef.current?.show(record)
            }}
          >
            <span className="!text-[13px] text-primary border-b border-dashed border-gray-weak">
              {Number(record?.takeProfit) ? formatNum(record?.takeProfit, { precision: record.symbolDecimal }) : AddDom}
            </span>
            <span> / </span>
            <span className="!text-[13px] text-primary border-b border-dashed border-gray-weak">
              {Number(record?.stopLoss) ? formatNum(record?.stopLoss, { precision: record.symbolDecimal }) : AddDom}
            </span>
          </div>
        )
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
      className: '!text-[13px] text-primary'
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
      width: 200,
      className: '!text-[13px] text-primary'
    },
    {
      title: <FormattedMessage id="common.op" />,
      key: 'option',
      fixed: 'right',
      width: 100,
      align: 'right',
      hideInForm: true,
      hideInSearch: true,
      render: (text, record, _, _action) => {
        return (
          <div className="flex items-center justify-end">
            <div
              className="min-w-[70px] cursor-pointer rounded border-gray-250 px-2 py-[5px] text-center font-normal text-primary dark:btn-dark max-xl:w-[48%] max-xl:bg-gray-50 text-sm xl:border"
              onClick={() => {
                parentPopup?.close()
                cancelPendingRef.current?.show(record)
              }}
            >
              <FormattedMessage id="mt.cexiao" />
            </div>
          </div>
        )
      }
    }
  ]

  const dataSource = toJS(list).map((v) => {
    const symbol = v.symbol as string
    const quoteInfo = getCurrentQuote(symbol)
    const digits = v.symbolDecimal || 2
    const isLimitOrder = v.type === ORDER_TYPE.LIMIT_BUY_ORDER || v.type === ORDER_TYPE.LIMIT_SELL_ORDER // 限价单

    let currentPrice = v.buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.ask : quoteInfo?.bid

    if (v.type === 'LIMIT_BUY_ORDER' || v.type === 'LIMIT_SELL_ORDER') {
      // 限价单价格不要取反
      currentPrice = v.buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.ask : quoteInfo?.bid
    }

    v.currentPrice = currentPrice // 现价
    v.isLimitOrder = isLimitOrder
    v.limitPrice = toFixed(v.limitPrice, digits)

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
        pageSize={10}
      />
      {/* 取消挂单弹窗 */}
      <PendingOrderCancelModal ref={cancelPendingRef} />
      {/* 修改挂单弹窗 */}
      <ModifyPendingOrderModal ref={modifyPendingRef} list={dataSource} />
    </>
  )
}

export default observer(PendingList)
