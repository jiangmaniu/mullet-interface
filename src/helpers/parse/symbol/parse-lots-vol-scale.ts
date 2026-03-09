import { BNumber } from '@/libs/utils/number'

export const parseSymbolLotsVolScale = (symbolConf?: Symbol.SymbolConf) => {
  return BNumber.from(symbolConf?.tradeStep)?.decimalPlaces()
}
