import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Button, Input, Progress, Alert, Collapse, Typography, Space, Spin, Divider } from 'antd'
import { ArrowRightOutlined, SwapOutlined, ArrowLeftOutlined, CheckCircleOutlined, DownOutlined } from '@ant-design/icons'
import { useWallets, useSendTransaction, usePrivy } from '@privy-io/react-auth'
import { useTronWallet } from '@/hooks/useTronWallet'
import { useTokenPrices } from '@/hooks/useTokenPrices'
import { useSolanaBalance } from '@/hooks/useSolanaBalance'
import usePrivyInfo from '@/hooks/web3/usePrivyInfo'
import { checkBalance } from '@/services/balanceService'
import { TOKEN_ICONS, CHAIN_ICONS } from '@/config/tokenIcons'
import { useTheme } from '@/context/themeProvider'
import { 
  getDeBridgeQuote, 
  createDeBridgeOrderTron,
  getDeBridgeOrderStatus, 
  DEBRIDGE_CHAIN_IDS,
  DEBRIDGE_TOKENS,
  type DeBridgeParams 
} from '@/services/debridgeService'
import { createPublicClient, http, encodeFunctionData, createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const { Text, Title } = Typography
const { Panel } = Collapse

interface SwapDialogProps {
  open: boolean
  onClose: () => void
  onBack?: () => void
  walletAddress: string
  network: string
  walletSource?: string // Wallet client type (okx_wallet, phantom, privy, etc.)
  initialAsset?: {
    symbol: string
    balance: number
    icon: string
    network?: string
  }
}

type BridgeStage = 'idle' | 'step1-executing' | 'step1-confirming' | 'step2-executing' | 'completed' | 'error'
type ViewState = 'asset_select' | 'input' | 'quote' | 'executing'

interface AssetBalance {
  symbol: string
  balance: number
  icon: string
  network: string
  usdValue: number
}

interface QuoteData {
  youSend: {
    token: string
    amount: string
  }
  youReceive: {
    token: string
    amount: string
  }
  source: {
    token: string
    network: string
    account: string
  }
  destination: {
    token: string
    network: string
    account: string
  }
  networkCost: string
  priceImpact: string
  maxSlippage: string
  estimatedTime: string
}

const skeletonPulse = {
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.4,
    },
  },
  animation: 'pulse 1.5s ease-in-out infinite',
}

const SwapDialog: React.FC<SwapDialogProps> = ({ open, onClose, onBack, walletAddress, network, walletSource, initialAsset }) => {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<ViewState>('asset_select')
  const [selectedAsset, setSelectedAsset] = useState<AssetBalance | null>(null)
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [countdown, setCountdown] = useState(30)
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)
  const [bridgeStage, setBridgeStage] = useState<BridgeStage>('idle')
  const [bridgeError, setBridgeError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  
  const { wallets } = useWallets()
  const { tronAddress, tronWalletId } = useTronWallet()
  const { sendTransaction } = useSendTransaction()
  const { getAccessToken, user } = usePrivy()
  const { prices } = useTokenPrices()
  const { activeSolanaWallet } = usePrivyInfo()
  const themeConfig = useTheme()
  const isDark = themeConfig.theme.isDark

  // Get Solana wallet from usePrivyInfo (智能选择逻辑)
  const solanaWallet = activeSolanaWallet

  // Fetch balances
  const { balances: solBalances } = useSolanaBalance(solanaWallet?.address)
  const [ethBalance, setEthBalance] = useState(0)
  const [ethUsdtBalance, setEthUsdtBalance] = useState(0)
  const [trxBalance, setTrxBalance] = useState(0)
  const [tronUsdtBalance, setTronUsdtBalance] = useState(0)

  // Fetch ETH Balance and ETH USDT Balance
  useEffect(() => {
    const fetchEthBalances = async () => {
      const ethWallets = wallets.filter(w => w.address.startsWith('0x'))
      if (ethWallets.length === 0) return

      const selectedWallet = ethWallets[0]
      if (selectedWallet?.address) {
        try {
          // Fetch ETH balance
          const ethRes = await checkBalance('', 1, selectedWallet.address)
          const ethAmount = parseFloat(ethRes.balance) / Math.pow(10, ethRes.decimals)
          setEthBalance(ethAmount)
          
          // Fetch ETH USDT balance
          const USDT_ETH_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7'
          const usdtRes = await checkBalance(USDT_ETH_ADDRESS, 1, selectedWallet.address)
          const usdtAmount = parseFloat(usdtRes.balance) / Math.pow(10, usdtRes.decimals)
          setEthUsdtBalance(usdtAmount)
        } catch (e) {
          console.error('[SwapDialog] Failed to fetch ETH balances', e)
        }
      }
    }
    
    if (wallets.length > 0) {
      fetchEthBalances()
    }
  }, [wallets])

  // Fetch Tron Balance and Tron USDT Balance
  useEffect(() => {
    const fetchTronBalances = async () => {
      if (!tronAddress) return

      try {
        // 动态导入 TronWeb
        const { TronWeb } = await import('tronweb')
        
        // 使用 Ankr Premium RPC (已付费)
        const tronWeb = new TronWeb({
          fullHost: 'https://rpc.ankr.com/premium-http/tron/6399319de5985a2ee9496b8ae8590d7bba3988a6fb28d4fc80cb1fbf9f039fb3'
        })

        // 获取 TRX 余额
        const trxBalanceInSun = await tronWeb.trx.getBalance(tronAddress)
        const trxAmount = trxBalanceInSun / 1_000_000 // SUN to TRX
        setTrxBalance(trxAmount)

        // 获取 Tron USDT 余额
        const USDT_TRON_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
        try {
          tronWeb.setAddress(tronAddress)
          const contract = await tronWeb.contract().at(USDT_TRON_ADDRESS)
          const balance = await contract.balanceOf(tronAddress).call()
          const usdtAmount = Number(balance.toString()) / 1_000_000 // USDT has 6 decimals
          setTronUsdtBalance(usdtAmount)
        } catch (err) {
          console.error('[SwapDialog] Failed to fetch Tron USDT balance', err)
          setTronUsdtBalance(0)
        }
      } catch (e) {
        console.error('[SwapDialog] Failed to fetch Tron balances', e)
      }
    }

    if (tronAddress) {
      fetchTronBalances()
    }
  }, [tronAddress])

  // Construct Assets List
  const assets = useMemo(() => {
    const list: AssetBalance[] = []

    // USDC (Solana)
    const solanaUsdcBalance = parseFloat(solBalances?.['USDC']?.balance || '0')
    list.push({
      symbol: 'USDC',
      balance: solanaUsdcBalance,
      usdValue: solanaUsdcBalance,
      icon: TOKEN_ICONS.USDC,
      network: 'Solana'
    })

    // ETH
    list.push({
      symbol: 'ETH',
      balance: ethBalance,
      usdValue: ethBalance * (prices.ethereum || 0),
      icon: TOKEN_ICONS.ETH,
      network: 'Ethereum'
    })

    // TRX
    list.push({
      symbol: 'TRX',
      balance: trxBalance,
      usdValue: trxBalance * (prices.tron || 0),
      icon: TOKEN_ICONS.TRX,
      network: 'Tron'
    })

    // SOL
    const solAmount = parseFloat(solBalances?.['SOL']?.balance || '0')
    list.push({
      symbol: 'SOL',
      balance: solAmount,
      usdValue: solAmount * (prices.solana || 0),
      icon: TOKEN_ICONS.SOL,
      network: 'Solana'
    })

    // USDT (Ethereum)
    list.push({
      symbol: 'USDT',
      balance: ethUsdtBalance,
      usdValue: ethUsdtBalance,
      icon: TOKEN_ICONS.USDT,
      network: 'Ethereum'
    })

    // USDT (Tron)
    list.push({
      symbol: 'USDT',
      balance: tronUsdtBalance,
      usdValue: tronUsdtBalance,
      icon: TOKEN_ICONS.USDT,
      network: 'Tron'
    })

    // USDT (Solana)
    const solanaUsdtAmount = parseFloat(solBalances?.['USDT']?.balance || '0')
    list.push({
      symbol: 'USDT',
      balance: solanaUsdtAmount,
      usdValue: solanaUsdtAmount,
      icon: TOKEN_ICONS.USDT,
      network: 'Solana'
    })

    // Sort by USD value descending
    return list.sort((a, b) => b.usdValue - a.usdValue)
  }, [solBalances, ethBalance, ethUsdtBalance, trxBalance, tronUsdtBalance, prices])

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setAmount('')
      setView(initialAsset ? 'input' : 'asset_select')
      setSelectedAsset(initialAsset ? {
        symbol: initialAsset.symbol,
        balance: initialAsset.balance,
        icon: initialAsset.icon,
        network: initialAsset.network || network,
        usdValue: initialAsset.balance
      } : null)
      setQuote(null)
      setCountdown(30)
      setBridgeStage('idle')
      setBridgeError(null)
      setProgress(0)
    }
  }, [open, initialAsset, network])

  // Countdown timer for quote refresh
  useEffect(() => {
    if (view !== 'quote' || !quote) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Refresh quote when countdown reaches 0
          getQuote()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [view, quote])

  const handlePercentageClick = (percentage: number) => {
    const asset = selectedAsset || initialAsset
    if (asset?.balance) {
      const isStable = ['USDC', 'USDT', 'DAI'].includes(asset.symbol)
      if (isStable) {
        setAmount((asset.balance * percentage).toFixed(2))
      } else {
        setAmount((asset.balance * percentage).toFixed(4))
      }
    }
  }

  const getQuote = async () => {
    try {
      setIsLoadingQuote(true)
      setBridgeError(null)
      const tokenAmount = parseFloat(amount)
      const asset = selectedAsset || initialAsset
      const sourceNetwork = asset?.network || network
      
      // Calculate USD value based on token type
      const tokenSymbol = asset?.symbol || 'ETH'
      let tokenPrice = 1; // Default for stablecoins
      if (tokenSymbol === 'SOL') tokenPrice = prices.solana
      else if (tokenSymbol === 'ETH') tokenPrice = prices.ethereum
      else if (tokenSymbol === 'TRX') tokenPrice = prices.tron
      
      const amountInUsd = tokenAmount * tokenPrice

      // Validate minimum amount for DeBridge
      if (amountInUsd < 10) {
        throw new Error(`Minimum amount is $10 USD (current: $${amountInUsd.toFixed(2)} = ${tokenAmount.toFixed(4)} ${tokenSymbol}). DeBridge has fixed fees of ~$2-3.`)
      }

      // For SOL on Solana: Need to swap SOL → USDC on Solana first, then bridge (or direct deposit)
      // For this quote, we'll use the USD value as the USDC amount
      if (tokenSymbol === 'SOL' && sourceNetwork === 'Solana') {
        // Solana → Solana: Just show estimated USDC amount (Jupiter swap would happen)
        // Estimate 0.5% slippage for Jupiter swap
        const estimatedUSDCAmount = amountInUsd * 0.995
        
        setQuote({
          youSend: {
            token: 'SOL',
            amount: tokenAmount.toFixed(6),
          },
          youReceive: {
            token: 'USDC',
            amount: estimatedUSDCAmount.toFixed(2),
          },
          source: {
            token: 'SOL',
            network: 'Solana',
            account: 'Wallet',
          },
          destination: {
            token: 'USDC',
            network: 'Solana',
            account: 'Mullet Account',
          },
          networkCost: '$0.01', // Solana transaction fee
          priceImpact: '0.5%',
          maxSlippage: 'Auto • 0.50%',
          estimatedTime: '~1 minute',
        })

        setCountdown(30)
        setIsLoadingQuote(false)
        return
      }

      // Use DeBridge for cross-chain quotes
      const ethWallet = wallets.find((w: any) => w.address.startsWith('0x'))
      if (!ethWallet) throw new Error('No Ethereum wallet found')

      // Determine source chain and token
      let srcChainId: number = DEBRIDGE_CHAIN_IDS.ETHEREUM
      let srcAddress = ethWallet.address
      let srcToken = asset?.symbol || 'ETH'
      let srcTokenAddress: string
      let decimals: number

      // Set token address and decimals based on selected token
      if (asset?.symbol === 'ETH') {
        srcTokenAddress = '0x0000000000000000000000000000000000000000' // Native ETH
        decimals = 18
      } else if (asset?.symbol === 'USDT') {
        srcTokenAddress = DEBRIDGE_TOKENS.ETHEREUM.USDT
        decimals = 6
      } else {
        srcTokenAddress = DEBRIDGE_TOKENS.ETHEREUM.USDC
        decimals = 6
      }

      if (sourceNetwork === 'Tron' || asset?.symbol === 'TRX' || asset?.symbol === 'USDT') {
        if (!tronAddress) {
          throw new Error('TRON wallet not connected')
        }
        srcChainId = DEBRIDGE_CHAIN_IDS.TRON
        srcAddress = tronAddress
        srcToken = asset?.symbol || 'USDT'
        if (asset?.symbol === 'USDC') {
          srcTokenAddress = DEBRIDGE_TOKENS.TRON.USDC
          decimals = 6
        } else if (asset?.symbol === 'TRX') {
          srcTokenAddress = '0x0000000000000000000000000000000000000000' // Native TRX
          decimals = 6
        } else {
          srcTokenAddress = DEBRIDGE_TOKENS.TRON.USDT
          decimals = 6
        }
      }

      // Destination is always Solana
      const dstChainId = DEBRIDGE_CHAIN_IDS.SOLANA
      const dstAddress = solanaWallet?.address || walletAddress // 使用 Solana 钱包地址
      const dstTokenAddress = DEBRIDGE_TOKENS.SOLANA.USDC
      
      // Calculate amount in smallest unit based on token decimals
      // For native tokens (ETH, TRX), use tokenAmount directly
      // For stablecoins, can use amountInUsd since they're ~$1
      const amountInSmallestUnit = Math.floor(tokenAmount * Math.pow(10, decimals)).toString()

      console.log('[SwapDialog] Quote address debug:', {
        solanaWalletAddress: solanaWallet?.address,
        walletAddressProp: walletAddress,
        finalDstAddress: dstAddress,
        isSolanaFormat: dstAddress?.length === 44 && !dstAddress?.startsWith('0x')
      })

      // Get DeBridge quote (doesn't execute anything)
      const quoteParams: DeBridgeParams = {
        srcChainId,
        dstChainId,
        srcChainTokenIn: srcTokenAddress,
        srcChainTokenInAmount: amountInSmallestUnit,
        dstChainTokenOut: dstTokenAddress,
        dstChainTokenOutRecipient: dstAddress,
        srcChainOrderAuthorityAddress: srcAddress,
        dstChainOrderAuthorityAddress: dstAddress,
      }

      console.log('[SwapDialog] Getting DeBridge quote:', quoteParams)
      const deBridgeQuote = await getDeBridgeQuote(quoteParams)

      // Extract actual receive amount from DeBridge quote
      const dstChainTokenOutAmount = deBridgeQuote.estimation?.dstChainTokenOut?.recommendedAmount || 
                                      deBridgeQuote.estimation?.dstChainTokenOut?.amount || '0'
      const actualReceiveAmount = parseFloat(dstChainTokenOutAmount) / 1e6; // USDC has 6 decimals

      console.log('[SwapDialog] DeBridge quote received:', {
        sendAmount: tokenAmount,
        receiveAmount: actualReceiveAmount,
        dstChainTokenOutAmount,
      })

      // Calculate send amount (estimate 1% fee)
      const sendAmount = tokenAmount * 1.01

      setQuote({
        youSend: {
          token: srcToken,
          amount: sendAmount.toFixed(6),
        },
        youReceive: {
          token: 'USDC',
          amount: actualReceiveAmount.toFixed(2),
        },
        source: {
          token: srcToken,
          network: sourceNetwork || 'Ethereum',
          account: 'Wallet',
        },
        destination: {
          token: 'USDC',
          network: 'Solana',
          account: 'Mullet Account',
        },
        networkCost: '$2.50', // DeBridge typical fee
        priceImpact: '0.1%',
        maxSlippage: 'Auto • 0.50%',
        estimatedTime: '~5 minutes',
      })

      setCountdown(30); // Reset countdown when new quote is fetched
      setIsLoadingQuote(false)
    } catch (error) {
      console.error('[SwapDialog] Quote failed:', error)
      setBridgeError(error instanceof Error ? error.message : 'Failed to get quote')
      setIsLoadingQuote(false)
      setView('input'); // Go back to input view on error
    }
  }

  // Direct one-step bridge: ETH → Solana (DeBridge only)
  const executeDirectBridge = async (_ethAddress: string, tokenAmount: number): Promise<void> => {
    console.log('[SwapDialog] Starting direct ETH → Solana bridge:', tokenAmount)
    setProgress(20)
    setBridgeStage('step2-executing')

    try {
      // Use consistent wallet selection logic (same as TransferCryptoDialog)
      const ethWallets = wallets.filter(w => w.address.startsWith('0x'))
      if (ethWallets.length === 0) {
        throw new Error('Ethereum wallet not found')
      }

      // Three-tier selection: walletSource match → Privy embedded → first ETH wallet
      let ethWallet = ethWallets.find(w => w.walletClientType === walletSource)
      
      if (!ethWallet && walletSource !== 'privy') {
        ethWallet = ethWallets.find(w => w.walletClientType === 'privy')
      }
      
      if (!ethWallet) {
        ethWallet = ethWallets[0]
      }

      console.log('[SwapDialog] Selected ETH wallet:', {
        address: ethWallet.address,
        type: ethWallet.walletClientType,
        walletSource
      })

      // Token addresses for DeBridge - use the actual selected token
      const selectedToken = (selectedAsset || initialAsset)?.symbol || 'USDC'
      
      // Determine source token address and decimals
      let srcTokenAddress: string
      let decimals: number
      
      if (selectedToken === 'ETH') {
        // Native ETH - use zero address
        srcTokenAddress = '0x0000000000000000000000000000000000000000'
        decimals = 18
      } else if (selectedToken === 'USDT') {
        srcTokenAddress = DEBRIDGE_TOKENS.ETHEREUM.USDT
        decimals = 6
      } else {
        // USDC or other stablecoins
        srcTokenAddress = DEBRIDGE_TOKENS.ETHEREUM.USDC
        decimals = 6
      }
      
      const dstTokenAddress = DEBRIDGE_TOKENS.SOLANA.USDC; // Always bridge to USDC on Solana
      
      // Calculate amount in smallest unit based on token decimals
      // tokenAmount is the actual token amount (e.g., 0.01 ETH or 50 USDT)
      const amountInSmallestUnit = Math.floor(tokenAmount * Math.pow(10, decimals)).toString()
      const solanaAddress = solanaWallet?.address || walletAddress // 使用 Solana 钱包地址

      console.log('[SwapDialog] Execute address debug:', {
        solanaWalletAddress: solanaWallet?.address,
        walletAddressProp: walletAddress,
        finalSolanaAddress: solanaAddress,
        isSolanaFormat: solanaAddress?.length === 44 && !solanaAddress?.startsWith('0x')
      })

      console.log('[SwapDialog] Using token:', {
        selected: selectedToken,
        srcTokenAddress,
        decimals,
        tokenAmount,
        amountInSmallestUnit
      })

      // Get DeBridge quote
      console.log('[SwapDialog] Requesting DeBridge quote...')
      setProgress(30)
      
      const quote = await getDeBridgeQuote({
        srcChainId: DEBRIDGE_CHAIN_IDS.ETHEREUM,
        dstChainId: DEBRIDGE_CHAIN_IDS.SOLANA,
        srcChainTokenIn: srcTokenAddress,
        srcChainTokenInAmount: amountInSmallestUnit,
        dstChainTokenOut: dstTokenAddress,
        dstChainTokenOutRecipient: solanaAddress,
        srcChainOrderAuthorityAddress: ethWallet.address,
        dstChainOrderAuthorityAddress: solanaAddress,
      })

      console.log('[SwapDialog] DeBridge quote received:', {
        estimation: quote.estimation,
        allowanceTarget: quote.tx?.allowanceTarget,
        allowanceValue: quote.tx?.allowanceValue,
      })

      // Check ETH balance for gas fees
      const publicClient = createPublicClient({
        chain: mainnet,
        transport: http()
      })
      
      const ethBalance = await publicClient.getBalance({
        address: ethWallet.address as `0x${string}`
      })
      
      console.log('[SwapDialog] ETH balance:', {
        wei: ethBalance.toString(),
        eth: Number(ethBalance) / 1e18,
        hasBalance: ethBalance > BigInt(0)
      })
      
      if (ethBalance === BigInt(0)) {
        throw new Error('⚠️ No ETH for gas fees! Please add ETH to your wallet: ' + ethWallet.address)
      }

      // Check if this is an external wallet (not Privy embedded)
      const isExternalWallet = ethWallet.walletClientType !== 'privy'
      console.log('[SwapDialog] Is external wallet:', isExternalWallet)

      // For external wallets, create wallet client from their provider
      let walletClient
      if (isExternalWallet) {
        const evmProvider = await ethWallet.getEthereumProvider()
        if (!evmProvider) {
          throw new Error('Failed to get Ethereum provider from external wallet')
        }
        walletClient = createWalletClient({
          account: ethWallet.address as `0x${string}`,
          chain: mainnet,
          transport: custom(evmProvider)
        })
        console.log('[SwapDialog] Created wallet client for external wallet')
      }

      // Step 1: Check and approve token to DeBridge contract (only for ERC20 tokens, not ETH)
      if (selectedToken !== 'ETH') {
        console.log('[SwapDialog] Step 1: Checking token allowance...')
        setProgress(40)

        const ERC20_ABI = [
          {
            name: 'approve',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'spender', type: 'address' },
              { name: 'amount', type: 'uint256' }
            ],
            outputs: [{ name: '', type: 'bool' }]
          },
          {
            name: 'allowance',
            type: 'function',
            stateMutability: 'view',
            inputs: [
              { name: 'owner', type: 'address' },
              { name: 'spender', type: 'address' }
            ],
            outputs: [{ name: '', type: 'uint256' }]
          }
        ]

        // Check current allowance
        const currentAllowance = await publicClient.readContract({
          address: srcTokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'allowance',
          args: [ethWallet.address as `0x${string}`, quote.tx.allowanceTarget as `0x${string}`]
        }) as bigint

        console.log('[SwapDialog] Current allowance:', currentAllowance.toString())
        console.log('[SwapDialog] Required amount:', amountInSmallestUnit)

        // Only approve if current allowance is insufficient
        if (currentAllowance < BigInt(amountInSmallestUnit)) {
          console.log('[SwapDialog] Insufficient allowance, requesting approval...')
          setProgress(45)

          // 🔥 USDT special case: if current allowance > 0, must reset to 0 first
          const isUSDT = srcTokenAddress.toLowerCase() === '0xdac17f958d2ee523a2206206994597c13d831ec7'
          if (isUSDT && currentAllowance > BigInt(0)) {
            console.log('[SwapDialog] ⚠️ USDT detected with existing allowance, resetting to 0 first...')
            
            const resetApproveData = encodeFunctionData({
              abi: ERC20_ABI,
              functionName: 'approve',
              args: [quote.tx.allowanceTarget, BigInt(0)]
            })

            let resetTxHash: string
            if (isExternalWallet && walletClient) {
              resetTxHash = await walletClient.sendTransaction({
                to: srcTokenAddress as `0x${string}`,
                data: resetApproveData as `0x${string}`,
                chain: mainnet,
              })
            } else {
              const resetTxResult = await sendTransaction({
                to: srcTokenAddress as `0x${string}`,
                from: ethWallet.address as `0x${string}`,
                data: resetApproveData as `0x${string}`,
                chainId: 1,
              })
              resetTxHash = resetTxResult.hash
            }

            console.log('[SwapDialog] ✅ Reset approval tx sent:', resetTxHash)
            console.log('[SwapDialog] Waiting for reset confirmation...')
            
            const resetReceipt = await publicClient.waitForTransactionReceipt({
              hash: resetTxHash as `0x${string}`,
              timeout: 180_000
            })

            if (resetReceipt.status === 'reverted') {
              throw new Error('Reset approval transaction failed')
            }

            console.log('[SwapDialog] ✅ Reset approval confirmed')
          }

          const approveData = encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [quote.tx.allowanceTarget, BigInt(quote.tx.allowanceValue)]
          })

          console.log('[SwapDialog] Sending approve transaction...')

          let approveTxHash: string
          if (isExternalWallet && walletClient) {
            // Use wallet client for external wallets
            approveTxHash = await walletClient.sendTransaction({
              to: srcTokenAddress as `0x${string}`,
              data: approveData as `0x${string}`,
              chain: mainnet,
            })
            console.log('[SwapDialog] ✅ External wallet approve tx sent:', approveTxHash)
          } else {
            // Use Privy sendTransaction for embedded wallets
            const approveTxResult = await sendTransaction({
              to: srcTokenAddress as `0x${string}`,
              from: ethWallet.address as `0x${string}`,
              data: approveData as `0x${string}`,
              chainId: 1,
            })
            approveTxHash = approveTxResult.hash
            console.log('[SwapDialog] ✅ Privy approve tx sent:', approveTxHash)
          }

          console.log('[SwapDialog] Waiting for approve confirmation...')
          
          const approveReceipt = await publicClient.waitForTransactionReceipt({
            hash: approveTxHash as `0x${string}`,
            timeout: 180_000
          })

          if (approveReceipt.status === 'reverted') {
            throw new Error('Token approval failed')
          }

          console.log('[SwapDialog] ✅ Approve confirmed:', approveReceipt.transactionHash)
        }
      } else {
        console.log('[SwapDialog] Skipping approval for native ETH')
        setProgress(50)
      }

      // Step 2: Get transaction data from DeBridge create-tx API
      console.log('[SwapDialog] Step 2: Getting DeBridge transaction data...')
      setProgress(60)

      const createTxUrl = new URL('https://dln.debridge.finance/v1.0/dln/order/create-tx')
      createTxUrl.searchParams.append('srcChainId', '1'); // Ethereum
      createTxUrl.searchParams.append('srcChainTokenIn', srcTokenAddress)
      createTxUrl.searchParams.append('srcChainTokenInAmount', amountInSmallestUnit)
      createTxUrl.searchParams.append('dstChainId', '7565164'); // Solana
      createTxUrl.searchParams.append('dstChainTokenOut', dstTokenAddress)
      createTxUrl.searchParams.append('dstChainTokenOutRecipient', solanaAddress)
      createTxUrl.searchParams.append('srcChainOrderAuthorityAddress', ethWallet.address)
      createTxUrl.searchParams.append('dstChainOrderAuthorityAddress', solanaAddress)
      createTxUrl.searchParams.append('prependOperatingExpenses', 'false')

      console.log('[SwapDialog] create-tx URL:', createTxUrl.toString())

      const createTxResponse = await fetch(createTxUrl.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!createTxResponse.ok) {
        const errorText = await createTxResponse.text()
        console.error('[SwapDialog] Failed to get transaction data:', errorText)
        throw new Error(`Failed to get DeBridge transaction data: ${createTxResponse.status}`)
      }

      const txData = await createTxResponse.json() as any
      console.log('[SwapDialog] Transaction data received:', txData)

      if (!txData.tx || !txData.tx.to || !txData.tx.data) {
        console.error('[SwapDialog] Invalid transaction data:', txData.tx)
        throw new Error('DeBridge API did not return valid transaction data')
      }

      const orderId = txData.orderId
      const dstChainTokenOutAmount = txData.estimation?.dstChainTokenOut?.recommendedAmount || txData.estimation?.dstChainTokenOut?.amount
      
      console.log('[SwapDialog] Order ID:', orderId)
      console.log('[SwapDialog] Expected Solana USDC amount:', dstChainTokenOutAmount)

      // Step 3: Execute the DeBridge order transaction
      console.log('[SwapDialog] Step 3: Executing DeBridge order...')
      setProgress(75)

      let orderTxHash: string
      if (isExternalWallet && walletClient) {
        // Use wallet client for external wallets
        orderTxHash = await walletClient.sendTransaction({
          to: txData.tx.to as `0x${string}`,
          data: txData.tx.data as `0x${string}`,
          value: txData.tx.value ? BigInt(txData.tx.value) : BigInt(0),
          chain: mainnet,
        })
        console.log('[SwapDialog] ✅ External wallet order tx sent:', orderTxHash)
      } else {
        // Use Privy sendTransaction for embedded wallets
        const orderTxResult = await sendTransaction({
          to: txData.tx.to as `0x${string}`,
          from: ethWallet.address as `0x${string}`,
          data: txData.tx.data as `0x${string}`,
          value: txData.tx.value ? BigInt(txData.tx.value) : BigInt(0),
          chainId: 1,
        })
        orderTxHash = orderTxResult.hash
        console.log('[SwapDialog] ✅ Privy order tx sent:', orderTxHash)
      }

      console.log('[SwapDialog] Waiting for order confirmation...')

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: orderTxHash as `0x${string}`,
        timeout: 180_000
      })

      if (receipt.status === 'reverted') {
        throw new Error('DeBridge order transaction failed')
      }

      console.log('[SwapDialog] ✅ Order confirmed:', receipt.transactionHash)
      console.log('[SwapDialog] 🎉 Bridge order created! Order ID:', orderId)
      console.log('[SwapDialog] Expected to receive', (parseFloat(dstChainTokenOutAmount) / 1e6).toFixed(2), 'USDC on Solana')

      setProgress(100)
      setBridgeStage('completed')

    } catch (error: any) {
      console.error('[SwapDialog] Direct bridge error:', error)
      setBridgeStage('error')
      throw error
    }
  }

  // Two-step bridge: TRON → ETH → Solana
  const executeTronBridge = async (amountInUsd: string) => {
    console.log('[SwapDialog] Starting TRON two-step bridge...')
    setBridgeStage('step1-executing')
    setProgress(10)

    if (!tronAddress) {
      throw new Error('TRON wallet not connected')
    }

    const tronAddr = tronAddress
    const ethWallet = wallets.find((w: any) => w.address.startsWith('0x'))
    if (!ethWallet) throw new Error('No Ethereum wallet found')
    const ethAddress = ethWallet.address

    // Import TronWeb and create instance
    const { TronWeb } = await import('tronweb')
    const tronWeb = new TronWeb({
      fullHost: 'https://rpc.ankr.com/premium-http/tron/6399319de5985a2ee9496b8ae8590d7bba3988a6fb28d4fc80cb1fbf9f039fb3',
    })

    // Find TRON wallet from user.linkedAccounts (Privy embedded wallet)
    const tronAccount = user?.linkedAccounts?.find(
      (account: any) => account.type === 'wallet' && account.chainType === 'tron'
    ) as any
    
    if (!tronAccount) {
      throw new Error('TRON wallet not found in linked accounts')
    }

    const tronWalletId = tronAccount.walletId || tronAccount.id
    const tronPublicKey = tronAccount.publicKey
    
    if (!tronWalletId || !tronPublicKey) {
      throw new Error('TRON wallet missing ID or public key')
    }

    const accessToken = await getAccessToken()
    if (!accessToken) {
      throw new Error('Failed to get access token')
    }

    // Step 1: TRON → Ethereum via DeBridge
    const srcTokenAddress = (selectedAsset || initialAsset)?.symbol === 'USDC' 
      ? DEBRIDGE_TOKENS.TRON.USDC 
      : DEBRIDGE_TOKENS.TRON.USDT
    const dstChainId = DEBRIDGE_CHAIN_IDS.ETHEREUM
    const dstTokenAddress = (selectedAsset || initialAsset)?.symbol === 'USDC' 
      ? DEBRIDGE_TOKENS.ETHEREUM.USDC 
      : DEBRIDGE_TOKENS.ETHEREUM.USDT
    
    const amountInSmallestUnit = Math.floor(parseFloat(amountInUsd) * 1e6).toString()

    const quote = await getDeBridgeQuote({
      srcChainId: DEBRIDGE_CHAIN_IDS.TRON,
      dstChainId,
      srcChainTokenIn: srcTokenAddress,
      srcChainTokenInAmount: amountInSmallestUnit,
      dstChainTokenOut: dstTokenAddress,
      dstChainTokenOutRecipient: ethAddress,
      srcChainOrderAuthorityAddress: tronAddr,
      dstChainOrderAuthorityAddress: ethAddress,
    })

    console.log('[SwapDialog] DeBridge quote received')
    setProgress(15)

    // Create DeBridge order
    const step1Result = await createDeBridgeOrderTron(
      quote,
      srcTokenAddress,
      amountInSmallestUnit,
      tronAddr,
      ethAddress,
      tronWalletId || '',
      '',
      accessToken,
      true
    )
    console.log('[SwapDialog] DeBridge order created')

    console.log('[SwapDialog] Step 1 completed:', step1Result.txHash)
    setProgress(25)

    // Step 2: Wait for DeBridge confirmation
    if (!step1Result.orderId) {
      throw new Error('No order ID from DeBridge')
    }

    setBridgeStage('step1-confirming')

    let confirmed = false
    let attempts = 0
    const maxAttempts = 20; // 20 attempts × 10s = ~3.3 minutes

    while (!confirmed && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000))
      
      const orderStatus = await getDeBridgeOrderStatus(step1Result.orderId)
      console.log(`[SwapDialog] Order status (${attempts + 1}):`, orderStatus.status)

      if (orderStatus.status === 'Fulfilled' || orderStatus.status === 'SentUnlock') {
        confirmed = true
        console.log('[SwapDialog] ✅ TRON → Ethereum confirmed')
      } else if (orderStatus.status === 'OrderCancelled') {
        throw new Error('DeBridge order cancelled')
      }

      attempts++
      setProgress(25 + (attempts / maxAttempts) * 30)
    }

    if (!confirmed) {
      throw new Error('Bridge confirmation timeout')
    }

    // Step 3: Ethereum → Solana via direct DeBridge
    console.log('[SwapDialog] Step 3: Bridging Ethereum → Solana...')
    setBridgeStage('step2-executing')
    setProgress(60)

    const ethereumAmount = step1Result.dstChainTokenOutAmount || amountInSmallestUnit
    console.log('[SwapDialog] Ethereum amount for final bridge:', ethereumAmount)

    // Execute final ETH → Solana bridge
    await executeDirectBridge(ethAddress, parseFloat(ethereumAmount) / 1e6)
  }

  const handleContinue = async () => {
    // If in input view, get quote first
    if (view === 'input') {
      setView('quote'); // Switch to quote view immediately
      await getQuote()
      return
    }

    // If in quote view, execute the swap
    try {
      setView('executing')
      setLoading(true)
      setBridgeError(null)
      setProgress(0)

      const tokenAmount = parseFloat(amount); // User input token amount (e.g., 0.01 ETH or 50 USDT)
      const sourceNetwork = (selectedAsset || initialAsset)?.network || network

      console.log('[SwapDialog] Starting swap:', {
        tokenAmount,
        from: (selectedAsset || initialAsset)?.symbol,
        network: sourceNetwork,
      })

      // Check if source is TRON - use two-step bridge
      if (sourceNetwork === 'Tron') {
        console.log('[SwapDialog] Using two-step bridge: TRON → ETH → Solana')
        await executeTronBridge(amount); // For TRON, keep as string
      } else {
        // ETH or other EVM chains - direct bridge to Solana
        console.log('[SwapDialog] Using direct bridge: ETH → Solana')
        setBridgeStage('step2-executing')
        const ethWallet = wallets.find((w: any) => w.address.startsWith('0x'))
        if (!ethWallet) throw new Error('No Ethereum wallet found')
        
        // Direct DeBridge to Solana (one step)
        await executeDirectBridge(ethWallet.address, tokenAmount)
      }

      console.log('[SwapDialog] Swap completed successfully')
      setTimeout(() => {
        setLoading(false)
        onClose()
      }, 2000)

    } catch (error) {
      console.error('[SwapDialog] Swap failed:', error)
      setBridgeError(error instanceof Error ? error.message : 'Swap failed')
      setBridgeStage('error')
      setLoading(false)
    }
  }

  // 根据主题动态获取颜色
  const getColor = {
    text: isDark ? 'white' : '#000000',
    textSecondary: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
    textTertiary: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)',
    background: isDark ? '#1a1a1a' : '#ffffff',
    cardBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    cardBgHover: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      centered
      className="swap-dialog"
      styles={{
        body: {
          padding: '24px',
          minHeight: 500,
          background: isDark ? '#1a1a1a' : '#ffffff',
        },
        content: {
          background: isDark ? '#1a1a1a' : '#ffffff',
        },
        header: {
          background: isDark ? '#1a1a1a' : '#ffffff',
          borderBottom: 'none',
        }
      }}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space align="center">
            {onBack && (
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={onBack}
                style={{ color: getColor.text, padding: 0 }}
              />
            )}
            <div>
              <Title level={5} style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: getColor.text }}>
                {view === 'asset_select' ? 'Select Asset to Swap' : 'Top Up Your Wallet'}
              </Title>
              <Text style={{ color: getColor.textSecondary, fontSize: '0.875rem' }}>
                {view === 'asset_select' 
                  ? 'Choose which asset to swap to Solana USDC' 
                  : `Balance: $${(selectedAsset || initialAsset)?.balance?.toFixed(2) || '0.00'}`
                }
              </Text>
            </div>
          </Space>
          {view === 'quote' && (
            <div style={{ position: 'relative', width: 44, height: 44 }}>
              <Progress
                type="circle"
                percent={((30 - countdown) / 30) * 100}
                size={44}
                strokeWidth={8}
                strokeColor="#FF6B35"
                showInfo={false}
                style={{ position: 'absolute' }}
              />
              <div style={{
                position: 'absolute',
                width: 36,
                height: 36,
                left: 4,
                top: 4,
                borderRadius: '50%',
                background: getColor.cardBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{ color: getColor.text, fontWeight: 600, fontSize: '0.875rem' }}>
                  {countdown}
                </Text>
              </div>
            </div>
          )}
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Asset Selection View */}
        {view === 'asset_select' && (
          <>
            <Space direction="vertical" size={12} style={{ width: '100%', marginTop: 8 }}>
              {assets.map((asset) => {
                // Solana USDC 是充值目标，不能作为源资产
                const isTargetAsset = asset.symbol === 'USDC' && asset.network === 'Solana'
                const isDisabled = isTargetAsset
                
                return (
                  <div
                    key={`${asset.symbol}-${asset.network}`}
                    onClick={() => {
                      if (!isDisabled) {
                        setSelectedAsset(asset)
                        setView('input')
                      }
                    }}
                    style={{
                      background: getColor.cardBg,
                      border: `2px solid ${selectedAsset?.symbol === asset.symbol && selectedAsset?.network === asset.network ? '#FF6B35' : 'transparent'}`,
                      borderRadius: 12,
                      padding: 16,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      opacity: isDisabled ? 0.5 : 1,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isDisabled) {
                        e.currentTarget.style.background = getColor.cardBgHover
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isDisabled) {
                        e.currentTarget.style.background = getColor.cardBg
                      }
                    }}
                  >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ position: 'relative' }}>
                        <img 
                          src={asset.icon} 
                          alt={asset.symbol}
                          style={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }} 
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: isDark ? '#1a1a1a' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <img 
                            src={CHAIN_ICONS[asset.network] || TOKEN_ICONS.ETH} 
                            alt={asset.network}
                            style={{ 
                              width: 14, 
                              height: 14, 
                              borderRadius: '50%',
                            }} 
                          />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Text style={{ fontSize: '1rem', fontWeight: 500, color: getColor.text }}>
                            {asset.symbol}
                          </Text>
                          <Text style={{ fontSize: '0.75rem', color: getColor.textSecondary }}>
                            {asset.network}
                          </Text>
                        </div>
                        <Text style={{ fontSize: '0.875rem', color: getColor.textSecondary }}>
                          {asset.balance.toFixed(asset.symbol === 'USDT' ? 2 : 5)} {asset.symbol}
                        </Text>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* Solana USDC 是充值目标，不显示 Low Balance */}
                      {asset.symbol === 'USDC' && asset.network === 'Solana' ? (
                        <div style={{
                          padding: '4px 8px',
                          borderRadius: 16,
                          background: getColor.cardBg,
                        }}>
                          <Text style={{ fontSize: '0.75rem', color: getColor.textSecondary }}>
                            N/A
                          </Text>
                        </div>
                      ) : asset.usdValue < 10 && (
                        <div style={{
                          padding: '4px 8px',
                          borderRadius: 16,
                          background: getColor.cardBg,
                        }}>
                          <Text style={{ fontSize: '0.75rem', color: getColor.textSecondary }}>
                            Low Balance
                          </Text>
                        </div>
                      )}
                      <Text style={{ fontSize: '1rem', fontWeight: 500, color: getColor.text }}>
                        ${asset.usdValue.toFixed(2)}
                      </Text>
                    </div>
                  </div>
                </div>
                )
              })}
            </Space>
          </>
        )}
        
        {/* Input View */}
        {view === 'input' && (
          <>
            {/* Main Input */}
            <div style={{ position: 'relative', width: '100%', textAlign: 'center', marginBottom: 8 }}>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                prefix={
                  <Text style={{ fontSize: '3.5rem', fontWeight: 500, color: amount ? getColor.text : getColor.textTertiary, marginRight: 8 }}>
                    $
                  </Text>
                }
                style={{
                  fontSize: '3.5rem',
                  fontWeight: 500,
                  textAlign: 'center',
                  border: 'none',
                  background: 'transparent',
                  color: getColor.text,
                  padding: 0,
                }}
                bordered={false}
              />
            </div>

            {/* Conversion Estimate */}
            <Space align="center" style={{ marginBottom: 32 }}>
              <SwapOutlined style={{ color: getColor.textSecondary, fontSize: 20 }} />
              <Text style={{ color: getColor.textSecondary }}>
                {amount ? parseFloat(amount).toFixed(5) : '0.00000'} {(selectedAsset || initialAsset)?.symbol || 'USDC'}
              </Text>
            </Space>

            {/* Percentage Buttons */}
            <Space size={12} style={{ marginBottom: 48, width: '100%', justifyContent: 'center' }}>
              {[0.25, 0.50, 0.75, 1].map((percent) => (
                <Button
                  key={percent}
                  onClick={() => handlePercentageClick(percent)}
                  style={{
                    borderColor: getColor.border,
                    color: getColor.text,
                    borderRadius: 8,
                    padding: '8px 20px',
                    background: getColor.cardBg,
                  }}
                >
                  {percent === 1 ? 'Max' : `${percent * 100}%`}
                </Button>
              ))}
            </Space>

            {/* Asset Pill */}
            <div
              style={{
                background: getColor.cardBgHover,
                borderRadius: 100,
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginBottom: 'auto',
              }}
            >
              <Space align="center" size={8}>
                <div style={{ position: 'relative', width: 24, height: 24 }}>
                  <img 
                    src={(selectedAsset || initialAsset)?.icon || TOKEN_ICONS.USDT} 
                    alt={(selectedAsset || initialAsset)?.symbol}
                    style={{ width: '100%', height: '100%', borderRadius: '50%' }} 
                  />
                  {(selectedAsset || initialAsset)?.network && CHAIN_ICONS[(selectedAsset || initialAsset)?.network || 'Ethereum'] && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -2,
                        right: -2,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: '#1a1a1a',
                        border: '1px solid #1a1a1a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img 
                        src={CHAIN_ICONS[(selectedAsset || initialAsset)?.network || 'Ethereum']} 
                        alt={(selectedAsset || initialAsset)?.network}
                        style={{ width: '100%', height: '100%', borderRadius: '50%' }} 
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Text style={{ color: getColor.textSecondary, fontSize: '0.75rem', display: 'block', lineHeight: 1 }}>
                    You send
                  </Text>
                  <Text style={{ color: getColor.text, fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.2 }}>
                    {(selectedAsset || initialAsset)?.symbol || 'USDT'}
                  </Text>
                </div>
              </Space>

              <ArrowRightOutlined style={{ color: getColor.textTertiary, fontSize: 16 }} />

              <Space align="center" size={8}>
                <div style={{ position: 'relative', width: 24, height: 24 }}>
                  <img 
                    src={TOKEN_ICONS.USDC} 
                    alt="USDC"
                    style={{ width: '100%', height: '100%', borderRadius: '50%' }} 
                  />
                  {network && CHAIN_ICONS[network] && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -2,
                        right: -2,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: '#1a1a1a',
                        border: '1px solid #1a1a1a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img 
                        src={CHAIN_ICONS[network]} 
                        alt={network}
                        style={{ width: '100%', height: '100%', borderRadius: '50%' }} 
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Text style={{ color: getColor.textSecondary, fontSize: '0.75rem', display: 'block', lineHeight: 1 }}>
                    You receive
                  </Text>
                  <Text style={{ color: getColor.text, fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.2 }}>
                    USDC
                  </Text>
                </div>
              </Space>
            </div>

        {/* Continue Button */}
        <Button
          block
          type="primary"
          onClick={handleContinue}
          disabled={!amount || parseFloat(amount) <= 0}
          style={{
            backgroundColor: '#FF6B35',
            color: getColor.text,
            padding: '16px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            marginTop: '32px',
            height: 'auto',
          }}
          onMouseEnter={(e) => !(!amount || parseFloat(amount) <= 0) && (e.currentTarget.style.backgroundColor = '#E55A25')}
          onMouseLeave={(e) => !(!amount || parseFloat(amount) <= 0) && (e.currentTarget.style.backgroundColor = '#FF6B35')}
        >
          Continue
        </Button>

        {/* Error Display */}
        {bridgeError && (
          <Alert
            message={bridgeError}
            type="error"
            showIcon
            style={{
              width: '100%',
              marginTop: 16,
              background: 'rgba(255, 68, 68, 0.1)',
              border: '1px solid rgba(255, 68, 68, 0.3)',
            }}
          />
        )}
        </>
        )}

        {/* Quote View */}
        {view === 'quote' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Source */}
            <div style={{ background: getColor.cardBg, borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Text style={{ color: getColor.textSecondary, minWidth: 65, fontSize: '14px' }}>
                Source
              </Text>
              {isLoadingQuote ? (
                <div style={{ background: getColor.border, borderRadius: '4px', height: 20, flex: 1, ...skeletonPulse }} />
              ) : quote && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative', width: 20, height: 20 }}>
                    <img 
                      src={(selectedAsset || initialAsset)?.icon || TOKEN_ICONS.USDT} 
                      alt={quote.source.token}
                      style={{ width: '100%', height: '100%', borderRadius: '50%' }} 
                    />
                    {quote.source.network && CHAIN_ICONS[quote.source.network] && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: -2,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                        }}
                      >
                        <img src={CHAIN_ICONS[quote.source.network]} alt={quote.source.network} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                      </div>
                    )}
                  </div>
                  <Text style={{ color: getColor.text, fontWeight: 500, fontSize: '14px' }}>
                    {quote.source.account}
                  </Text>
                </div>
              )}
            </div>

            {/* Destination */}
            <div style={{ background: getColor.cardBg, borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Text style={{ color: getColor.textSecondary, minWidth: 65, fontSize: '14px' }}>
                Destination
              </Text>
              {isLoadingQuote ? (
                <div style={{ background: getColor.border, borderRadius: '4px', height: 20, flex: 1, ...skeletonPulse }} />
              ) : quote && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative', width: 20, height: 20 }}>
                    <img 
                      src={TOKEN_ICONS.USDC} 
                      alt="USDC"
                      style={{ width: '100%', height: '100%', borderRadius: '50%' }} 
                    />
                    {quote.destination.network && CHAIN_ICONS[quote.destination.network] && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: -2,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                        }}
                      >
                        <img src={CHAIN_ICONS[quote.destination.network]} alt={quote.destination.network} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                      </div>
                    )}
                  </div>
                  <Text style={{ color: getColor.text, fontWeight: 500, fontSize: '14px' }}>
                    {quote.destination.account}
                  </Text>
                </div>
              )}
            </div>

            {/* Estimated Time */}
            <div style={{ background: getColor.cardBg, borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: getColor.textSecondary, fontSize: '14px' }}>
                Estimated time
              </Text>
              {isLoadingQuote ? (
                <div style={{ background: getColor.border, borderRadius: '4px', height: 20, width: 80, ...skeletonPulse }} />
              ) : quote && (
                <Text style={{ color: getColor.text, fontWeight: 500, fontSize: '14px' }}>
                  {quote.estimatedTime}
                </Text>
              )}
            </div>

            {/* You Send */}
            <div style={{ background: getColor.cardBg, borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              {isLoadingQuote ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text style={{ color: getColor.textSecondary, fontSize: '14px' }}>
                      You send
                    </Text>
                    <div style={{ background: getColor.border, borderRadius: '50%', width: 20, height: 20, ...skeletonPulse }} />
                    <div style={{ background: getColor.border, borderRadius: '4px', height: 16, width: 40, ...skeletonPulse }} />
                  </div>
                  <div style={{ background: getColor.border, borderRadius: '4px', height: 20, width: 60, ...skeletonPulse }} />
                </>
              ) : quote && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text style={{ color: getColor.textSecondary, fontSize: '14px' }}>
                      You send
                    </Text>
                    <div style={{ position: 'relative', width: 20, height: 20 }}>
                      <img 
                        src={(selectedAsset || initialAsset)?.icon || TOKEN_ICONS.USDT} 
                        alt={quote.youSend.token}
                        style={{ width: '100%', height: '100%', borderRadius: '50%' }} 
                      />
                    </div>
                    <Text style={{ color: getColor.text, fontSize: '14px' }}>
                      {quote.youSend.token}
                    </Text>
                  </div>
                  <Text style={{ color: getColor.text, fontWeight: 500, fontSize: '14px' }}>
                    {quote.youSend.amount}
                  </Text>
                </>
              )}
            </div>

            {/* You Receive - Always show user input amount */}
            <div style={{ background: getColor.cardBg, borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text style={{ color: getColor.textSecondary, fontSize: '14px' }}>
                  You receive
                </Text>
                <div style={{ position: 'relative', width: 20, height: 20 }}>
                  <img 
                    src={TOKEN_ICONS.USDC} 
                    alt="USDC"
                    style={{ width: '100%', height: '100%', borderRadius: '50%' }} 
                  />
                </div>
                <Text style={{ color: getColor.text, fontSize: '14px' }}>
                  USDC
                </Text>
              </div>
              <Text style={{ color: getColor.text, fontWeight: 500, fontSize: '14px' }}>
                {quote?.youReceive?.amount || '0.00'}
              </Text>
            </div>

            {/* Transaction Breakdown */}
            {!isLoadingQuote && quote && (
            <Collapse
              ghost
              items={[{
                key: '1',
                label: <Text style={{ color: getColor.textSecondary, fontWeight: 500, fontSize: '14px' }}>Transaction breakdown</Text>,
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ color: getColor.textSecondary, fontSize: '14px' }}>
                        Network cost
                      </Text>
                      <Text style={{ color: getColor.text, fontSize: '14px' }}>
                        {quote.networkCost}
                      </Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ color: getColor.textSecondary, fontSize: '14px' }}>
                        Price impact
                      </Text>
                      <Text style={{ color: getColor.text, fontSize: '14px' }}>
                        {quote.priceImpact}
                      </Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ color: getColor.textSecondary, fontSize: '14px' }}>
                        Max slippage
                      </Text>
                      <Text style={{ color: getColor.text, fontSize: '14px' }}>
                        {quote.maxSlippage}
                      </Text>
                    </div>
                  </div>
                )
              }]}
              style={{
                background: getColor.cardBg,
                borderRadius: '8px',
              }}
            />
            )}

            {/* Terms Agreement */}
            {!isLoadingQuote && quote && (
            <div style={{ background: getColor.cardBg, borderRadius: '8px', padding: '12px', marginTop: '8px' }}>
              <Text style={{ color: getColor.textSecondary, textAlign: 'center', fontSize: '14px' }}>
                By clicking on Confirm Order, you agree to our{' '}
                <span
                  style={{
                    color: getColor.text,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  terms
                </span>
                .
              </Text>
            </div>
            )}

            {/* Confirm Button */}
            <Button
              block
              type="primary"
              onClick={handleContinue}
              disabled={isLoadingQuote || loading}
              loading={isLoadingQuote || loading}
              style={{
                backgroundColor: '#FF6B35',
                color: getColor.text,
                padding: '16px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                marginTop: '16px',
                height: 'auto',
              }}
              onMouseEnter={(e) => !(isLoadingQuote || loading) && (e.currentTarget.style.backgroundColor = '#E55A25')}
              onMouseLeave={(e) => !(isLoadingQuote || loading) && (e.currentTarget.style.backgroundColor = '#FF6B35')}
            >
              {isLoadingQuote ? 'Preparing your quote...' : loading ? 'Regenerating quote...' :
                'Confirm Order'
              }
            </Button>
          </div>
        )}

        {/* Executing View */}
        {view === 'executing' && (
          <div style={{ width: '100%' }}>
            {/* Bridge Progress */}
            {bridgeStage !== 'idle' && (
              <div style={{ width: '100%', marginBottom: '24px' }}>
                <Progress 
                  percent={progress}
                  strokeColor={bridgeStage === 'error' ? '#ff4444' : (bridgeStage === 'completed' ? '#4caf50' : '#FF6B35')}
                  trailColor="rgba(255,255,255,0.1)"
                  showInfo={false}
                  strokeLinecap="round"
                />
                <Text style={{ color: getColor.textSecondary, marginTop: '8px', textAlign: 'center', display: 'block', fontSize: '14px' }}>
                  {bridgeStage === 'step1-executing' && 'Step 1/2: Bridging via DeBridge...'}
                  {bridgeStage === 'step1-confirming' && 'Step 1/2: Confirming transaction...'}
                  {bridgeStage === 'step2-executing' && 'Step 2/2: Bridging via LiFi...'}
                  {bridgeStage === 'completed' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <CheckCircleOutlined style={{ color: '#4caf50', fontSize: 20 }} />
                      Swap completed successfully!
                    </div>
                  )}
                  {bridgeStage === 'error' && `Error: ${bridgeError}`}
                </Text>
              </div>
            )}

            {/* Error Alert */}
            {bridgeError && (
              <Alert
                message={bridgeError}
                type="error"
                showIcon
                style={{
                  width: '100%',
                  marginBottom: '24px',
                  background: 'rgba(255, 68, 68, 0.1)',
                  border: '1px solid rgba(255, 68, 68, 0.3)',
                }}
              />
            )}
          </div>
        )}

      </div>
    </Modal>
  )
}

export default SwapDialog
