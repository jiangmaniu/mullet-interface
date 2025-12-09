import { BNumber } from '@/utils/b-number'
import { useVaultDetail } from './use-vault-detail'
import { useVaultSharePrice } from './use-vault-share-price'
import { useVaultAccountNetValue } from './use-vault-account-net-value'

export const useVaultOverviewData = () => {
  const { vaultDetail } = useVaultDetail()
  const sharePrice = useVaultSharePrice()

  const totalPurchaseMoney = BNumber.from(vaultDetail?.totalShares)?.multipliedBy(sharePrice)
  const yourBalance = useVaultAccountNetValue()
  const yourProfit = BNumber.from(vaultDetail?.accountFollowShares?.redeemTotalMoney)
    ?.plus(yourBalance)
    ?.minus(vaultDetail?.accountFollowShares?.followTotalMoney)

  return {
    totalPurchaseMoney: totalPurchaseMoney?.toString(),
    apr: vaultDetail?.apr,
    yourBalance: yourBalance?.toString(),
    yourProfit: yourProfit?.toString()
  }
}
