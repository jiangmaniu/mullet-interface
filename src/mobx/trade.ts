import { getIntl } from '@umijs/max'
import { keyBy } from 'lodash'
import { action, computed, configure, makeObservable, observable, runInAction } from 'mobx'

import { getTradeSymbolCategory } from '@/services/api/common'
import { getTradeSymbolList } from '@/services/api/tradeCore/account'
import { getAccountGroupList } from '@/services/api/tradeCore/accountGroup'
import {
  cancelOrder,
  createOrder,
  getBgaOrderPage,
  getOrderMargin,
  getOrderPage,
  modifyPendingOrder,
  modifyStopProfitLoss
} from '@/services/api/tradeCore/order'
import { getAllSymbols } from '@/services/api/tradeCore/symbol'
import { toFixed } from '@/utils'
import { message } from '@/utils/message'
import mitt from '@/utils/mitt'
import { push } from '@/utils/navigator'
import { STORAGE_GET_CONF_INFO, STORAGE_SET_CONF_INFO } from '@/utils/storage'
import { covertProfit, getCurrentQuote } from '@/utils/wsUtil'

import klineStore from './kline'
import ws from './ws'
import { IPositionListSymbolCalcInfo, MarginReteInfo } from './ws.types'

export type UserConfInfo = Record<
  string,
  {
    /**自选列表 */
    favoriteList?: Account.TradeSymbolListItem[]
    /**激活的品种名称 */
    activeSymbolName?: string
    /**打开的品种名称列表 */
    openSymbolNameList?: Account.TradeSymbolListItem[]
    /**当前切换的账户信息 */
    currentAccountInfo?: User.AccountItem
  }
>

// 底部Tabs交易记录类型
export type IRecordTabKey =
  /**持仓单 */
  | 'POSITION'
  /**挂单 */
  | 'PENDING'
  /**历史挂单(历史委托) */
  | 'HISTORY_PENDING'
  /**历史成交 */
  | 'HISTORY_CLOSE'
  /**历史仓位 */
  | 'HISTORY_POSITION'
  /**资金流水 */
  | 'FUND_RECORD'

// 交易区订单类型
export type ITradeTabsOrderType =
  /**市价单 */
  | 'MARKET_ORDER'
  /**限价单 */
  | 'LIMIT_ORDER'
  /**停损单 */
  | 'STOP_LIMIT_ORDER'

// 禁用 MobX 严格模式
configure({ enforceActions: 'never' })

type AccountBalanceInfo = {
  /**占用保证金 */
  occupyMargin: any
  /**可用保证金 */
  availableMargin: any
  /**账户净值 */
  balance: any
  /**账户总浮动盈亏 */
  totalProfit: any
  /** */
  currentAccountInfo: any
  money: any
}

class TradeStore {
  constructor() {
    makeObservable(this) // 使用 makeObservable mobx6.0 才会更新视图
  }
  @observable socket: any = null
  @observable symbolCategory: API.KEYVALUE[] = [] // 品种分类
  @observable symbolListLoading = true
  @observable symbolList: Account.TradeSymbolListItem[] = []
  @observable symbolListAll: Account.TradeSymbolListItem[] = [] // 首次查询的全部品种列表，不按条件查询

  @observable userConfInfo = {} as UserConfInfo // 记录用户设置的品种名称、打开的品种列表、自选信息，按accountId储存
  // 当前accountId的配置信息从userConfInfo展开，切换accountId时，重新设置更新
  @observable activeSymbolName = '' // 当前激活的品种名
  @observable openSymbolNameList = [] as Account.TradeSymbolListItem[] // 记录打开的品种名称列表
  @observable favoriteList = [] as Account.TradeSymbolListItem[] // 自选列表

  @observable currentAccountInfo = {} as User.AccountItem // 当前切换的账户信息
  @observable showBalanceEmptyModal = false // 余额为空弹窗
  @observable accountBalanceInfo = {} as AccountBalanceInfo // 账户余额信息

  //  ========= 交易区操作 =========
  @observable marginType: API.MarginType = 'CROSS_MARGIN' // 交易区保证金类型
  @observable buySell: API.TradeBuySell = 'BUY' // 交易区买卖类型
  @observable orderType: ITradeTabsOrderType = 'MARKET_ORDER' // 交易区订单类型
  @observable leverageMultiple = 1 // 浮动杠杆倍数，默认1
  @observable leverageMultipleMaxOpenVolume = 0 // 浮动杠杆模式点击弹窗确认后，最大可开仓量，显示在可开的位置
  // ============================

  // ====== 历史交易记录 ===========
  @observable positionList = [] as Order.BgaOrderPageListItem[] // 持仓列表
  @observable positionListCalcCache = [] as Order.BgaOrderPageListItem[] // 持仓列表-计算处理过浮动盈亏的
  @observable pendingList = [] as Order.OrderPageListItem[] // 挂单列表
  @observable stopLossProfitList = [] as Order.OrderPageListItem[] // 止盈止损列表
  @observable recordTabKey: IRecordTabKey = 'POSITION' // 交易记录切换
  @observable showActiveSymbol = false // 是否展示当前，根据当前激活的品种，搜索交易历史记录
  // ============================

  @observable currentLiquidationSelectBgaId = 'CROSS_MARGIN' // 默认全仓，右下角爆仓选择逐仓、全仓切换
  @observable accountGroupList = [] as AccountGroup.AccountGroupItem[] // 账户组列表
  @observable accountGroupListLoading = false // 账户组列表loading
  @observable accountGroupListInitialized = false // 账户组列表是否初始化, 用于判断是否需要全量初始化或更新

  @observable allSimpleSymbolsMap = {} as { [key: string]: Symbol.AllSymbolItem } // 全部品种列表map，校验汇率品种用到

  @observable switchAccountLoading = false // 切换账户loading效果

  @observable tradePageActive = false // 交易页窗口是否激活
  @observable positionListSymbolCalcInfo = new Map<string, IPositionListSymbolCalcInfo>() // 持仓单计算信息
  @observable rightWidgetSelectMarginInfo = {} as MarginReteInfo // 右下角选择的保证金信息

  // 初始化加载
  init = () => {
    // 初始化打开的品种列表
    this.initOpenSymbolNameList()
    // 初始化自选列表
    this.initFavoriteList()
    // 获取全部品种列表作为汇率校验
    this.getAllSimbleSymbols()
  }

  // 右下角爆仓选择逐仓、全仓切换
  setCurrentLiquidationSelectBgaId = (value: any) => {
    this.currentLiquidationSelectBgaId = value
  }

  setSwitchAccountLoading = (loading: boolean) => {
    this.switchAccountLoading = loading
  }

  setShowActiveSymbol = (value: boolean) => {
    this.showActiveSymbol = value
  }

  setTradePageActive = (value: boolean) => {
    this.tradePageActive = value
  }

  // =========== 设置交易区操作 ==========

  // 设置弹窗选择的保证金类型
  setMarginType = (marginType: API.MarginType) => {
    this.marginType = marginType
  }

  // 设置弹窗选择的浮动杠杆倍数
  setLeverageMultiple = (leverageMultiple: number) => {
    this.leverageMultiple = leverageMultiple
  }

  // 浮动杠杆模式最大可开手数
  setLeverageMultipleMaxOpenVolume = (maxOpenVolume: number) => {
    this.leverageMultipleMaxOpenVolume = maxOpenVolume
  }

  // 设置买卖类型切换
  setBuySell = (buySell: API.TradeBuySell) => {
    this.buySell = buySell
  }

  // 设置订单类型Tabs切换
  setOrderType = (orderType: ITradeTabsOrderType) => {
    this.orderType = orderType
  }

  // =============================

  // 获取创建账户页面-账户组列表
  getAccountGroupList = async () => {
    if (this.accountGroupListLoading) return
    this.accountGroupListLoading = true

    const res = await getAccountGroupList()
    const accountList = (res?.data || []) as AccountGroup.AccountGroupItem[]
    runInAction(() => {
      this.accountGroupList = accountList
      this.accountGroupListLoading = false
    })
    return res
  }

  // 设置账户组列表初始化状态
  setAccountGroupListInitialized = (initialized: boolean) => {
    this.accountGroupListInitialized = initialized
  }

  // 设置当前切换的账户信息
  @action
  setCurrentAccountInfo = (info: User.AccountItem) => {
    this.currentAccountInfo = info

    // 缓存当前账号
    STORAGE_SET_CONF_INFO(info, `currentAccountInfo`)

    this.reloadAfterAccountChange()

    // 根据accountId切换本地设置的自选、打开的品种列表、激活的品种名称
    this.init()
  }

  @action
  jumpTrade = () => {
    this.setSwitchAccountLoading(true)

    // 需要刷新k线，否则切换不同账号加载的品种不一样
    push('/trade')
    klineStore.destroyed() // 非交易页面跳转需要重置trandview实例，否则报错

    setTimeout(() => {
      // 停止动画播放
      this.setSwitchAccountLoading(false)
    }, 2000)
  }

  // 获取当前账户账户余额、保证金信息
  // @action
  // getAccountBalance = () => {
  //   const currentAccountInfo = this.currentAccountInfo
  //   const currencyDecimal = currentAccountInfo.currencyDecimal

  //   // 账户余额
  //   const money = Number(toFixed(currentAccountInfo.money || 0, currencyDecimal))
  //   // 当前账户占用的保证金 = 逐仓保证金 + 全仓保证金（可用保证金）
  //   const occupyMargin = Number(
  //     toFixed(Number(currentAccountInfo?.margin || 0) + Number(currentAccountInfo?.isolatedMargin || 0), currencyDecimal)
  //   )
  //   // 可用保证金
  //   let availableMargin = Number(toFixed(money - occupyMargin, currencyDecimal))
  //   // 持仓总浮动盈亏
  //   const totalOrderProfit = Number(toFixed(this.getCurrentAccountFloatProfit(this.positionList), currencyDecimal))
  //   // 持仓单总的库存费
  //   const totalInterestFees = Number(
  //     toFixed(
  //       this.positionList.reduce((total, next) => Number(total) + Number(toFixed(Number(next.interestFees), currencyDecimal)), 0) || 0,
  //       currencyDecimal
  //     )
  //   )
  //   // 持仓单总的手续费
  //   const totalHandlingFees = Number(
  //     toFixed(
  //       this.positionList.reduce((total, next) => Number(total) + Number(toFixed(Number(next.handlingFees), currencyDecimal)), 0) || 0,
  //       currencyDecimal
  //     )
  //   )
  //   // 净值 = 账户余额 + 库存费 + 手续费 + 浮动盈亏
  //   const balance = Number(Number(currentAccountInfo.money || 0) + totalInterestFees + totalHandlingFees + totalOrderProfit)

  //   // 账户总盈亏 = 所有订单的盈亏 + 所有订单的库存费 + 所有订单的手续费
  //   const totalProfit = totalOrderProfit + totalInterestFees + totalHandlingFees

  //   // console.log('totalInterestFees', totalInterestFees)
  //   // console.log('totalHandlingFees', totalHandlingFees)
  //   // console.log('totalOrderProfit', totalOrderProfit)
  //   // console.log('totalProfit', totalProfit)

  //   // 账户组设置“可用计算未实现盈亏”时
  //   // 新可用预付款=原来的可用预付款+账户的持仓盈亏
  //   if (currentAccountInfo?.usableAdvanceCharge === 'PROFIT_LOSS') {
  //     availableMargin = availableMargin + totalProfit
  //   }
  //   return {
  //     occupyMargin,
  //     availableMargin,
  //     balance,
  //     totalProfit,
  //     currentAccountInfo,
  //     money
  //   }
  // }

  // 使用从worker计算同步的数据
  @action
  getAccountBalance = () => {
    return this.accountBalanceInfo
  }

  // 计算逐仓保证金信息
  @action
  calcIsolatedMarginRateInfo = (filterPositionList: Order.BgaOrderPageListItem[]) => {
    let compelCloseRatio = this.currentAccountInfo.compelCloseRatio || 0 // 强制平仓比例(订单列表都是一样的，同一个账户组)
    let orderMargin = 0 // 订单总的保证金
    let handlingFees = 0 // 订单总的手续费
    let interestFees = 0 // 订单总的库存费
    let profit = 0 // 订单总的浮动盈亏
    filterPositionList.map((item) => {
      const orderProfit = covertProfit(item) as any
      orderMargin += Number(item.orderMargin || 0)
      handlingFees += Number(item.handlingFees || 0)
      interestFees += Number(item.interestFees || 0)
      if (orderProfit) {
        profit += orderProfit
      }
    })

    // 逐仓净值=账户余额（单笔或多笔交易保证金）+ 库存费 + 手续费 + 浮动盈亏
    const isolatedBalance = Number(orderMargin + Number(interestFees || 0) + Number(handlingFees || 0) + Number(profit || 0))
    // 逐仓保证金率：当前逐仓净值 / 当前逐仓订单占用 = 保证金率
    const marginRate = orderMargin && isolatedBalance ? toFixed((isolatedBalance / orderMargin) * 100) : 0
    const margin = Number(orderMargin * (compelCloseRatio / 100))
    const balance = toFixed(isolatedBalance, 2)

    // console.log('orderMargin', orderMargin)
    // console.log('compelCloseRatio', compelCloseRatio)
    // console.log('维持保证金margin', margin)

    return {
      marginRate,
      margin,
      balance
    }
  }

  /**
   *
   * @param item
   * @returns
   */
  /**
   * 计算全仓/逐仓：保证金率、维持保证金
   * @param item 持仓单item
   * @returns
   */
  @action
  getMarginRateInfo = (item?: Order.BgaOrderPageListItem) => {
    const currentLiquidationSelectBgaId = this.currentLiquidationSelectBgaId
    const quote = getCurrentQuote()
    const conf = item?.conf || quote?.symbolConf // 品种配置信息
    const buySell = this.buySell
    const isCrossMargin = item?.marginType === 'CROSS_MARGIN' || (!item && currentLiquidationSelectBgaId === 'CROSS_MARGIN') // 全仓
    // 全仓保证金率：全仓净值/占用 = 保证金率
    // 全仓净值 = 全仓净值 - 逐仓单净值(单笔或多笔)
    // 逐仓保证金率：当前逐仓净值 / 当前逐仓订单占用 = 保证金率
    // 净值=账户余额+库存费+手续费+浮动盈亏
    const currentAccountInfo = this.currentAccountInfo
    let { balance } = this.getAccountBalance()

    let marginRate = 0
    let margin = 0 // 维持保证金 = 占用保证金 * 强制平仓比例
    const positionList = this.positionList // 注意这里外部传递过来的list是处理过汇率 浮动盈亏的
    let compelCloseRatio = positionList?.[0]?.compelCloseRatio || 0 // 强制平仓比例(订单列表都是一样的，同一个账户组)
    compelCloseRatio = compelCloseRatio ? compelCloseRatio / 100 : 0
    if (isCrossMargin) {
      // 全仓占用的保证金
      const occupyMargin = Number(toFixed(Number(currentAccountInfo.margin || 0), 2))
      // 判断是否存在全仓单
      const hasCrossMarginOrder = positionList.some((item) => item.marginType === 'CROSS_MARGIN')
      if (hasCrossMarginOrder) {
        // 逐仓保证金信息
        const marginInfo = this.calcIsolatedMarginRateInfo(this.positionList.filter((item) => item.marginType === 'ISOLATED_MARGIN'))
        // 全仓净值：全仓净值 - 逐仓净值
        const crossBalance = Number(toFixed(balance - marginInfo.balance, 2))
        balance = crossBalance
        marginRate = occupyMargin ? toFixed((balance / occupyMargin) * 100) : 0
        margin = Number(occupyMargin * compelCloseRatio)

        // console.log('逐仓净值', marginInfo.balance)
        // console.log('计算后的全仓净值', balance)
        // console.log('全仓occupyMargin', occupyMargin)
        // console.log('marginRate', marginRate)
      }
    } else {
      let filterPositionList = [item] as Order.BgaOrderPageListItem[]
      // 逐仓模式保证金
      const marginInfo = this.calcIsolatedMarginRateInfo(filterPositionList)
      return marginInfo
    }

    return {
      marginRate,
      margin,
      balance
    }
  }

  // 计算当前账户总的浮动盈亏
  @action
  getCurrentAccountFloatProfit = (list: Order.BgaOrderPageListItem[]) => {
    const currencyDecimal = this.currentAccountInfo.currencyDecimal
    // const data = cloneDeep(list)
    const data = list
    // 持仓总浮动盈亏
    let totalProfit = 0
    if (data.length) {
      data.forEach((item: Order.BgaOrderPageListItem) => {
        const profit = covertProfit(item) // 浮动盈亏
        // item.profit = profit
        // 先截取在计算，否则跟页面上截取后的值累加对不上
        totalProfit += Number(toFixed(Number(profit || 0), currencyDecimal))
      })
    }
    return totalProfit
  }

  // 调用接口计算保证金
  calcMargin = async (params: Order.CreateOrder) => {
    if (!params.orderVolume || !params.symbol) return
    const res = await getOrderMargin(params)
    return Math.abs(res.data || 0)
  }

  // 切换账户后，重载的接口
  @action reloadAfterAccountChange = () => {
    // 重新加载品种列表
    this.getSymbolList()
  }

  // ========= 设置打开的品种 =========

  // 初始化本地打开的symbol
  @action
  initOpenSymbolNameList() {
    // this.openSymbolNameList = STORAGE_GET_SYMBOL_NAME_LIST() || []
    // this.activeSymbolName = STORAGE_GET_ACTIVE_SYMBOL_NAME()

    runInAction(() => {
      const userConfInfo = (STORAGE_GET_CONF_INFO() || {}) as UserConfInfo
      this.currentAccountInfo = (userConfInfo?.currentAccountInfo || {}) as User.AccountItem
      const accountId = this.currentAccountInfo?.id
      const currentAccountConf = accountId ? userConfInfo?.[accountId] : {}

      this.userConfInfo = userConfInfo
      this.openSymbolNameList = (currentAccountConf?.openSymbolNameList || []).filter((v) => v) as Account.TradeSymbolListItem[]
      this.activeSymbolName = currentAccountConf?.activeSymbolName as string
    })
  }

  // 切换交易品种
  @action
  switchSymbol = (symbol: string) => {
    // 切换k线时如果处于loading状态，在切换其他则不可以点击，等切换成功后再点击，否则会出现跳空问题
    if (klineStore.switchSymbolLoading) return
    // 记录打开的symbol
    this.setOpenSymbolNameList(symbol)
    // 设置当前当前的symbol
    this.setActiveSymbolName(symbol)

    // 切换品种事件
    mitt.emit('symbol_change')
  }

  // 获取打开的品种完整信息
  getActiveSymbolInfo = (currentSymbolName?: string) => {
    const symbol = currentSymbolName || this.activeSymbolName
    const symbolList = this.symbolListAll
    const info = symbolList.find((item) => item.symbol === symbol) || {}
    return info as Account.TradeSymbolListItem
  }

  // 获取激活品种的dataSourceSymbol，用于获取websocket品种对应的行情
  getActiveDataSourceSymbol = () => {
    const symbolInfo = this.getActiveSymbolInfo()
    return symbolInfo?.dataSourceSymbol || ''
  }

  // 记录打开的symbol
  @action
  setOpenSymbolNameList(name: string) {
    this.setActiveSymbolName(name)
    if (this.openSymbolNameList.some((item) => item.symbol === name)) return
    const symbolItem = this.symbolList.find((item) => item.symbol === name) as Account.TradeSymbolListItem
    this.openSymbolNameList.push(symbolItem)
    this.updateLocalOpenSymbolNameList()
  }

  // 移除打开的symbol
  @action
  removeOpenSymbolNameList(name: string, removeIndex: number) {
    const originList = JSON.parse(JSON.stringify(this.openSymbolNameList))
    const newList = this.openSymbolNameList.filter((item) => item.symbol !== name)

    this.openSymbolNameList = newList
    this.updateLocalOpenSymbolNameList()

    if (this.activeSymbolName === name) {
      // 更新激活的索引
      const nextActiveItem = originList[removeIndex - 1] || originList[removeIndex + 1]
      this.setActiveSymbolName(nextActiveItem)
    }
  }

  // 切换当前打开的symbol
  @action
  setActiveSymbolName(key: string) {
    // 取消订阅上一个的深度报价
    ws.subscribeDepth(true)

    setTimeout(() => {
      this.activeSymbolName = key
      // STORAGE_SET_ACTIVE_SYMBOL_NAME(key)
      STORAGE_SET_CONF_INFO(key, `${this.currentAccountInfo?.id}.activeSymbolName`)
      // 重新订阅深度
      ws.subscribeDepth()
    }, 300)
  }

  // 更新本地缓存的symbol列表
  @action updateLocalOpenSymbolNameList = () => {
    // STORAGE_SET_SYMBOL_NAME_LIST(this.openSymbolNameList)
    STORAGE_SET_CONF_INFO(
      this.openSymbolNameList.filter((v) => v),
      `${this.currentAccountInfo?.id}.openSymbolNameList`
    )
  }

  // =========== 收藏、取消收藏 ==============

  // 是否收藏品种
  @computed get isFavoriteSymbol() {
    return this.favoriteList.some((item) => item.symbol === this.activeSymbolName && item.checked)
  }

  // 获取本地自选
  @action async initFavoriteList() {
    // const data = await STORAGE_GET_FAVORITE()
    const data = STORAGE_GET_CONF_INFO(`${this.currentAccountInfo?.id}.favoriteList`) || []
    if (Array.isArray(data) && data.length) {
      runInAction(() => {
        this.favoriteList = data
      })
    } else {
      // 重置
      this.favoriteList = []
      this.setDefaultFavorite()
    }
  }

  // 设置默认自选
  @action setDefaultFavorite() {
    // 设置本地默认自选 @TODO 品种动态加载的，先不加默认
    // this.setSymbolFavoriteToLocal(DEFAULT_QUOTE_FAVORITES_CURRENCY)
  }

  // 设置本地自选
  @action async setSymbolFavoriteToLocal(data: any) {
    // if (Array.isArray(data) && data.length) {
    this.favoriteList = data
    // STORAGE_SET_FAVORITE(data)
    STORAGE_SET_CONF_INFO(data, `${this.currentAccountInfo?.id}.favoriteList`)
    // } else {
    // this.setDefaultFavorite()
    // }
  }

  // 切换收藏选中状态
  @action toggleSymbolFavorite(name?: string) {
    const symbolName = name || this.activeSymbolName // 不传name，使用当前激活的
    const index = this.favoriteList.findIndex((v) => v.symbol === symbolName)
    const item: any = this.symbolList.find((v) => v.symbol === symbolName)
    // 删除
    if (index !== -1) {
      this.favoriteList.splice(index, 1)
    } else {
      // 添加到已选列表
      item.checked = true
      this.favoriteList.push(item)
    }
    this.setSymbolFavoriteToLocal(this.favoriteList)
  }

  // ============================
  // 查询品种分类
  @action
  getSymbolCategory = async () => {
    const res = await getTradeSymbolCategory()
    if (res.success) {
      runInAction(() => {
        this.symbolCategory = [{ value: '0', key: '0', label: getIntl().formatMessage({ id: 'common.all' }) }, ...(res?.data || [])]
      })
    }
  }

  // 判断本地收藏的品种是否禁用被下架的
  @action
  disabledSymbol = () => {
    return !this.symbolListAll.some((item) => item.symbol === this.activeSymbolName)
  }

  // 禁用交易
  @action
  disabledTrade = () => {
    // enableConnect 启用禁用账户组
    // isTrade 启用禁用账户交易
    return this.disabledSymbol() || !this.currentAccountInfo.enableTrade || !this.currentAccountInfo.isTrade
  }

  // 禁用切换账户
  @action
  disabledConect = (accountItem?: User.AccountItem) => {
    // enableConnect 启用禁用账户组
    // status 启用禁用账号
    const item = accountItem || this.currentAccountInfo
    return !item.enableConnect || item?.status === 'DISABLED'
  }

  // 禁用交易区操作
  @action
  disabledTradeAction = () => {
    // 账户禁用或者是休市状态
    return this.disabledTrade() || !this.isMarketOpen()
  }

  // 判断是否休市状态，根据当前时间判断是否在交易时间段内
  @action
  isMarketOpen = (symbol?: string) => {
    const symbolInfo = this.getActiveSymbolInfo(symbol)
    const tradeTimeConf = symbolInfo?.symbolConf?.tradeTimeConf || []

    if (!symbolInfo.id) return false

    const now = new Date()
    const currentDay = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][now.getDay()]
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    // @ts-ignore
    const dayConfig = tradeTimeConf.find((config: any) => config.weekDay === currentDay)
    if (!dayConfig) return false

    // 每隔两个值表示一个时间段，第一个值表示开始时间，第二个值表示结束时间。时间按分钟计算
    for (let i = 0; i < dayConfig.trade.length; i += 2) {
      const start = dayConfig.trade[i]
      const end = dayConfig.trade[i + 1]
      if (currentMinutes >= start && currentMinutes <= end) {
        return true
      }
    }

    return false
  }

  // 获取全部品种列表
  @action
  getAllSimbleSymbols = async () => {
    const res = await getAllSymbols()
    runInAction(() => {
      const data = res.data as Symbol.AllSymbolItem[]
      this.allSimpleSymbolsMap = keyBy(data, 'symbol')
    })
  }

  // 根据账户id查询侧边栏菜单交易品种列表
  @action
  getSymbolList = async (params = {} as Partial<Account.TradeSymbolListParams>) => {
    const accountId = params?.accountId || this.currentAccountInfo?.id
    if (!accountId) return
    // 查询全部
    if (params.classify === '0') {
      delete params.classify
    }
    const res = await getTradeSymbolList({ ...params, accountId }).catch((e) => e)
    runInAction(() => {
      this.symbolListLoading = false
    })
    if (res.success) {
      const symbolList = (res.data || []) as Account.TradeSymbolListItem[]
      runInAction(() => {
        this.symbolList = symbolList
        // 查询全部的品种列表
        if (!params.classify) {
          this.symbolListAll = symbolList
        }

        // 切换accountId后请求的品种列表可能不一致，设置第一个默认的品种名称
        const firstSymbolName = this.symbolListAll[0]?.symbol
        // 如果当前激活的品种名称不在返回的列表中，则重新设置第一个为激活
        if (firstSymbolName && !this.symbolListAll.some((item) => item.symbol === this.activeSymbolName)) {
          this.activeSymbolName = firstSymbolName
        }
        // 设置默认的
        if (!this.openSymbolNameList.length) {
          this.setOpenSymbolNameList(firstSymbolName)
        }
      })

      // 获取品种后，动态订阅品种
      if (ws.socket?.readyState === 1 || ws.readyState === 1) {
        ws.batchSubscribeSymbol()
      } else {
        // 按需连接
        // ws.reconnect()
      }
    }
  }

  // 切换交易记录TabKey
  setTabKey = (tabKey: IRecordTabKey) => {
    this.recordTabKey = tabKey

    if (tabKey === 'POSITION') {
      // 持仓
      this.getPositionList()
    } else if (tabKey === 'PENDING') {
      // 挂单
      this.getPendingList()
    }
    // else if (tabKey === 'STOPLOSS_PROFIT') {
    // 止盈止损
    // this.getStopLossProfitList()
    // }
  }

  // 查询持仓列表
  @action
  getPositionList = async () => {
    // 查询进行中的订单
    const res = await getBgaOrderPage({ current: 1, size: 999, status: 'BAG', accountId: this.currentAccountInfo?.id })
    if (res.success) {
      const data = (res.data?.records || []) as Order.BgaOrderPageListItem[]
      runInAction(() => {
        this.positionList = data
      })

      // 动态订阅汇率品种行情
      if (data.length) {
        data.forEach((item) => {
          ws.subscribeExchangeRateQuote(item.conf)
        })
      }
    }
    return res
  }

  @action
  setPositionListCalcCache = (list: Order.BgaOrderPageListItem[]) => {
    runInAction(() => {
      // this.positionListCalcCache = uniqueObjectArray([...this.positionListCalcCache, ...list], 'id')
      this.positionListCalcCache = list
    })
  }

  // 查询挂单列表
  @action
  getPendingList = async () => {
    const res = await getOrderPage({
      current: 1,
      size: 999,
      status: 'ENTRUST',
      type: 'LIMIT_BUY_ORDER,LIMIT_SELL_ORDER,STOP_LOSS_LIMIT_BUY_ORDER,STOP_LOSS_LIMIT_SELL_ORDER,STOP_LOSS_MARKET_BUY_ORDER,STOP_LOSS_MARKET_SELL_ORDER',
      accountId: this.currentAccountInfo?.id
    })
    if (res.success) {
      runInAction(() => {
        this.pendingList = (res.data?.records || []) as Order.OrderPageListItem[]
      })
    }
  }
  // 查询止盈止损列表
  @action
  getStopLossProfitList = async () => {
    const res = await getOrderPage({
      current: 1,
      size: 999,
      status: 'ENTRUST',
      type: 'STOP_LOSS_ORDER,TAKE_PROFIT_ORDER',
      accountId: this.currentAccountInfo?.id
    })
    if (res.success) {
      runInAction(() => {
        this.stopLossProfitList = (res.data?.records || []) as Order.OrderPageListItem[]
      })
    }
  }
  // 下单操作
  // 携带持仓订单号则为平仓单，只需要传递持仓单号、交易账户ID、订单数量、订单类型和反向订单方向，其他参数无效
  createOrder = async (params: Order.CreateOrder) => {
    const intl = getIntl()
    const orderType = params.type
    const isBuy = params.buySell === 'BUY'
    const res = await createOrder(params)
    if (res.success) {
      // 市价单：买入卖出单
      if (['MARKET_ORDER'].includes(orderType)) {
        // 更新持仓列表,通过ws推送更新
        // this.getPositionList()
        // 携带持仓订单号则为平仓单
        if (params.executeOrderId) {
          message.info(intl.formatMessage({ id: 'mt.pingcangchenggong' }))
        } else {
          message.info(intl.formatMessage({ id: 'mt.kaicangchenggong' }))
          // notification.success({
          //   message: intl.formatMessage({ id: 'mt.kaicangchenggong' }),
          //   description: `${isBuy ? intl.formatMessage({ id: 'mt.mairu' }) : intl.formatMessage({ id: 'mt.maichu' })} ${
          //     params.orderVolume
          //   }${intl.formatMessage({ id: 'mt.lot' })} ${intl.formatMessage({ id: 'mt.jiage' })}:${params.limitPrice}`,
          //   placement: 'bottomLeft',
          //   duration: 5000
          // })
        }
        // 激活Tab
        trade.setTabKey('POSITION')
      }
      // 限价买入卖出单、停损买入卖出单
      else if (['LIMIT_BUY_ORDER', 'LIMIT_SELL_ORDER', 'STOP_LOSS_LIMIT_BUY_ORDER', 'STOP_LOSS_LIMIT_SELL_ORDER'].includes(orderType)) {
        // 更新挂单列表,通过ws推送更新
        // this.getPendingList()
        message.info(getIntl().formatMessage({ id: 'mt.guadanchenggong' }))
        // 激活Tab
        trade.setTabKey('PENDING')
      }
    }
    return res
  }
  // 修改止盈止损
  modifyStopProfitLoss = async (params: Order.ModifyStopProfitLossParams) => {
    const res = await modifyStopProfitLoss(params)
    if (res.success) {
      // 更新持仓列表
      this.getPositionList()
      // 更新止盈止损列表
      // this.getStopLossProfitList()

      message.info(getIntl().formatMessage({ id: 'mt.xiugaizhiyingzhisunchenggong' }))
      // 激活Tab
      // trade.setTabKey('STOPLOSS_PROFIT')
    }
    return res
  }
  // 修改挂单
  modifyPendingOrder = async (params: Order.UpdatePendingOrderParams) => {
    const res = await modifyPendingOrder(params)
    if (res.success) {
      // 更新挂单列表
      this.getPendingList()

      message.info(getIntl().formatMessage({ id: 'mt.xiugaiguadanchenggong' }))
    }
    return res
  }
  // 取消挂单
  cancelOrder = async (params: API.IdParam) => {
    const res = await cancelOrder(params)
    if (res.success) {
      // 更新挂单列表
      this.getPendingList()
      // 更新止盈止损列表
      // this.getStopLossProfitList()
      message.info(getIntl().formatMessage({ id: 'mt.cexiaochenggong' }))
    }
    return res
  }
}

const trade = new TradeStore()

export default trade
