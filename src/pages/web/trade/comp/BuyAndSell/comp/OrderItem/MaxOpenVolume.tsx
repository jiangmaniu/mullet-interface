import { observer } from 'mobx-react'

import useTrade from '@/hooks/useTrade'

// 可开手数
function MaxOpenVolume() {
  const { maxOpenVolume } = useTrade()
  return Number(maxOpenVolume) < 0 ? '--' : maxOpenVolume
}

export default observer(MaxOpenVolume)
