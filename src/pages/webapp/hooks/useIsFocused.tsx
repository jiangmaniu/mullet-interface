import { useDebugValue, useEffect, useState } from 'react'
import { history, useLocation } from 'umi'

/**
 * Hook to get the current focus state of the page. Returns `true` if the current route is focused, otherwise `false`.
 * This can be used if a component needs to render something based on the focus state.
 */
export default function useIsFocused() {
  const location = useLocation()
  const [isFocused, setIsFocused] = useState(true)

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 用户从后台切换回前台时执行的操作
        setIsFocused(true)
      } else {
        // 用户从前台切换到后台时执行的操作
        setIsFocused(false)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 清除事件监听器
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    // 监听路由变化
    const unsubscribe = history.listen(() => {
      // 比较新的路径和当前组件的路径
      const isCurrentRouteFocused = location.pathname === window.location.pathname
      setIsFocused(isCurrentRouteFocused)
    })

    return () => {
      unsubscribe()
    }
  }, [location])

  useDebugValue(isFocused)

  return isFocused
}
