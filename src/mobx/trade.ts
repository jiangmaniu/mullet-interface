import { getIntl } from '@umijs/max'
import { action, computed, configure, makeObservable, observable, runInAction } from 'mobx'

import { getTradeSymbolCategory } from '@/services/api/common'
import { getTradeSymbolList } from '@/services/api/tradeCore/account'
import {
  cancelOrder,
  createOrder,
  getBgaOrderPage,
  getOrderMargin,
  getOrderPage,
  getTradeRecordsPage,
  modifyPendingOrder,
  modifyStopProfitLoss
} from '@/services/api/tradeCore/order'
import { toFixed } from '@/utils'
import { message } from '@/utils/message'
import { STORAGE_GET_CONF_INFO, STORAGE_SET_CONF_INFO } from '@/utils/storage'
import { covertProfit } from '@/utils/wsUtil'

import ws from './ws'

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

export type IRecordTabKey = 'POSITION' | 'PENDING' | 'STOPLOSS_PROFIT' | 'HISTORY'

// 禁用 MobX 严格模式
configure({ enforceActions: 'never' })

class TradeStore {
  constructor() {
    makeObservable(this) // 使用 makeObservable mobx6.0 才会更新视图
  }
  @observable socket: any = null
  @observable symbolCategory: API.KEYVALUE[] = [] // 品种分类
  @observable symbolList: Account.TradeSymbolListItem[] = []
  @observable symbolListAll: Account.TradeSymbolListItem[] = [] // 首次查询的全部品种列表，不按条件查询
  @observable positionList = [] as Order.BgaOrderPageListItem[] // 持仓列表
  @observable pendingList = [] as Order.OrderPageListItem[] // 挂单列表
  @observable stopLossProfitList = [] as Order.OrderPageListItem[] // 止盈止损列表
  @observable historyCloseList = [] as Order.TradeRecordsPageListItem[] // 历史成交列表
  @observable historyPendingList = [] as Order.OrderPageListItem[] // 历史挂单列表
  @observable recordTabKey: IRecordTabKey = 'POSITION' // 交易记录切换

  @observable userConfInfo = {} as UserConfInfo // 记录用户设置的品种名称、打开的品种列表、自选信息，按accountId储存
  // 当前accountId的配置信息从userConfInfo展开，切换accountId时，重新设置更新
  @observable activeSymbolName = '' // 当前激活的品种名
  @observable openSymbolNameList = [] as Account.TradeSymbolListItem[] // 记录打开的品种名称列表
  @observable favoriteList = [] as Account.TradeSymbolListItem[] // 自选列表

  @observable currentAccountInfo = {} as User.AccountItem // 当前切换的账户信息
  @observable showBalanceEmptyModal = false // 余额为空弹窗
  @observable marginType: API.MaiginType = 'CROSS_MARGIN' // 保证金类型
  @observable currentAccountMargin = 0 // 当前账户可用保证金：逐仓保证金 + 全仓保证金margin

  // 初始化加载
  init = () => {
    // 初始化打开的品种列表
    trade.initOpenSymbolNameList()
    // 初始化自选列表
    trade.initFavoriteList()
  }

  // 设置保证金类型
  setMarginType = (marginType: API.MaiginType) => {
    this.marginType = marginType
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

  // 当前账户可用保证金 = 逐仓保证金 + 全仓保证金
  @action
  getCurrentAccountMargin = () => {
    const currentAccountInfo = this.currentAccountInfo
    return toFixed(Number(currentAccountInfo?.margin || 0) + Number(currentAccountInfo?.isolatedMargin || 0))
  }

  // 计算当前账户总的浮动盈亏
  @action
  getCurrentAccountFloatProfit = (list: Order.BgaOrderPageListItem[]) => {
    const data = JSON.parse(JSON.stringify(list))
    // 持仓总浮动盈亏
    let totalProfit = 0
    if (data.length) {
      data.forEach((item: Order.BgaOrderPageListItem) => {
        const profit = covertProfit(item.dataSourceSymbol as string, item) // 浮动盈亏
        item.profit = profit || item.profit
        totalProfit += Number(item.profit || 0)
      })
    }
    return totalProfit
  }

  // 计算保证金
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

    const userConfInfo = (STORAGE_GET_CONF_INFO() || {}) as UserConfInfo
    this.currentAccountInfo = (userConfInfo?.currentAccountInfo || {}) as User.AccountItem
    const accountId = this.currentAccountInfo?.id
    const currentAccountConf = accountId ? userConfInfo?.[accountId] : {}

    this.userConfInfo = userConfInfo
    this.openSymbolNameList = (currentAccountConf?.openSymbolNameList || []).filter((v) => v) as Account.TradeSymbolListItem[]
    this.activeSymbolName = currentAccountConf?.activeSymbolName as string
  }

  // 获取打开的品种完整信息
  getActiveSymbolInfo = (currentSymbolName?: string) => {
    const symbol = currentSymbolName || this.activeSymbolName
    const symbolList = this.symbolList
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
    this.activeSymbolName = key
    // STORAGE_SET_ACTIVE_SYMBOL_NAME(key)
    STORAGE_SET_CONF_INFO(key, `${this.currentAccountInfo?.id}.activeSymbolName`)

    // 重新订阅深度
    ws.subscribeDepth()
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
  // 根据账户id查询侧边栏菜单交易品种列表
  @action
  getSymbolList = async (params = {} as Partial<Account.TradeSymbolListParams>) => {
    // 查询全部
    if (params.classify === '0') {
      delete params.classify
    }
    const res = await getTradeSymbolList({ ...params, accountId: this.currentAccountInfo?.id })
    if (res.success) {
      const symbolList = (res.data || []) as Account.TradeSymbolListItem[]
      runInAction(() => {
        this.symbolList = symbolList
        // 查询全部的品种列表
        if (!params.classify) {
          this.symbolListAll = symbolList
        }

        // 切换accountId后请求的品种列表可能不一致，设置第一个默认的品种名称
        const firstSymbolName = symbolList[0]?.symbol
        // 如果当前激活的品种名称不在返回的列表中，则重新设置第一个为激活
        if (firstSymbolName && !symbolList.some((item) => item.symbol === this.activeSymbolName)) {
          this.activeSymbolName = firstSymbolName
        }
        // 设置默认的
        if (!this.openSymbolNameList.length) {
          this.setOpenSymbolNameList(firstSymbolName)
        }
      })

      // 动态获取到品种列表后在连接ws，默认查询全部的时候订阅
      if (!params?.accountId) {
        ws.reconnect()
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
    } else if (tabKey === 'STOPLOSS_PROFIT') {
      // 止盈止损
      this.getStopLossProfitList()
    }
  }

  // 查询持仓列表
  @action
  getPositionList = async () => {
    // 查询进行中的订单
    const res = await getBgaOrderPage({ current: 1, size: 999, status: 'BAG', accountId: this.currentAccountInfo?.id })
    if (res.success) {
      runInAction(() => {
        this.positionList = (res.data?.records || []) as Order.BgaOrderPageListItem[]
      })
    }
  }
  // 查询挂单列表
  @action
  getPendingList = async () => {
    const res = await getOrderPage({
      current: 1,
      size: 999,
      status: 'ENTRUST',
      type: 'LIMIT_BUY_ORDER,LIMIT_SELL_ORDER,STOP_LOSS_LIMIT_BUY_ORDER,STOP_LOSS_LIMIT_SELL_ORDER',
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
      type: 'STOP_LOSS_ORDER,TAKE_PROFIT_ORDERR',
      accountId: this.currentAccountInfo?.id
    })
    if (res.success) {
      runInAction(() => {
        this.stopLossProfitList = (res.data?.records || []) as Order.OrderPageListItem[]
      })
    }
  }
  // 查询历史成交列表
  @action
  getHistoryList = async () => {
    const res = await getTradeRecordsPage({ current: 1, size: 999, accountId: this.currentAccountInfo?.id })
    if (res.success) {
      runInAction(() => {
        this.historyCloseList = (res.data?.records || []) as Order.TradeRecordsPageListItem[]
      })
    }
  }
  // 查询历史挂单列表
  @action
  getHistoryPendingList = async () => {
    const res = await getOrderPage({
      current: 1,
      size: 999,
      status: 'CANCEL,FAIL,FINISH',
      type: 'LIMIT_BUY_ORDER,LIMIT_SELL_ORDER,STOP_LOSS_LIMIT_BUY_ORDER,STOP_LOSS_LIMIT_SELL_ORDER',
      accountId: this.currentAccountInfo?.id
    })
    if (res.success) {
      runInAction(() => {
        this.historyPendingList = (res.data?.records || []) as Order.OrderPageListItem[]
      })
    }
  }
  // 下单操作
  // 携带持仓订单号则为平仓单，只需要传递持仓单号、交易账户ID、订单数量、订单类型和反向订单方向，其他参数无效
  createOrder = async (params: Order.CreateOrder) => {
    const orderType = params.type
    const res = await createOrder(params)
    if (res.success) {
      // 市价单：买入卖出单
      if (['MARKET_ORDER'].includes(orderType)) {
        // 更新持仓列表
        this.getPositionList()
        // 携带持仓订单号则为平仓单
        if (params.bagOrderId) {
          message.info(getIntl().formatMessage({ id: 'mt.pingcangchenggong' }))
        } else {
          message.info(getIntl().formatMessage({ id: 'mt.kaicangchenggong' }))
        }
        // 激活Tab
        trade.setTabKey('POSITION')
      }
      // 限价买入卖出单、停损买入卖出单
      else if (['LIMIT_BUY_ORDER', 'LIMIT_SELL_ORDER', 'STOP_LOSS_LIMIT_BUY_ORDER', 'STOP_LOSS_LIMIT_SELL_ORDER'].includes(orderType)) {
        // 更新挂单列表
        this.getPendingList()
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
      this.getStopLossProfitList()

      message.info(getIntl().formatMessage({ id: 'mt.xiugaizhiyingzhisunchenggong' }))
      // 激活Tab
      trade.setTabKey('STOPLOSS_PROFIT')
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
      this.getStopLossProfitList()
      message.info(getIntl().formatMessage({ id: 'mt.cexiaochenggong' }))
    }
    return res
  }
}

const trade = new TradeStore()

export default trade
