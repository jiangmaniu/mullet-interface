import { FormattedMessage } from '@umijs/max'
import { Empty as EmptyComp } from 'antd'

type IProps = {
  /**文字 */
  description?: React.ReactNode
}
export default function Empty({ description }: IProps) {
  return <EmptyComp image="/img/empty-icon.png" description={description || <FormattedMessage id="common.noData" />} />
}
