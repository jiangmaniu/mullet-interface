'use client'

import AddFundsMenu from '@/components/Web/AddFundsMenu'
import SwapDialog from '@/components/Web/SwapDialog'
import TransferCryptoDialog from '@/components/Web/TransferCryptoDialog'
import usePrivyInfo from '@/hooks/web3/usePrivyInfo'
// import { useWalletAuthState } from '@/hooks/wallet/use-wallet-auth-state'
import { Button } from '@/libs/ui/components/button'
import { useState, useCallback } from 'react'
import { useFundWallet as useSolanaFundWallet } from '@privy-io/react-auth/solana'
import { useFundWallet as useEvmFundWallet } from '@privy-io/react-auth'
import { usePrivy } from '@privy-io/react-auth'
import { useServerWallet } from '@/hooks/useServerWallet'
import { message } from 'antd'
import { useStores } from '@/context/mobxProvider'

export const DepositAssets = () => {
  // const { isAuthenticated } = useWalletAuthState()

  // if (!isAuthenticated) {
  //   return null
  // }

  const { trade } = useStores()
  const [showAddFundsMenu, setShowAddFundsMenu] = useState(false)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [showSwapDialog, setShowSwapDialog] = useState(false)
  const { activeSolanaWallet, wallets } = usePrivyInfo()
  const { user } = usePrivy()
  const hasWallet = !!activeSolanaWallet

  // 判断是否是外部钱包：用 activeSolanaWallet.address 在 linkedAccounts 中查找
  // 如果该地址对应的 walletClientType 不是 'privy'，则是外部钱包
  const currentWalletAccount = user?.linkedAccounts?.find((account: any) => account.address === activeSolanaWallet?.address)
  const isExternalWallet = currentWalletAccount && (currentWalletAccount as any).walletClientType !== 'privy'

  console.log('[DepositAssets] 🔍 Wallet check:', {
    hasWallet,
    isExternalWallet,
    walletAddress: activeSolanaWallet?.address,
    currentWalletAccount: currentWalletAccount
      ? {
          address: (currentWalletAccount as any).address,
          walletClientType: (currentWalletAccount as any).walletClientType
        }
      : null
  })

  // 使用 onUserExited 回调处理用户关闭 modal
  const handleFundWalletExit = useCallback(() => {
    console.log('[Privy] User exited fund wallet modal')
  }, [])

  const { fundWallet: fundSolanaWallet } = useSolanaFundWallet({
    onUserExited: handleFundWalletExit
  })
  const { fundWallet: fundEvmWallet } = useEvmFundWallet({
    onUserExited: handleFundWalletExit
  })

  // 🔥 使用 Privy Server Solana 钱包地址（用于信用卡购买）
  const { address: serverSolanaAddress, isCreating: serverWalletLoading } = useServerWallet('solana', !!trade.currentAccountInfo?.id, trade.currentAccountInfo?.id)

  const handleCardClick = async () => {
    setShowAddFundsMenu(false)

    // 如果 Server Wallet 还在加载中
    if (serverWalletLoading) {
      message.info('正在加载充值地址，请稍候...')
      return
    }

    // 必须使用 Privy Server Solana 充值地址
    if (!serverSolanaAddress) {
      console.error('[Buy Crypto] No Server Solana address available')
      message.error('Solana 充值地址未就绪，请稍后重试')
      return
    }

    console.log('[Buy Crypto] Using Server Solana address:', serverSolanaAddress)

    try {
      const result = await fundSolanaWallet({
        address: serverSolanaAddress,
        options: {
          asset: 'USDC', // 购买 USDC 稳定币
          amount: '10' // 默认 $10
        }
      })
      console.log('[Buy Crypto] Fund wallet result:', result)
    } catch (error) {
      console.error('[Buy Crypto] Fund wallet error:', error)
      // 用户取消或关闭 modal 也会抛出错误，这是正常的
    }
  }

  return (
    <div>
      <div>
        <Button
          disabled={!hasWallet}
          variant={'primary'}
          size={'md'}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
          onClick={() => setShowAddFundsMenu(true)}
        >
          存款
        </Button>

        {/* Add Funds 菜单 */}
        <AddFundsMenu
          open={showAddFundsMenu}
          onClose={() => setShowAddFundsMenu(false)}
          onTransferClick={() => setShowTransferDialog(true)}
          onSwapClick={() => setShowSwapDialog(true)}
          onCardClick={handleCardClick}
          showSwapOption={!!isExternalWallet}
          walletType={(currentWalletAccount as any)?.walletClientType}
        />
        {/* 跨链充值弹窗 */}
        <TransferCryptoDialog
          open={showTransferDialog}
          onClose={() => setShowTransferDialog(false)}
          onBack={() => setShowAddFundsMenu(true)}
        />
        {/* 资产兑换弹窗 */}
        <SwapDialog
          open={showSwapDialog}
          onClose={() => setShowSwapDialog(false)}
          onBack={() => setShowAddFundsMenu(true)}
          walletAddress={wallets?.[0]?.address || ''}
          network={
            wallets?.[0]?.address?.length === 44 && !wallets?.[0]?.address?.startsWith('0x')
              ? 'solana'
              : wallets?.[0]?.chainId?.includes('tron') || wallets?.[0]?.chainId?.startsWith('0x')
              ? 'ethereum'
              : 'ethereum'
          }
          walletSource={wallets?.[0]?.walletClientType || 'privy'}
        />
      </div>
    </div>
  )
}
