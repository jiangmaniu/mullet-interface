import updateVersion from '@/hooks/updateVersion'
import { STORAGE_SET_REGISTER_CODE } from '@/utils/storage'
import { useEffect } from 'react'
import { EnvProvider } from './envProvider'
import { LanguageProvider } from './languageProvider'
import { LoadingProvider } from './loadingProvider'
import { StoresProvider, stores } from './mobxProvider'
import { NotificationProvider } from './notification'
import { PrivyProvider } from './privyProvider'
import { ThemeProvider } from './themeProvider'

interface IProps {
  children: JSX.Element
}

export const Provider = ({ children }: IProps): JSX.Element => {
  const searchParams = new URLSearchParams(window.location.search)
  const code = searchParams.get('code')

  updateVersion()

  useEffect(() => {
    // 提前建立socket连接，加快首次进入页面行情连接速度
    stores.ws.connect()
  }, [])

  useEffect(() => {
    // 缓存地址上的注册识别码
    const code = searchParams.get('code')
    if (code) {
      STORAGE_SET_REGISTER_CODE(code)
    }
  }, [code])

  return (
    <PrivyProvider>
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
    </PrivyProvider>
  )
}
