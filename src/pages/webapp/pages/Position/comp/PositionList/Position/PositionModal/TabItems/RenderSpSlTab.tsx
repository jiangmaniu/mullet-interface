import { useStores } from '@/context/mobxProvider'
import useTrade from '@/hooks/useTrade'
import FullModeSpSl from '@/pages/webapp/components/Trade/TradeView/comp/SetSpSl/FullModeSpSl'
import useFocusEffect from '@/pages/webapp/hooks/useFocusEffect'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { ForwardedRef, forwardRef, useCallback, useImperativeHandle, useState } from 'react'
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

  useTrade({
    marketItem: item
  })

  const [stopLoss, setStopLoss] = useState(item.stopLoss)
  const [takeProfit, setTakeProfit] = useState(item.takeProfit)

  const setValues = (sl: number, tp: number) => {
    setStopLoss(sl)
    setTakeProfit(tp)
  }

  // 止盈止损确认
  const submitSpsl = useCallback(async () => {
    const msg = t('pages.trade.SpSl Set Error')
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
    }
  }, [t, item, trade, close, stopLoss, takeProfit])

  useImperativeHandle(ref, () => ({
    submit: submitSpsl
  }))

  useFocusEffect(
    useCallback(() => {
      // TopTabbar.summit 需要
      setTabKey?.('SPSL')
    }, [])
  )

  return <FullModeSpSl useOuterTrade setValues={setValues} />
})

export default RenderSpSlTab
