import { stores } from '@/context/mobxProvider'
import useTrade from '@/hooks/useTrade'

export const useSwitchSymbol = () => {
  const { switchSymbol: rawSwitchSymbol, setOrderVolume } = stores.trade
  const { vmin } = useTrade()

  return {
    switchSymbol: (symbol: string) => {
      rawSwitchSymbol(symbol)
      setOrderVolume(vmin)
    }
  }
}
