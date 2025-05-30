import React from 'react'

import globalStore from '../mobx/global'
import klineStore from '../mobx/kline'
import searchStore from '../mobx/search'
import tradeStore from '../mobx/trade'
import walletStore from '../mobx/wallet/index'
import wsStore from '../mobx/ws'

class Stores {
  ws = wsStore
  global = globalStore
  trade = tradeStore
  kline = klineStore
  wallet = walletStore
  search = searchStore
}
export const stores = new Stores()

const StoresContext = React.createContext<Stores>(stores)
export const StoresProvider = ({ children }: any) => {
  return <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
}
export const useStores = (): Stores => React.useContext(StoresContext)
