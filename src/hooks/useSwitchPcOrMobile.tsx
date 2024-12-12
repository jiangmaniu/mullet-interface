import { useLocation } from '@umijs/max'
import { useEffect } from 'react'

import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { getPathname, push } from '@/utils/navigator'

// 切换pc和mobile布局时，跳转页面
function useSwitchPcOrMobile() {
  const { pathname } = useLocation()
  const { isPc, isMobileOrIpad } = useEnv()
  const { global } = useStores()
  const {
    lastDeviceType,
    setLastDeviceType,
    setLastMobileJumpPathname,
    setLastPcJumpPathname,
    lastPcJumpPathname,
    lastMobileJumpPathname
  } = global

  useEffect(() => {
    const currentDeviceType = isPc ? 'PC' : 'MOBILE'
    const purePath = getPathname(pathname) // 当前地址 没有多语言 => /app/trade

    // 只在设备类型发生变化时才执行跳转
    if (lastDeviceType !== currentDeviceType) {
      if (isPc) {
        // 跳转到PC端上次记录的路径或默认路径
        push(lastPcJumpPathname || '/trade')
      } else if (isMobileOrIpad) {
        // 跳转到移动端上次记录的路径或默认路径
        navigateTo(lastMobileJumpPathname || '/app/quote')
      }
      // 记录最后一次设备类型
      setLastDeviceType(currentDeviceType)
    } else {
      // 记录最后跳转的路径
      if (isPc) {
        // PC端的路径
        setLastPcJumpPathname(purePath)
      } else if (isMobileOrIpad) {
        // 移动端的路径
        setLastMobileJumpPathname(purePath)
      }
    }
  }, [isPc, isMobileOrIpad, pathname, lastPcJumpPathname, lastMobileJumpPathname])
}
export default useSwitchPcOrMobile
