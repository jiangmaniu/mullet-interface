declare namespace Account {
  // 资金变更记录-分页-参数
  type MoneyRecordsPageListParams = API.PageParam & {
    /**账户id 必需 */
    accountId: number
  }
  // 资金变更记录-分页-列表
  type MoneyRecordsPageListItem = {
    /**
     * 账户ID
     */
    accountId?: number
    /**
     * 创建时间
     */
    createTime?: string
    /**
     * 主键
     */
    id?: number
    /**
     * 金额
     */
    money?: number
    /**
     * 旧余额
     */
    oldBalance?: number
    /**
     * 备注
     */
    remark?: string
    /**
     * 类型
     */
    type?: API.MoneyRecordsType
  }
  // 交易账户-分页-参数
  type AccountPageListParams = {
    /**
     * 组名称
     */
    name?: string
    /**客户ID */
    clientId?: string
  } & API.PageParam
  // 交易账户-分页-列表
  type AccountPageListItem = {
    /**
     * 账户组ID
     */
    accountGroupId?: number
    /**
     * 客户ID
     */
    clientId?: number
    /**
     * 创建时间
     */
    createTime?: string
    /**
     * 货币单位
     */
    currencyUnit?: string
    /**
     * 启用逐仓
     */
    enableIsolated?: boolean
    /**
     * 资金划转
     */
    fundTransfer?: API.FundTransfer
    /**
     * 组别
     */
    groupCode?: string
    /**
     * 组名称
     */
    groupName?: string
    /**
     * 主键
     */
    id?: number
    /**
     * 逐仓保证金
     */
    isolatedMargin?: number
    /**
     * 是否模拟
     */
    isSimulate?: boolean
    /**
     * 最近访问
     */
    lastVisitedTime?: string
    /**
     * 保证金
     */
    margin?: number
    /**
     * 余额
     */
    money?: number
    /**
     * 名称
     */
    name?: string
    /**
     * 订单模式
     */
    orderMode?: API.OrderMode
    /**
     * 备注
     */
    remark?: string
    /**
     * 状态
     */
    status?: API.Status
  }
  // 交易账户-充值参数
  type RechargeParams = {
    /**
     * 主键ID
     */
    accountId: number
    /**
     * 金额
     */
    money: number
  }
  // 交易账户-新增
  type SubmitAccount = {
    /**
     * 账户组ID
     */
    accountGroupId: number
    /**
     * 名称
     */
    name?: string
    /**
     * 备注
     */
    remark?: string
    id?: number
    status?: API.Status
  }
}
