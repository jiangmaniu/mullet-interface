declare namespace TradeFollowLead {
  /**
   * api: getTradeFollowLeadPlaza
   * 跟单广场参数
   * */
  type LeadPlazaParams = {
    /**
     * 结束时间
     */
    endDate: string
    /**
     * groupName
     */
    groupName?: string
    /**
     * 开始时间
     */
    startDate: string
    /**
     * 当前交易账户
     */
    tradeAccountId: number
    [property: string]: any
  }
  /**
   * api: getTradeFollowLeadPlaza
   * 跟单广场返回值
   */
  type LeadPlazaItem = {
    /**
     * 交易分组名称
     */
    accountGroupName?: string
    /**
     * 收益率
     */
    earningRate?: number
    /**
     * 收益率
     */
    earningRates?: EarningRateVO[]
    /**
     * 跟单人数
     */
    followerNumber?: number
    /**
     * 总跟单人数
     */
    followerTotal?: number
    /**
     * 头像
     */
    imageUrl?: string
    /**
     * 带单人名称
     */
    leadName?: string
    /**
     * 带单盈亏
     */
    leadProfit?: number
    /**
     * 最大跟随人数限制
     */
    maxSupportCount?: number
    /**
     * 累计盈亏
     */
    profitTotal?: number
    /**
     * 是否本人
     */
    selfFlag?: number
    /**
     * 排序收益率
     */
    sortEarningRate?: number
    /**
     * 状态
     */
    status?: number
    /**
     * 标签
     */
    tags?: string
    /**
     * 交易总数
     */
    tradeTotal?: number
    /**
     * 胜率
     */
    winRate?: number
    [property: string]: any
  }

  /**
   * EarningRateVO
   */
  type EarningRateVO = {
    /**
     * 日期
     */
    date?: Date
    /**
     * 收益率
     */
    earningRate?: number
    [property: string]: any
  }

  /**
   * 申请带单
   */
  type LeadSaveParams = {
    /**
     * 交易账户分组Id
     */
    accountGroupId?: number
    /**
     * 客户Id
     */
    clientId?: number
    /**
     * 合约证明
     */
    contractProof?: string
    /**
     * 描述
     */
    desc?: string
    /**
     * 头像
     */
    imageUrl?: string
    /**
     * 项目名称
     */
    projectName?: string
    /**
     * 交易账户Id
     */
    tradeAccountId?: number
    [property: string]: any
  }
  /**
   * R«List«LeadManagementVO»»，返回信息
   */
  export type Response = {
    /**
     * 状态码
     */
    code: number
    /**
     * 承载数据
     */
    data?: LeadManagementVO[]
    /**
     * 返回消息
     */
    msg: string
    /**
     * 是否成功
     */
    success: boolean
    [property: string]: any
  }

  /**
   * api: getTradeFollowLeadManagements
   * 带单人 - 带单管理
   */
  type LeadManagementsItem = {
    /**
     * 资产管理规模
     */
    assetScaleTotal?: number
    /**
     * 入住天数
     */
    createDayTotal?: number
    /**
     * 跟单人数
     */
    followerNumber?: number
    /**
     * 分组名称
     */
    groupName?: string
    /**
     * 头像
     */
    imageUrl?: string
    /**
     * 分润比例
     */
    profitSharingRatio?: number
    /**
     * 项目名称
     */
    projectName?: string
    /**
     * 带单保证金额余额
     */
    remainingGuaranteedAmount?: number
    /**
     * 今日分润
     */
    shareProfitToday?: number
    /**
     * 分润总和
     */
    shareProfitTotal?: number
    /**
     * 交易账户Id
     */
    tradeAccountId?: number
    [property: string]: any
  }
}
