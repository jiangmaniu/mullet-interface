import { useEffect } from 'react'

import { useStores } from '@/context/mobxProvider'

// 监听页面的可见性变化
// 检测用户是否切换到后台，以及何时返回到前台
const useIsFocused = (onVisible?: () => void, onHidden?: () => void) => {
  const { global } = useStores()
  const { setPageIsFocused: setIsFocused, pageIsFocused: isFocused } = global

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 用户从后台切换回前台时执行的操作
        onVisible?.()
        setIsFocused(true)
      } else {
        // 用户从前台切换到后台时执行的操作
        onHidden?.()
        setIsFocused(false)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 清除事件监听器
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [onVisible, onHidden])

  return isFocused
}

export default useIsFocused
