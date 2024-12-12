import { useParams } from '@umijs/max'
import { observer } from 'mobx-react'

function AccountDetail() {
  const { id } = useParams()
  return <div>AccountDetail {id}</div>
}

export default observer(AccountDetail)
