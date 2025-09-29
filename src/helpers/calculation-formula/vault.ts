import { BNumber, BNumberValue } from "@/utils/b-number";
import { isNil } from "lodash-es";

/**
 * 计算 vault 可用余额
 * @param balance 余额
 * @returns 可用余额
 */
export function calculateVaultAvailableBalance({
  balance,
}: {
  balance?: BNumberValue
}) {
  if (isNil(balance)) {
    return undefined
  }

  return BNumber.from(balance)
}

/**
 * 计算 vault 份额单价 (（余额-保证金-逐仓保证金）+ 实时盈亏 ）/ 总份额
 * @param balance 余额
 * @param isolatedMargin 逐仓保证金
 * @param margin 保证金
 * @param share 份额
 * @param pnl 实时盈亏
 * @returns 可用余额
 */
export function calculateVaultSharePrice({
  balance,
  isolatedMargin,
  share,
  margin,
  pnl
}: {
  balance?: BNumberValue
  isolatedMargin?: BNumberValue
  margin?: BNumberValue
  share?: BNumberValue
  pnl?: BNumberValue
}) {
  if (isNil(balance) || isNil(isolatedMargin) || isNil(margin) || isNil(share) || isNil(pnl)) {
    return undefined
  }

  if (BNumber.from(share).eq(0)) {
    return undefined
  }

  const price = BNumber.from(balance)
    .minus(margin)
    .minus(isolatedMargin)
    .plus(pnl)
    .div(share)

  console.log({
    balance,
    isolatedMargin,
    share,
    margin,
    pnl,
    price: price.toString()
  })

  return price
}

export const calculateVaultAccountNetValue = ({
  sharePrice,
  share
}: {
  sharePrice?: BNumberValue
  share?: BNumberValue
}) => {
  if (isNil(sharePrice) || isNil(share)) {
    return undefined
  }

  return BNumber.from(sharePrice).times(share)
}
