import { gray, red, yellow } from '@/pages/webapp/theme/colors'
import { t } from '@/libs/lingui/react/macro'
import { getLocale as getMaxLocale } from '@umijs/max'

export enum Language {
  'en-US' = 'en-US', // 英语
  'zh-TW' = 'zh-TW', // 台湾繁体
  'vi-VN' = 'vi-VN' // 越南语
}
export const LanguageMap: Record<string, any> = {
  'en-US': {
    key: 'en-US',
    label: 'EN',
    icon: '🇺🇸'
  },
  'vi-VN': {
    key: 'vi-VN',
    label: 'VN',
    icon: '🇻🇳'
  },
  'zh-TW': {
    key: 'zh-TW',
    label: 'ZH',
    icon: '🇨🇳'
  }
}

export type ILanguage = 'en-US' | 'zh-TW' | 'vi-VN'

export const SUPPORTED_LANGUAGES = ['zh-TW', 'en-US', 'vi-VN']

// 传给后台的值，转化一下
export const LanuageTransformMap: Record<ILanguage, string> = {
  'zh-TW': 'zh-TW',
  'en-US': 'en-US',
  'vi-VN': 'vi-VN'
}

// 获取k线对应的语言
export const getTradingViewLng = () => {
  const langMap = {
    'zh-TW': 'zh_TW', // 中文繁体
    'en-US': 'en', // 英文
    'vi-VN': 'vi' // 越南语
  }

  return langMap[getMaxLocale() as ILanguage] || 'en'
}

export const getLocaleForBackend = () => LanuageTransformMap[getMaxLocale() as ILanguage]

// 转换星期文本
export type IWeekDay = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
export const transferWeekDay = (weekDay: IWeekDay): string => {
  const weekDayMap: Record<IWeekDay, string> = {
    MONDAY: t`周一`,
    TUESDAY: t`周二`,
    WEDNESDAY: t`周三`,
    THURSDAY: t`周四`,
    FRIDAY: t`周五`,
    SATURDAY: t`周六`,
    SUNDAY: t`周日`
  }

  return weekDayMap[weekDay]
}

// 订单类型
export const ORDER_TYPE = {
  /**市价单 */
  MARKET_ORDER: 'MARKET_ORDER',
  /**限价买入单 */
  LIMIT_BUY_ORDER: 'LIMIT_BUY_ORDER',
  /**限价卖出单 */
  LIMIT_SELL_ORDER: 'LIMIT_SELL_ORDER',
  /**止损限价买入单 */
  STOP_LOSS_LIMIT_BUY_ORDER: 'STOP_LOSS_LIMIT_BUY_ORDER',
  /**止损限价卖出单 */
  STOP_LOSS_LIMIT_SELL_ORDER: 'STOP_LOSS_LIMIT_SELL_ORDER',
  /**止损市价买入单 */
  STOP_LOSS_MARKET_BUY_ORDER: 'STOP_LOSS_MARKET_BUY_ORDER',
  /**止损市价卖出单 */
  STOP_LOSS_MARKET_SELL_ORDER: 'STOP_LOSS_MARKET_SELL_ORDER',
  /**止损单 */
  STOP_LOSS_ORDER: 'STOP_LOSS_ORDER',
  /**止盈单 */
  TAKE_PROFIT_ORDER: 'TAKE_PROFIT_ORDER'
}

// 买卖交易方向
export const TRADE_BUY_SELL = {
  /**买方向 */
  BUY: 'BUY',
  /**买方向 */
  SELL: 'SELL'
}

export const Enums = {
  // 启用、禁用状态
  Status: {
    DISABLED: { key: 'common.enum.Status.DISABLED' },
    ENABLE: { key: 'common.enum.Status.ENABLE' }
  },
  // 认证状态
  ApproveStatus: {
    TODO: { key: 'common.enum.ApproveStatus.TODO' },
    CANCEL: { key: 'common.enum.ApproveStatus.CANCEL' },
    Disallow: { key: 'common.enum.ApproveStatus.FAIL' },
    SUCCESS: { key: 'common.enum.ApproveStatus.SUCCESS' }
  },
  // 证件类型
  IdentificationType: {
    ID_CARD: { key: 'common.enum.IdentificationType.ID_CARD' },
    PASSPORT: { key: 'common.enum.IdentificationType.PASSPORT' }
  },
  // 银行卡类型
  BankCardType: {
    DEBIT_CARD: { key: 'common.enum.BankCardType.DEBIT_CARD' },
    CREDIT_CARD: { key: 'common.enum.BankCardType.CREDIT_CARD' }
  },
  // 交易方向类型：只有两种 买、卖
  TradeBuySell: {
    BUY: { key: 'common.enum.TradeBuySell.BUY' },
    SELL: { key: 'common.enum.TradeBuySell.SELL' }
  },
  // 订单类型
  OrderType: {
    MARKET_ORDER: { value: 10, key: 'common.enum.OrderType.MARKET_ORDER' },
    STOP_LOSS_ORDER: { value: 20, key: 'common.enum.OrderType.STOP_LOSS_ORDER' },
    TAKE_PROFIT_ORDER: {
      value: 30,
      key: 'common.enum.OrderType.TAKE_PROFIT_ORDER'
    },
    LIMIT_BUY_ORDER: { value: 40, key: 'common.enum.OrderType.LIMIT_BUY_ORDER' },
    LIMIT_SELL_ORDER: { value: 50, key: 'common.enum.OrderType.LIMIT_SELL_ORDER' },
    STOP_LOSS_LIMIT_BUY_ORDER: {
      value: 60,
      key: 'common.enum.OrderType.STOP_LOSS_LIMIT_BUY_ORDER'
    },
    STOP_LOSS_LIMIT_SELL_ORDER: {
      value: 70,
      key: 'common.enum.OrderType.STOP_LOSS_LIMIT_SELL_ORDER'
    },
    STOP_LOSS_MARKET_BUY_ORDER: {
      value: 80,
      key: 'common.enum.OrderType.STOP_LOSS_MARKET_BUY_ORDER'
    },
    STOP_LOSS_MARKET_SELL_ORDER: {
      value: 90,
      key: 'common.enum.OrderType.STOP_LOSS_MARKET_BUY_ORDER'
    }
  },
  // 订单状态
  OrderStatus: {
    CANCEL: { key: 'common.enum.OrderStatus.CANCEL' },
    ENTRUST: { key: 'common.enum.OrderStatus.ENTRUST' },
    FAIL: { key: 'common.enum.OrderStatus.FAIL' },
    FINISH: { key: 'common.enum.OrderStatus.FINISH' }
  },
  // 订单成交方向
  OrderInOut: {
    IN: { key: 'common.enum.OrderInOut.IN' },
    OUT: { key: 'common.enum.OrderInOut.OUT' }
  },
  // 持仓单状态
  BGAStatus: {
    BAG: { key: 'common.enum.BGAStatus.BAG' },
    FINISH: { key: 'common.enum.BGAStatus.FINISH' }
  },
  // 保证金类型
  MarginType: {
    CROSS_MARGIN: { key: 'common.enum.MarginType.CROSS_MARGIN' },
    ISOLATED_MARGIN: { key: 'common.enum.MarginType.ISOLATED_MARGIN' }
  },
  // 客户管理-交易账号-结余-表格-类型
  CustomerBalanceRecordType: {
    DEPOSIT: { key: 'common.enum.BalanceType.DEPOSIT' },
    DEPOSIT_SIMULATE: { key: 'common.enum.BalanceType.DEPOSIT_SIMULATE' },
    WITHDRAWAL: { key: 'common.enum.BalanceType.WITHDRAWAL' },
    MARGIN: { key: 'common.enum.BalanceType.MARGIN' },
    PROFIT: { key: 'common.enum.BalanceType.PROFIT' },
    GIFT: { key: 'common.enum.BalanceType.GIFT' },
    BALANCE: { key: 'common.enum.BalanceType.BALANCE' },
    TRANSFER: { key: 'common.enum.BalanceType.TRANSFER' },
    ZERO: { key: 'common.enum.BalanceType.ZERO' },
    FOLLOW_PROFIT: { key: 'common.enum.BalanceType.FOLLOW_PROFIT' },
    HANDLING_FEES: { key: 'common.enum.BalanceType.HANDLING_FEES' },
    INTEREST_FEES: { key: 'common.enum.BalanceType.INTEREST_FEES' },
    BACK: { key: 'mt.tixiantuihui' }
  }
}

// 业务枚举
export const getEnum = () => {
  //  ============= 业务枚举值 ================
  // 使用text形式命名，方便表格 valueEnum 消费
  const Enum = {
    // 启用、禁用状态
    Status: {
      DISABLED: { text: t`禁用` },
      ENABLE: { text: t`启用` }
    },
    // 认证状态
    ApproveStatus: {
      TODO: { text: t`待审核`, color: yellow['560'] },
      CANCEL: { text: t`取消`, color: gray['900'] },
      Disallow: { text: t`审核失败`, color: red['600'] },
      SUCCESS: { text: t`已认证`, color: gray['900'] }
    },
    // 证件类型
    IdentificationType: {
      ID_CARD: { text: t`身份证` },
      PASSPORT: { text: t`护照` }
    },
    // 银行卡类型
    BankCardType: {
      DEBIT_CARD: { text: t`储蓄卡` },
      CREDIT_CARD: { text: t`信用卡` }
    },
    // 交易方向类型：只有两种 买、卖
    TradeBuySell: {
      BUY: { text: t`买入` },
      SELL: { text: t`卖出` }
    },
    // 订单类型
    OrderType: {
      MARKET_ORDER: { text: t`市价`, value: 10 },
      STOP_LOSS_ORDER: { text: t`止损单`, value: 20 },
      TAKE_PROFIT_ORDER: { text: t`止盈单`, value: 30 },
      LIMIT_BUY_ORDER: { text: t`限价买入单`, value: 40 },
      LIMIT_SELL_ORDER: { text: t`限价卖出单`, value: 50 },
      STOP_LOSS_LIMIT_BUY_ORDER: { text: t`止损限价买入单`, value: 60 },
      STOP_LOSS_LIMIT_SELL_ORDER: { text: t`止损限价卖出单`, value: 70 },
      STOP_LOSS_MARKET_BUY_ORDER: { text: t`止损市价买入单`, value: 80 },
      STOP_LOSS_MARKET_SELL_ORDER: { text: t`止损市价卖出单`, value: 90 }
    },
    // 订单状态
    OrderStatus: {
      CANCEL: { text: t`已撤销` },
      ENTRUST: { text: t`委托中` },
      FAIL: { text: t`失败` },
      FINISH: { text: t`已成交` }
    },
    // 订单成交方向
    OrderInOut: {
      IN: { text: t`建仓` },
      OUT: { text: t`平仓` }
    },
    // 持仓单状态
    BGAStatus: {
      BAG: { text: t`持仓中` },
      FINISH: { text: t`已完成` }
    },
    // 保证金类型
    MarginType: {
      CROSS_MARGIN: { text: t`全仓` },
      ISOLATED_MARGIN: { text: t`逐仓` }
    },
    // 客户管理-交易账号-结余-表格-类型
    CustomerBalanceRecordType: {
      DEPOSIT: { text: t`充值` },
      DEPOSIT_SIMULATE: { text: t`模拟充值` },
      WITHDRAWAL: { text: t`提现` },
      MARGIN: { text: t`保证金` },
      PROFIT: { text: t`盈亏` },
      BALANCE: { text: t`结余` },
      TRANSFER: { text: t`转账` },
      HANDLING_FEES: { text: t`手续费` },
      INTEREST_FEES: { text: t`库存费` },
      FEE: { text: t`手续费` },
      ACTIVITY: { text: t`首充活动` }
    },
    // 可用预付款
    UsableAdvanceCharge: {
      NOT_PROFIT_LOSS: { text: t`不计算未实现盈亏` },
      PROFIT_LOSS: { text: t`计算未实现盈亏` }
    },
    // 出金订单状态
    PaymentWithdrawalOrderStatus: {
      SUCCESS: { text: t`审核通过` },
      RECEIPT: { text: t`已到账` },
      WAIT: { text: t`转账中` },
      REJECT: { text: t`拒绝` },
      FAIL: { text: t`失败` }
    }
  }

  //  ============= 枚举对象转options数组选项 ================
  const enumToOptions = (enumKey: keyof typeof Enum, valueKey?: string) => {
    const options: Array<{ value: any; label: string }> = []
    const enumObj = Enum[enumKey] as any

    Object.keys(enumObj).forEach((key) => {
      options.push({
        value: valueKey ? enumObj[key][valueKey] : key,
        label: enumObj[key].text
      })
    })

    return options
  }

  type RetType = {
    Enum: Record<keyof typeof Enum, { [key: string]: { text: string; color?: string } }>
    enumToOptions: (enumKey: keyof typeof Enum, valueKey?: string) => Array<{ value: any; label: string }>
  }

  const ret: RetType = {
    Enum,
    enumToOptions
  }

  return ret
}
