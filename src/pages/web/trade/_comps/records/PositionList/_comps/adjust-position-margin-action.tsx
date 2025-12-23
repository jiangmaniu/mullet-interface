import { forwardRef, useImperativeHandle, useState } from 'react'
import { observer } from 'mobx-react'
import { IPositionItem } from '@/pages/web/trade/comp/TradeRecord/comp/PositionList'
import { AdjustPositionMarginModal } from '../../../modal/adjust-position-margin-modal'

export const AdjustPositionMarginAction = observer(
  forwardRef(({ positionInfo, onClose }: { positionInfo: IPositionItem; onClose?: () => void }, ref) => {
    const [open, setOpen] = useState(false)

    const show = (item: any) => {
      setOpen(true)
    }

    const close = () => {
      setOpen(false)
      onClose?.()
    }

    useImperativeHandle(ref, () => {
      return {
        show,
        close
      }
    })

    return <AdjustPositionMarginModal isOpen={open} onClose={close} positionInfo={positionInfo} />
  })
)
