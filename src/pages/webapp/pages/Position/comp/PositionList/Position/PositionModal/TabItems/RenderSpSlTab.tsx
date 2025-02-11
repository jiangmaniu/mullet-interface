import { useStores } from '@/context/mobxProvider'
import FullModeSpSl from '@/pages/webapp/components/Trade/TradeView/comp/SetSpSl/FullModeSpSl'
import useSpSl from '@/pages/webapp/hooks/trade/useSpSl'
import useFocusEffect from '@/pages/webapp/hooks/useFocusEffect'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { message } from '@/utils/message'
import { observer } from 'mobx-react'
import { ForwardedRef, forwardRef, useCallback, useImperativeHandle } from 'react'
import { RenderTabRef } from '.'
import { Params } from '../TopTabbar/types'

type IProps = {
  rawItem: Order.BgaOrderPageListItem
  close?: () => void
  setTabKey?: (value: Params['tabKey']) => void
}

const RenderSpSlTab = forwardRef((props: IProps, ref: ForwardedRef<RenderTabRef>) => {
  const { rawItem: item, close, setTabKey } = props
  const { t } = useI18n()
  const { trade } = useStores()

  const { slValuePrice: stopLoss, spValuePrice: takeProfit } = useSpSl()

  // 止盈止损确认
  const submitSpsl = async () => {
    const msg = t('pages.trade.SpSl Set Error')

    try {
      if (!stopLoss || !takeProfit) {
        message.info(msg)
        return
      }

      const params = {
        bagOrderId: item?.id,
        stopLoss,
        takeProfit
      } as Order.ModifyStopProfitLossParams

      console.log('止盈止损确认参数', params)

      const res = await trade.modifyStopProfitLoss(params)

      if (res.success) {
        // 关闭弹窗
        close?.()
      } else {
        message.info(msg)
        close?.()
      }
    } catch (error) {
      message.info(JSON.stringify(error))
      close?.()
    }
  }

  useImperativeHandle(ref, () => ({
    submit: submitSpsl
  }))

  useFocusEffect(
    useCallback(() => {
      // TopTabbar.summit 需要
      setTabKey?.('SPSL')
    }, [])
  )

  return <FullModeSpSl />
})

export default observer(RenderSpSlTab)
