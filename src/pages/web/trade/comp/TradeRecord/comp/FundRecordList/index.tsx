import { observer } from 'mobx-react'

import StandardTable from '@/components/Admin/StandardTable'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import { getMoneyRecordsPageList } from '@/services/api/tradeCore/account'

import { getColumns } from './tableConfig'

export default observer((props, ref) => {
  const { trade } = useStores()
  const { recordListClassName } = useStyle()

  return (
    <StandardTable
      columns={getColumns()}
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
      size="middle"
      searchFormBgColor="#fff"
      params={{ accountId: trade.currentAccountInfo.id }}
      action={{
        query: (params) => getMoneyRecordsPageList(params)
      }}
    />
  )
})
