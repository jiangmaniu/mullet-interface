import { SpinLoading } from 'antd-mobile'

type IProps = {
  size?: number
  color?: string
}

/**
 * loading动画，替换APP的ActivityIndicator
 * @param param0
 * @returns
 */
function ActivityIndicator({ size = 20, color }: IProps) {
  return <SpinLoading style={{ '--size': `${size}px`, '--color': color }} />
}

export default ActivityIndicator
