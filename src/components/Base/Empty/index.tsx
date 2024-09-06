import { FormattedMessage } from '@umijs/max'
import { Empty as EmptyComp } from 'antd'

type IProps = {
  /**文字 */
  description?: React.ReactNode
  src?: string
  className?: string
}
export default function Empty({ src, description, className }: IProps) {
  return (
    <div className={className}>
      <EmptyComp image={src ?? '/img/empty-icon.png'} description={description ?? <FormattedMessage id="common.noData" />} />
    </div>
  )
}
