declare namespace AgentUser {
  // 名下用户查询列表Item
  type SubordinateUserItem = {
    id: number
    /**0 标准账户 8美分账户 用户组别也是用这个字段 */
    isNoLoad?: number | string
    username: string
    account: string
    createDate: string
    agentId: string
    agentLevel: string
    agentType: string
    backBrokerage: number
    balance: number
    dailiAccount: string
    goldCount: number
    haveGroups: string
    haveSubAgent: boolean
    isNewRecord: boolean
    isNoLoad: string
    joinDailiTime: string
    lots: number
    netIncome: number
    oilCount: number
    rebateCount: number
    selfRebate: number
    silverCount: number
    subRebate: number
  }
  // 查询修改下级返佣详情信息
  type AgentUpdateInfo = {
    /**
     * -，示例：80000021
     */
    account: string
    /**
     * -，示例：20
     */
    agentBritainOilFreeCommission: number
    /**
     * -，示例：20
     */
    agentBritainOilFreeCommissionEcn: number
    /**
     * -，示例：0.25
     */
    agentBtcFreeCommissionEcn: number
    /**
     * -，示例：0.25
     */
    agentBtcsFreeCommission: number
    /**
     * -，示例：0.25
     */
    agentBtcsFreeCommissionEcn: number
    /**
     * -，示例：20
     */
    agentChina300FreeCommission: number
    /**
     * -，示例：20
     */
    agentChina300FreeCommissionEcn: number
    /**
     * -，示例：20
     */
    agentChina50FreeCommission: number
    /**
     * -，示例：20
     */
    agentChina50FreeCommissionEcn: number
    /**
     * -，示例：20
     */
    agentCrudeOilFreeCommission: number
    /**
     * -，示例：20
     */
    agentCrudeOilFreeCommissionEcn: number
    /**
     * -，示例：20
     */
    agentExchangeFreeCommission: number
    /**
     * -，示例：20
     */
    agentExchangeFreeCommissionEcn: number
    /**
     * -，示例：20
     */
    agentGoldFreeCommission: number
    /**
     * -，示例：20
     */
    agentGoldFreeCommissionEcn: number
    /**
     * -，示例：0
     */
    agentHaveGroups: string
    /**
     * -，示例：20
     */
    agentIndexFreeCommission: number
    /**
     * -，示例：20
     */
    agentIndexFreeCommissionEcn: number
    /**
     * -，示例：20
     */
    agentSilverFreeCommission: number
    /**
     * -，示例：20
     */
    agentSilverFreeCommissionEcn: number
    /**
     * -，示例：20
     */
    agentStockFreeCommission: number
    /**
     * -，示例：20
     */
    agentStockFreeCommissionEcn: number
    /**
     * -，示例：15
     */
    britainOilFreeCommission: number
    /**
     * -，示例：15
     */
    britainOilFreeCommissionEcn: number
    /**
     * -，示例：0
     */
    btcFreeCommission: number
    /**
     * -，示例：0.15
     */
    btcsFreeCommission: number
    /**
     * -，示例：0.15
     */
    btcsFreeCommissionEcn: number
    /**
     * -，示例：15
     */
    china300FreeCommission: number
    /**
     * -，示例：15
     */
    china300FreeCommissionEcn: number
    /**
     * -，示例：15
     */
    china50FreeCommission: number
    /**
     * -，示例：15
     */
    china50FreeCommissionEcn: number
    /**
     * -，示例：15
     */
    crudeOilFreeCommission: number
    /**
     * -，示例：15
     */
    crudeOilFreeCommissionEcn: number
    /**
     * -，示例：15
     */
    exchangeFreeCommission: number
    /**
     * -，示例：15
     */
    exchangeFreeCommissionEcn: number
    /**
     * -，示例：15
     */
    goldFreeCommission: number
    /**
     * -，示例：15
     */
    goldFreeCommissionEcn: number
    /**
     * -，示例：0
     */
    haveGroups: string
    /**
     * -，示例：15
     */
    indexFreeCommission: number
    /**
     * -，示例：15
     */
    indexFreeCommissionEcn: number
    /**
     * -，示例：RL4
     */
    name: string
    /**
     * -，示例：15
     */
    silverFreeCommission: number
    /**
     * -，示例：15
     */
    silverFreeCommissionEcn: number
    /**
     * -，示例：15
     */
    stockFreeCommission: number
    /**
     * -，示例：15
     */
    stockFreeCommissionEcn: number
    /**
     * -，示例：2
     */
    type: number
  }
  // 更新修改下级返佣
  type AgentUpdateParams = {
    account: string
    britainOilFreeCommission: number
    britainOilFreeCommissionEcn: number
    btcsFreeCommission: number
    btcsFreeCommissionEcn: number
    china300FreeCommission: number
    china300FreeCommissionEcn: number
    china50FreeCommission: number
    china50FreeCommissionEcn: number
    crudeOilFreeCommission: number
    crudeOilFreeCommissionEcn: number
    exchangeFreeCommission: number
    exchangeFreeCommissionEcn: number
    goldFreeCommission: number
    goldFreeCommissionEcn: number
    /**组别权限 */
    haveGroups: string
    indexFreeCommission: number
    indexFreeCommissionEcn: number
    platform: number
    silverFreeCommission: number
    silverFreeCommissionEcn: number
    stockFreeCommission: number
    stockFreeCommissionEcn: number
    sysUser: string
    /**type = 1 升级机构客户 type=2 修改机构客户 */
    type: number
  }
  // 名下用户-交易信息-返佣明细-列表跟佣金管理-返佣明细一样

  // 交易信息-持仓
  type PositionParams = {
    account?: number | string
    agentAccount?: number | string
  } & Agent.PageParams

  type PositionData = {
    /**
     * -，示例：-
     */
    page: {
      /**
       * -，示例：5
       */
      count: number
      /**
       * -，示例：-
       */
      list: List[]
    }
    /**
     * -，示例：-
     */
    statistic: PositionOverview
  }
  type PositionDataItem = {
    /**
     * -，示例：OP_BUY OP_SELL
     */
    Command: string
    /**
     * -，示例：-
     */
    Comment: string
    /**
     * -，示例：0
     */
    Commission: number
    /**
     * -，示例：0
     */
    is_no_load: string
    /**
     * -，示例：51000132
     */
    Login: number
    /**
     * -，示例：0.5
     */
    Lot: number
    /**
     * -，示例：111
     */
    name: string
    /**
     * -，示例：70.542
     */
    OpenPrice: number
    /**
     * -，示例：1702003275000
     */
    OpenTime: number
    /**
     * -，示例：5620
     */
    OrderId: number
    /**
     * -，示例：0
     */
    OrderSwaps: number
    /**
     * -，示例：0
     */
    StopLoss: number
    /**
     * -，示例：USOIL
     */
    Symbol: string
    /**
     * -，示例：0
     */
    TakeProfit: number
    /**
     * -，示例：50
     */
    Volume: number
  }
  type PositionOverview = {
    /**
     * -，示例：0
     */
    balance: number
    /**
     * -，示例：0
     */
    equity: number
    /**
     * -，示例：0
     */
    margin: number
    /**
     * -，示例：0
     */
    marginFree: number
    /**
     * -，示例：0
     */
    riskValue: number
  }

  // 交易信息-平仓
  type CloseOrderParams = {
    startDate?: string
    endDate?: string
    /**品种 */
    symbol?: string
    orderId?: string
    /**子级account账号 */
    agentAccount?: number | string
    /**登录真实的账号 */
    account?: number | string
  } & Agent.PageParams

  type CloseOrderData = {
    /**
     * -，示例：-
     */
    page: {
      /**
       * -，示例：1
       */
      count: number
      /**
       * -，示例：-
       */
      list: CloseOrderDataItem[]
    }
    /**
     * -，示例：-
     */
    statistic: {
      Data: CloseOrderOverview
    }
  }
  type CloseOrderDataItem = {
    /**
     * -，示例：0.85705
     */
    ClosePrice?: number
    /**
     * -，示例：1702018732000
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
     * -，示例：51000132
     */
    Login?: number
    /**
     * -，示例：0.5
     */
    Lot?: number
    /**
     * -，示例：111
     */
    name?: string
    /**
     * -，示例：0.85694
     */
    OpenPrice?: number
    /**
     * -，示例：1702018725000
     */
    OpenTime?: number
    /**
     * -，示例：5628
     */
    OrderId?: number
    /**
     * -，示例：0
     */
    OrderSwaps?: number
    /**
     * -，示例：-6.92
     */
    Profit?: number
    /**
     * -，示例：0
     */
    StopLoss?: number
    /**
     * -，示例：EURGBP
     */
    Symbol?: string
    /**
     * -，示例：0
     */
    TakeProfit?: number
    /**
     * -，示例：50
     */
    Volume?: number
  }
  type CloseOrderOverview = {
    all: {
      /**外汇 */
      exchangeSymbols: number
      /**现货黄金*/
      GOLD: number
      /**白银*/
      SILVER: number
      /**美国原油*/
      USOIL: number
      /**英国原油*/
      UKOIL: number
      /**中华300*/
      CH300: number
      /**中华50*/
      CH50: number
      /**外汇*/
      exchangeSymbols: number
      /**股票*/
      stockSymbols: number
      /**指数*/
      indexSymbols: number
      /**数字货币*/
      btcSymbols: number
    }
    /**平仓盈亏 */
    allTotalProfit: number
  }
  type CloseSymbolCardItem = {
    /**
     * -，示例：7
     */
    AverageHoldTime?: number
    /**
     * -，示例：0.5
     */
    AverageVolume?: number
    /**
     * -，示例：EURGBP
     */
    Symbol?: string
    /**
     * -，示例：0.5
     */
    TotalLots?: number
    /**
     * -，示例：0
     */
    TotalPosition?: number
    /**
     * -，示例：-6.92
     */
    TotalProfit?: number
    /**
     * -，示例：1
     */
    TotalTransactions?: number
    /**
     * -，示例：1
     */
    TotalUsers?: number
    /**
     * -，示例：50000
     */
    TotalValue?: number
  }
  // 交易信息-资金信息列表 同报表预览
  type UserBankrollInfoParams = {
    /**2023-08-25 00:00:00 */
    startDate?: string
    endDate?: string
    /**1入金，2出金，3佣金入金，4非佣金入金 */
    type?: number
    keyword?: string
    /*账户 */
    account?: number | string
  } & Agent.PageParams

  type UserBankrollData = {
    /**出金 */
    gold: number
    withdrawDeposits: UserBankrollItem[]
    /**入金 */
    deposit: number
    /**净入金 */
    netincome: number
  }
  type UserBankrollItem = {
    amount: number
    orderid: string
    time: string
    /**1入金，2出金，3佣金入金，4非佣金入金 */
    type: string
    account: string
    is_no_load: string
    username: string
  }
}
