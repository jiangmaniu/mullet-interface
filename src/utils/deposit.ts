import { DEFAULT_CURRENCY_DECIMAL } from '@/constants'
import { formatNum } from '.'

// 入金：手续费计算
export const countHandingFee = (value: number, methodInfo?: Wallet.fundsMethodPageListItem) => {
  if (!methodInfo) return 0

  const { userSingleLeastFee, userTradePercentageFee, userSingleFixedFee } = methodInfo || {}

  let val = Number(value) || 0

  // 手續費：單筆最低手續費 或 入金金額 * 交易百分比手續費 + 單筆固定手續費
  const fee = Math.max(userSingleLeastFee || 0, val * (userTradePercentageFee || 0) * 0.01 + (userSingleFixedFee || 0) || 0)

  return fee
}

export const transferHandlingFee = (value: number, methodInfo?: Wallet.fundsMethodPageListItem) => {
  if (!methodInfo) return 0

  let val = Number(value) || 0

  const fee = countHandingFee(val, methodInfo)

  return formatNum(fee, { precision: DEFAULT_CURRENCY_DECIMAL })
}

// 入金：實際到賬汇率换算
export const depositTransferCurr = (value: number, methodInfo?: Wallet.fundsMethodPageListItem) => {
  if (!methodInfo) return 0

  const { exchangeRate, userExchangeDifferencePercentage } = methodInfo || {}

  let val = Number(value) || 0

  // 匯率： 平台匯率 + 匯差百分比
  const _exchangeRate = (exchangeRate || 1.0) * (1 + (userExchangeDifferencePercentage || 0) * 0.01)

  // 手續費：單筆最低手續費 或 入金金額 * 交易百分比手續費 + 單筆固定手續費
  const fee = countHandingFee(val, methodInfo)

  val = (val + fee) * _exchangeRate

  return formatNum(val, { precision: DEFAULT_CURRENCY_DECIMAL })
}

// 出金：實際到賬汇率换算
export const withdrawCountTransferCurr = (value: number, methodInfo?: Wallet.fundsMethodPageListItem) => {
  if (!methodInfo) return 0

  const { exchangeRate, userExchangeDifferencePercentage, userSingleLeastFee, userTradePercentageFee, userSingleFixedFee } =
    methodInfo || {}

  let val = Number(value) || 0

  // 匯率： 平台匯率 + 匯差百分比
  const _exchangeRate = (exchangeRate || 1.0) * (1 - (userExchangeDifferencePercentage || 0) * 0.01)

  // 手續費：單筆最低手續費 或 入金金額 * 交易百分比手續費 + 單筆固定手續費
  const fee = countHandingFee(val, methodInfo)

  val = (val - fee) * _exchangeRate
  return val
}

// 出金：實際到賬汇率换算
export const withdrawTransferCurr = (value: number, methodInfo?: Wallet.fundsMethodPageListItem) => {
  return formatNum(withdrawCountTransferCurr(value, methodInfo), { precision: DEFAULT_CURRENCY_DECIMAL })
}

export const formatBankCard = (card: string) => {
  return card.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1-')
}
