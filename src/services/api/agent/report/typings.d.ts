declare namespace AgentReport {
  // 名下客户持仓报表请求参数
  type UserPositionReportParams = {
    /**2023-08-25 00:00:00 */
    startDate?: string
    endDate?: string
    symbol?: string
    /**@name 1:OP_BUY,2:OP_SELL */
    command?: string
    orderId?: string
    keyword?: string
  } & Agent.PageParams
  // 名下客户持仓报表响应
  type UserPositionReportData = {
    /**
     * -，示例：-
     */
    page: {
      /**
       * -，示例：-
       */
      content: UserPositionReportListItem[]
      /**
       * -，示例：5
       */
      count: number
      /**
       * -，示例：1
       */
      PageNo: number
      /**
       * -，示例：10
       */
      PageSize: number
    }
    /**
     * 持仓总手数，示例：0.07
     */
    totalLots: string
    /**
     * -，示例：0
     */
    totalProfit: number
    /**
     * 持仓总笔数，示例：5
     */
    totalTransactions: number
    /**
     * -，示例：5
     */
    totalUsers: number
  }
  type UserPositionReportListItem = {
    /**
     * -，示例：OP_SELL OP_BUY
     */
    Command?: string
    /**
     * -，示例：-
     */
    Comment?: string
    /**
     * -，示例：0
     */
    Commission?: number
    /**
     * -，示例：0
     */
    is_no_load?: string
    /**
     * -，示例：80000003
     */
    Login?: number
    /**
     * -，示例：0.01
     */
    Lot?: number
    /**
     * -，示例：新待
     */
    name?: string
    /**
     * -，示例：0.06203
     */
    OpenPrice?: number
    /**
     * -，示例：1692947328000
     */
    OpenTime?: number
    /**
     * -，示例：3264
     */
    OrderId?: number
    /**
     * -，示例：0
     */
    OrderSwaps?: number
    /**
     * -，示例：0
     */
    StopLoss?: number
    /**
     * -，示例：DOGEUSDT
     */
    Symbol?: string
    /**
     * -，示例：0
     */
    TakeProfit?: number
    /**
     * -，示例：1
     */
    Volume?: number
  }

  // 名下客户平仓报表请求参数
  type UserCloseReportParams = UserPositionReportParams

  // 名下客户平仓报表响应
  type UserCloseReportData = {
    /**
     * -，示例：-
     */
    page: {
      /**
       * -，示例：-
       */
      content: UserCloseReportListItem[]
      /**
       * -，示例：1
       */
      count: number
      /**
       * -，示例：1
       */
      PageNo: number
      /**
       * -，示例：10
       */
      PageSize: number
    }
    /**
     * 持仓总手数，示例：0
     */
    totalLots: number
    /**
     * -，示例：0
     */
    totalProfit: number
    /**
     * 持仓总笔数，示例：0
     */
    totalTransactions: number
    /**
     * -，示例：0
     */
    totalUsers: number
  }
  type UserCloseReportListItem = {
    /**
     * -，示例：0.06263
     */
    ClosePrice?: number
    /**
     * -，示例：-28800000
     */
    CloseTime?: number
    /**
     * -，示例：OP_SELL
     */
    Command?: string
    /**
     * -，示例：-
     */
    Comment?: string
    /**
     * -，示例：0
     */
    Commission?: number
    /**
     * -，示例：0
     */
    is_no_load?: string
    /**
     * -，示例：80000003
     */
    Login?: number
    /**
     * -，示例：0.01
     */
    Lot?: number
    /**
     * -，示例：新待
     */
    name?: string
    /**
     * -，示例：0.06203
     */
    OpenPrice?: number
    /**
     * -，示例：1692947328000
     */
    OpenTime?: number
    /**
     * -，示例：3264
     */
    OrderId?: number
    /**
     * -，示例：0
     */
    OrderSwaps?: number
    /**
     * -，示例：-1.8
     */
    Profit?: number
    /**
     * -，示例：DOGEUSDT
     */
    Symbol?: string
    /**
     * -，示例：1
     */
    Volume?: number
  }

  // 名下客户资金报表报表请求参数
  type UserBankrollReportParams = {
    /**2023-08-25 00:00:00 */
    startDate?: string
    endDate?: string
    /**1入金，2出金，3佣金入金，4非佣金入金 */
    type?: number
    keyword?: string
    /*账户 */
    account?: number | string
  } & Agent.PageParams

  // 名下客户资金报表报表响应
  type UserBankrollReportData = {
    /**
     * 佣金入金总笔数，示例：0
     */
    ccommission: number
    /**
     * 入金笔数，示例：1
     */
    cdeposit: number
    /**
     * 出金笔数，示例：0
     */
    cgold: number
    /**
     * 佣金入金总金额，示例：0
     */
    commission: number
    /**
     * 入金总金额，示例：5000
     */
    deposit: number
    /**
     * 出金总金额，示例：0
     */
    gold: number
    /**
     * -，示例：-
     */
    withdrawDeposits: UserBankrollReportListItem[]
  }

  type UserBankrollReportListItem = {
    /**
     * -，示例：51000132
     */
    account?: string
    /**
     * -，示例：5000
     */
    amount?: number
    /**
     * -，示例：14029
     */
    orderid?: string
    /**
     * -，示例：2023-12-06 17:02:22
     */
    time?: string
    /**
     * 1入金，2出金，3佣金入金，4非佣金入金
     */
    type?: string
    /**
     * -，示例：111
     */
    username?: string
  }

  // 名下客户盈亏报表请求参数
  type UserProfitLossReportParams = {
    /**2023-08-25 00:00:00 */
    startDate?: string
    endDate?: string
    keyword?: string
  } & Agent.PageParams

  // 名下客户盈亏报表请求响应
  type UserProfitLossReportData = {
    /**
     * -，示例：-
     */
    list: UserProfitLossReportListItem[]
    /**
     * -，示例：2.01
     */
    lotTotal: string
    /**
     * -，示例：1
     */
    orderPeople: number
    /**
     * -，示例：-82.70
     */
    profitTotal: string
    /**
     * -，示例：1
     */
    total: number
  }
  type UserProfitLossReportListItem = {
    /**
     * -，示例：51000132
     */
    account?: string
    /**
     * -，示例：0
     */
    btcLot?: number
    /**
     * -，示例：0
     */
    btcsLot?: number
    /**
     * -，示例：0
     */
    china300Lot?: number
    /**
     * -，示例：1.01
     */
    china50Lot?: number
    /**
     * -，示例：1
     */
    exchangeLot?: number
    /**
     * -，示例：0
     */
    goldLot?: number
    /**
     * -，示例：0
     */
    indexLot?: number
    /**
     * -，示例：2.01
     */
    lot?: number
    /**
     * -，示例：111
     */
    name?: string
    /**
     * -，示例：0
     */
    oilLot?: number
    /**
     * -，示例：-82.7
     */
    profit?: number
    /**
     * -，示例：0
     */
    silverLot?: number
    /**
     * -，示例：0
     */
    stockLot?: number
    /**
     * -，示例：0
     */
    ukoilLot?: number
  }
}
