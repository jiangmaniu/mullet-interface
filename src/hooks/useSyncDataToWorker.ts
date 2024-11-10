import { useDebounceEffect } from 'ahooks'
import { toJS } from 'mobx'

import { stores } from '@/context/mobxProvider'
import { WorkerType } from '@/mobx/ws.types'

// 同步主线程数据到worker线程中作为基础计算数据
export default function useSyncDataToWorker() {
  const { trade, ws } = stores
  const {
    tradePageActive,
    activeSymbolName,
    currentAccountInfo,
    positionList,
    allSimpleSymbolsMap,
    symbolListAll,
    currentLiquidationSelectBgaId,
    buySell,
    orderType,
    orderVolume,
    orderPrice,
    leverageMultiple,
    marginType
  } = trade

  const syncData = (type: WorkerType, data?: any) => {
    ws.sendWorkerMessage({
      type,
      data
    })
  }

  // 1、当前激活品种
  useDebounceEffect(
    () => {
      syncData('SYNC_ACTIVE_SYMBOL_NAME', { activeSymbolName })
    },
    [activeSymbolName, tradePageActive],
    {
      wait: 300
    }
  )

  // 2、当前选择的账户信息
  useDebounceEffect(
    () => {
      syncData('SYNC_CURRENT_ACCOUNT_INFO', { currentAccountInfo: toJS(currentAccountInfo) })
    },
    [currentAccountInfo, tradePageActive],
    {
      wait: 300
    }
  )

  // 3、当前持仓列表
  useDebounceEffect(
    () => {
      syncData('SYNC_POSITION_LIST', { positionList: toJS(positionList) })
    },
    [positionList.length, tradePageActive],
    {
      wait: 300
    }
  )

  // 4、全部品种列表map，校验汇率品种用到
  useDebounceEffect(
    () => {
      syncData('SYNC_ALL_SYMBOL_MAP', { allSimpleSymbolsMap: toJS(allSimpleSymbolsMap) })
    },
    [allSimpleSymbolsMap, tradePageActive],
    {
      wait: 300
    }
  )

  // 5、当前账户所有品种列表
  useDebounceEffect(
    () => {
      syncData('SYNC_ALL_SYMBOL_LIST', { symbolListAll: toJS(symbolListAll) })
    },
    [symbolListAll.length, tradePageActive],
    {
      wait: 300
    }
  )

  // 6、同步交易区操作类型
  useDebounceEffect(
    () => {
      syncData('SYNC_TRADE_ACTIONS', {
        buySell,
        orderType,
        orderVolume,
        price: orderPrice,
        leverageMultiple,
        marginType,
        currentLiquidationSelectBgaId
      })
    },
    [buySell, orderType, orderVolume, orderPrice, leverageMultiple, marginType, currentLiquidationSelectBgaId, tradePageActive],
    {
      wait: 300
    }
  )
}
