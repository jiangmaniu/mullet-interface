import { observer } from 'mobx-react'

import useMaxOpenVolume from '@/hooks/useMaxOpenVolume'

// 可开手数
function MaxOpenVolume() {
  // const { maxOpenVolume } = useTrade()
  const maxOpenVolume = useMaxOpenVolume()
  return Number(maxOpenVolume) < 0 ? '--' : maxOpenVolume
}

export default observer(MaxOpenVolume)
