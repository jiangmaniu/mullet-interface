declare namespace Order {
  // 下单
  type CreateOrder = {
    /**
     * 携带持仓订单号则为平仓单，只需要传递持仓单号、交易账户ID、订单数量、订单类型和反向订单方向，其他参数无效
     */
    bagOrderId?: number
    /**
     * 订单方向
     */
    buySell?: API.TradeBuySell
    /**
     * 杠杆倍数
     */
    leverageMultiple?: number
    /**
     * 限价价格
     */
    limitPrice?: number
    /**
     * 保证金类型
     */
    marginType?: API.MarginType
    /**
     * 订单数量
     */
    orderVolume: number
    /**
     * 止损
     */
    stopLoss?: number
    /**
     * 交易品种
     */
    symbol: string
    /**
     * 止盈
     */
    takeProfit?: number
    /**
     * 交易账户ID
     */
    tradeAccountId: number
    /**
     * 订单类型
     */
    type: API.OrderType
  }
  // 订单修改
  type UpdateOrder = {
    /**
     * 过期时间
     */
    expirationTime?: string
    /**
     * 订单号
     */
    id?: number
    /**
     * 止损
     */
    stopLoss?: number
    /**
     * 止盈
     */
    takeProfit?: number
  }

  // 修改委托单(挂单)
  type UpdatePendingOrderParams = {
    /**
     * 委托订单号
     */
    orderId: number
    /**
     * 止损
     */
    stopLoss: number
    /**
     * 止盈
     */
    takeProfit: number
    /**
     * 限价价格
     */
    limitPrice: number
  }

  // 修改止盈止损参数
  type ModifyStopProfitLossParams = {
    /**持仓订单号 */
    bagOrderId: number
    /**止损 */
    stopLoss: number
    /**止盈 */
    takeProfit: number
  }

  // 订单分页-参数
  type OrderPageListParams = {
    /**当前账户ID */
    accountId: number | string
    /**
     * 订单方向
     */
    buySell?: API.TradeBuySell
    /**
     * 客户ID
     */
    clientId?: number
    /**
     * 当前页
     */
    current?: number
    /**
     * 保证金类型
     */
    marginType?: API.MarginType
    /**
     * 订单模式
     */
    mode?: API.OrderMode
    /**
     * 每页的数量
     */
    size?: number
    /**
     * 状态
     */
    status?: API.OrderStatus
    /**
     * 交易品种
     */
    symbol?: string
    /**
     * 订单类型
     */
    type?: API.OrderType | string
  }
  // 订单分页-列表
  type OrderPageListItem = {
    /**
     * 持仓ID
     */
    bagOrderId?: number | string
    /**
     * 订单方向
     */
    buySell?: API.TradeBuySell
    /**
     * 配置
     */
    conf?: string | Symbol.SymbolConf
    /**
     * 创建原因
     */
    createReason?: API.OrderCreateReason
    /**
     * 创建时间
     */
    createTime?: string
    /**
     * 数据源code
     */
    dataSourceCode?: string
    /**
     * 数据源Symbol
     */
    dataSourceSymbol?: string
    /**
     * 过期时间
     */
    expirationTime?: string
    /**
     * 手续费
     */
    handlingFees?: number
    /**
     * 主键
     */
    id?: number
    /**
     * 图标
     */
    imgUrl?: string
    /**
     * 成交方向
     */
    inOut?: API.OrderInOut
    /**
     * 杠杆倍数
     */
    leverageMultiple?: number
    /**
     * 限价价格
     */
    limitPrice?: number
    /**
     * 保证金类型
     */
    marginType?: API.MarginType
    /**
     * 订单模式
     */
    mode?: API.OrderMode
    /**
     * 操作员ID
     */
    operatorId?: number
    /**
     * 订单保证金
     */
    orderMargin?: number
    /**
     * 订单数量
     */
    orderVolume?: number
    /**
     * 备注
     */
    remark?: string
    /**
     * 状态
     */
    status?: API.OrderStatus
    /**
     * 止损
     */
    stopLoss?: number
    /**
     * 交易品种
     */
    symbol?: string
    /**
     * 品种小数位
     */
    symbolDecimal?: number
    /**
     * 止盈
     */
    takeProfit?: number
    /**
     * 交易账户ID
     */
    tradeAccountId?: number
    /**
     * 成交价格
     */
    tradePrice?: string
    /**
     * 成交量
     */
    tradingVolume?: number
    /**
     * 订单类型
     */
    type?: API.OrderType
    /**
     * 更新时间
     */
    updateTime?: string
    /**
     * 账户id
     */
    accountId: string
    /**
     * 交易账户001
     */
    accountName: string
    /**
     * 用户登录账号 654321@163.com
     */
    userAccount: string
    /**用户名称 */
    userName: string
  }
  // 订单详情：持仓单、委托单、成交单
  type OrderDetailListItem = BgaOrderPageListItem & {
    /**
     * 订单集合
     */
    ordersInfo: OrderPageListItem &
      {
        /**
         * 成交记录集合
         */
        tradeRecordsInfo?: TradeRecordsPageListItem[]
      }[]
  }

  // 持仓单分页-参数
  type BgaOrderPageListParams = {
    /**当前账户id */
    accountId: string | number
    /**
     * 订单方向
     */
    buySell?: API.TradeBuySell
    /**
     * 客户ID
     */
    clientId?: number
    /**
     * 当前页
     */
    current?: number
    /**
     * 保证金类型
     */
    marginType?: API.MarginType
    /**
     * 订单模式
     */
    mode?: API.OrderMode
    /**
     * 每页的数量
     */
    size?: number
    /**
     * 状态
     */
    status: API.BGAStatus
    /**
     * 交易品种
     */
    symbol?: string
  }
  // 持仓单分页-列表
  type BgaOrderPageListItem = {
    /**
     * 订单方向
     */
    buySell?: API.TradeBuySell
    /**
     * 平仓价格
     */
    closePrice?: number
    /**
     * 配置
     */
    conf?: string | Symbol.SymbolConf
    /**
     * 创建时间
     */
    createTime?: string
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
     * 主键
     */
    id: number
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
    marginType?: API.MarginType
    /**
     * 订单模式
     */
    mode?: API.OrderMode
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
     * 备注
     */
    remark?: string
    /**
     * 开仓价格
     */
    startPrice?: number
    /**
     * 状态
     */
    status?: API.BGAStatus
    /**
     * 止损
     */
    stopLoss?: number
    /**
     * 交易品种
     */
    symbol?: string
    /**
     * 品种小数位
     */
    symbolDecimal: number
    /**
     * 止盈
     */
    takeProfit?: number
    /**
     * 交易账户ID
     */
    tradeAccountId?: number
    /**
     * 更新时间
     */
    updateTime?: string
    /**品种配置 */
    conf?: Symbol.SpreadConf
    /**
     * 账户id
     */
    accountId: string
    /**
     * 交易账户001
     */
    accountName: string
    /**
     * 用户登录账号 654321@163.com
     */
    userAccount: string
    /**用户名称 */
    userName: string
  }
  // 成交记录-分页-参数
  type TradeRecordsPageListParams = {
    /**当前账户ID */
    accountId: string | number
    /**
     * 客户ID
     */
    clientId?: number
    /**
     * 当前页
     */
    current?: number
    /**
     * 成交方向
     */
    inOut?: API.OrderInOut
    /**
     * 每页的数量
     */
    size?: number
    /**
     * 交易品种
     */
    symbol?: string
  }
  // 成交记录-分页-列表
  type TradeRecordsPageListItem = {
    /**
     * 持仓订单ID
     */
    bagOrderId?: number
    /**
     * 订单方向
     */
    buySell?: API.TradeBuySell
    /**
     * 创建时间
     */
    createTime?: string
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
     * 主键
     */
    id?: number
    /**
     * 图标
     */
    imgUrl?: string
    /**
     * 成交方向
     */
    inOut?: API.OrderInOut
    /**
     * 库存费
     */
    interestFees?: number
    /**
     * 订单ID
     */
    orderId?: number
    /**
     * 价格id
     */
    priceValueId?: string
    /**
     * 盈亏
     */
    profit?: number
    /**
     * 备注
     */
    remark?: string
    /**
     * 开仓价格
     */
    startPrice?: number
    /**
     * 交易品种
     */
    symbol?: string
    /**
     * 品种小数位
     */
    symbolDecimal?: number
    /**
     * 交易账户ID
     */
    tradeAccountId?: number
    /**
     * 成交价格
     */
    tradePrice?: number
    /**
     * 成交量
     */
    tradingVolume?: number
    /**
     * 账户id
     */
    accountId: string
    /**
     * 交易账户001
     */
    accountName: string
    /**
     * 用户登录账号 654321@163.com
     */
    userAccount: string
    /**用户名称 */
    userName: string
    /**
     * 配置
     */
    conf?: string | Symbol.SymbolConf
  }
  // 追加保证金
  type AddMarginParams = {
    /**追加保证金 */
    addMargin: number
    /**持仓订单号 */
    bagOrderId: string | number
  }
  type ExtractMarginParams = {
    /**	持仓订单号 */
    bagOrderId: string | number
    /**提取保证金 */
    extractMargin: number
  }
}
