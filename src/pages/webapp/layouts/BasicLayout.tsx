import { useLocation } from '@umijs/max'
import React, { useEffect } from 'react'

import { useTheme } from '@/context/themeProvider'

import { Helmet } from 'react-helmet'
import { View } from '../components/Base/View'

type BgColorType = 'primary' | 'secondary' | 'transparent'

interface Iprops {
  style?: React.CSSProperties
  children: React.ReactNode
  /** 页面背景颜色 */
  bgColor?: BgColorType
  className?: string
  scrollY?: boolean
  /** 头部颜色 */
  headerColor?: string
}

// 页面布局基础组件
const Basiclayout: React.FC<Iprops> = ({ headerColor, className, style, children, bgColor = 'primary', scrollY = false }) => {
  const { theme, cn } = useTheme()
  const { pathname } = useLocation()

  // 动态设置页面body背景颜色
  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.backgroundColor[bgColor]
    return () => {
      // 离开APP布局设置成pc的背景颜色
      document.body.style.backgroundColor = 'var(--bg-primary)'
    }
  }, [pathname])

  const statusBarBgColor = headerColor || theme.colors.backgroundColor.primary

  return (
    <>
      <Helmet>
        {/* 设置手机顶部状态栏颜色 */}
        <meta name="theme-color" content={statusBarBgColor} />
      </Helmet>
      <View className={cn('flex-1 flex flex-col h-[100vh]', scrollY ? 'overflow-y-scroll' : '', className)} bgColor={bgColor} style={style}>
        {children}
      </View>
    </>
  )
}

export default Basiclayout
