import { forwardRef, useImperativeHandle, useState } from 'react'
import { ClosePositionModal } from '../../../modal/close-position-modal'
import { observer } from 'mobx-react'
import { IPositionItem } from '@/pages/web/trade/comp/TradeRecord/comp/PositionList'
import { TradeOrderDirectionEnum } from '@/pages/web/trade/_options/order'
import { ORDER_TYPE } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import { toast } from '@/libs/ui/components/toast'
import { Trans, useLingui } from '@/libs/lingui/react/macro'
import { useModel } from '@umijs/max'
import { SettingPositionTpSlModal } from '../../../modal/setting-position-tp-sl-modal'
import useTrade from '@/hooks/useTrade'
import { RecordModalItem } from '@/mobx/trade'
import { SettingPendingTpSlModal } from '../../../modal/setting-pending-tp-sl-modal'
import { IPendingItem } from '../../PendingList'

export const SettingPendingTpSlAction = observer(
  forwardRef((props, ref) => {
    const { trade } = useStores()
    const [open, setOpen] = useState(false)

    const [pendingOrderInfo, setPendingOrderInfo] = useState<IPendingItem>({} as IPendingItem)

    const show = (item: IPendingItem) => {
      setOpen(true)
      setPendingOrderInfo(item)
    }

    const close = () => {
      setOpen(false)
      setPendingOrderInfo({} as IPendingItem)
      trade.resetTradeAction()
      trade.setRecordModalItem({} as RecordModalItem)
    }

    useImperativeHandle(ref, () => {
      return {
        show,
        close
      }
    })

    return <SettingPendingTpSlActionContent isOpen={open} onClose={close} pendingOrderInfo={pendingOrderInfo} />
  })
)

const SettingPendingTpSlActionContent = observer(
  ({ isOpen: open, onClose: close, pendingOrderInfo }: { isOpen: boolean; onClose: () => void; pendingOrderInfo: IPendingItem }) => {
    return <SettingPendingTpSlModal isOpen={open} onClose={close} pendingOrderInfo={pendingOrderInfo} />
  }
)
