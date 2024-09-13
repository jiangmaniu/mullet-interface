// 业务相关工具

import { getIntl, getLocale } from '@umijs/max'

import { TRADE_BUY_SELL, transferWeekDay } from '@/constants/enum'
import { stores } from '@/context/mobxProvider'
import ENV from '@/env'
import { IPositionItem } from '@/pages/web/trade/comp/TradeRecord/comp/PositionList'

import { formatMin2Time, formatNum, getUid, groupBy, isImageFile, parseJsonFields, toFixed } from '.'
import { calcForceClosePrice, calcYieldRate, covertProfit, getCurrentQuote } from './wsUtil'

//  =============

// 转换品种-交易时间配置-提交参数
export function transformTradeTimeSubmit(arr: any[]) {
  const result: any = {}

  arr.forEach((item: any) => {
    const weekDay = item.weekDay
    // 星期
    result[weekDay] = {
      // 是否启动独立时间段
      isAlone: item.isAlone,
      // 交易时间
      trade: groupBy(item.trade, 2).map((v: any) => ({
        start: v[0],
        end: v[1]
      })),
      // 报价时间
      price: groupBy(item.price, 2).map((v: any) => ({
        start: v[0],
        end: v[1]
      }))
    }
  })

  return JSON.stringify(result)
}

// 转换品种-交易时间配置-回显
export function transformTradeTimeShow(conf: any) {
  const result: any = []

  Object.keys(conf).forEach((key: string) => {
    result.push({
      // 星期
      weekDay: key,
      // 是否启动独立时间段
      isAlone: conf[key]?.isAlone,
      // 交易时间
      trade: (conf[key]?.trade || [])?.map((v: any) => [v.start, v.end]).flat(),
      // 报价时间
      price: (conf[key]?.price || [])?.map((v: any) => [v.start, v.end]).flat()
    })
  })

  return result
}

// 返回交易时间段 eg. 00:06-12:00,14:00-18:00
export const formatTimeStr = (time: number[]) => {
  return groupBy(time, 2)
    .map((v) => [`${formatMin2Time(v[0])}-${formatMin2Time(v[1])}`])
    .flat()
    .join(',') // 两个一组，分段区间的开始和结尾值
}

//  =============

// 转换品种-库存费-提交参数
export function transformTradeInventorySubmit(conf: Symbol.HoldingCostConf) {
  const multiplierSubmit: any = {}
  const multiplier: any = conf.multiplier || [] // 本地的数据格式

  console.log('库存费', conf)
  multiplier.forEach((item: any) => {
    multiplierSubmit[item.weekDay] = item.num
  })

  // 转换为接口需要的格式
  conf.multiplier = multiplierSubmit

  return JSON.stringify(conf || {})
}

// 转换品种-库存费-回显
export function transformTradeInventoryShow(conf: Symbol.HoldingCostConf) {
  const multiplierShow: any = [] // 回显的格式

  Object.keys(conf?.multiplier || {}).forEach((key: any) => {
    multiplierShow.push({
      // 星期
      weekDay: key,
      // 显示名称
      weekDayName: transferWeekDay(key),
      // 库存费乘数
      // @ts-ignore
      num: conf?.multiplier[key],
      id: getUid() // 需要一个唯一值id，否则编辑表格出错
    })
  })

  // 用新的格式覆盖接口返回的
  conf.multiplier = multiplierShow

  return conf
}

//  =============

// 转换品种-手续费配置-提交参数
export function transformTradeFeeSubmit(conf: Symbol.TransactionFeeConf) {
  // 手续费配置
  const transactionFeeConfType = conf?.type // 手续费范围类型字段
  const params = transactionFeeConfType
    ? {
        type: transactionFeeConfType,
        // @ts-ignore
        [transactionFeeConfType]: conf.table?.map((item: any) => {
          return {
            from: item.from,
            to: item.to,
            compute_mode: item.compute_mode,
            market_fee: item.market_fee,
            limit_fee: item.limit_fee,
            min_value: item?.maxMinMap?.min_value,
            max_value: item?.maxMinMap?.max_value
          }
        })
      }
    : {}

  return JSON.stringify(params)
}

// 转换品种-手续费配置-回显
export function transformTradeFeeShow(conf: Symbol.TransactionFeeConf) {
  const type = conf?.type
  const trade_hand = conf?.trade_hand
  const trade_vol = conf?.trade_vol
  const list = type === 'trade_hand' ? trade_hand : trade_vol
  // @ts-ignore
  // table是传给表格回显的
  conf.table = list?.map((item) => {
    return {
      ...item,
      id: getUid(), // 需要一个唯一值id，否则编辑表格出错
      maxMinMap: {
        // 用于显示在表格上的范围值，一个输入框 对应两个值
        min_value: item.min_value,
        max_value: item.max_value
      }
    }
  })
  return conf
}

// ============

// 转换品种-预付款配置-提交参数
export function transformTradePrepaymentConfSubmit(conf: Symbol.PrepaymentConf) {
  // 处理浮动杠杆参数
  if (conf?.float_leverage?.length) {
    conf.float_leverage = conf.float_leverage
      .filter((item: any) => item.leverage_multiple)
      .map((item: any) => {
        return {
          leverage_multiple: item.leverage_multiple,
          nominal_start_value: item?.maxMinMap?.nominal_start_value,
          nominal_end_value: item?.maxMinMap?.nominal_end_value
        }
      })
  }
  return JSON.stringify(conf || {})
}

// 转换品种-预付款配置-回显
export function transformTradePrepaymentConfShow(conf: Symbol.PrepaymentConf) {
  // 自定义杠杆表格回显
  const float_leverage = conf?.float_leverage
  if (float_leverage?.length) {
    // @ts-ignore
    conf.float_leverage = float_leverage.map((item) => {
      return {
        ...item,
        id: getUid(), // 需要一个唯一值id，否则编辑表格出错
        maxMinMap: {
          // 用于显示在表格上的范围值，一个输入框 对应两个值
          nominal_start_value: item.nominal_start_value,
          nominal_end_value: item.nominal_end_value
        }
      }
    })
  }
  return conf
}

/**
 * 格式化对象里面的多选字段
 * @param fields 字段
 * @param obj 对象
 * @returns
 */
export const formatMultipleValue = (fields: string[], obj: any) => {
  if (!fields?.length) return
  const result: any = {}
  fields.forEach((key) => {
    result[key] = obj[key]?.split(',') || []
  })
  return {
    ...obj,
    ...result
  }
}

/**
 * 格式化多选参数
 * @param value
 * @returns
 */
export const formatMultipleValueSubmit = (value: any) => {
  if (Array.isArray(value)) {
    return value.join(',')
  }
  return value
}

// 格式化品种配置详情
export const formatSymbolConf = (data: any) => {
  let symbolConf = data
  if (symbolConf) {
    // 字符串对象转对象
    symbolConf = parseJsonFields(symbolConf, [
      'spreadConf', // 点差配置
      'prepaymentConf', // 预付款配置
      'tradeTimeConf', // 交易时间配置
      'quotationConf', // 报价配置
      'transactionFeeConf', // 手续费配置
      'holdingCostConf' // 库存费配置
    ])
    // 格式化多选字段，转化为数组
    symbolConf = formatMultipleValue(['orderType'], symbolConf)

    // 预付款配置回显处理
    const prepaymentConf = symbolConf?.prepaymentConf as unknown as Symbol.PrepaymentConf
    if (prepaymentConf) {
      // @ts-ignore
      symbolConf.prepaymentConf = transformTradePrepaymentConfShow(prepaymentConf)
    }

    // 库存费配置回显处理
    const holdingCostConf = symbolConf?.holdingCostConf as unknown as Symbol.HoldingCostConf
    if (holdingCostConf) {
      // @ts-ignore
      symbolConf.holdingCostConf = transformTradeInventoryShow(holdingCostConf)
    }

    // 交易时间配置回显处理
    const tradeTimeConf = symbolConf?.tradeTimeConf as unknown as Symbol.TradeTimeConf
    if (tradeTimeConf) {
      // @ts-ignore
      symbolConf.tradeTimeConf = transformTradeTimeShow(tradeTimeConf)
    }

    // 手续费配置回显处理
    const transactionFeeConf = symbolConf?.transactionFeeConf as unknown as Symbol.TransactionFeeConf
    if (transactionFeeConf) {
      // @ts-ignore
      symbolConf.transactionFeeConf = transformTradeFeeShow(transactionFeeConf)
    }
  }
  return symbolConf
}

/**
 * 获取默认品种图片地址
 * @param imgUrl 图片地址
 * @returns
 */
export const getSymbolIcon = (imgUrl: any) => {
  return isImageFile(imgUrl) ? `${ENV.imgDomain}${imgUrl}` : `/img/default-symbol-icon.png`
}

/**
 * 获取买卖、保证金文字提示和颜色
 * @param item
 * @returns
 */
export const getBuySellInfo = (item: any) => {
  const intl = getIntl()
  const mode = item?.conf?.prepaymentConf?.mode
  const isFixedMargin = mode === 'fixed_margin' // 固定保证金
  const isBuy = item.buySell === TRADE_BUY_SELL.BUY
  const buySellText = isBuy ? intl.formatMessage({ id: 'mt.mairu' }) : intl.formatMessage({ id: 'mt.maichu' })

  let marginTypeText = ''
  if (item.marginType) {
    marginTypeText =
      item.marginType === 'CROSS_MARGIN' ? intl.formatMessage({ id: 'mt.quancang' }) : intl.formatMessage({ id: 'mt.zhucang' })
  }
  const fixedMarginText = isFixedMargin ? intl.formatMessage({ id: 'mt.guding' }) : ''
  const leverageMultiple = item.leverageMultiple
  const leverageText = leverageMultiple ? `${leverageMultiple}X` : fixedMarginText

  let text = buySellText

  if (leverageText) {
    text += ` · ${leverageText}`
  }

  return {
    text,
    buySellText,
    marginTypeText,
    colorClassName: isBuy ? 'text-green' : 'text-red'
  }
}

/**
 * 根据字典的value拆分语言，根据当前切换的语言
 * @param value 字典的value值
 */
export const getDictLabelByLocale = (value: string) => {
  const [zh, en] = (value || '').split(',')
  return getLocale() === 'zh-TW' ? zh : en || zh
}

// ========= 计算持仓单信息 ============
export const calcPositionList = (list: IPositionItem[]) => {
  const { trade } = stores
  if (list.length === 0) return []
  return list.map((v) => {
    {
      const accountGroupPrecision = trade.currentAccountInfo.currencyDecimal
      const conf = v.conf as Symbol.SymbolConf
      const symbol = v.symbol as string
      const contractSize = conf.contractSize || 0
      const quoteInfo = getCurrentQuote(symbol)
      const digits = v.symbolDecimal || 2
      const currentPrice = v.buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.bid : quoteInfo?.ask // 价格需要取反方向的
      const isCrossMargin = v.marginType === 'CROSS_MARGIN'

      if (isCrossMargin) {
        // 全仓单笔保证金 = (开盘价 * 合约大小 * 手数) / 杠杆
        // 如果没有设置杠杆，读后台配置的杠杆
        const prepaymentConf = conf?.prepaymentConf as Symbol.PrepaymentConf
        const leverage = prepaymentConf?.mode === 'fixed_leverage' ? prepaymentConf?.fixed_leverage?.leverage_multiple : 0
        const leverageMultiple = v.leverageMultiple || leverage
        const initialMargin = prepaymentConf?.mode === 'fixed_margin' ? prepaymentConf?.fixed_margin?.initial_margin : 0 // 读后台初始预付款的值

        // 存在杠杆
        if (leverageMultiple) {
          v.orderMargin = toFixed((Number(v.startPrice) * contractSize * Number(v.orderVolume)) / leverageMultiple, digits)
        } else {
          // 固定保证金 * 手数
          v.orderMargin = toFixed(Number(initialMargin) * Number(v.orderVolume || 0), digits)
        }
      } else {
        // 逐仓保证金
        // v.orderMargin = toFixed(v.orderMargin, digits)
      }

      v.currentPrice = currentPrice // 现价
      const profit = covertProfit(v) as number // 浮动盈亏

      const [exchangeSymbol, exchangeRate] = (v.marginExchangeRate || '').split(',')
      // v.orderMargin =
      //   v.marginType === 'CROSS_MARGIN'
      //     ? calcOrderMarginExchangeRate({
      //         value: v.orderMargin,
      //         exchangeSymbol,
      //         exchangeRate
      //       })
      //     : v.orderMargin
      // 全仓使用基础保证金
      v.orderMargin = v.marginType === 'CROSS_MARGIN' ? v.orderBaseMargin : v.orderMargin

      v.profit = profit
      v.profitFormat = Number(v.profit) ? formatNum(v.profit, { precision: 3 }) : v.profit || '-' // 格式化的
      v.profitFormat = v.profit > 0 ? `+${v.profitFormat}` : v.profitFormat
      v.startPrice = toFixed(v.startPrice, digits) // 开仓价格格式化
      v.yieldRate = calcYieldRate(v, accountGroupPrecision) // 收益率
      v.forceClosePrice = calcForceClosePrice(v) // 强平价
      v.takeProfit = toFixed(v.takeProfit, digits) // 止盈价
      v.stopLoss = toFixed(v.stopLoss, digits) // 止损价
      v.handlingFees = toFixed(v.handlingFees, digits)
      v.interestFees = toFixed(v.interestFees, digits)

      return v
    }
  })
}
