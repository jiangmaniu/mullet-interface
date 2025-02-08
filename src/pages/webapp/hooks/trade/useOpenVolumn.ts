import { stores } from '@/context/mobxProvider'

export default function useOpenVolumn() {
  const { orderVolume, maxOpenVolume } = stores.trade

  return {
    orderVolume, // 同 useTrade 中的 orderVolume
    maxOpenVolume
  }
}
