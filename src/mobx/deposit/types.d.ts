/** 数据类型 */

export type IMethodStatus = 'locked' | 'unlocked'
export type IMethodType = 'crypto' | 'bank' // 支付类型： 加密货币 / 银行

export type IMethodOption = {
  icon?: string
  title?: string
  desc?: string
}

export type IMethodOptions = Record<string, IMethodOption>

/**
 * 入金/方式
 */
export type IDepositMethod = {
  id: string
  icon?: string
  title: string
  // 是否可用（解锁）状态
  status?: IMethodStatus
  // 配置详情，到账时间 / 限制 / 费用等等
  options?: IMethodOptions
  // 支付类型
  type?: IMethodType
  // 充值地址
  address?: string
  // 充值提示
  depositTips?: string
  // 入金须知
  depositNotice?: string

  [key: string]: any
}

/**
 * 入金/方式
 */
export type IWithdrawalMethod = {
  id: string
  icon?: string
  title: string
  // 是否可用（解锁）状态
  status?: IMethodStatus
  // 配置详情，到账时间 / 限制 / 费用等等
  options?: IMethodOptions
  // 支付类型
  type?: IMethodType
  // 充值地址
  address?: string
  // 充值提示
  depositTips?: string
  // 入金须知
  depositNotice?: string

  [key: string]: any
}
