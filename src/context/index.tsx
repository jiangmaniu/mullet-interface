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
