export type Params = {
  tabKey: 'CLOSE_POSITION' | 'SPSL' | 'MARGIN' | 'CLOSE_MARKET_POSITION'
}

type IProps = Params & {
  rawItem: Order.BgaOrderPageListItem
  close?: () => void
  setSwipeEnabled?: (value: boolean) => void
  setTabKey?: (value: Params['tabKey']) => void
}

export type PositionTabParamList = {
  /** 平仓 */
  CLOSE_POSITION: undefined
  /** 止盈止损 */
  SPSL: undefined
  /** 追加、减少保证金 */
  MARGIN?: undefined
}
