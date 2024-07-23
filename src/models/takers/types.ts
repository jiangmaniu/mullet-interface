export type IOrderTakerState = 'gendan' | 'yigendan' | 'yimanyuan' | 'wufagendan'
export type IOrderAccountType = 'biaozhun' | 'luodian' | 'meifen'

/** 賬戶信息 */
export interface IAccount {
  id: string
  name: string
  avatar?: string
}

/** 帶單賬戶信息 */
export interface ITaker extends IAccount {
  type: IOrderAccountType
  followers: number
  limitFollowers: number
  introduction?: string
}

/** 跟單賬戶信息 */
export interface IFollower extends IAccount {
  /** 淨盈虧 */
  jingyingkui: number
  /** 跟單金額 */
  gendanjine: number
  /** 保證金餘額 */
  baozhengjinyue: number
  /** 已實現盈虧 */
  yishixianyingkui: number
  /** 未實現盈虧 */
  weishixianyingkui: number
  /** 跟随天数 */
  gensuitianshu: number
  /** 跟随开始时间 */
  gensuikaishishijian: string
  /** 跟随结束时间 */
  gensuijieshushijian: string
  /** 分润金额 */
  fenrunjine: number
}

/** 帶單員 */
export type IOrderTaker = {
  id: string
  account: ITaker
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
  account: ITaker
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

/** 帶單頁面參數 */
export type IOrderTakerProps = {
  item: IOrderTaker
  state: Record<string, any> // 页面状态
}

/** 跟單頁面參數 */
export type IOrderProps = {
  item: IOrder
  state: Record<string, any> // 页面状态
}
