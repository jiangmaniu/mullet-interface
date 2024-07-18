import { ConfigProvider } from 'antd'
import { createContext, useContext, useEffect, useState } from 'react'

import themeColor from '@/theme/theme.antd'
import themeDarkColor from '@/theme/theme.antd.dark'
import { STORAGE_GET_THEME, STORAGE_SET_THEME } from '@/utils/storage'

export type IThemeMode = 'default' | 'dark'

interface IThemeContextProps {
  theme: IThemeMode
  setTheme: (theme: IThemeMode) => void
}

interface IProps {
  children: JSX.Element
}

export const ThemeContext = createContext<IThemeContextProps>({} as IThemeContextProps)

export const ThemeProvider = ({ children }: IProps): JSX.Element => {
  const [theme, setTheme] = useState<IThemeMode>('default') // 主题色

  const themeToken = {
    default: themeColor,
    dark: themeDarkColor // 黑色主题
  }[theme]

  useEffect(() => {
    setTheme(STORAGE_GET_THEME() || 'default')
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: (mode: IThemeMode) => {
          STORAGE_SET_THEME(mode)
          setTheme(mode)
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
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
