import { useLocation } from '@umijs/max'
import React, { useEffect, useState } from 'react'

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
          // 不使用100vh safari浏览器出现滚动条
          // hFull ? 'h-[100vh]' : '',
          scrollY ? 'overflow-y-scroll' : 'auto',
          // `pt-[${headerHeight}px]`,
          className
        )}
        bgColor={bgColor}
        style={{
          paddingTop: headerHeight,
          // paddingBottom: footerHeight,
          height: `calc(100% - ${headerHeight}px - ${footerHeight}px)`,
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
