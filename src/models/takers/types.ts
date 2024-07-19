export type IOrderTakerState = 'gendan' | 'yigendan' | 'yimanyuan' | 'wufagendan'
export type IOrderAccountType = 'biaozhun' | 'luodian' | 'meifen'

/** 賬戶信息 */
export interface IAccount {
  id: string
  name: string
  avatar?: string
}

/** 帶單賬戶信息 */
export interface IOrderAccount extends IAccount {
  type: IOrderAccountType
  followers: number
  limitFollowers: number
  introduction?: string
}

/** 帶單員 */
export type IOrderTaker = {
  id: string
  account: IOrderAccount
  datas: Record<string, any>
  tags: any[]
  state: IOrderTakerState
}

/** 帶單任務 */
export type IOrder = {
  id: string
  /** 任務名稱 */
  title: string
  /** 帶單賬戶 */
  account: IOrderAccount
  /** 跟單人列表 */
  followers: IAccount[]
  /** 任務狀態 */
  datas: Record<string, any>
  /** 任務狀態 */
  // datas: {
  //   /** 任務名稱 */
  //   title: string
  //   /** 賬戶保證金 */
  //   zhanghubaozhengjin: number
  //   /** 賬戶餘額 */
  //   zhanghuyue: number
  //   /** 累計盈虧 */
  //   leijiyingkui: number
  //   /** 淨盈虧 */
  //   jingyingkui: number
  // }
}

/** 跟單頁面參數 */
export type IOrderTakerProps = {
  item: IOrderTaker
  state: Record<string, any> // 页面状态
}

/** 跟單頁面參數 */
export type IOrderProps = {
  item: IOrder
  state: Record<string, any> // 页面状态
}
