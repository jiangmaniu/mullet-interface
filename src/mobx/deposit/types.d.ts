export type IDEpositMethodStatus = 'locked' | 'unlocked'

export type IDEpositMethodOption = {
  icon?: string
  title: string
  desc?: string
}

export type IDepositMethod = {
  id: string
  icon?: string
  title: string
  // 是否可用（解锁）状态
  status: IDEpositMethodStatus
  // 配置详情，到账时间 / 限制 / 费用等等
  options: IDEpositMethodOption[]

  // 充值地址
  address?: string
  // 充值提示
  depositTips?: string
  // 入金须知
  depositNotice?: string
}
