import { useEffect, useState } from 'react'

import { ITabItem } from '@/components/Admin/Tabs'
import { bgColorBase } from '@/theme/theme.config'
import { STORAGE_GET_THEME, STORAGE_SET_THEME } from '@/utils/storage'

type IThemeMode = 'default' | 'dark'

// 全局状态管理
export default () => {
  const [hasProList, setHasProList] = useState(false) // 表格/列表是否有数据
  const [pageBgColor, setPageBgColor] = useState<any>(bgColorBase) // 页面颜色
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false) // 默认展开侧边栏
  const [topTabItems, setTopTabItems] = useState<ITabItem[]>([]) // 顶部导航栏tabs
  const [topTabKey, setTopTabKey] = useState<string>('') // 顶部导航栏tabs
  const [notificationApi, setNotificationApi] = useState<any>(null) // 通知api
  const [openTradeSidebar, setOpenTradeSidebar] = useState(true) // 控制打开交易页面侧边栏
  const [theme, setThemeMode] = useState<IThemeMode>('default') // 主题色

  // 首次加载设置默认Key
  useEffect(() => {
    setTopTabKey(topTabItems[0]?.key || '')
  }, [topTabItems])

  useEffect(() => {
    setTheme(STORAGE_GET_THEME() || 'default')
  }, [])

  // 切换主题色
  const setTheme = (mode: IThemeMode) => {
    STORAGE_SET_THEME(mode)
    setThemeMode(mode)
  }

  return {
    hasProList,
    setHasProList,

    pageBgColor,
    setPageBgColor,

    sidebarCollapsed,
    setSidebarCollapsed,

    topTabItems,
    setTopTabItems,
    topTabKey,
    setTopTabKey,

    openTradeSidebar,
    setOpenTradeSidebar,

    theme,
    setTheme
  }
}
