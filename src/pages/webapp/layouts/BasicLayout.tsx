import { useLocation, useSearchParams } from '@umijs/max'
import React, { useEffect, useState } from 'react'

import { useTheme } from '@/context/themeProvider'

import { useEnv } from '@/context/envProvider'
import { cn } from '@/utils/cn'
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
  /** 是否固定高度 */
  fixedHeight?: boolean
  /** 底部 */
  footer?: React.ReactNode
  footerClassName?: string
  footerStyle?: React.CSSProperties
  /** 头部 */
  header?: React.ReactNode
  headerClassName?: string
  headerStyle?: React.CSSProperties
  /**是否隐藏页面滚动条 */
  hiddenScrollBar?: boolean
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
  fixedHeight = false,
  footer,
  footerClassName,
  footerStyle,
  header,
  headerClassName,
  headerStyle,
  hiddenScrollBar
}) => {
  const { theme } = useTheme()
  const { pathname } = useLocation()
  const { screenSize } = useEnv()

  // 动态设置页面body背景颜色
  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.backgroundColor[bgColor]
    return () => {
      // 离开APP布局设置成pc的背景颜色
      document.body.style.backgroundColor = 'var(--bg-primary)'
    }
  }, [pathname])

  const statusBarBgColor = headerColor || theme.colors.backgroundColor.primary

  const [headerHeight, setHeaderHeight] = useState(0)
  useEffect(() => {
    const headerElement = document.getElementById('body-header')
    if (headerElement) {
      setHeaderHeight(headerElement.offsetHeight)
    } else {
      setHeaderHeight(0)
    }
  }, [header])

  const [footerHeight, setFooterHeight] = useState(0)
  useEffect(() => {
    const footerElement = document.getElementById('body-footer')
    if (footerElement) {
      setFooterHeight(footerElement.offsetHeight)
    } else {
      setFooterHeight(0)
    }
  }, [footer])

  useEffect(() => {
    // 隐藏页面滚动条
    if (hiddenScrollBar) {
      document.documentElement.style.overflowY = 'hidden'
    }

    return () => {
      document.documentElement.style.overflowY = 'auto'
    }
  }, [hiddenScrollBar])

  const [searchParams] = useSearchParams()
  const hideHeader = searchParams.get('hideHeader') === '1'

  return (
    <>
      <Helmet>
        {/* 设置手机顶部状态栏颜色 */}
        <meta name="theme-color" content={statusBarBgColor} />
        {/* IE/Edge浏览器 */}
        <meta name="msapplication-TileColor" content={statusBarBgColor} />
      </Helmet>

      {!hideHeader && header && (
        <div
          id="body-header"
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
          // 不使用100vh safari浏览器出现滚动条
          scrollY ? 'overflow-y-scroll' : 'auto',
          className
        )}
        bgColor={bgColor}
        style={{
          paddingTop: fixedHeight ? headerHeight : undefined,
          paddingBottom: fixedHeight ? footerHeight : undefined,
          height: fixedHeight ? `${screenSize.height - headerHeight - footerHeight}px)` : undefined,
          ...style
        }}
      >
        {children}
      </View>
      {footer && (
        <div
          id="body-footer"
          className={cn(footerClassName)}
          style={{
            position: 'fixed',
            // 当 viewport-fit=contain 时 env() 是不起作用的，必须要配合 viewport-fit=cover 使用。对于不支持env() 的浏览器，浏览器将会忽略它
            bottom: 'env(safe-area-inset-bottom)',
            left: 0,
            right: 0,
            paddingInline: 14,
            paddingTop: 10,
            backgroundColor: 'white',
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
