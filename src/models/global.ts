import { useEffect, useState } from 'react'

import { ITabItem } from '@/components/Admin/Tabs'
import { bgColorBase } from '@/theme/theme.config'

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

  // 首次加载设置默认Key
  useEffect(() => {
    setTopTabKey(topTabItems[0]?.key || '')
  }, [topTabItems])

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
    setOpenTradeSidebar
  }
}
