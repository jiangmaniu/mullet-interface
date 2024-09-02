import { useNetwork } from 'ahooks'
import { useEffect } from 'react'

import { EnvProvider } from './envProvider'
import { LanguageProvider } from './languageProvider'
import { stores, StoresProvider } from './mobxProvider'
import { NotificationProvider } from './notification'
import { ThemeProvider } from './themeProvider'

interface IProps {
  children: JSX.Element
}

export const Provider = ({ children }: IProps): JSX.Element => {
  const networkState = useNetwork()
  const isOnline = networkState.online

  useEffect(() => {
    // 如果网络断开，在连接需要重新重新建立新的连接
    if (!isOnline) {
      stores.ws.close()
    }
    if (isOnline) {
      // 重新建立新连接
      stores.ws.reconnect()
      // 刷新k线历史数据
      // @ts-ignore
      stores.kline.tvWidget = null
    }
  }, [isOnline])

  return (
    <NotificationProvider>
      <StoresProvider>
        <ThemeProvider>
          <LanguageProvider>
            <EnvProvider>{children}</EnvProvider>
          </LanguageProvider>
        </ThemeProvider>
      </StoresProvider>
    </NotificationProvider>
  )
}
