import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { useEffect, useRef, useState, useMemo } from 'react'

import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import { toFixed } from '@/utils'

import usePageVisibility from '@/hooks/usePageVisibility'
import { ClosePositionAction } from './_comps/close-position-action'
import { SettingPositionTpSlAction } from './_comps/setting-position-tp-sl-action'
import { AdjustPositionMarginAction } from './_comps/adjust-position-margin-action'
import { DataTable } from '@/libs/table'
import { getColumns } from './tableConfig'
import { ExpandedState } from '@tanstack/react-table'

export type IPositionItem = Order.BgaOrderPageListItem & {
  /**合并汇总展开行的手续费 */
  totalHandlingFees?: number
  /**合并汇总展开行的库存费 */
  totalInterestFees?: number
  /**展开子列表 */
  childrenList?: IPositionItem[]
}

type IProps = {
  style?: React.CSSProperties
  parentPopup?: any
}

function Position({ style, parentPopup }: IProps) {
  const { ws, trade } = useStores()
  const { lng } = useLang()
  const { recordListClassName } = useStyle()
  const showActiveSymbol = trade.showActiveSymbol

  const [loading, setLoading] = useState(true)

  const closePositionActionRef = useRef<any>(null)
  const settingPositionTpSlActionRef = useRef<any>(null)
  const adjustPositionMarginActionRef = useRef<any>(null)
  const [adjustPositionMarginData, setAdjustPositionMarginData] = useState<any>({} as IPositionItem)

  const [expandedRowKeys, setExpandedRowKeys] = useState<ExpandedState>({})

  const positionList = trade.positionList as IPositionItem[]

  const activeSymbolName = trade.activeSymbolName
  let list = showActiveSymbol ? positionList.filter((v) => v.symbol === activeSymbolName) : positionList

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 200)
  }, [])

  // 账户组是锁仓模式下按品种名称分类 统计全仓模式下的品种分类
  const getSymbolGroup = (list: IPositionItem[]) => {
    if (trade.currentAccountInfo.orderMode === 'LOCKED_POSITION') {
      // 分离全仓和逐仓仓位
      const crossMarginPositions = list.filter((item) => item.marginType === 'CROSS_MARGIN')
      const isolatedPositions = list.filter((item) => item.marginType === 'ISOLATED_MARGIN')

      // 处理全仓仓位分组
      const symbolMap = new Map()
      crossMarginPositions.forEach((item) => {
        const symbol = item.symbol
        if (!symbolMap.has(symbol)) {
          symbolMap.set(symbol, [])
        }
        symbolMap.get(symbol).push(item)
      })

      // 将全仓分组转换为所需格式，并与逐仓仓位合并
      const groupedCrossMargin = Array.from(symbolMap.entries()).map(([symbol, children]) => ({
        ...children.at(-1), // 获取最后一项时间最早的作为展开行之前的数据
        totalHandlingFees: (children || []).reduce((acc: number, item: IPositionItem) => acc + Number(item.handlingFees || 0), 0), // 合并手续费
        totalInterestFees: (children || []).reduce((acc: number, item: IPositionItem) => acc + Number(item.interestFees || 0), 0), // 合并库存费
        childrenList: children.map((v: IPositionItem) => {
          const digits = v.symbolDecimal || 2
          if (v.marginType === 'CROSS_MARGIN') {
            v.orderMargin = v.orderBaseMargin
          }
          v.startPrice = toFixed(v.startPrice, digits) // 开仓价格格式化
          return v
        })
      }))

      // 合并全仓分组和逐仓仓位
      return [...groupedCrossMargin, ...isolatedPositions]
    }
    return list
  }

  const dataSource = useMemo(() => {
    return getSymbolGroup(toJS(list)).map((v) => {
      const digits = v.symbolDecimal || 2
      const isCrossMargin = v.marginType === 'CROSS_MARGIN'

      // 全仓使用基础保证金
      if (isCrossMargin) {
        v.orderMargin = v.orderBaseMargin
      }
      v.startPrice = toFixed(v.startPrice, digits) // 开仓价格格式化
      return v
    })
  }, [list, trade.currentAccountInfo.orderMode])

  const columns = getColumns({
    onClose: (record) => closePositionActionRef.current?.show(record),
    onTpSl: (record) => settingPositionTpSlActionRef.current?.show(record),
    onMargin: (record) => {
      setAdjustPositionMarginData(record)
      adjustPositionMarginActionRef.current?.show(record)
    }
  })

  // 展开状态维护
  useEffect(() => {
    // 当数据源变化（主要是列表刷新）时，我们可能想保持展开状态，
    // 或者如果 ID 变了，可能需要清理。
  }, [dataSource])

  const [forceUpdateKey, setForceUpdateKey] = useState(0)

  usePageVisibility(
    () => {
      setForceUpdateKey((prev) => prev + 1)
    },
    () => {}
  )

  return (
    <>
      <DataTable
        data={dataSource}
        columns={columns}
        loading={loading}
        pagination={{
          pageSize: 6,
          total: dataSource.length
        }}
        state={{
          expanded: expandedRowKeys
        }}
        onExpandedChange={setExpandedRowKeys}
        getSubRows={(row) => row.childrenList}
      />

      {/* 平仓修改确认弹窗 */}
      <ClosePositionAction ref={closePositionActionRef} />
      {/* 设置止损止盈弹窗 */}
      <SettingPositionTpSlAction ref={settingPositionTpSlActionRef} />
      {/* 追加、提取保证金弹窗 */}
      <AdjustPositionMarginAction
        ref={adjustPositionMarginActionRef}
        positionInfo={adjustPositionMarginData}
        onClose={() => setAdjustPositionMarginData({})}
      />
    </>
  )
}

export default observer(Position)
