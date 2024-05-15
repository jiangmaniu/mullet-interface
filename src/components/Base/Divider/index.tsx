import { Divider } from 'antd'

import { useEnv } from '@/context/envProvider'

type IProps = {
  style?: React.CSSProperties
}
export default function DividerComp({ style }: IProps) {
  const { isMobile } = useEnv()
  return <Divider style={{ marginTop: 15, marginBottom: 15, borderTopWidth: isMobile ? 4 : 1, ...style }} />
}
