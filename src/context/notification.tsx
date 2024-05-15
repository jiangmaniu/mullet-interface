import { notification } from 'antd'
import { createContext, useContext } from 'react'

interface IProps {
  children: JSX.Element
}

type ProviderType = {
  api: any
}

const Context = createContext<ProviderType>({} as ProviderType)

export const NotificationProvider = ({ children }: IProps) => {
  const [api, contextHolder] = notification.useNotification()

  const exposed = {
    api
  }

  return (
    <Context.Provider value={exposed}>
      <>
        {children}
        {contextHolder}
      </>
    </Context.Provider>
  )
}

export const useNotification = () => useContext(Context)
