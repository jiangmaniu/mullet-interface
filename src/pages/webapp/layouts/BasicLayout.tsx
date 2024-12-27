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
  /** 头部状态栏颜色 */
  headerColor?: string
  /** 是否全屏 */
  hFull?: boolean
  /** 底部 */
  footer?: React.ReactNode
  footerClassName?: string
  footerStyle?: React.CSSProperties
  /** 头部 */
  header?: React.ReactNode
  /** 头部高度 */
  headerHeight?: number
  headerClassName?: string
  headerStyle?: React.CSSProperties
}

// 页面布局基础组件
// 页面布局基础组件
const Basiclayout: React.FC<Iprops> = ({
  headerColor,
  className,
  style,
  children,
  bgColor = 'primary',
  scrollY = false,
  hFull = true,
  footer,
  footerClassName,
  footerStyle,
  header,
  headerHeight = 0,
  headerClassName,
  headerStyle
}) => {
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

  // useEffect(() => {
  //   document.body.style.overflowY = scrollY ? 'auto' : 'hidden'
  // }, [scrollY])

  return (
    <>
      <Helmet>
        {/* 设置手机顶部状态栏颜色 */}
        <meta name="theme-color" content={statusBarBgColor} />
      </Helmet>

      {header && (
        <div
          className={cn(headerClassName)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            minHeight: headerHeight,
            ...headerStyle
          }}
        >
          {header}
        </div>
      )}

      <View
        className={cn(
          hFull ? 'h-[100vh]' : '',
          scrollY ? 'overflow-y-scroll' : '',
          // `pt-[${headerHeight}px]`,
          className
        )}
        bgColor={bgColor}
        style={{
          // paddingTop: headerHeight,
          marginTop: headerHeight,
          ...style
        }}
      >
        {children}
      </View>
      {footer && (
        <div
          className={cn(footerClassName)}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '10px 14px',
            // backgroundColor: 'linear-gradient(-90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)'
            backgroundColor: 'white',
            // display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
            ...footerStyle
          }}
        >
          {footer}
        </div>
      )}
    </>
  )
}

export default Basiclayout
