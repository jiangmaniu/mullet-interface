import { observer } from 'mobx-react'
import { useMemo, useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'

import { DataTable } from '@/libs/table'
import { useStores } from '@/context/mobxProvider'
import { getMoneyRecordsPageList } from '@/services/api/tradeCore/account'

import { getColumns } from './tableConfig'
import { isUndefined } from 'lodash'
import { REQUEST_POLLING_INTERVAL } from '../_config'

export default observer(() => {
  const { trade } = useStores()

  const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 6 })

  const { data, isLoading } = useQuery({
    queryKey: ['moneyRecords', trade.currentAccountInfo.id, pagination],
    queryFn: () =>
      getMoneyRecordsPageList({
        accountId: trade.currentAccountInfo.id,
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
    <DataTable
      columns={getColumns({ currentAccountInfo: trade.currentAccountInfo })}
      data={list}
      loading={isLoading}
      pagination={{ total, ...pagination }}
      onStateChange={({ pagination }) => setPagination({ pageIndex: pagination.pageIndex + 1, pageSize: pagination.pageSize })}
    />
  )
})
