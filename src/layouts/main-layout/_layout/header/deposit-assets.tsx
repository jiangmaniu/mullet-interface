'use client'

import AddFundsMenu from '@/components/Web/AddFundsMenu'
import SwapDialog from '@/components/Web/SwapDialog'
import TransferCryptoDialog from '@/components/Web/TransferCryptoDialog'
import usePrivyInfo from '@/hooks/web3/usePrivyInfo'
// import { useWalletAuthState } from '@/hooks/wallet/use-wallet-auth-state'
import { Button } from '@/libs/ui/components/button'
import { useState } from 'react'
import { useFundWallet as useSolanaFundWallet } from '@privy-io/react-auth/solana'
import { useFundWallet as useEvmFundWallet } from '@privy-io/react-auth'

export const DepositAssets = () => {
  // const { isAuthenticated } = useWalletAuthState()

  // if (!isAuthenticated) {
  //   return null
  // }

  const [showAddFundsMenu, setShowAddFundsMenu] = useState(false)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [showSwapDialog, setShowSwapDialog] = useState(false)
  const { activeSolanaWallet, wallets } = usePrivyInfo()
  const hasWallet = !!activeSolanaWallet
  const { fundWallet: fundSolanaWallet } = useSolanaFundWallet()
  const { fundWallet: fundEvmWallet } = useEvmFundWallet()

  const handleCardClick = async () => {
    setShowAddFundsMenu(false)

    // 获取当前钱包地址
    const wallet = wallets?.[0]
    if (!wallet) {
      console.error('[Buy Crypto] No wallet found')
      return
    }

    const walletAddress = wallet.address
    console.log('[Buy Crypto] Wallet address:', walletAddress)

    // 检测是 Solana 还是 EVM 钱包
    const isSolanaAddress = walletAddress.length === 44 && !walletAddress.startsWith('0x')

    try {
      if (isSolanaAddress) {
        // Solana wallet - use Solana fundWallet
        console.log('[Buy Crypto] Opening Solana fundWallet for:', walletAddress)
        fundSolanaWallet({
          address: walletAddress,
          options: {
            amount: '10' // 默认 $10
          }
        })
      } else {
        // EVM wallet - use EVM fundWallet with mainnet chain
        console.log('[Buy Crypto] Opening EVM fundWallet for:', walletAddress)

        // 动态导入 viem/chains 以获取 mainnet 配置
        const { mainnet } = await import('viem/chains')

        fundEvmWallet({
          address: walletAddress,
          options: {
            chain: mainnet,
            asset: 'USDC', // 默认购买 USDC
            amount: '10' // 默认 $10
          }
        })
      }
    } catch (error) {
      console.error('[Buy Crypto] Failed to open fundWallet:', error)
    }
  }

  return (
    <div>
      <div>
        <Button disabled={!hasWallet} variant={'primary'} size={'md'} color={'primary'} onClick={() => setShowAddFundsMenu(true)}>
          存款
        </Button>

        {/* Add Funds 菜单 */}
        <AddFundsMenu
          open={showAddFundsMenu}
          onClose={() => setShowAddFundsMenu(false)}
          onTransferClick={() => setShowTransferDialog(true)}
          onSwapClick={() => setShowSwapDialog(true)}
          onCardClick={handleCardClick}
        />
        {/* 跨链充值弹窗 */}
        <TransferCryptoDialog open={showTransferDialog} onClose={() => setShowTransferDialog(false)} />
        {/* 资产兑换弹窗 */}
        <SwapDialog
          open={showSwapDialog}
          onClose={() => setShowSwapDialog(false)}
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
