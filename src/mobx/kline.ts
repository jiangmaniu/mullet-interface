// @ts-nocheck
import { isPCByWidth } from '@/utils'
import dayjs from 'dayjs'
import { action, makeAutoObservable, observable, runInAction, toJS } from 'mobx'
import NP from 'number-precision'

import { IChartingLibraryWidget } from '@/libs/charting_library'
import mitt from '@/utils/mitt'
import { request } from '@/utils/request'

import { stores } from '@/context/mobxProvider'
import { getEnv } from '@/env'
import { STORAGE_GET_TRADINGVIEW_RESOLUTION } from '@/utils/storage'
import { IQuoteItem } from './ws.types'

NP.enableBoundaryChecking(false)

const isDev = process.env.NODE_ENV === 'development'

function log(...args) {
  const timestamp = new Date().toISOString()
  if (isDev) {
    console.log(`[${timestamp}]`, ...args)
  }
}

class KlineStore {
  constructor() {
    makeAutoObservable(this)
  }
  tvWidget = null as IChartingLibraryWidget
  @observable bars = []
  @observable activeSymbolInfo = {
    symbolInfo: {}
  }
  @observable loading = true
  @observable switchSymbolLoading = false // 切换品种状态
  @observable lastbar = {} // 最后一条k线数据
  @observable datafeedBarCallbackObj = {} // 记录getbars回调的参数
  @observable lastBarTime = '' // 记录最后一次时间，用于作为请求k线的截止时间
  @observable isChartLoading = true // 图表是否加载中，直到完成
  @observable klineDataCacheMap = new Map<string, MarketSymbol.SymbolKlineOptimizeListItem>() // k线数据map

  @action
  setSwitchSymbolLoading = (flag: boolean) => {
    this.switchSymbolLoading = flag
  }

  @action
  setIsChartLoading = (flag: boolean) => {
    this.isChartLoading = flag
  }

  // 获取当前激活品种的kline缓存KEY
  getActiveSymbolCacheKey = () => {
    const resolution = STORAGE_GET_TRADINGVIEW_RESOLUTION() || '1'
    const cacheKey = `${stores.trade.activeSymbolName}-${resolution}`
    return cacheKey
  }

  // 获取当前激活品种的kline缓存数据
  getActiveSymbolKlineData = () => {
    const cacheKey = this.getActiveSymbolCacheKey()
    return this.klineDataCacheMap.get(cacheKey)
  }

  // 重置当前品种的k线历史数据缓存
  @action
  resetKlineCacheData = () => {
    const cacheKey = this.getActiveSymbolCacheKey()
    // 重置数据
    this.klineDataCacheMap.set(cacheKey, undefined)
  }

  // 强制刷新k线数据
  @action
  forceRefreshKlineData = () => {
    if (!isPCByWidth()) {
      // 重置数据
      this.resetKlineCacheData()
    }

    if (!this.tvWidget) return

    // @ts-ignore
    this.activeSymbolInfo.onResetCacheNeededCallback?.() // 重置缓存
    setTimeout(() => {
      this.tvWidget.activeChart().resetData() // 重置数据
    }, 100)
  }

  refreshKline = (resolution: string) => {
    // 每隔一分钟强制刷新k线数据，避免绘制错误，和后台数据同步校对一下
    const now = Date.now() / 1000
    const lastBarTime = this.lastbar.time / 1000
    const seconds = Math.round(now - lastBarTime)

    // 正好等于60s刷新一次
    if (resolution === '1' && seconds === 60) {
      // 强制刷新
      setTimeout(() => {
        this.forceRefreshKlineData()
      }, 2000)
    }
  }

  @action
  updateKlineData(quotes: Map<string, IQuoteItem>) {
    const symbolInfo = this.activeSymbolInfo.symbolInfo
    if (symbolInfo && quotes.size) {
      const symbol = symbolInfo.name
      // const dataSourceCode = symbolInfo.dataSourceCode
      // const data = quotes.get(`${dataSourceCode}/${symbol}`)
      const accountGroupId = symbolInfo.accountGroupId
      const data = quotes.get(`${accountGroupId}/${symbol}`)
      // 追加当前行情的最新一条跟页面显示的保持一致
      const klineList = [...toJS(data?.klineList || []), { id: data?.priceData?.id, price: data?.priceData?.buy }].filter(
        (item) => item.price
      )
      // 只更新当前激活的品种
      if (data && data.symbol === symbol && symbol === stores.trade.activeSymbolName) {
        const resolution = this.activeSymbolInfo.resolution
        const precision = symbolInfo.precision
        for (const rawItem of klineList) {
          // 兼容结构
          const item = {
            priceData: {
              buy: rawItem?.price,
              id: rawItem?.id
            }
          }
          // 通过ws更新k线数据
          const newLastBar = this.updateBar(item, { resolution, precision, symbolInfo })
          if (newLastBar) {
            // 实时更新k线数据，通过datefeed subscribeBars提供的onRealtimeCallback方法更新
            this.activeSymbolInfo.onRealtimeCallback?.(newLastBar)
            // 更新最后一条k线
            runInAction(() => {
              this.lastbar = newLastBar
            })

            // this.refreshKline(resolution)
          }
        }
      }
    }
  }

  // 更新最后一条k线段
  @action
  updateBar = (socketData, currentSymbol) => {
    let newLastBar
    const precision = currentSymbol.precision
    const lastBar = this.lastbar
    if (!lastBar.time) return
    let resolution = currentSymbol.resolution

    const refreshResolution = ['1'].includes(resolution) // 1/5/15分钟k线以当前时间为基准(服务器推送的时间会有几秒不等延迟)，其他以服务器时间为基准
    // const serverTime = refreshResolution ? Date.now() / 1000 : socketData?.priceData?.id / 1000 // 服务器返回的时间戳
    const serverTime = socketData?.priceData?.id / 1000 // 服务器返回的时间戳

    let rounded = serverTime
    const bid = socketData?.priceData?.buy // 买盘卖价（相对于买价是低价） 没有加点差的价格 历史k线也是没有加点差的

    if (!resolution) return

    if (!isNaN(resolution) || resolution.includes('D')) {
      if (resolution.includes('D')) {
        resolution = 1440
      }
      const coeff = resolution * 60
      rounded = Math.floor(serverTime / coeff) * coeff // 确保时间戳被正确舍入到对应的时间段
    } else if (resolution.includes('W')) {
      rounded =
        dayjs(serverTime * 1000)
          .day(0) // 将时间舍入到该周的开始（星期天的凌晨 12 点）
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
          .valueOf() / 1000
    } else if (resolution.includes('M')) {
      rounded =
        dayjs(serverTime * 1000)
          .date(1) // 将时间舍入到该月的第一天的凌晨 12 点
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
          .valueOf() / 1000
    }
    const lastBarSec = lastBar.time / 1000

    if (rounded > lastBarSec) {
      const currentTime = rounded * 1000
      const currentOpenPrice = NP.round(bid, precision) // 当前行情价格作为开盘价格
      const lastBarOpenPrice = NP.round(lastBar.close, precision) // 上一根k线的收盘价格作为开盘价格

      let open = 0
      if (resolution === '1') {
        // 1分钟K线 11:30收盘 13:30开盘 这种间隔大于1分钟的 则当前画的这根k线开盘价取这一刻的价格
        // 如果是连续的则当前画的这根k线开盘价取上一根k线的收盘价
        open = Math.abs(currentTime - lastBar.time) / 1000 === 60 ? lastBarOpenPrice : currentOpenPrice
      } else {
        open = NP.round(lastBar.open, precision)
      }
      newLastBar = {
        time: currentTime,
        open: currentOpenPrice, // 使用当前行情价格作为开盘价
        high: NP.round(bid, precision),
        low: NP.round(bid, precision),
        close: NP.round(bid, precision)
      }

      // log('新建k线', newLastBar)
    } else {
      newLastBar = {
        time: lastBar.time,
        open: lastBar.open,
        high: NP.round(Math.max(lastBar.high, bid), precision),
        low: NP.round(Math.min(lastBar.low, bid), precision),
        close: NP.round(bid, precision)
      }
      // log('更新k线', newLastBar)
    }

    return newLastBar
  }
  /**
   *通过http获取k线历史数据
   * @param symbolInfo 品种信息
   * @param resolution 分辨率
   * @param from 开始时间戳
   * @param to 结束时间戳
   * @param countBack
   * @param firstDataRequest 首次请求
   * @returns
   */
  getHttpHistoryBars = async (symbolInfo, resolution, from, to, countBack, firstDataRequest) => {
    const ENV = getEnv()
    const precision = symbolInfo.precision
    const klineType =
      {
        1: '1min',
        5: '5min',
        15: '15min',
        30: '30min',
        60: '60min',
        240: '4hour',
        '1D': '1day',
        '1W': '1week',
        '1M': '1mon',
        '1Y': '1year'
      }[resolution] || '1min'

    // const symbolName = [
    //   ...stringToBin(symbolInfo.name, 12),
    //   ...intToBin(resolutionToMin),
    //   ...intToBin(300), // 请求返回多少个数据
    //   ...intToBin(0),
    //   ...intToBin(to + 8 * 60 * 60)
    // ]
    // const b = Base64.btoa(
    //   quoteUtil.stringToBin(symbolInfo.mtName || symbolInfo.name, 12) + // 品种
    //     quoteUtil.intToBin(resolutionToMin) + // K线周期
    //     quoteUtil.intToBin(countBack) + // 请求返回多少个数据
    //     quoteUtil.timeToBin(to + 8 * 60 * 60) +
    //     quoteUtil.timeToBin(0)
    // )
    try {
      if (!to) {
        return this.bars
      }
      // const cacheData = this.getActiveSymbolKlineData()
      // if (cacheData && firstDataRequest) {
      //   return cacheData
      // }
      const res = await request('/api/trade-market/marketApi/kline/symbol/klineList', {
        params: {
          symbol: symbolInfo.symbol, // 品种
          first: firstDataRequest, // 标识是否首次请求
          current: 1,
          size: isPCByWidth() ? 500 : 200, // 条数
          klineType, // 时间类型
          // klineTime: to + 8 * 60 * 60 // 查询截止时间之前的k线数据
          klineTime: to * 1000 // 数据库存的都是零时区的，查询参数也必须是零时区
        }
      })
        .catch((e) => e)
        .finally(() => {
          runInAction(() => {
            this.loading = false
          })
        })
      const list = res?.data || []
      if (list?.length) {
        const bars = list
          .map((item) => {
            // 时间,开,高,低,收
            const [klineTime, open, high, low, close] = (item || '').split(',')
            const timeStamp = Number(klineTime)
            return {
              open: NP.round(open, precision),
              close: NP.round(close, precision),
              high: NP.round(high, precision),
              low: NP.round(low, precision),
              // volume: NP.round(vol, precision),
              time: timeStamp,
              mytime: dayjs(timeStamp).format('YYYY-MM-DD HH:mm:ss')
            }
          })
          .reverse() // 反转数据，按时间从大到小排序
        runInAction(() => {
          this.bars = bars
        })

        return bars
      } else {
        return []
      }
    } catch (err) {
      console.log(err)
      // 请求加载出问题返回上一次有数据的
      return this.bars || []
    }
  }
  // datafeed getBars回调处理
  // 首次加载/切换分辨率/左右移动时间轴触发，http方式获取k线柱历史数据
  @action
  getDataFeedBarCallback = (obj = {}) => {
    const ENV = getEnv()
    const { symbolInfo, resolution, firstDataRequest, from, to, countBack } = obj

    runInAction(() => {
      this.datafeedBarCallbackObj = obj
    })

    // 首次请求
    if (firstDataRequest) {
      this.getHttpHistoryBars(symbolInfo, resolution, from, to, countBack, firstDataRequest).then((bars) => {
        if (bars?.length) {
          this.datafeedBarCallbackObj.onHistoryCallback(bars, { noData: false })
          runInAction(() => {
            const lastbar = bars.at(-1) // 最后一个数据
            // this.lastBarTime = bars[0]?.time / 1000 - 8 * 60 * 60 // 记录最后一次时间，用于作为请求k线的截止时间
            this.lastBarTime = bars[0]?.time / 1000
            this.lastbar = lastbar
          })
        } else {
          this.datafeedBarCallbackObj.onHistoryCallback(bars, { noData: true })
        }
      })
    } else {
      this.getHttpHistoryBars(symbolInfo, resolution, from, this.lastBarTime, countBack, firstDataRequest).then((bars) => {
        if (bars?.length) {
          // if (this.lastBarTime === bars[0]?.time / 1000 - 8 * 60 * 60) {
          if (this.lastBarTime === bars[0]?.time / 1000) {
            this.datafeedBarCallbackObj.onHistoryCallback([], { noData: true })
          } else if (bars.length) {
            this.datafeedBarCallbackObj.onHistoryCallback(bars, { noData: false })
          }
          runInAction(() => {
            // this.lastBarTime = bars[0]?.time / 1000 - 8 * 60 * 60 // 记录最后一次时间，用于作为请求k线的截止时间
            this.lastBarTime = bars[0]?.time / 1000
          })
        } else {
          this.datafeedBarCallbackObj.onHistoryCallback(bars, { noData: true })
        }
      })
    }
  }

  // 记录tvWidget初始化实例
  @action
  setTvWidget = (tvWidget: IChartingLibraryWidget) => {
    this.tvWidget = tvWidget
  }

  // 记录当前的symbol
  @action
  setActiveSymbolInfo = (data) => {
    this.activeSymbolInfo = {
      ...this.activeSymbolInfo,
      ...data
    }
  }

  // 取消订阅，暂不处理
  removeActiveSymbol = (subscriberUID) => {
    if (this.activeSymbolInfo.subscriberUID === subscriberUID) {
    }
  }

  // 重置实例
  @action
  destroyed = () => {
    // 等待图表加载完成再关闭,否则销毁实例会导致之前未加载完成的实例报错
    if (this.isChartLoading) {
      return
    }
    if (this.tvWidget) {
      this.tvWidget.remove?.()
      // 重置tradingview实例，否则报错
      runInAction(() => {
        this.tvWidget = null as any
      })
    }

    // 重置变量，避免重置了k线，内存还占用
    runInAction(() => {
      this.bars = []
      this.activeSymbolInfo = {}
      this.lastbar = {}
      this.datafeedBarCallbackObj = {}
      this.lastBarTime = ''
    })
    window.tvWidget = null

    // 取消事件订阅
    mitt.off('symbol_change')
  }
}

const klineStore = new KlineStore()
export default klineStore
