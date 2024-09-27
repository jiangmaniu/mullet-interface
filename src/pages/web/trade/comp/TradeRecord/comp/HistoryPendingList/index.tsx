import { observer } from 'mobx-react'

import StandardTable from '@/components/Admin/StandardTable'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import { getOrderPage } from '@/services/api/tradeCore/order'
import { toFixed } from '@/utils'

import { getColumns } from './tableConfig'

// 历史挂单列表
function HistoryPendingList() {
  const { isPc } = useEnv()
  const { ws, trade } = useStores()
  const { recordListClassName } = useStyle()
  const symbol = trade.showActiveSymbol ? trade.activeSymbolName : undefined

  const onQuery = async (params: Order.OrderPageListParams) => {
    const res = await getOrderPage({
      current: 1,
      size: 10,
      ...params,
      status: 'CANCEL,FAIL,FINISH'
      // type: 'LIMIT_BUY_ORDER,LIMIT_SELL_ORDER,STOP_LOSS_LIMIT_BUY_ORDER,STOP_LOSS_LIMIT_SELL_ORDER,STOP_LOSS_ORDER,TAKE_PROFIT_ORDER'
    })
    if (res.success && res.data?.records?.length) {
      res.data.records = res.data.records.map((v: Order.OrderPageListItem) => {
        const digits = v.symbolDecimal || 2
        v.tradePrice = toFixed(v.tradePrice, digits)
        v.handlingFees = toFixed(v.handlingFees, digits)
        v.orderVolume = toFixed(v.orderVolume, digits)

        return v
      })
    }
    return res
  }

  return (
    <>
      <StandardTable
        columns={getColumns()}
        // ghost
        showOptionColumn={false}
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
        params={{ accountId: trade.currentAccountInfo?.id, symbol }}
        action={{
          query: (params: Order.OrderPageListParams) => onQuery(params)
        }}
      />
    </>
  )
}

export default observer(HistoryPendingList)
