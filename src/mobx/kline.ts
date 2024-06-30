// @ts-nocheck
import dayjs from 'dayjs'
import { action, makeAutoObservable, observable, runInAction } from 'mobx'
import NP from 'number-precision'

import { IChartingLibraryWidget } from '@/libs/charting_library'
import { request } from '@/utils/request'

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
  heartbeatInterval: any = null
  heartbeatTimeout = 20000 // 心跳间隔，单位毫秒
  socket: any = null
  tvWidget = null as IChartingLibraryWidget
  @observable socketState = 0
  @observable bars = []
  @observable activeSymbolInfo = {
    symbolInfo: {}
  }
  @observable loading = true
  @observable lastbar = {} // 最后一条k线数据
  @observable datafeedBarCallbackObj = {} // 记录getbars回调的参数
  @observable lastBarTime = '' // 记录最后一次时间，用于作为请求k线的截止时间

  updateKlineData(quotes: any) {
    const symbolInfo = this.activeSymbolInfo.symbolInfo
    if (symbolInfo && quotes) {
      const dataSourceSymbol = symbolInfo.dataSourceSymbol
      const data = quotes[dataSourceSymbol]
      if (data && data.symbol === dataSourceSymbol) {
        const resolution = this.activeSymbolInfo.resolution
        const precision = symbolInfo.precision
        // 通过ws更新k线数据
        const newLastBar = this.updateBar(data, { resolution, precision, symbolInfo })
        if (newLastBar) {
          // 实时更新k线数据，通过datefeed subscribeBars提供的onRealtimeCallback方法更新
          this.activeSymbolInfo.onRealtimeCallback?.(newLastBar)
          // 更新最后一条k线
          this.lastbar = newLastBar
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
    if (!lastBar) return
    let resolution = currentSymbol.resolution
    const serverTime = socketData?.priceData?.id / 1000 // 服务器返回的时间戳

    let rounded = serverTime
    const bid = socketData?.priceData?.sell

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
      newLastBar = {
        time: rounded * 1000,
        open: NP.round(bid, precision),
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
   * @returns
   */
  getHttpHistoryBars = async (symbolInfo, resolution, from, to, countBack) => {
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
      const res = await request('/api/trade-market/marketApi/public/symbol/klineList', {
        params: {
          symbol: symbolInfo.dataSourceSymbol, // 数据源品种
          dataSourceCode: symbolInfo.dataSourceCode, // 数据源code
          current: 1,
          size: 500, // 条数
          klineType, // 时间类型
          klineTime: to + 8 * 60 * 60 // 查询截止时间之前的k线数据
        }
      })
        .catch((e) => e)
        .finally(() => {
          runInAction(() => {
            this.loading = false
          })
        })
      const list = res?.data?.records || []
      if (list?.length) {
        const bars = list
          .map((item) => {
            const timeStamp = item.klineTime * 1000
            return {
              ...item,
              open: NP.round(item.open, precision),
              close: NP.round(item.close, precision),
              high: NP.round(item.high, precision),
              low: NP.round(item.low, precision),
              // volume: NP.round(item.vol, precision),
              time: timeStamp,
              mytime: dayjs(timeStamp).format('YYYY-MM-DD HH:mm:ss')
            }
          })
          .reverse() // 反转数据，按时间从大到小排序
        this.barList = bars
        return bars
      } else {
        return []
      }
    } catch (err) {
      console.log(err)
      // 请求加载出问题返回上一次有数据的
      return this.barList || []
    }
  }
  // datafeed getBars回调处理
  // 首次加载/切换分辨率/左右移动时间轴触发，http方式获取k线柱历史数据
  @action
  getDataFeedBarCallback = (obj = {}) => {
    const { symbolInfo, resolution, firstDataRequest, from, to, countBack } = obj
    this.datafeedBarCallbackObj = obj

    // 首次请求
    if (firstDataRequest) {
      this.getHttpHistoryBars(symbolInfo, resolution, from, to, countBack).then((bars) => {
        if (bars?.length) {
          this.datafeedBarCallbackObj.onHistoryCallback(bars, { noData: false })
          runInAction(() => {
            const lastbar = bars.at(-1) // 最后一个数据
            this.lastBarTime = bars[0]?.time / 1000 - 8 * 60 * 60 // 记录最后一次时间，用于作为请求k线的截止时间
            this.lastbar = lastbar
          })
        } else {
          this.datafeedBarCallbackObj.onHistoryCallback(bars, { noData: true })
        }
      })
    } else {
      this.getHttpHistoryBars(symbolInfo, resolution, from, this.lastBarTime, countBack).then((bars) => {
        if (bars?.length) {
          if (this.lastBarTime === bars[0]?.time / 1000 - 8 * 60 * 60) {
            this.datafeedBarCallbackObj.onHistoryCallback([], { noData: true })
          } else if (bars.length) {
            this.datafeedBarCallbackObj.onHistoryCallback(bars, { noData: false })
          }
          runInAction(() => {
            this.lastBarTime = bars[0]?.time / 1000 - 8 * 60 * 60 // 记录最后一次时间，用于作为请求k线的截止时间
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
}

const klineStore = new KlineStore()
export default klineStore
