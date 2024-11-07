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
    currentLiquidationSelectBgaId
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

  // 6、默认全仓，右下角爆仓选择逐仓、全仓切换
  useDebounceEffect(
    () => {
      syncData('SYNC_CURRENT_LIQUIDATION_SELECT_BGA_ID', { currentLiquidationSelectBgaId })
    },
    [currentLiquidationSelectBgaId, tradePageActive],
    {
      wait: 300
    }
  )
}
