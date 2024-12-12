import { useParams } from '@umijs/max'
import { observer } from 'mobx-react'

function TransferDetail() {
  const { id } = useParams()
  return <div>TransferDetail {id}</div>
}

export default observer(TransferDetail)
