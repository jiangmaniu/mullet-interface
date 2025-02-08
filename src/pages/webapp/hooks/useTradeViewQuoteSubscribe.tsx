// import { useCallback, useEffect } from 'react'

// import { useStores } from '@/context/mobxProvider'

// import { toJS } from 'mobx'

// // 交易区订阅行情
// export default function useSymbolQuoteUnsubscribe() {
//   const { trade, ws } = useStores()
//   const { activeSymbolName, positionList } = trade
//   const symbolList = toJS(positionList).map((item) => item.symbol) as string[]
//   const avoidList = ws.makeWsSymbol([activeSymbolName, ...symbolList])

//   const unSubscribe = useCallback(() => {
//     ws.batchSubscribeSymbol({ cancel: true, avoidList })
//   }, [avoidList])

//   useEffect(() => {
//     return unSubscribe
//   }, [unSubscribe])
// }
