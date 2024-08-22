import { ConfigProvider } from 'antd'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import themeColor from '@/theme/theme.antd'
import themeDarkColor from '@/theme/theme.antd.dark'
import { showInsetEffect } from '@/utils/antdWave'
import { STORAGE_GET_THEME, STORAGE_SET_THEME } from '@/utils/storage'

export type IThemeMode = 'light' | 'dark'
type IDirection = 0 | 1

interface IThemeContextProps {
  theme: IThemeMode
  /**0绿涨红跌 1红涨绿跌 */
  direction: IDirection
  /**涨 颜色 */
  upColor: string
  /**跌 颜色 */
  downColor: string
  setTheme: (theme: IThemeMode) => void
  /**设置0绿涨红跌 1红涨绿跌 */
  setDirection: (key: IDirection) => void
}

interface IProps {
  children: JSX.Element
}

export const ThemeContext = createContext<IThemeContextProps>({} as IThemeContextProps)

export const ThemeProvider = ({ children }: IProps): JSX.Element => {
  const [theme, setTheme] = useState<IThemeMode>('light') // 主题色
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
      document.documentElement.className = theme
    } else {
      document.documentElement.className = 'light'
    }
  }

  useEffect(() => {
    const themeMode = STORAGE_GET_THEME() || 'light'
    setTheme(themeMode)
    setThemeClassName(themeMode)
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        direction,
        setDirection,
        upColor: themeConfig.upColor,
        downColor: themeConfig.downColor,
        setTheme: (mode: IThemeMode) => {
          STORAGE_SET_THEME(mode)
          setTheme(mode)
          setThemeClassName(mode)
        }
      }}
    >
      {/* 使用ConfigProvider配置主题，方便动态切换主题，不在使用config/theme来配置 */}
      <ConfigProvider
        theme={{
          token: {
            ...themeConfig.themeToken
          }
        }}
        wave={{
          showEffect: showInsetEffect
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
