import { observer } from 'mobx-react'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isUndefined } from 'lodash'
import { DataTable } from '@/libs/table'
import { useStores } from '@/context/mobxProvider'
import { getTradeRecordsPage } from '@/services/api/tradeCore/order'

import { getColumns } from './tableConfig'
import { REQUEST_POLLING_INTERVAL } from '../_config'

// 历史记录
function HistoryClose() {
  const { trade } = useStores()

  const symbol = trade.showActiveSymbol ? trade.activeSymbolName : undefined
  const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 6 })

  const { data, isLoading } = useQuery({
    queryKey: ['tradeRecordsPage', trade.currentAccountInfo.id, symbol, pagination],
    queryFn: () =>
      getTradeRecordsPage({
        accountId: trade.currentAccountInfo.id,
        symbol,
        current: pagination.pageIndex,
        size: pagination.pageSize
      }),
    enabled: !isUndefined(trade.currentAccountInfo.id),
    refetchInterval: REQUEST_POLLING_INTERVAL,
    refetchOnMount: true
  })

  const list = useMemo(() => data?.data?.records || [], [data])
  const total = data?.data?.total || 0

  return (
    <>
      <DataTable
        columns={getColumns({
          currentAccountInfo: trade.currentAccountInfo
        })}
        data={list}
        loading={isLoading}
        pagination={{ total, ...pagination }}
        onStateChange={({ pagination }) => setPagination({ pageIndex: pagination.pageIndex + 1, pageSize: pagination.pageSize })}
      />
    </>
  )
}

export default observer(HistoryClose)
