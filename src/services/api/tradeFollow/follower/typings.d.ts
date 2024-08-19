declare namespace TradeFollowFollower {
  /**
   * api: getTradeFollowFolloerManagementInProgress / getTradeFollowFolloerManagementEnd
   * 跟单管理 - 进行中 / 已结束
   */
  type ManagementParams = {
    /**
     * accountGroupId
     */
    accountGroupId?: number
    /**
     * clientId
     */
    clientId?: number
    /**
     * followerTradeAccountId
     */
    followerTradeAccountId?: string | number
    // [property: string]: any;
  }
  /**
   * api: getTradeFollowFolloerManagementInProgress
   * 跟单管理 - 进行中
   */
  type ManagementInProgressItem = {
    /**
     * 跟单金额
     */
    followAmount?: number
    /**
     * 跟单Id
     */
    followerId?: number
    /**
     * 头像
     */
    imageUrl?: string
    /**
     * 净利润
     */
    netProfitAndLoss?: number
    /**
     * 已实现盈亏
     */
    profitLoss?: number
    /**
     * 分润金额
     */
    profitSharingAmount?: number
    /**
     * 项目名称
     */
    projectName?: string
    /**
     * 账户保证金
     */
    tradeAmountTotal?: number
    [property: string]: any
  }

  /**
   * api: getTradeFollowFolloerManagementEnd
   * 跟单管理-已结束
   */
  type ManagementEndItem = {
    /**
     * 跟单金额
     */
    followAmount?: number
    /**
     * 跟随天数
     */
    followerDays?: number
    /**
     * 跟随结束时间
     */
    followerEndTime?: Date
    /**
     * 跟单人Id
     */
    followerId?: number
    /**
     * 跟随开始时间
     */
    followerStartTime?: Date
    /**
     * 头像
     */
    imageUrl?: string
    /**
     * 净利润
     */
    netProfitAndLoss?: number
    /**
     * 已实现盈亏
     */
    profitLoss?: number
    /**
     * 分润金额
     */
    profitSharingAmount?: number
    /**
     * 项目名称
     */
    projectName?: string
    [property: string]: any
  }

  /**
   * api: getTradeFollowFolloerManagementHistory
   * 跟单管理 - 历史仓位
   */
  type ManagementHistoryItem = {
    /**
     * 别名
     */
    alias?: string
    /**
     * 订单方向
     */
    buySell?: string
    /**
     * 分类
     */
    classify?: string
    /**
     * 平仓价格
     */
    closePrice?: number
    /**
     * 配置
     */
    conf?: string
    /**
     * 数据源code
     */
    dataSourceCode?: string
    /**
     * 数据源Symbol
     */
    dataSourceSymbol?: string
    /**
     * 手续费
     */
    handlingFees?: number
    /**
     * 图标
     */
    imgUrl?: string
    /**
     * 库存费
     */
    interestFees?: number
    /**
     * 杠杆倍数
     */
    leverageMultiple?: number
    /**
     * 保证金类型
     */
    marginType?: string
    /**
     * 订单模式
     */
    mode?: string
    /**
     * 订单基础保证金
     */
    orderBaseMargin?: number
    /**
     * 订单保证金
     */
    orderMargin?: number
    /**
     * 订单数量
     */
    orderVolume?: number
    /**
     * 盈亏
     */
    profit?: number
    /**
     * 开仓均价
     */
    startPrice?: number
    /**
     * 止损
     */
    stopLoss?: number
    /**
     * 交易品种
     */
    symbol?: string
    /**
     * 品种组配置ID
     */
    symbolConfId?: number
    /**
     * 品种小数位
     */
    symbolDecimal?: number
    /**
     * 品种组ID
     */
    symbolGroupId?: number
    /**
     * 止盈
     */
    takeProfit?: number
    [property: string]: any
  }
}
