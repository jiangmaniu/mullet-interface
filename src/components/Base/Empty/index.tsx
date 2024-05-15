import { FormattedMessage } from '@umijs/max'
import { Empty as EmptyComp } from 'antd'

export default function Empty() {
  return <EmptyComp description={<FormattedMessage id="common.noData" />} />
}
