import { useEnv } from '@/context/envProvider'

/**隐藏h5头部 */
export default function useHideHeader() {
  const { isRNWebview } = useEnv()
  const isHideHeader = isRNWebview

  return {
    isHideHeader
  }
}
