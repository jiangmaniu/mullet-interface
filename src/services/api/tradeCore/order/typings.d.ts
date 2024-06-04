declare namespace Order {
  // 追加保证金
  type addMargin = {
    /**追加保证金 */
    addMargin: number
    /**订单号 */
    id: number
  }
  // 下单
  type CreateOrder = {
    /**
     * 持仓订单号
     */
    bagOrderId?: number
    /**
     * 订单方向
     */
    buySell?: API.BuySell
    /**
     * 过期时间
     */
    expirationTime?: string
    /**
     * 杠杆倍数
     */
    leverageMultiple?: number
    /**
     * 保证金类型
     */
    marginType?: API.MarginType
    /**
     * 订单数量
     */
    orderVolume?: number
    /**
     * 止损
     */
    stopLoss?: number
    /**
     * 交易品种
     */
    symbol?: string
    /**
     * 止盈
     */
    takeProfit?: number
    /**
     * 交易账户ID
     */
    tradeAccountId?: number
    /**
     * 订单类型
     */
    type?: API.OrderType
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

  // 订单分页-参数
  type OrderPageListParams = {
    /**
     * 持仓ID
     */
    bagOrderId?: number
    /**
     * 订单方向
     */
    buySell?: string
    /**
     * 配置
     */
    conf?: string
    /**
     * 创建原因
     */
    createReason?: API.OrderCreateReason
    /**
     * 创建时间
     */
    createTime?: string
    /**
     * 当前页
     */
    current?: number
    /**
     * 过期时间
     */
    expirationTime?: string
    /**
     * 主键
     */
    id?: number
    /**
     * 成交方向
     */
    inOut?: API.OrderInOut
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
     * 每页的数量
     */
    size?: number
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
    type?: string
    /**
     * 更新时间
     */
    updateTime?: string
  }
  // 订单分页-列表
  type OrderPageListItem = {
    /**
     * 持仓ID
     */
    bagOrderId?: number
    /**
     * 订单方向
     */
    buySell?: API.BuySell
    /**
     * 配置
     */
    conf?: string
    /**
     * 创建原因
     */
    createReason?: API.OrderCreateReason
    /**
     * 创建时间
     */
    createTime?: string
    /**
     * 过期时间
     */
    expirationTime?: string
    /**
     * 主键
     */
    id?: number
    /**
     * 成交方向
     */
    inOut?: API.OrderInOut
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
     * 操作员ID
     */
    operatorId?: number
    /**
     * 订单保证金
     */
    orderMargin?: number
    /**
     * 订单交易量
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
    /**
     * 订单方向
     */
    buySell?: API.BuySell
    /**
     * 平仓价格
     */
    closePrice?: number
    /**
     * 配置
     */
    conf?: string
    /**
     * 创建时间
     */
    createTime?: string
    /**
     * 当前页
     */
    current?: number
    /**
     * 主键
     */
    id?: number
    /**
     * 库存费
     */
    interest?: number
    /**
     * 杠杆倍数
     */
    leverageMultiple?: string
    /**
     * 保证金类型
     */
    marginType?: string
    /**
     * 订单模式
     */
    mode?: string
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
     * 每页的数量
     */
    size?: number
    /**
     * 开仓价格
     */
    startPrice?: number
    /**
     * 状态
     */
    status?: string
    /**
     * 止损
     */
    stopLoss?: number
    /**
     * 交易品种
     */
    symbol?: string
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
  }
  // 持仓单分页-列表
  type BgaOrderPageListItem = {
    /**
     * 订单方向
     */
    buySell?: API.BuySell
    /**
     * 平仓价格
     */
    closePrice?: number
    /**
     * 成交量
     */
    tradingVolume?: number
    /**
     * 配置
     */
    conf?: string
    /**
     * 创建时间
     */
    createTime?: string
    /**
     * 主键
     */
    id?: number
    /**
     * 库存费
     */
    interest?: number
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
  }
  // 成交记录-分页-参数
  type TradeRecordsPageListParams = {
    /**
     * 持仓订单ID
     */
    bagOrderId?: number
    /**
     * 订单方向
     */
    buySell?: string
    /**
     * 创建时间
     */
    createTime?: string
    /**
     * 当前页
     */
    current?: number
    /**
     * 主键
     */
    id?: number
    /**
     * 成交方向
     */
    inOut?: string
    /**
     * 订单ID
     */
    orderId?: number
    /**
     * 备注
     */
    remark?: string
    /**
     * 每页的数量
     */
    size?: number
    /**
     * 开仓价格
     */
    startPrice?: number
    /**
     * 交易品种
     */
    symbol?: string
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
    buySell?: API.BuySell
    /**
     * 创建时间
     */
    createTime?: string
    /**
     * 主键
     */
    id?: number
    /**
     * 成交方向
     */
    inOut?: API.OrderInOut
    /**
     * 订单ID
     */
    orderId?: number
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
     * 	盈亏
     */
    profit?: number
  }
}
