declare namespace Wallet {
  /**
   * 资金类型
   */
  type FundsType = 'DEPOSIT' | 'WITHDRAWAL'
  /**
   * 多语言类型CODE编码
   */
  type Language = 'ZHTW' | 'ENUS' | 'VIVN'

  type IMethodStatus = 'locked' | 'unlocked' // 是否可用（解锁）状态

  type IMethodType = 'crypto' | 'bank' // 支付类型： 加密货币 / 银行

  type IOrderStatus = 'beginning' | 'pending' | 'finished' | 'failed' // 订单状态: 开始 / 等待 / 完成 / 失败

  /**
   * 订单状态
   */
  type IWithdrawalOrderStatus = 'RECEIPT' | 'WAIT' | 'SUCCESS' | 'REJECT' | 'FAIL' // 出金订单状态: 收款 / 等待回调

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
    // 渠道ID
    channelId: number
    // 交易账户 ID
    tradeAccountId: string
    // // 充值方式
    // methodId: string
    // // 充值金额
    // amount: number
    // // 交易账户 ID
    // toAccountId: string
    // // 币种
    // currency?: string
    // // 备注
    // remark?: string
  }

  // /**
  //  * 生成提现订单（预览）
  //  */
  // type GenerateWithdrawOrderParams = {
  //   // 出款地址：从该交易账户提取
  //   fromAccountId: string
  //   // 提现金额
  //   amount: number
  //   // 提现方式 ID,
  //   methodId: string
  //   // 收款地址：链地址（crypto） / 银行账户（bank）
  //   toAccountId: string
  //   // 提现币种
  //   currency?: string
  //   // 备注
  //   remark?: string
  // }

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

  type fundsMethodPageListParams = {
    /**
     * 资金类型
     */
    fundsType?: FundsType
    /**
     * 多语言类型CODE编码
     */
    language?: Language
    /**
     * 每页的数量
     */
    [property: string]: any
  } & API.PageParam

  /**
   * 出入金方式列表VO，出入金方式列表VO
   */
  type fundsMethodPageListItem = {
    /**
     * 基准货币
     */
    baseCurrency?: string
    /**
     * 渠道ID
     */
    channelId?: number
    /**
     * 支付通道编号
     */
    channelNo?: string
    /**
     * 渠道展示名称
     */
    channelRevealName?: string
    /**
     * 平台汇率
     */
    exchangeRate?: number
    /**
     * 汇率ID
     */
    exchangeRateId?: number
    /**
     * 出入金说明
     */
    explanation?: string
    /**
     * 出入金须知
     */
    notice?: string
    /**
     * 币种
     */
    symbol?: string
    /**
     * 客户单笔固定手续费
     */
    userSingleFixedFee?: number
    /**
     * 客户单笔最低手续费
     */
    userSingleLeastFee?: number
    /**
     * 客户交易百分比手续费 %
     */
    userTradePercentageFee?: number
    /**
     * 汇率差价百分比 %
     */
    userExchangeDifferencePercentage?: number

    /**
     * 渠道图标
     */
    channelIcon?: string
    [property: string]: any
  }

  type depositOrderListItem = {
    channelIcon?: string
    /**
     * 账户编号
     */
    account?: string
    /**
     * 基准货币单位
     */
    baseCurrency?: string
    /**
     * 入金金额
     */
    baseOrderAmount?: number
    /**
     * 渠道展示名称
     */
    channelRevealName?: string
    /**
     * 创建时间
     */
    createTime?: string
    /**
     * 账户组CODE
     */
    groupCode?: string
    /**
     * 订单编号
     */
    orderNo?: string
    /**
     * 订单状态（1待支付 2支付成功 3支付失败）
     */
    status?: string
    /**
     * 交易账户ID
     */
    tradeAccountId?: number
    [property: string]: any
  }

  /**
   * WithdrawalOrderPageVO对象，入金订单表
   */
  type withdrawalOrderListItem = {
    /**
     * 账户编号
     */
    account?: string
    /**
     * 基准货币单位
     */
    baseCurrency?: string
    /**
     * 支付渠道ID
     */
    channelId?: string
    /**
     * 支付渠道名称
     */
    channelName?: string
    /**
     * 渠道展示名称
     */
    channelRevealName?: string
    /**
     * 支付渠道类型值
     */
    channelType?: string
    /**
     * 账户组CODE
     */
    groupCode?: string
    /**
     * 订单金额
     */
    orderAmount?: number
    /**
     * 订单状态
     */
    status?: IWithdrawalOrderStatus
    /**
     * 交易账户ID
     */
    tradeAccountId?: number
    [property: string]: any
  }

  type WithdrawalAddress = {
    /**
     * 提币地址
     */
    address?: string
    /**
     * 渠道ID
     */
    channelId?: string
    /**
     * 渠道显示名称（ERC20）
     */
    channelName?: string

    /**
     * 提币地址ID
     */
    id: string
    /**
     * 说明
     */
    remark?: string
    /**
     * 币种（USDT）
     */
    symbol?: string
    [property: string]: any
  }

  type GenerateWithdrawOrderParams = {
    /**
     * 提币地址
     */
    address?: string
    /**
     * 订单金额(基准单位)
     */
    baseOrderAmount?: number
    /**
     * 支付渠道ID
     */
    channelId?: string
    /**
     * 账户密码
     */
    password?: string
    /**
     * 手机验证码
     */
    phoneCode?: number
    /**
     * 交易账户ID
     */
    tradeAccountId?: number
    [property: string]: any
  }
}
