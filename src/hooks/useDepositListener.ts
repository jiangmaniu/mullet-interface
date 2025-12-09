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
  const { enabled = false, pollInterval = 5000, chains = ['TRON', 'Ethereum', 'Solana'] } = options

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

  // 检查 TRON 余额 (使用 TronGrid API)
  const checkTronBalance = useCallback(
    async (address: string) => {
      try {
        const response = await fetch(`https://api.trongrid.io/v1/accounts/${address}/transactions/trc20`, {
          headers: {
            'TRON-PRO-API-KEY': '6399319de5985a2ee9496b8ae8590d7bba3988a6fb28d4fc80cb1fbf9f039fb3'
          }
        })

        if (!response.ok) {
          throw new Error(`TronGrid API error: ${response.status}`)
        }

        const data = await response.json()

        // 检查最近的交易
        if (data.data && data.data.length > 0) {
          const latestTx = data.data[0]
          const key = `tron-last-tx-${address}`

          if (previousBalances[key] !== latestTx.transaction_id) {
            // 新交易
            if (latestTx.to === address) {
              console.log('[Deposit] Detected TRON deposit:', latestTx)
              setPreviousBalances((prev) => ({ ...prev, [key]: latestTx.transaction_id }))

              return {
                amount: latestTx.value,
                token: latestTx.token_info?.symbol || 'TRX',
                chain: 'TRON',
                txHash: latestTx.transaction_id,
                rawBalance: latestTx.value
              }
            }
          }
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
      const tronWallet = findWalletByChain(wallets, 'tron')
      const ethWallet = findWalletByChain(wallets, 'ethereum')
      const solWallet = findWalletByChain(wallets, 'solana')

      let detectedDeposit: DepositDetection | null = null

      if (chains.includes('Tron') && tronWallet) {
        const tronDeposit = await checkTronBalance(tronWallet.address)
        if (tronDeposit) detectedDeposit = tronDeposit
      }

      if (chains.includes('Ethereum') && ethWallet) {
        const ethDeposit = await checkEthereumBalance(ethWallet.address)
        if (ethDeposit) detectedDeposit = ethDeposit
      }

      if (chains.includes('Solana') && solWallet) {
        const solDeposit = await checkSolanaBalance(solWallet.address)
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
  }, [enabled, pollInterval, chains, wallets, checkTronBalance, checkEthereumBalance, checkSolanaBalance])

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
