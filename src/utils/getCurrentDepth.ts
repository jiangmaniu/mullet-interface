import { useStores } from '@/context/mobxProvider'

/**
 * 获取当前激活打开的品种深度报价
 * @param {*} currentSymbol 当前传入的symbolName
 * @returns
 */
function getCurrentDepth(currentSymbolName?: string) {
  const { ws, trade } = useStores()
  const { depth } = ws
  const symbol = currentSymbolName || trade.activeSymbolName
  const dataSourceSymbol = trade.getActiveSymbolInfo(symbol)?.dataSourceSymbol as string

  const currentDepth = depth[dataSourceSymbol] || {}

  return currentDepth
}

export default getCurrentDepth
