import { ConfigProvider, theme } from 'antd'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import themeColor from '@/theme/theme.antd'
import themeDarkColor from '@/theme/theme.antd.dark'
import { showInsetEffect } from '@/utils/antdWave'
import { STORAGE_GET_THEME, STORAGE_GET_TRADE_THEME, STORAGE_SET_THEME } from '@/utils/storage'

const { defaultAlgorithm, darkAlgorithm } = theme

export type IThemeMode = 'light' | 'dark'
type IDirection = 0 | 1

interface IThemeContextProps {
  /**全局主题色 */
  theme: IThemeMode
  /**交易页面主题色 */
  tradeTheme: IThemeMode
  /**是否是黑色主题 */
  isDark?: boolean
  /**0绿涨红跌 1红涨绿跌 */
  direction: IDirection
  /**涨 颜色 */
  upColor: string
  /**跌 颜色 */
  downColor: string
  /**设置主题色 */
  setTheme: (theme: IThemeMode) => void
  /**切换主题色 */
  toggleTheme: () => void
  /**设置0绿涨红跌 1红涨绿跌 */
  setDirection: (key: IDirection) => void
}

interface IProps {
  children: JSX.Element
}

export const ThemeContext = createContext<IThemeContextProps>({} as IThemeContextProps)

export const ThemeProvider = ({ children }: IProps): JSX.Element => {
  const [theme, setTheme] = useState<IThemeMode>('light') // 主题色
  const [tradeTheme, setTradeTheme] = useState<IThemeMode>('light') // 主题色
  const [direction, setDirection] = useState<any>(0) // 0绿涨红跌 1红涨绿跌 @TODO 暂时未使用

  const themeConfig = useMemo(() => {
    const themeToken = {
      light: themeColor,
      dark: themeDarkColor // 黑色主题
    }[theme]

    return {
      themeToken,
      upColor: direction === 1 ? 'var(--color-red)' : 'var(--color-green)',
      downColor: direction === 1 ? 'var(--color-green)' : 'var(--color-red)'
    }
  }, [theme, direction])

  // 切换主题模式
  const setThemeClassName = (theme: IThemeMode) => {
    // 只有在交易页面才需要切换主题模式
    if (location.pathname.indexOf('/trade') !== -1) {
      // 避免设置null值
      document.documentElement.className = ['dark', 'light'].includes(theme) ? theme : 'light'
      document.body.style.background = 'var(--bg-primary)'
    } else {
      document.documentElement.className = 'light'
      document.body.style.background = '#fff'
    }
  }

  // 监听系统主题模式
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setTheme(darkModeMediaQuery.matches ? 'dark' : 'light')
    const listener = (event: any) => {
      const themeMode = event.matches ? 'dark' : 'light'

      setTheme(themeMode)
      setThemeClassName(themeMode)
    }

    darkModeMediaQuery.addEventListener('change', listener)
    return () => {
      darkModeMediaQuery.removeEventListener('change', listener)
    }
  }, [])

  const handleSetTheme = (mode: IThemeMode) => {
    STORAGE_SET_THEME(mode)
    setTheme(mode)
    setThemeClassName(mode)
  }

  useEffect(() => {
    // 优先获取交易页面主题，如果没有获取到，则获取全局主题
    const themeMode = STORAGE_GET_TRADE_THEME() || STORAGE_GET_THEME() || 'light'
    setTheme(themeMode)
    setTradeTheme(themeMode)
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        tradeTheme,
        isDark: theme === 'dark',
        direction,
        setDirection,
        upColor: themeConfig.upColor,
        downColor: themeConfig.downColor,
        toggleTheme: () => {
          setTheme(theme === 'dark' ? 'light' : 'dark')
        },
        setTheme: (mode: IThemeMode) => {
          if (mode) {
            handleSetTheme(mode)
          }
        }
      }}
    >
      {/* 使用ConfigProvider配置主题，方便动态切换主题，不在使用config/theme来配置 */}
      <ConfigProvider
        theme={{
          token: {
            ...themeConfig.themeToken
          },
          cssVar: true,
          algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm
        }}
        warning={{ strict: false }}
        wave={{
          showEffect: showInsetEffect
        }}
        button={{
          autoInsertSpace: false
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
