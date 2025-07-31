import StandardTable from '@/components/Admin/StandardTable'
import { useGetSignatures } from '@/hooks/web3/useGetSignatures'
import { useEffect } from 'react'
import { getColumns } from './tableConfig'

// 交易历史签名列表展示
export default function HistoryTxList() {
  const { signaturesList, loading, error, fetchSignaturesList } = useGetSignatures()

  useEffect(() => {
    fetchSignaturesList()
  }, [fetchSignaturesList])

  return (
    <StandardTable
      columns={getColumns()}
      // 持仓列表不能删除和编辑
      showOptionColumn={false}
      dataSource={signaturesList}
      loading={loading}
    />
  )
}
