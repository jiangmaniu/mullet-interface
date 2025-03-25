import updateVersion from '@/hooks/updateVersion'
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
  updateVersion()

  useEffect(() => {
    stores.ws.initWorker()
    // 提前建立socket连接，加快首次进入页面行情连接速度
    stores.ws.connect()
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
