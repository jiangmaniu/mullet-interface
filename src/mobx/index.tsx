import React from 'react'

import globalStore from './global'
import wsStore from './ws'

class Stores {
  ws = wsStore
  global = globalStore
}
export const stores = new Stores()

const StoresContext = React.createContext<Stores>(stores)
export const StoresProvider = ({ children }: any) => {
  return <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
}
export const useStores = (): Stores => React.useContext(StoresContext)
