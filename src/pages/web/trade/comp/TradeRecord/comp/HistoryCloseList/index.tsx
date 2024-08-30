import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'

import StandardTable from '@/components/Admin/StandardTable'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import { getTradeRecordsPage } from '@/services/api/tradeCore/order'
import { toFixed } from '@/utils'

import { getColumns } from './tableConfig'

// 历史记录
function HistoryClose() {
  const { isPc } = useEnv()
  const { ws, trade } = useStores()
  const { recordListClassName } = useStyle()
  const intl = useIntl()
  const symbol = trade.showActiveSymbol ? trade.activeSymbolName : undefined

  const onQuery = async (params: Order.TradeRecordsPageListParams) => {
    const res = await getTradeRecordsPage({ current: 1, size: 10, ...params })
    if (res.success && res.data?.records?.length) {
      res.data.records = res.data.records.map((v: Order.TradeRecordsPageListItem) => {
        const digits = v.symbolDecimal || 2
        v.tradePrice = toFixed(v.tradePrice, digits)
        v.startPrice = toFixed(v.startPrice, digits)
        v.handlingFees = toFixed(v.handlingFees, digits)
        v.tradingVolume = toFixed(v.tradingVolume, digits)
        v.profit = toFixed(v.profit, digits)

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
          query: (params: Order.TradeRecordsPageListParams) => onQuery(params)
        }}
      />
    </>
  )
}

export default observer(HistoryClose)
