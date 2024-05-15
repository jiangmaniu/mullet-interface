declare namespace Trade {
  // 历史平仓订单列表项
  type CloseOrderItem = {
    symbol: string
    orderId: string
    closePrice: number
    lot: number
    command: 'OP_SELL' | 'OP_BUY'
    orderSwaps: string
    profit: number
    commission: number
    closeTime: string
  }
  // 交易品种项
  type SymbolItem = {
    mtName: string
    displayName: string
    isRecommend: false
    type: number
  }
  // 获取入金明细分页参数
  type DepositOrWithdrawDetailsParams = {
    /** YYYY-MM-DD HH:mm:ss */
    BeginTime?: string
    /** YYYY-MM-DD HH:mm:ss */
    EndTime?: string
    Account?: number
  } & API.PageSkipParams
  // 入金明细Item
  type DepositDetailItem = {
    /**
     * 交易账号
     */
    account?: number
    /**
     * 账号组别
     */
    accountGroup?: null | string
    /**
     * 通道名称
     */
    channelName?: null | string
    /**
     * 主键Id
     */
    id?: number
    /**
     * MT金额
     */
    mtMoney?: number
    /**
     * MT订单号
     */
    mtOrder?: null | string
    /**
     * 支付币种
     */
    payCurrency?: null | string
    /**
     * 支付金额
     */
    payMoney?: number
    /**
     * 到账时间
     */
    successTime?: null | string
  }
  // 出金明细Item
  type WithdrawDetailItem = {
    /**
     * 交易账号
     */
    account?: number
    /**
     * 账号组别
     */
    accountGroup?: null | string
    /**
     * 到账金额(实际到账金额)
     */
    arrivedMoney?: number
    /**
     * 到账金额币种
     */
    arrivedMoneyCurrency?: number
    /**
     * 到账金额币种
     */
    arrivedMoneyCurrencyName?: null | string
    /**
     * 审核时间
     */
    auditTime?: null | string
    /**
     * 链币地址/银行卡号
     */
    chainCoinAddress?: null | string
    /**
     * 链名称/银行名称
     */
    chainName?: null | string
    /**
     * 出金方式
     */
    channel?: number
    /**
     * 出金方式
     */
    channelName?: null | string
    /**
     * 手续费
     */
    fee?: number
    /**
     * 主键Id
     */
    id?: number
    /**
     * 申请金额
     */
    mtMoney?: number
    /**
     * 订单号
     */
    mtOrder?: null | string
    /**
     * 出金状态
     */
    status?: number
    /**
     * 出金状态
     */
    statusName?: null | string
    /**
     * 提交时间
     */
    submitTime?: null | string
    /**
     * 到账时间
     */
    successTime?: null | string
    /**
     * 实际金额
     */
    trueMtMoney?: number
  }
}
