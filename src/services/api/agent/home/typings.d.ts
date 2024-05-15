declare namespace AgentHome {
  // 首页佣金统计信息
  type AgentHomeInfo = {
    /**
     * -，示例：80000043
     */
    account: number
    /**
     * 返佣明细，示例：-
     */
    commissions: CommissionItem[]
    /**
     * 新增入金，示例：0
     */
    deposit: number
    /**
     * 新增用户，示例：0
     */
    newAgent: number
    /**
     * 新增佣金，示例：0
     */
    newCommission: number
    /**
     * -，示例：53
     */
    platform: number
  }
  type CommissionItem = {
    /**
     * 日期，示例：2023-12-01
     */
    date?: string
    /**
     * 金额，示例：0
     */
    value?: number
  }
}
