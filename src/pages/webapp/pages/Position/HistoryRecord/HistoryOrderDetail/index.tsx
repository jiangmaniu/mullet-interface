import { useParams } from '@umijs/max'
import { observer } from 'mobx-react'

function HistoryOrderDetail() {
  const { id } = useParams()
  return <div>HistoryOrderDetail {id}</div>
}

export default observer(HistoryOrderDetail)
