import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'

import StandardTable from '@/components/Admin/StandardTable'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import { getTradeRecordsPage } from '@/services/api/tradeCore/order'

import { getColumns } from './tableConfig'

// 历史记录
function HistoryClose() {
  const { isPc } = useEnv()
  const { ws, trade } = useStores()
  const { recordListClassName } = useStyle()
  const intl = useIntl()
  const symbol = trade.showActiveSymbol ? trade.activeSymbolName : undefined
  const currencyDecimal = trade.currentAccountInfo.currencyDecimal

  const onQuery = async (params: Order.TradeRecordsPageListParams) => {
    const res = await getTradeRecordsPage({ current: 1, size: 10, ...params })
    return res
  }

  return (
    <>
      <StandardTable
        columns={getColumns(currencyDecimal)}
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
        pageSize={10}
        params={{ accountId: trade.currentAccountInfo?.id, symbol }}
        action={{
          query: (params: Order.TradeRecordsPageListParams) => onQuery(params)
        }}
      />
    </>
  )
}

export default observer(HistoryClose)
