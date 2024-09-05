import { getIntl, getLocale as getMaxLocale } from '@umijs/max'

import { gray, red, yellow } from '@/theme/theme.config'

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
  /**止损单 */
  STOP_LOSS_ORDER: 'STOP_LOSS_ORDER',
  /**止盈单 */
  TAKE_PROFIT_ORDERR: 'TAKE_PROFIT_ORDERR'
}

// 买卖交易方向
export const TRADE_BUY_SELL = {
  /**买方向 */
  BUY: 'BUY',
  /**买方向 */
  SELL: 'SELL'
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
      MARKET_ORDER: { text: intl.formatMessage({ id: 'mt.shijiadan' }), value: 10 },
      STOP_LOSS_ORDER: { text: intl.formatMessage({ id: 'mt.zhisundan' }), value: 20 },
      TAKE_PROFIT_ORDERR: { text: intl.formatMessage({ id: 'mt.zhiyingdan' }), value: 30 },
      LIMIT_BUY_ORDER: { text: intl.formatMessage({ id: 'mt.xianjiamairudan' }), value: 40 },
      LIMIT_SELL_ORDER: { text: intl.formatMessage({ id: 'mt.xianjiamaichudan' }), value: 50 },
      STOP_LOSS_LIMIT_BUY_ORDER: { text: intl.formatMessage({ id: 'mt.zhiyunxianjiamairudan' }), value: 60 },
      STOP_LOSS_LIMIT_SELL_ORDER: { text: intl.formatMessage({ id: 'mt.zhiyunxianjiamaichudan' }), value: 70 }
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
      ZERO: { text: intl.formatMessage({ id: 'mt.qiangping' }) },
      FOLLOW_PROFIT: { text: intl.formatMessage({ id: 'common.gendanfenrun' }) },
      HANDLING_FEES: { text: intl.formatMessage({ id: 'mt.shouxufei' }) },
      INTEREST_FEES: { text: intl.formatMessage({ id: 'mt.kucunfei' }) }
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
