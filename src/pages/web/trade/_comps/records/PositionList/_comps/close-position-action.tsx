import { forwardRef, useImperativeHandle, useState } from 'react'
import { ClosePositionModal } from '../../../modal/close-position-modal'
import { observer } from 'mobx-react'
import { IPositionItem } from '@/pages/web/trade/_comps/records/PositionList'
import { TradeOrderDirectionEnum } from '@/pages/web/trade/_options/order'
import { ORDER_TYPE } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import { toast } from '@/libs/ui/components/toast'
import { Trans } from '@/libs/lingui/react/macro'
import { useModel } from '@umijs/max'

export const ClosePositionAction = observer(
  forwardRef((props, ref) => {
    const { trade } = useStores()
    const { fetchUserInfo } = useModel('user')
    const [open, setOpen] = useState(false)

    const [positionInfo, setPositionInfo] = useState({} as IPositionItem)

    const show = (item: any) => {
      setOpen(true)
      setPositionInfo(item)
    }

    const close = () => {
      setOpen(false)
    }

    const handleClosePosition = async (data: { amount: string }) => {
      const { amount } = data
      // 平仓下一个反方向的单
      const params = {
        symbol: positionInfo.symbol,
        buySell: positionInfo.buySell === TradeOrderDirectionEnum.BUY ? TradeOrderDirectionEnum.SELL : TradeOrderDirectionEnum.BUY, // 订单方向
        orderVolume: amount,
        tradeAccountId: positionInfo.tradeAccountId,
        executeOrderId: positionInfo.id, // 持仓单号
        type: ORDER_TYPE.MARKET_ORDER // 订单类型
      } as Order.CreateOrder

      const res = await trade.createOrder(params)

      if (res.success) {
        // 更新账户余额信息
        await fetchUserInfo()
        // toast.success(<Trans>平仓成功!</Trans>)
      }
    }

    useImperativeHandle(ref, () => {
      return {
        show,
        close
      }
    })

    return <ClosePositionModal isOpen={open} onClose={close} positionInfo={positionInfo} onConfirm={handleClosePosition} />
  })
)
