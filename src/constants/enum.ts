import { getIntl, getLocale as getMaxLocale } from '@umijs/max'

import { CurrencyLABELS } from '@/utils/wsUtil'

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

export const getLocaleForBackend = () => LanuageTransformMap[getMaxLocale() as ILanguage]

// 提币方式
export const COINS_NETWORK_TYPE = ['USDT-TRC20', 'USDT-OMNI']

// 名下用户组别权限标识
export const AgentUserGroups: Record<string, string> = {
  0: 'S0',
  1: 'S10',
  2: 'S20',
  3: 'S30',
  4: 'S40',
  5: 'S50',
  6: 'S502',
  7: 'E10',
  8: 'S8'
}

export const getAgentQuerySymbolOptions = () => {
  const intl = getIntl()
  return Object.keys(CurrencyLABELS).map((value) => ({ value, label: value }))
}
