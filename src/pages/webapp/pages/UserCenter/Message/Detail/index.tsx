import { useParams } from '@umijs/max'
import { observer } from 'mobx-react'

function Detail() {
  const { id } = useParams()
  return <div>详细详情页 {id}</div>
}

export default observer(Detail)
