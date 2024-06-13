declare namespace Account {
  // 账号交易品种及配置-集合-参数
  type TradeSymbolListParams = {
    /**
     * 交易账户ID
     */
    accountId: number
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
}
