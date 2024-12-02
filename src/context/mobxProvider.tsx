import React from 'react'

import depositStore from '../mobx/deposit/index'
import globalStore from '../mobx/global'
import klineStore from '../mobx/kline'
import tradeStore from '../mobx/trade'
import wsStore from '../mobx/ws'

class Stores {
  ws = wsStore
  global = globalStore
  trade = tradeStore
  kline = klineStore
  deposit = depositStore
}
export const stores = new Stores()

const StoresContext = React.createContext<Stores>(stores)
export const StoresProvider = ({ children }: any) => {
  return <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
}
export const useStores = (): Stores => React.useContext(StoresContext)
