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
    tradeAccountId: string | number
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
   * LeadSettingsParams
   * 带单设置参数
   */
  type LeadSettingsParams = {
    /**
     * 资产要求
     */
    assetRequirement?: number
    /**
     * 头像
     */
    imageUrl?: string
    leadId?: number
    /**
     * 最大支持人数
     */
    maxSupportCount?: number
    /**
     * 利润分成比例
     */
    profitSharingRatio?: number
    /**
     * 项目名称
     */
    projectName?: string
    /**
     * 标签
     */
    tags?: string
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

  /**
   * getTradeFollowLeadDetail
   * 带单人 - 详情
   */
  type LeadDetailItem = {
    /**
     * 资产要求
     */
    assetRequirement?: number
    /**
     * 资产管理规模
     */
    assetScaleTotal?: number
    /**
     * 审核状态：0待审核  1=已审核 2=审核拒绝
     */
    auditStatus?: number
    /**
     * 入住天数
     */
    createDayTotal?: number
    /**
     * 描述
     */
    desc?: string
    /**
     * 跟单人数
     */
    followerNumber?: number
    /**
     * 头像
     */
    imageUrl?: string
    /**
     * 是否开启带单：1=开启 0=关闭
     */
    openFlag?: number
    /**
     * 分润比例
     */
    profitSharingRatio?: number
    /**
     * 带单盈亏
     */
    profitTotal?: number
    /**
     * 项目名称
     */
    projectName?: string
    /**
     * 带单保证金额余额/总资产
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
     * 昨日分润
     */
    shareProfitYesterday?: number
    [property: string]: any
  }
  /**
   * api: tradeFollowLeadStatistics
   * // 带单人 - 带单表现
   */
  type TradeFollowLeadStatisticsItem = {
    /**
     * 平均每笔收益率
     */
    averageProfitRate?: number
    /**
     * 总收益率
     */
    earningRateTotal?: number
    /**
     * 跟单盈亏
     */
    followerProfit?: number
    /**
     * 带单盈亏
     */
    leadProfit?: number
    /**
     * 回撤率
     */
    retracementRate?: number
    /**
     * 胜率
     */
    winRate?: number
    [property: string]: any
  }

  /**
   * api: tradeFollowLeadProfitStatistics
   * // 带单人 - 累计盈亏
   */
  type TradeFollowLeadProfitStatisticsItem = {
    earningRates?: EarningRate[]
    profitAmounts?: ProfitAmount[]
    [property: string]: any
  }

  type EarningRate = {
    /**
     * 日期
     */
    date?: string
    /**
     * 收益率
     */
    earningRate?: number
    [property: string]: any
  }

  /**
   * ProfitAmount
   */
  type ProfitAmount = {
    /**
     * 日期
     */
    date?: string
    /**
     * 盈亏额
     */
    profitAmount?: number
    [property: string]: any
  }
  /**
   * api: tradeFollowSymbolStatistics
   * 带单人 - 交易偏好
   */
  export type TradeFollowLeadSymbolStatisticsItem = {
    /**
     * 跟单盈亏
     */
    profit?: number
    /**
     * 比例
     */
    rate?: number
    /**
     * 品种名称
     */
    symbol?: string
    /**
     * 交易次数
     */
    tradeCount?: number
    [property: string]: any
  }
}
