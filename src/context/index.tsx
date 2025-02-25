import { getEnv } from '@/env'
import { seriesLoadScripts } from '@/utils/loadScript'
import { useEffect } from 'react'
import { EnvProvider } from './envProvider'
import { LanguageProvider } from './languageProvider'
import { LoadingProvider } from './loadingProvider'
import { StoresProvider, stores } from './mobxProvider'
import { NotificationProvider } from './notification'
import { ThemeProvider } from './themeProvider'

interface IProps {
  children: JSX.Element
}

export const Provider = ({ children }: IProps): JSX.Element => {
  const ENV = getEnv()

  useEffect(() => {
    stores.ws.initWorker()
    // 提前建立socket连接，加快首次进入页面行情连接速度
    stores.ws.connect()
  }, [])

  useEffect(() => {
    // salesmartly客服配置
    if (!ENV?.salesmartlyJSUrl) return
    // 必须等待执行完成脚本后，调用回调函数
    seriesLoadScripts([ENV?.salesmartlyJSUrl], () => {
      // 设置聊天插件图标隐藏，可配合打开窗口api实现自定义图标
      // @ts-ignore
      window.__ssc.setting = { hideIcon: true }
    })
  }, [])

  return (
    <NotificationProvider>
      <LoadingProvider>
        <StoresProvider>
          <EnvProvider>
            <ThemeProvider>
              <LanguageProvider>{children}</LanguageProvider>
            </ThemeProvider>
          </EnvProvider>
        </StoresProvider>
      </LoadingProvider>
    </NotificationProvider>
  )
}
