import { gray, red, yellow } from '@/pages/webapp/theme/colors'
import { getIntl, getLocale as getMaxLocale } from '@umijs/max'

export enum Language {
  'en-US' = 'en-US', // 英语
  'zh-TW' = 'zh-TW' // 台湾繁体
}
export const LanguageMap: Record<string, any> = {
  'en-US': {
    key: 'en-US',
    label: 'EN',
    icon: '🇺🇸'
  },
  'zh-TW': {
    key: 'zh-TW',
    label: 'ZH',
    icon: '🇨🇳'
  }
}

export type ILanguage = 'en-US' | 'zh-TW'

// 传给后台的值，转化一下
export const LanuageTransformMap: Record<ILanguage, string> = {
  'zh-TW': 'zh-TW',
  'en-US': 'en-US'
}

// 获取k线对应的语言
export const getTradingViewLng = () => {
  const langMap = {
    'zh-TW': 'zh_TW', // 中文繁体
    'en-US': 'en' // 英文
  }

  return langMap[getMaxLocale() as ILanguage] || 'en'
}

export const getLocaleForBackend = () => LanuageTransformMap[getMaxLocale() as ILanguage]

// 转换星期文本
export type IWeekDay = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
export const transferWeekDay = (weekDay: IWeekDay) => {
  const text = {
    MONDAY: getIntl().formatMessage({ id: 'mt.xingqiyi' }),
    TUESDAY: getIntl().formatMessage({ id: 'mt.xingqier' }),
    WEDNESDAY: getIntl().formatMessage({ id: 'mt.xingqisan' }),
    THURSDAY: getIntl().formatMessage({ id: 'mt.xingqisi' }),
    FRIDAY: getIntl().formatMessage({ id: 'mt.xingqiwu' }),
    SATURDAY: getIntl().formatMessage({ id: 'mt.xingqiliu' }),
    SUNDAY: getIntl().formatMessage({ id: 'mt.xingqiri' })
  }[weekDay]

  return text
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
      key: 'common.enum.OrderType.TAKE_PROFIT_ORDERR'
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
    INTEREST_FEES: { key: 'common.enum.BalanceType.INTEREST_FEES' }
  }
}

// 业务枚举
export const getEnum = () => {
  const intl = getIntl()

  //  ============= 业务枚举值 ================
  // 使用text形式命名，方便表格 valueEnum 消费
  const Enum = {
    // 启用、禁用状态
    Status: {
      DISABLED: { text: intl.formatMessage({ id: 'common.jinyong' }) },
      ENABLE: { text: intl.formatMessage({ id: 'common.qiyong' }) }
    },
    // 认证状态
    ApproveStatus: {
      TODO: { text: intl.formatMessage({ id: 'mt.daishenhe' }), color: yellow['560'] },
      CANCEL: { text: intl.formatMessage({ id: 'mt.quxiao' }), color: gray['900'] },
      Disallow: { text: intl.formatMessage({ id: 'mt.shenheshibai' }), color: red['600'] },
      SUCCESS: { text: intl.formatMessage({ id: 'mt.yirenzheng' }), color: gray['900'] }
    },
    // 证件类型
    IdentificationType: {
      ID_CARD: { text: intl.formatMessage({ id: 'mt.shenfenzheng' }) },
      PASSPORT: { text: intl.formatMessage({ id: 'mt.huzhao' }) }
    },
    // 银行卡类型
    BankCardType: {
      DEBIT_CARD: { text: intl.formatMessage({ id: 'mt.chuxuka' }) },
      CREDIT_CARD: { text: intl.formatMessage({ id: 'mt.xingyongka' }) }
    },
    // 交易方向类型：只有两种 买、卖
    TradeBuySell: {
      BUY: { text: intl.formatMessage({ id: 'mt.mairu' }) },
      SELL: { text: intl.formatMessage({ id: 'mt.maichu' }) }
    },
    // 订单类型
    OrderType: {
      MARKET_ORDER: { text: intl.formatMessage({ id: 'mt.shijia' }), value: 10 },
      STOP_LOSS_ORDER: { text: intl.formatMessage({ id: 'mt.zhisundan' }), value: 20 },
      TAKE_PROFIT_ORDER: { text: intl.formatMessage({ id: 'mt.zhiyingdan' }), value: 30 },
      LIMIT_BUY_ORDER: { text: intl.formatMessage({ id: 'mt.xianjiamairudan' }), value: 40 },
      LIMIT_SELL_ORDER: { text: intl.formatMessage({ id: 'mt.xianjiamaichudan' }), value: 50 },
      STOP_LOSS_LIMIT_BUY_ORDER: { text: intl.formatMessage({ id: 'mt.zhiyunxianjiamairudan' }), value: 60 },
      STOP_LOSS_LIMIT_SELL_ORDER: { text: intl.formatMessage({ id: 'mt.zhiyunxianjiamaichudan' }), value: 70 },
      STOP_LOSS_MARKET_BUY_ORDER: { text: intl.formatMessage({ id: 'mt.zhiyunshijiamairudan' }), value: 80 },
      STOP_LOSS_MARKET_SELL_ORDER: { text: intl.formatMessage({ id: 'mt.zhiyunshijiamaichudan' }), value: 90 }
    },
    // 订单状态
    OrderStatus: {
      CANCEL: { text: intl.formatMessage({ id: 'mt.yicexiao' }) },
      ENTRUST: { text: intl.formatMessage({ id: 'mt.weituozhong' }) },
      FAIL: { text: intl.formatMessage({ id: 'mt.shibai' }) },
      FINISH: { text: intl.formatMessage({ id: 'mt.yichengjiao' }) }
    },
    // 订单成交方向
    OrderInOut: {
      IN: { text: intl.formatMessage({ id: 'mt.jiancang' }) },
      OUT: { text: intl.formatMessage({ id: 'mt.pingcang' }) }
    },
    // 持仓单状态
    BGAStatus: {
      BAG: { text: intl.formatMessage({ id: 'mt.chicangzhong' }) },
      FINISH: { text: intl.formatMessage({ id: 'mt.yiwancheng' }) }
    },
    // 保证金类型
    MarginType: {
      CROSS_MARGIN: { text: intl.formatMessage({ id: 'mt.quancang' }) },
      ISOLATED_MARGIN: { text: intl.formatMessage({ id: 'mt.zhucang' }) }
    },
    // 客户管理-交易账号-结余-表格-类型
    CustomerBalanceRecordType: {
      DEPOSIT: { text: intl.formatMessage({ id: 'common.chongzhi' }) },
      DEPOSIT_SIMULATE: { text: intl.formatMessage({ id: 'common.monichongzhi' }) },
      WITHDRAWAL: { text: intl.formatMessage({ id: 'mt.tixian' }) },
      MARGIN: { text: intl.formatMessage({ id: 'mt.baozhengjin' }) },
      PROFIT: { text: intl.formatMessage({ id: 'mt.yingkui' }) },
      GIFT: { text: intl.formatMessage({ id: 'mt.zengjin' }) },
      BALANCE: { text: intl.formatMessage({ id: 'mt.jieyu' }) },
      TRANSFER: { text: intl.formatMessage({ id: 'common.zhuanzhang' }) },
      ZERO: { text: intl.formatMessage({ id: 'mt.guiling' }) },
      FOLLOW_PROFIT: { text: intl.formatMessage({ id: 'common.gendanfenrun' }) },
      HANDLING_FEES: { text: intl.formatMessage({ id: 'mt.shouxufei' }) },
      INTEREST_FEES: { text: intl.formatMessage({ id: 'mt.kucunfei' }) }
    },
    // 可用预付款
    UsableAdvanceCharge: {
      NOT_PROFIT_LOSS: { text: intl.formatMessage({ id: 'mt.bujisuanweishixiandyinglikuyun' }) },
      PROFIT_LOSS: { text: intl.formatMessage({ id: 'mt.jisuanweishixiandyinglikuyun' }) }
    }
  }
  //  ============= 业务枚举值 ================
  // // 使用text形式命名，方便表格 valueEnum 消费
  // const Enum = Object.keys(Enums).reduce((acc, key) => {
  //   acc[key] = Object.keys(Enums[key]).reduce((innerAcc, innerKey) => {
  //     innerAcc[innerKey] = {
  //       ...Enums[key][innerKey],
  //       text: Enums[key][innerKey].key ? intl.formatMessage({ id: Enums[key][innerKey].key }) : undefined
  //     }
  //     return innerAcc
  //   }, {})
  //   return acc
  // }, {})

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
