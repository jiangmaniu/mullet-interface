declare namespace AgentCommission {
  // 电子钱包
  type ElectronicWalletData = {
    account: string
    balance: string
    /**返佣类型 （0：每周结算 1：每月结算 2：禁止结算 3：每日结算） */
    settlementType: number
  }
  type extractCommissionParams = {
    money: number
    type: number
  }
  // 返佣明细参数
  type TradeInfoDetailsParams = {
    isSettlement?: number
  } & Agent.PageParams &
    Agent.TimeRange

  type TradeInfoDetailsData = {
    /**
     * -，示例：1
     */
    count: number
    /**
     * -，示例：-
     */
    settmentOverview: TradeInfoDetailsSettmentOverview
    /**
     * -，示例：-
     */
    tradeInfo: TradeInfoDetailsListItem[]
  }
  type TradeInfoDetailsSettmentOverview = {
    /**
     * -，示例：0.06
     */
    alreadySettledMoney: number
    /**
     * -，示例：0
     */
    backBrokerageNum: number
    /**
     * -，示例：0
     */
    backPointNum: number
    /**
     * -，示例：0
     */
    britainOilCountStatic: number
    /**
     * -，示例：0.01
     */
    btcCountStatic: number
    /**
     * -，示例：0
     */
    btcsCountStatic: number
    /**
     * -，示例：0
     */
    china300CountStatic: number
    /**
     * -，示例：0
     */
    china50CountStatic: number
    /**
     * -，示例：0
     */
    exchangeCountStatic: number
    /**
     * -，示例：0
     */
    generalAgentStatic: number
    /**
     * -，示例：0
     */
    goldCountStatic: number
    /**
     * -，示例：0
     */
    indexCountStatic: number
    /**
     * -，示例：0
     */
    oilCountStatic: number
    /**
     * -，示例：0
     */
    silverCountStatic: number
    /**
     * -，示例：0
     */
    stockCountStatic: number
    /**
     * -，示例：0
     */
    sumBackBrokerage: number
    /**
     * -，示例：0
     */
    sumLot: number
    /**
     * -，示例：0
     */
    totalRebateMoney: number
    /**
     * -，示例：0
     */
    unsettledMoney: number
  }
  type TradeInfoDetailsListItem = {
    order_id: string
    isNoLoad: '0' | '8' // 0标准账户、8微账户
    command: 'OP_BUY' | 'OP_SELL'
    isSettlement: '已结算' | '未结算'
    symbol: string
    username: string
    account_can_gain_comm: number
    backBrokerage: number
    daliName: string
    lot: number
    account: string
    close_time: number
    account_commission: number
    child_agent_commission: number
    updateDate: number
  }
  // 佣金管理-返点标准信息查询
  type GroupsAndBackPointData = {
    /**
     * -，示例：80000005
     */
    account: string
    /**
     * -，示例：1002
     */
    agentId: string
    /**
     * -，示例：0
     */
    agentLevel: string
    /**
     * -，示例：1
     */
    agentType: string
    /**
     * -，示例：20
     */
    britainOilFreeCommission: number
    /**
     * -，示例：20
     */
    britainOilFreeCommissionEcn: number
    /**
     * -，示例：0.25
     */
    btcsFreeCommission: number
    /**
     * -，示例：0.25
     */
    btcsFreeCommissionEcn: number
    /**
     * -，示例：20
     */
    china300FreeCommission: number
    /**
     * -，示例：20
     */
    china300FreeCommissionEcn: number
    /**
     * -，示例：20
     */
    china50FreeCommission: number
    /**
     * -，示例：20
     */
    china50FreeCommissionEcn: number
    /**
     * -，示例：1683798176000
     */
    commissionUpTime: number
    /**
     * -，示例：1683798176000
     */
    createDate: number
    /**
     * -，示例：20
     */
    crudeOilFreeCommission: number
    /**
     * -，示例：20
     */
    crudeOilFreeCommissionEcn: number
    /**
     * -，示例：80000005
     */
    dailiAccount: string
    /**
     * -，示例：20
     */
    exchangeFreeCommission: number
    /**
     * -，示例：20
     */
    exchangeFreeCommissionEcn: number
    /**
     * -，示例：80000005
     */
    generalAgentAccount: string
    /**
     * -，示例：20
     */
    goldFreeCommission: number
    /**
     * -，示例：20
     */
    goldFreeCommissionEcn: number
    /**
     * -，示例：0
     */
    haveGroups: string
    /**
     * -，示例：14
     */
    id: number
    /**
     * -，示例：20
     */
    indexFreeCommission: number
    /**
     * -，示例：20
     */
    indexFreeCommissionEcn: number
    /**
     * -，示例：0
     */
    isNoLoad: string
    /**
     * -，示例：1683798176000
     */
    joinDailiTime: number
    /**
     * -，示例：53
     */
    platform: string
    /**
     * -，示例：1
     */
    settlementType: string
    /**
     * -，示例：20
     */
    silverFreeCommission: number
    /**
     * -，示例：20
     */
    silverFreeCommissionEcn: number
    /**
     * -，示例：20
     */
    stockFreeCommission: number
    /**
     * -，示例：20
     */
    stockFreeCommissionEcn: number
    /**
     * -，示例：1683798176000
     */
    updateDate: number
    /**
     * -，示例：RL2
     */
    username: string
  }
  // 佣金提现记录参数
  type commissionRecordParams = {
    beginTime?: string
    endTime?: string
  } & Agent.PageParams
  // 佣金提现记录列表
  type commissionRecordData = {
    total: number
    commissionHandleData: commissionRecordListItem[]
  }
  type commissionRecordListItem = {
    id: number
    account: string
    platform: string
    type: string
    mjMoney: string
    status: string
    createDate: number
    updateDate: number
  }
}
