import { useEnv } from '@/context/envProvider'

interface IProps {
  children?: React.ReactNode
  /**@name pc组件 */
  pcComponent: React.ReactNode
  /**@name 移动端组件 */
  wapComponent: React.ReactNode
}
/**
 * 切换pc、wap布局页面
 * @returns
 */
export default function SwitchPcOrWapLayout({ children, pcComponent, wapComponent }: IProps) {
  const { isMobileOrIpad, breakPoint } = useEnv()
  if (children) {
    return <>{children}</>
  }
  // @TODO 暂时不考虑h5
  // return <>{isMobileOrIpad ? wapComponent : pcComponent}</>
  return <>{pcComponent}</>
}
