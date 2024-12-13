import { useLocation } from '@umijs/max'
import React, { useEffect } from 'react'

import { useTheme } from '@/context/themeProvider'

import { View } from '../View'

type BgColorType = 'primary' | 'secondary' | 'transparent'

interface Iprops {
  style?: React.CSSProperties
  children: React.ReactNode
  /** 页面背景颜色 */
  bgColor?: BgColorType
}

// 页面布局基础组件
const Basiclayout: React.FC<Iprops> = ({ style, children, bgColor = 'primary' }) => {
  const { theme, cn } = useTheme()
  const { pathname } = useLocation()

  // 动态设置页面body背景颜色
  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.backgroundColor[bgColor]
    return () => {
      document.body.style.backgroundColor = 'var(--bg-primary)'
    }
  }, [pathname])

  return (
    <View className={cn('flex-1 flex flex-col')} bgColor={bgColor} style={style}>
      {children}
    </View>
  )
}

export default Basiclayout
