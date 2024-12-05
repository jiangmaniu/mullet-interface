declare namespace Wallet {
  type IMethodStatus = 'locked' | 'unlocked' // 是否可用（解锁）状态
  type IMethodType = 'crypto' | 'bank' // 支付类型： 加密货币 / 银行

  type IMethodOption = {
    // 图标
    icon?: string
    // 标签
    label?: string
    // 值
    value?: string
    // 描述
    desc?: string
  }

  // 配置详情，到账时间 / 金额限制 / 资费 / 货币类型 / 链名称 / 入金链上地址 / 银行名称 等等
  type IMethodOptions = Record<string, IMethodOption>

  /**
   * 接口获取充值方式返回数据类型
   */
  type DepositMethod = {
    id: string
    // 图标
    icon?: string
    // 标题
    title: string
    // 是否可用（解锁）状态
    status?: IMethodStatus
    // 配置详情，到账时间 / 金额限制 / 资费 / 货币类型 / 链名称 / 入金链上地址 / 银行名称 等等
    options?: IMethodOptions
    // 支付类型
    type?: IMethodType
    // 充值提示 （根据语言类型返回；或前端预设）
    tips?: string
    // 入金须知（html，根据语言类型返回；或前端预设）
    notice?: string

    // [key: string]: any
  }

  /**
   * 接口获取提现方式返回数据类型
   */
  type WithdrawMethod = {
    id: string
    // 图标
    icon?: string
    // 标题
    title: string
    // 是否可用（解锁）状态
    status?: IMethodStatus
    // 配置详情，到账时间 / 金额限制 / 资费 / 货币类型 / 链名称 / 银行名称 等等
    options?: IMethodOptions
    // 支付类型
    type?: IMethodType
    // 充值提示 （根据语言类型返回；或前端预设）
    tips?: string
    // 出金须知（html，根据语言类型返回；或前端预设）
    notice?: string

    // [key: string]: any
  }

  /**
   * 生成充值订单请求参数
   */
  type GenerateDepositOrderParams = {
    // 充值方式
    methodId: string
    // 充值金额
    amount: number
    // 交易账户 ID
    toAccountId: string
    // 币种
    currency?: string
    // 备注
    remark?: string
  }

  /**
   * 生成提现订单（预览）
   */
  type GenerateWithdrawOrderParams = {
    // 出款地址：从该交易账户提取
    fromAccountId: string
    // 提现金额
    amount: number
    // 提现方式 ID,
    methodId: string
    // 收款地址：链地址（crypto） / 银行账户（bank）
    toAccountId: string
    // 提现币种
    currency?: string
    // 备注
    remark?: string
  }

  /**
   * 生成提现订单（提交申请）请求参数
   */
  type ConfirmWithdrawOrderParams = {
    // 提现订单 ID
    orderId: string
    // 支付密码
    password: string
    // 验证码
    code: string
  }

  /**
   * 获取入金记录
   */
  type DepositRecord = {
    [key: string]: any
  }

  /**
   * 获取提现记录
   */
  type WithdrawRecord = {
    [key: string]: any
  }
}
