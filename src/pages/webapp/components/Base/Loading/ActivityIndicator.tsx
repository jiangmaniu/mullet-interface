import { SpinLoading } from 'antd-mobile'

type IProps = {
  size?: number
}

/**
 * loading动画，替换APP的ActivityIndicator
 * @param param0
 * @returns
 */
function ActivityIndicator({ size = 20 }: IProps) {
  return <SpinLoading style={{ '--size': `${size}px` }} />
}

export default ActivityIndicator
