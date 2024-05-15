import { ProCard, ProCardProps } from '@ant-design/pro-components'
import { Skeleton, SkeletonProps, Spin } from 'antd'

import Empty from '../Empty'

interface IProps {
  loading?: boolean
  /**没有数据 */
  isEmpty?: boolean
  children: React.ReactNode
  style?: React.CSSProperties
  cardProps?: ProCardProps
  skeleton?: boolean
  skeletonProps?: SkeletonProps
}

export default function Loading({ loading, children, isEmpty, style, cardProps, skeleton, skeletonProps }: IProps) {
  if (isEmpty && !loading) {
    return (
      <ProCard bordered={false} layout="center" style={style} {...cardProps}>
        <Empty />
      </ProCard>
    )
  }
  if (skeleton) {
    if (loading) {
      return <Skeleton {...skeletonProps} />
    }
    return <>{children}</>
  }
  return <Spin spinning={loading}>{children}</Spin>
}
