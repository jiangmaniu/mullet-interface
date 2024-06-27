declare namespace Account {
  // 账号交易品种及配置-集合-参数
  type TradeSymbolListParams = {
    /**
     * 交易账户ID
     */
    accountId?: string | number
    /**
     * 交易品种
     */
    symbol?: string
    /**
     * 交易品种路径 例如 /test2/1/*
     */
    symbolPath?: string
    /**品种分类参数 */
    classify?: string
  }
  // 账号交易品种及配置-集合-列表
  type TradeSymbolListItem = {
    /**
     * 别名
     */
    alias?: string
    /**
     * 数据源code
     */
    dataSourceCode?: string
    /**
     * 数据源Symbol
     */
    dataSourceSymbol?: string
    /**
     * 主键
     */
    id: number
    /**
     * 图标
     */
    imgUrl?: string
    /**
     * 备注
     */
    remark?: string
    /**
     * 状态
     */
    status?: API.Status
    /**
     * 品种名称
     */
    symbol: string
    symbolConf?: Symbol.SymbolConf
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
     * 自定义添加的是否选中
     */
    checked?: boolean
    symbolNewTicker?: SymbolNewTicker
  }
  // 高开低收，初始值
  type SymbolNewTicker = {
    dataSourceCode: string
    symbol: string
    /**开盘价 */
    open: string
    /**收盘价 */
    close: string
    /**最低 */
    low: string
    /**最高 */
    high: string
  }

  // 账号交易品种及配置-集合-列表
  type TradeSymbolListItem = {
    /**
     * 别名
     */
    alias?: string
    /**
     * 数据源code
     */
    dataSourceCode?: string
    /**
     * 数据源Symbol
     */
    dataSourceSymbol?: string
    /**
     * 主键
     */
    id: number
    /**
     * 图标
     */
    imgUrl?: string
    /**
     * 备注
     */
    remark?: string
    /**
     * 状态
     */
    status?: API.Status
    /**
     * 品种名称
     */
    symbol: string
    symbolConf?: Symbol.SymbolConf
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
     * 自定义添加的是否选中
     */
    checked?: boolean
    symbolNewTicker?: SymbolNewTicker
  }
  // 资金变更记录-分页-参数
  type MoneyRecordsPageListParams = API.PageParam & {
    /**账户id 必需 */
    accountId: string
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
    status?: API.Status | boolean
    /**
     * 用户账号 654321@163.com
     */
    userAccount: string
    /**用户名 */
    userName: string
    /**手机号 */
    userPhone: string
    /**邮箱 */
    userEmail: string
  }
  // 交易账户-充值参数
  type RechargeParams = {
    /**
     * 交易账户ID
     */
    accountId: string
    /**
     * 金额
     */
    money: number
    /**
     * 备注
     */
    remark: string
    /**
     * 类型
     */
    type: API.MoneyRecordsType
  }
  // 交易账户-新增/修改
  type SubmitAccount = {
    /**
     * 账户组ID
     */
    accountGroupId?: string
    /**
     * 主键
     */
    id?: number
    /**
     * 账户组ID
     */
    accountGroupId: number
    /**
     * 客户ID
     */
    clientId?: string
    /**
     * 启用交易
     */
    isTrade?: boolean
    /**
     * 名称
     */
    name?: string
    /**
     * 备注
     */
    remark?: string
    /**
     * 状态
     */
    status?: API.Status
  }
  // 账号交易品种及配置-集合-列表
  type TradeSymbolListItem = {
    /**
     * 别名
     */
    alias?: string
    /**
     * 数据源code
     */
    dataSourceCode?: string
    /**
     * 数据源Symbol
     */
    dataSourceSymbol?: string
    /**
     * 主键
     */
    id: number
    /**
     * 图标
     */
    imgUrl?: string
    /**
     * 备注
     */
    remark?: string
    /**
     * 状态
     */
    status?: API.Status
    /**
     * 品种名称
     */
    symbol: string
    symbolConf?: Symbol.SymbolConf
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
     * 自定义添加的是否选中
     */
    checked?: boolean
    symbolNewTicker?: SymbolNewTicker
  }
}
