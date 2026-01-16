import { forwardRef, useImperativeHandle, useState } from 'react'
import { ClosePositionModal } from '../../../modal/close-position-modal'
import { observer } from 'mobx-react'
import { IPositionItem } from '@/pages/web/trade/_comps/records/PositionList'
import { TradeOrderDirectionEnum } from '@/pages/web/trade/_options/order'
import { ORDER_TYPE } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import { toast } from '@/libs/ui/components/toast'
import { Trans, useLingui } from '@/libs/lingui/react/macro'
import { useModel } from '@umijs/max'
import useTrade from '@/hooks/useTrade'
import { RecordModalItem } from '@/mobx/trade'
import { IPendingItem } from '..'
import { SettingPendingEditorModal } from '../../../modal/setting-pending-editor-modal'

export const SettingPendingEditorAction = observer(
  forwardRef<{ show: () => void; close: () => void }, { record: IPendingItem; onClose?: () => void }>((props, ref) => {
    const { record, onClose } = props
    const { trade } = useStores()
    const [open, setOpen] = useState(false)

    const show = () => {
      setOpen(true)
    }

    const close = () => {
      setOpen(false)
      onClose?.()
      trade.resetTradeAction()
      trade.setRecordModalItem({} as RecordModalItem)
    }

    useImperativeHandle(ref, () => {
      return {
        show,
        close
      }
    })

    return <SettingPendingEditorActionContent isOpen={open} onClose={close} pendingOrderInfo={record} />
  })
)

const SettingPendingEditorActionContent = observer(
  ({ isOpen: open, onClose: close, pendingOrderInfo }: { isOpen: boolean; onClose: () => void; pendingOrderInfo: IPendingItem }) => {
    return <SettingPendingEditorModal isOpen={open} onClose={close} pendingOrderInfo={pendingOrderInfo} />
  }
)
