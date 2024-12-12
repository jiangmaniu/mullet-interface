import { EnvProvider } from './envProvider'
import { LanguageProvider } from './languageProvider'
import { StoresProvider } from './mobxProvider'
import { NotificationProvider } from './notification'
import { ThemeProvider } from './themeProvider'

interface IProps {
  children: JSX.Element
}

export const Provider = ({ children }: IProps): JSX.Element => {
  return (
    <NotificationProvider>
      <EnvProvider>
        <StoresProvider>
          <ThemeProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </ThemeProvider>
        </StoresProvider>
      </EnvProvider>
    </NotificationProvider>
  )
}
