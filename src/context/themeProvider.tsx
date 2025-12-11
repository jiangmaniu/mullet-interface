import { ConfigProvider, theme } from 'antd'
import { ClassValue } from 'clsx'
import { merge } from 'lodash'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { mobileLightTheme } from '@/pages/webapp/theme/theme.config'
import { mobileDarkTheme } from '@/pages/webapp/theme/theme.config.dark'
import themeColor from '@/theme/theme.antd'
import themeDarkColor from '@/theme/theme.antd.dark'
import { showInsetEffect } from '@/utils/antdWave'
import { cn } from '@/utils/cn'
import { STORAGE_GET_THEME, STORAGE_GET_TRADE_THEME, STORAGE_SET_THEME, STORAGE_SET_TRADE_THEME } from '@/utils/storage'

import { useEnv } from './envProvider'
const { defaultAlgorithm, darkAlgorithm } = theme

export type IThemeMode = 'light' | 'dark'
export type IDirection =
  /** 0绿涨红跌 */
  | 0
  /** 红涨绿跌 */
  | 1

interface IThemeContextProps {
  /** 主题变量 */
  theme: {
    /**antd主题变量 */
    themeToken: typeof themeColor
    /** 主题颜色 */
    colors: typeof mobileLightTheme
    /** 0绿涨红跌 1 红涨绿跌 */
    direction: IDirection
    /** 涨 颜色 */
    up: string
    /** 跌 颜色 */
    down: string
    /** 用戶配置的主题模式 */
    mode: IThemeMode
    /** 是否是黑色主题 */
    isDark: boolean
  }
  /**交易页面主题色 */
  tradeTheme: IThemeMode
  /**设置主题 */
  setMode: (theme: IThemeMode) => void
  /**切换主题色 */
  toggleTheme: () => void
  /**className工具方法 */
  cn: (...inputs: ClassValue[]) => any
  /**设置0绿涨红跌 1红涨绿跌 */
  setDirection: (key: IDirection) => void
}

interface IProps {
  children: JSX.Element
}

export const ThemeContext = createContext<IThemeContextProps>({} as IThemeContextProps)

export const ThemeProvider = ({ children }: IProps): JSX.Element => {
  const [mode, setMode] = useState<IThemeMode>('light') // 主题色
  const [tradeTheme, setTradeTheme] = useState<IThemeMode>('light') // 主题色
  const [direction, setDirection] = useState<any>(0) // 0绿涨红跌 1红涨绿跌
  const { isPc, isMobileOrIpad } = useEnv()

  const theme = useMemo(() => {
    const themeToken = mode === 'dark' ? themeDarkColor : themeColor // antd主题色
    const mobileColors = mode === 'dark' ? mobileDarkTheme : mobileLightTheme // mobile主题色
    // pc端合并antd主题色和mobile主题色，否则取值报错
    const colors = isPc ? merge(mobileColors, themeToken) : mobileColors

    return {
      themeToken, // antd主题色
      colors, // 全部动态主题颜色
      direction, // 0绿涨红跌 1红涨绿跌
      up: direction === 1 ? 'var(--color-red)' : 'var(--color-green)', // 涨的颜色
      down: direction === 1 ? 'var(--color-green)' : 'var(--color-red)', // 跌的颜色
      mode, // 主题模式
      isDark: mode === 'dark' // 是否暗色模式
    }
  }, [mode, direction, isPc])

  // 设置移动端主题变量模式，切换:root[data-mode=h5-light/h5-dark]属性改变css移动端的变量
  const setMobileThemeMode = () => {
    setTimeout(() => {
      if (isMobileOrIpad) {
        document.documentElement.setAttribute('data-mode', mode === 'light' ? 'h5-light' : 'h5-dark')
      }
    }, 100)
    if (isPc) {
      document.documentElement.removeAttribute('data-mode')
    }
  }

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
    setMobileThemeMode()
  }

  // 监听响应式变化，设置主题模式
  useEffect(() => {
    setMobileThemeMode()
  }, [isPc, isMobileOrIpad])

  // @TODO 移动端 切换为亮色主题及时pc设置了黑色，暂时不考虑移动端黑色主题
  useEffect(() => {
    if (theme.isDark && isMobileOrIpad) {
      const themeMode = theme.isDark ? 'light' : 'dark'
      setMode(themeMode)
      // 设置交易页面主题，因为交易页面主题不是全局的，所以需要单独设置
      STORAGE_SET_TRADE_THEME(themeMode)
    }
  }, [theme.isDark, isMobileOrIpad])

  // 监听系统主题模式
  useEffect(() => {
    // 优先获取交易页面主题，如果没有获取到，则获取全局主题
    const themeMode = STORAGE_GET_TRADE_THEME() || STORAGE_GET_THEME()

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const matchMode = darkModeMediaQuery.matches ? 'dark' : 'light'
    const mode = themeMode ? themeMode : matchMode

    handleSetTheme(mode)

    const listener = (event: any) => {
      const themeMode = event.matches ? 'dark' : 'light'

      // 监听系统主题切换
      handleSetTheme(themeMode)
    }

    darkModeMediaQuery.addEventListener('change', listener)
    return () => {
      darkModeMediaQuery.removeEventListener('change', listener)
    }
  }, [])

  const handleSetTheme = (mode: IThemeMode) => {
    STORAGE_SET_THEME(mode)
    setMode(mode)
    setThemeClassName(mode)
  }

  const values = {
    theme, // 当前主题的所有配置项
    cn,
    tradeTheme,
    setDirection,
    toggleTheme: () => {
      setMode(mode === 'dark' ? 'light' : 'dark')
    },
    setMode: (mode: IThemeMode) => {
      if (mode) {
        handleSetTheme(mode)
      }
    }
  } as IThemeContextProps

  return (
    <ThemeContext.Provider value={values}>
      {/* 使用ConfigProvider配置主题，方便动态切换主题，不在使用config/theme来配置 */}
      <ConfigProvider
        theme={{
          token: {
            ...theme.themeToken
          },
          hashed: false,
          cssVar: true,
          algorithm: mode === 'dark' ? darkAlgorithm : defaultAlgorithm
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
