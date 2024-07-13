import { ProColumns } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { useRef } from 'react'

import StandardTable from '@/components/Admin/StandardTable'
import { ORDER_TYPE, TRADE_BUY_SELL } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import { formatNum, toFixed } from '@/utils'
import { getBuySellInfo, getSymbolIcon } from '@/utils/business'
import { getCurrentQuote } from '@/utils/wsUtil'

import PendingOrderCancelModal from '../../../Modal/PendingOrderCancelModal'

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

// 止盈止损单记录
function StopLossProfitList({ style, parentPopup, showActiveSymbol }: IProps) {
  const { isPc } = useEnv()
  const { ws, trade } = useStores()
  const { recordListClassName } = useStyle()
  const unit = 'USD'

  let list = trade.stopLossProfitList as IPendingItem[]

  const cancelPendingRef = useRef<any>(null)

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
            <img width={26} height={26} alt="" src={getSymbolIcon(record.imgUrl)} className="rounded-full border border-gray-90" />
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
        return record.type === 'STOP_LOSS_ORDER' ? <FormattedMessage id="mt.zhisundan" /> : <FormattedMessage id="mt.zhiyingdan" />
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
          <span className={classNames('!text-[13px] !font-dingpro-medium', record.buySell === 'BUY' ? 'text-green' : 'text-red')}>
            {formatNum(record.currentPrice)} USD
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
        return <span className="!text-[13px] text-gray !font-dingpro-medium">{formatNum(text)} USD</span>
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
      width: 200,
      className: '!text-[13px] text-gray'
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
              className="min-w-[70px] cursor-pointer rounded border-gray-250 px-2 py-[5px] text-center font-normal text-gray max-xl:w-[48%] max-xl:bg-sub-card text-sm xl:border"
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

  const dataSource = list.map((v) => {
    const dataSourceSymbol = v.dataSourceSymbol as string
    const quoteInfo = getCurrentQuote(dataSourceSymbol)
    const digits = v.symbolDecimal || 2
    const currentPrice = v.buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.bid : quoteInfo?.ask // 价格取反方向的
    const isLimitOrder = v.type === ORDER_TYPE.LIMIT_BUY_ORDER || v.type === ORDER_TYPE.LIMIT_SELL_ORDER // 限价单

    v.currentPrice = currentPrice // 现价，根据买卖方向获取当前价格
    v.orderVolume = toFixed(v.orderVolume, digits) // 手数格式化
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
      />
      {/* 取消挂单弹窗 */}
      <PendingOrderCancelModal ref={cancelPendingRef} />
    </>
  )
}

export default observer(StopLossProfitList)
