declare namespace AgentUserStatic {
  // 名下用户数据统计请求参数
  type UserDataStatisticsParams = {
    /**"beginCreateTime": "2023-04-19 18:30:21", */
    beginCreateTime?: string
    /** "endCreateTime": "2023-04-19 18:32:21" */
    endCreateTime?: string
  }
  // 名下用户数据统计卡片信息
  type UserDataStatisticsData = {
    /**
     * -，示例：0
     */
    deposit: string
    /**
     * -，示例：3
     */
    directAccountNum: string
    /**
     * -，示例：0
     */
    gold: string
    /**
     * -，示例：0.01
     */
    lot: number
    /**
     * -，示例：0
     */
    lowAccountNum: string
    /**
     * -，示例：-5.2
     */
    profit: number
    /**
     * -，示例：0.00
     */
    sumBackBrokerage: string
    /**
     * -，示例：0.06
     */
    sumBackPoint: string
  }
  // 名下用户统计列表
  type SubordinateUserListItem = {
    /**
     * -，示例：80000022
     */
    account: string
    /**
     * -，示例：1005
     */
    agentId: string
    /**
     * -，示例：2
     */
    agentLevel: string
    /**
     * -，示例：0 普通用户 1机构客户
     */
    agentType: string
    britainOilFreeCommission: number
    britainOilFreeCommissionEcn: number
    btcFreeCommissionEcn?: number
    btcsFreeCommission: number
    btcsFreeCommissionEcn: number
    china300FreeCommission: number
    china300FreeCommissionEcn: number
    china50FreeCommission: number
    china50FreeCommissionEcn: number
    /**
     * -，示例：1683798339000
     */
    commissionUpTime: number
    /**
     * -，示例：1683798339000
     */
    createDate: number
    crudeOilFreeCommission: number
    crudeOilFreeCommissionEcn: number
    /**
     * -，示例：80000010
     */
    dailiAccount: string
    exchangeFreeCommission: number
    exchangeFreeCommissionEcn: number
    /**
     * -，示例：80000005
     */
    generalAgentAccount: string
    goldFreeCommission: number
    goldFreeCommissionEcn: number
    /**
     * -，示例：0
     */
    haveGroups: string
    /**
     * -，示例：17
     */
    id: number
    indexFreeCommission: number
    indexFreeCommissionEcn: number
    /**
     *0 标准账户 8美分账户
     */
    isNoLoad: string
    /**
     * -，示例：1683798339000
     */
    joinDailiTime: number
    /**
     * -，示例：-
     */
    map: {
      /**
       * -，示例：1
       */
      countnum: string
      /**
       * -，示例：0.00
       */
      deposit: string
      /**
       * -，示例：0.00
       */
      gold: string
      /**
       * -，示例：0.00
       */
      netincome: string
      /**
       * -，示例：0.00
       */
      sumBackBrokerage: string
      /**
       * -，示例：7.00
       */
      totallots: string
      /**
       * -，示例：552.95
       */
      totalprofit: string
      /**
       * -，示例：0.00
       */
      totalsettledmoney: string
    }
    /**
     * -，示例：53
     */
    platform: string
    /**
     * -，示例：3
     */
    settlementType: string
    silverFreeCommission: number
    silverFreeCommissionEcn: number
    stockFreeCommission: number
    stockFreeCommissionEcn: number
    /**
     * -，示例：1683798339000
     */
    updateDate: number
    /**
     * -，示例：RL1
     */
    username: string
  }
}
