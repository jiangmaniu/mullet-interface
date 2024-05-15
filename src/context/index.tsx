import { StoresProvider } from '@/mobx'

import { EnvProvider } from './envProvider'
import { LanguageProvider } from './languageProvider'
import { NotificationProvider } from './notification'

interface IProps {
  children: JSX.Element
}

export const Provider = ({ children }: IProps): JSX.Element => {
  return (
    <NotificationProvider>
      <StoresProvider>
        <LanguageProvider>
          <EnvProvider>{children}</EnvProvider>
        </LanguageProvider>
      </StoresProvider>
    </NotificationProvider>
  )
}
