import { getIntl, getLocale as getMaxLocale } from '@umijs/max'

export enum Language {
  'en-US' = 'en-US', // 英语
  'zh-TW' = 'zh-TW' // 台湾繁体
}
export const LanguageMap: Record<string, any> = {
  'en-US': {
    key: 'en-US',
    label: 'English',
    icon: '🇺🇸'
  },
  'zh-TW': {
    key: 'zh-TW',
    label: '繁體中文',
    icon: '🇨🇳'
  }
}

export type ILanguage = 'en-US' | 'zh-TW'

// 传给后台的值，转化一下
export const LanuageTransformMap: Record<ILanguage, string> = {
  'zh-TW': 'zh-Hant',
  'en-US': 'en'
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
    FRIDAY: getIntl().formatMessage({ id: 'mt.xingqisi' }),
    SATURDAY: getIntl().formatMessage({ id: 'mt.xingqiliu' }),
    SUNDAY: getIntl().formatMessage({ id: 'mt.xingqiri' })
  }[weekDay]

  return text
}

// 交易类型
export const TRADE_TYPE = {
  /**市场单买入0 */
  MARKET_BUY: 0,
  /**市场单卖出1 */
  MARKET_SELL: 1,
  /**限价挂单买入是2 */
  LIMIT_BUY: 2,
  /**限价挂单卖出是3 */
  LIMIT_SELL: 3,
  /**停损挂单买入是4 */
  STOP_LIMIT_BUY: 4,
  /**停损挂单卖出是5 */
  STOP_LIMIT_SELL: 5
}
