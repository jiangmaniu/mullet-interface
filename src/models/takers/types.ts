export type IOrderTakerState = 'gendan' | 'yigendan' | 'yimanyuan' | 'wufagendan'
export type IOrderAccountType = 'biaozhun' | 'luodian' | 'meifen'

export type IOrderAccount = {
  id: string
  name: string
  avatar?: string
  type: IOrderAccountType
  followers: number
  limitFollowers: number
}

export type IOrderTaker = {
  account: IOrderAccount
  datas: Record<string, any>
  tags: any[]
  state: IOrderTakerState
}

export type IOrderTakerProps = {
  taker: IOrderTaker
  state: Record<string, any> // 页面状态
}
