// 业务相关工具

import { transferWeekDay } from '@/constants/enum'

import { getUid, groupBy } from '.'

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

  Object.keys(conf?.multiplier).forEach((key: any) => {
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
