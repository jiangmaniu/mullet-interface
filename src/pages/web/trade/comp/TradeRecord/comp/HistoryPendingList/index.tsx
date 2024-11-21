import { observer } from 'mobx-react'

import StandardTable from '@/components/Admin/StandardTable'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import { getOrderPage } from '@/services/api/tradeCore/order'

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
    return res
  }

  return (
    <>
      <StandardTable
        columns={getColumns()}
        key={trade.currentAccountInfo.id}
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
        pageSize={6}
        params={{ accountId: trade.currentAccountInfo?.id, symbol }}
        action={{
          query: (params: Order.OrderPageListParams) => onQuery(params)
        }}
      />
    </>
  )
}

export default observer(HistoryPendingList)
