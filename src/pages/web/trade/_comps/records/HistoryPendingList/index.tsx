import { observer } from 'mobx-react'
import { useState, useMemo } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { isUndefined } from 'lodash'
import { DataTable } from '@/libs/table'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import { getOrderPage } from '@/services/api/tradeCore/order'

import { getColumns } from './tableConfig'
import { REQUEST_POLLING_INTERVAL } from '../_config'

// 历史挂单列表
function HistoryPendingList() {
  const { trade } = useStores()
  const { recordListClassName } = useStyle()
  const symbol = trade.showActiveSymbol ? trade.activeSymbolName : undefined
  const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 6 })

  const { data, isLoading } = useQuery({
    queryKey: ['orderPage', trade.currentAccountInfo.id, symbol, pagination, 'HISTORY_PENDING'],
    queryFn: () =>
      getOrderPage({
        current: pagination.pageIndex,
        size: pagination.pageSize,
        accountId: trade.currentAccountInfo.id,
        symbol,
        status: 'CANCEL,FAIL,FINISH'
      }),
    enabled: !isUndefined(trade.currentAccountInfo.id),
    refetchInterval: REQUEST_POLLING_INTERVAL,
    placeholderData: keepPreviousData,
    refetchOnMount: 'always'
  })

  const list = useMemo(() => data?.data?.records || [], [data])
  const total = data?.data?.total || 0

  return (
    <>
      <DataTable
        columns={getColumns({ currentAccountInfo: trade.currentAccountInfo })}
        data={list}
        loading={isLoading}
        className={recordListClassName}
        pagination={{ total, ...pagination }}
        onStateChange={({ pagination }) => setPagination({ pageIndex: pagination.pageIndex + 1, pageSize: pagination.pageSize })}
      />
    </>
  )
}

export default observer(HistoryPendingList)
