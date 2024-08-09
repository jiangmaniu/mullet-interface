import { ConfigProvider } from 'antd'
import { createContext, useContext, useEffect, useState } from 'react'

import themeColor from '@/theme/theme.antd'
import themeDarkColor from '@/theme/theme.antd.dark'
import { showInsetEffect } from '@/utils/antdWave'
import { STORAGE_GET_THEME, STORAGE_SET_THEME } from '@/utils/storage'

export type IThemeMode = 'light' | 'dark'

interface IThemeContextProps {
  theme: IThemeMode
  setTheme: (theme: IThemeMode) => void
}

interface IProps {
  children: JSX.Element
}

export const ThemeContext = createContext<IThemeContextProps>({} as IThemeContextProps)

export const ThemeProvider = ({ children }: IProps): JSX.Element => {
  const [theme, setTheme] = useState<IThemeMode>('light') // 主题色

  const themeToken = {
    light: themeColor,
    dark: themeDarkColor // 黑色主题
  }[theme]

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
            ...themeToken
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
