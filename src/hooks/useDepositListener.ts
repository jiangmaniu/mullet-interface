import { useState, useEffect, useCallback } from 'react'
import { useWallets } from '@privy-io/react-auth'
import { Connection, PublicKey } from '@solana/web3.js'
import { SUPPORTED_TOKENS } from '@/config/lifiConfig'
import { findWalletByChain } from '@/utils/privyWalletHelpers'

interface DepositDetection {
  amount: string
  token: string
  chain: string
  txHash?: string
  rawBalance?: string
}

interface UseDepositListenerOptions {
  enabled?: boolean
  pollInterval?: number // 轮询间隔(ms)
  chains?: ('Tron' | 'Ethereum' | 'Solana')[] // 监听的链
  tronAddress?: string // 手动指定 TRON 地址（因为 Tier 2 钱包不在 wallets 中）
  ethereumAddress?: string // 手动指定 Ethereum 地址
  solanaAddress?: string // 手动指定 Solana 地址
}

/**
 * 监听用户钱包的充值
 * 支持 TRON / Ethereum / Solana 三条链
 *
 * @example
 * ```tsx
 * const { deposit, isListening } = useDepositListener({
 *   enabled: true,
 *   chains: ['TRON', 'Ethereum']
 * })
 *
 * useEffect(() => {
 *   if (deposit) {
 *     console.log('Detected deposit:', deposit)
 *     // 触发桥接流程
 *   }
 * }, [deposit])
 * ```
 */
export function useDepositListener(options: UseDepositListenerOptions = {}) {
  const { 
    enabled = false, 
    pollInterval = 5000, 
    chains = ['Tron', 'Ethereum', 'Solana'],
    tronAddress,
    ethereumAddress,
    solanaAddress
  } = options

  const { wallets } = useWallets()
  const [deposit, setDeposit] = useState<DepositDetection | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [previousBalances, setPreviousBalances] = useState<Record<string, string>>({})

  // 检查 Solana 余额
  const checkSolanaBalance = useCallback(
    async (address: string) => {
      try {
        const connection = new Connection(
          'https://rpc.ankr.com/premium-http/solana/6399319de5985a2ee9496b8ae8590d7bba3988a6fb28d4fc80cb1fbf9f039fb3'
        )

        // 检查 USDT
        const usdtTokenInfo = SUPPORTED_TOKENS.solana.find((t) => t.symbol === 'USDT')
        if (!usdtTokenInfo) {
          console.warn('[Deposit] USDT token not found in config')
          return null
        }

        const usdtMint = new PublicKey(usdtTokenInfo.address)
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(new PublicKey(address), {
          mint: usdtMint
        })

        if (tokenAccounts.value.length > 0) {
          const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.amount
          const key = `solana-usdt-${address}`

          if (previousBalances[key] && BigInt(balance) > BigInt(previousBalances[key])) {
            const diff = (BigInt(balance) - BigInt(previousBalances[key])).toString()
            console.log('[Deposit] Detected Solana USDT deposit:', diff)
            return {
              amount: diff,
              token: 'USDT',
              chain: 'Solana',
              rawBalance: balance
            }
          }

          setPreviousBalances((prev) => ({ ...prev, [key]: balance }))
        }
      } catch (error) {
        console.error('[Deposit] Failed to check Solana balance:', error)
      }

      return null
    },
    [previousBalances]
  )

  // 检查 TRON 余额 (直接查询智能合约余额)
  const checkTronBalance = useCallback(
    async (address: string) => {
      try {
        // 动态导入 TronWeb
        const { TronWeb } = await import('tronweb')
        
        // 使用 Ankr Premium RPC (已付费)
        const tronWeb = new TronWeb({
          fullHost: 'https://rpc.ankr.com/premium-http/tron/6399319de5985a2ee9496b8ae8590d7bba3988a6fb28d4fc80cb1fbf9f039fb3'
        })

        // 检查 USDT TRC20 余额
        const usdtTokenInfo = SUPPORTED_TOKENS.tron.find((t) => t.symbol === 'USDT')
        if (!usdtTokenInfo) {
          console.warn('[Deposit] TRON USDT token not found in config')
          return null
        }

        tronWeb.setAddress(address)
        const contract = await tronWeb.contract().at(usdtTokenInfo.address)
        const balance = await contract.balanceOf(address).call()
        const tokenBalance = Number(balance.toString()) / Math.pow(10, 6) // USDT 有 6 位小数

        const key = `tron-usdt-${address}`
        const previousBalance = previousBalances[key] ? parseFloat(previousBalances[key]) : 0

        // 如果余额增加，触发充值检测
        if (tokenBalance > previousBalance && tokenBalance > 0.000001) {
          const depositAmount = (tokenBalance - previousBalance).toFixed(6)
          console.log('[Deposit] Detected TRON USDT deposit:', depositAmount, 'USDT')
          
          setPreviousBalances((prev) => ({ ...prev, [key]: tokenBalance.toString() }))

          return {
            amount: depositAmount,
            token: 'USDT',
            chain: 'Tron',
            rawBalance: balance.toString()
          }
        }

        // 更新余额记录
        if (previousBalance === 0 && tokenBalance > 0) {
          // 首次检测到余额，记录但不触发
          setPreviousBalances((prev) => ({ ...prev, [key]: tokenBalance.toString() }))
        }
      } catch (error) {
        console.error('[Deposit] Failed to check TRON balance:', error)
      }

      return null
    },
    [previousBalances]
  )

  // 检查 Ethereum 余额 (使用 Ankr API)
  const checkEthereumBalance = useCallback(
    async (address: string) => {
      try {
        const response = await fetch(
          'https://rpc.ankr.com/premium-http/eth/6399319de5985a2ee9496b8ae8590d7bba3988a6fb28d4fc80cb1fbf9f039fb3',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getBalance',
              params: [address, 'latest'],
              id: 1
            })
          }
        )

        const data = await response.json()
        const balance = data.result

        const key = `ethereum-eth-${address}`

        if (previousBalances[key] && BigInt(balance) > BigInt(previousBalances[key])) {
          const diff = (BigInt(balance) - BigInt(previousBalances[key])).toString()
          console.log('[Deposit] Detected Ethereum ETH deposit:', diff)
          return {
            amount: diff,
            token: 'ETH',
            chain: 'Ethereum',
            rawBalance: balance
          }
        }

        setPreviousBalances((prev) => ({ ...prev, [key]: balance }))
      } catch (error) {
        console.error('[Deposit] Failed to check Ethereum balance:', error)
      }

      return null
    },
    [previousBalances]
  )

  // 轮询检查余额
  useEffect(() => {
    if (!enabled) {
      setIsListening(false)
      return
    }

    setIsListening(true)

    const checkAllBalances = async () => {
      // Use manual addresses if provided, otherwise fall back to wallet discovery
      const tronWallet = findWalletByChain(wallets, 'tron')
      const ethWallet = findWalletByChain(wallets, 'ethereum')
      const solWallet = findWalletByChain(wallets, 'solana')

      // Use manual addresses with priority
      const tronAddr = tronAddress || tronWallet?.address
      const ethAddr = ethereumAddress || ethWallet?.address
      const solAddr = solanaAddress || solWallet?.address

      console.log('[DepositListener] Checking balances with addresses:', {
        tron: tronAddr ? `${tronAddr.slice(0, 6)}...${tronAddr.slice(-4)}` : 'none',
        eth: ethAddr ? `${ethAddr.slice(0, 6)}...${ethAddr.slice(-4)}` : 'none',
        sol: solAddr ? `${solAddr.slice(0, 6)}...${solAddr.slice(-4)}` : 'none',
        source: {
          tron: tronAddress ? 'manual' : 'wallet',
          eth: ethereumAddress ? 'manual' : 'wallet',
          sol: solanaAddress ? 'manual' : 'wallet'
        }
      })

      let detectedDeposit: DepositDetection | null = null

      if (chains.includes('Tron') && tronAddr) {
        const tronDeposit = await checkTronBalance(tronAddr)
        if (tronDeposit) detectedDeposit = tronDeposit
      }

      if (chains.includes('Ethereum') && ethAddr) {
        const ethDeposit = await checkEthereumBalance(ethAddr)
        if (ethDeposit) detectedDeposit = ethDeposit
      }

      if (chains.includes('Solana') && solAddr) {
        const solDeposit = await checkSolanaBalance(solAddr)
        if (solDeposit) detectedDeposit = solDeposit
      }

      if (detectedDeposit) {
        setDeposit(detectedDeposit)
      }
    }

    // 立即检查一次
    checkAllBalances()

    // 定时轮询
    const interval = setInterval(checkAllBalances, pollInterval)

    return () => {
      clearInterval(interval)
      setIsListening(false)
    }
  }, [enabled, pollInterval, chains, wallets, checkTronBalance, checkEthereumBalance, checkSolanaBalance, tronAddress, ethereumAddress, solanaAddress])

  // 清除检测到的充值
  const clearDeposit = useCallback(() => {
    setDeposit(null)
  }, [])

  return {
    deposit,
    isListening,
    clearDeposit
  }
}
