import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { useRef, useState } from 'react'

import { useStores } from '@/context/mobxProvider'
import { DataTable } from '@/libs/table'
import { ORDER_TYPE } from '@/constants/enum'

import { SettingPendingEditorAction } from './_comps/setting-pending-editor-action'
import { getColumns } from './tableConfig'

export type IPendingItem = Order.OrderPageListItem & {
  /**是否是限价单 */
  isLimitOrder: boolean
}

type IProps = {
  style?: React.CSSProperties
  parentPopup?: any
}

// 挂单记录
function PendingList({ style, parentPopup }: IProps) {
  const { trade } = useStores()
  const showActiveSymbol = trade.showActiveSymbol

  let pendingList = trade.pendingList as IPendingItem[]
  let list = showActiveSymbol ? pendingList.filter((v) => v.symbol === trade.activeSymbolName) : pendingList
  const settingPendingEditorActionRef = useRef<any>(null)
  const [settingPendingTpSlRecord, setSettingPendingTpSlRecord] = useState<IPendingItem>({} as IPendingItem)

  const dataSource = toJS(list).map((v) => {
    const isLimitOrder = v.type === ORDER_TYPE.LIMIT_BUY_ORDER || v.type === ORDER_TYPE.LIMIT_SELL_ORDER // 限价单
    v.isLimitOrder = isLimitOrder

    return v
  })

  return (
    <>
      <DataTable
        columns={getColumns({
          onEdit: (record) => {
            setSettingPendingTpSlRecord(record)
            settingPendingEditorActionRef.current?.show()
          }
        })}
        data={dataSource}
        loading={false}
        pagination={{ pageSize: 6 }}
      />

      <SettingPendingEditorAction
        ref={settingPendingEditorActionRef}
        record={settingPendingTpSlRecord}
        onClose={() => setSettingPendingTpSlRecord({} as IPendingItem)}
      />
    </>
  )
}

export default observer(PendingList)
