import { useStores } from '@/context/mobxProvider'
import useAccountChange from './useAccountChange'
import usePrivyInfo from './usePrivyInfo'
import useTransfer from './useSoLTransfer'

// 监听邮箱方式登录的情况下 privy 嵌入钱包地址余额变化，转账到PDA账户地址上
export default function usePrivyEmbeddedWalletChangeTransferToPdaAddr() {
  const { hasEmbeddedWallet, foundWallet, address } = usePrivyInfo()
  const { onTransfer } = useTransfer()
  const { trade } = useStores()
  const pdaTokenAddress = trade.currentAccountInfo?.pdaTokenAddress

  // 监听嵌入钱包余额变化，转账到PDA账户地址上
  useAccountChange({
    address,
    onUpdateCallback: (updatedAccountInfo) => {
      if (updatedAccountInfo.balance > 0 && hasEmbeddedWallet && pdaTokenAddress) {
        console.log('监听嵌入钱包余额变化，转账到PDA账户地址上')
        onTransfer({
          toAddress: pdaTokenAddress,
          amount: updatedAccountInfo.balance
        })
      }
    }
  })

  return {}
}
