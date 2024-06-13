import { useStores } from '@/context/mobxProvider'

/**
 * 获取当前激活打开的品种深度报价
 * @param {*} currentSymbol 当前传入的symbolName
 * @returns
 */
function useCurrentDepth(currentSymbolName?: string) {
  const { ws, trade } = useStores()
  const { depth } = ws
  const symbol = currentSymbolName || trade.activeSymbolName

  const currentDepth = depth[symbol] || {}

  return currentDepth
}

export default useCurrentDepth
