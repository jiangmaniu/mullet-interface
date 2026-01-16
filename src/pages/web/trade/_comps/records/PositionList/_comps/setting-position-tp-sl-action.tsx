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
import { SettingPositionTpSlModal } from '../../../modal/setting-position-tp-sl-modal'
import useTrade from '@/hooks/useTrade'
import { RecordModalItem } from '@/mobx/trade'

export const SettingPositionTpSlAction = observer(
  forwardRef((props, ref) => {
    const { trade } = useStores()
    const [open, setOpen] = useState(false)

    const [positionInfo, setPositionInfo] = useState<IPositionItem>({} as IPositionItem)

    const show = (item: IPositionItem) => {
      setOpen(true)
      setPositionInfo(item)
    }

    const close = () => {
      setOpen(false)
      setPositionInfo({} as IPositionItem)
      trade.resetTradeAction()
      trade.setRecordModalItem({} as RecordModalItem)
    }

    useImperativeHandle(ref, () => {
      return {
        show,
        close
      }
    })

    return <SettingPositionTpSlActionContent isOpen={open} onClose={close} positionInfo={positionInfo} />
  })
)

const SettingPositionTpSlActionContent = observer(
  ({ isOpen: open, onClose: close, positionInfo }: { isOpen: boolean; onClose: () => void; positionInfo: IPositionItem }) => {
    return <SettingPositionTpSlModal isOpen={open} onClose={close} positionInfo={positionInfo} />
  }
)
