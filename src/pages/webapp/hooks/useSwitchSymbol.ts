import { stores } from '@/context/mobxProvider'
import useQuote from './trade/useQoute'

export const useSwitchSymbol = () => {
  const { switchSymbol: rawSwitchSymbol, setOrderVolume } = stores.trade
  const { vmin } = useQuote()

  return {
    switchSymbol: (symbol: string) => {
      rawSwitchSymbol(symbol)
      setOrderVolume(vmin)
    }
  }
}
