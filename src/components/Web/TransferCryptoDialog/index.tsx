import React, { useState, useEffect } from 'react'
import { Modal, Input, Select, Button, message, QRCode, Typography, Space, Spin, Avatar, theme as antdTheme, Alert, Tooltip } from 'antd'
import { CopyOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { usePrivy, useWallets, useSendTransaction } from '@privy-io/react-auth'
import { SUPPORTED_BRIDGE_CHAINS, SUPPORTED_TOKENS } from '@/config/lifiConfig'
import { TOKEN_ICONS, CHAIN_ICONS } from '@/config/tokenIcons'
import { debridgeService } from '@/services/debridgeService'
import { useDepositListener } from '@/hooks/useDepositListener'
import { findPrivyWalletByChain } from '@/utils/privyWalletHelpers'
import { useStores } from '@/context/mobxProvider'
import { useTronWallet } from '@/hooks/useTronWallet'
import { useCoboWallet } from '@/hooks/useCoboWallet'
import { useCoboDepositAddress } from '@/hooks/useCoboDepositAddress'
import { useCoboDepositMonitor } from '@/hooks/useCoboDepositMonitor'
import { API_BASE_URL } from '@/constants/api'
import './index.less'

const { Text } = Typography

interface TransferCryptoDialogProps {
  open: boolean
  onClose: () => void
  onBack?: () => void
  onDepositDetected?: (amount: string, token: string, chain: string) => void
}

/**
 * 跨链充值对话框
 * 支持 TRON / Ethereum / Solana 充值并自动桥接到 Solana
 */
const TransferCryptoDialog: React.FC<TransferCryptoDialogProps> = ({ open, onClose, onBack, onDepositDetected }) => {
  const { token } = antdTheme.useToken()
  const { getAccessToken, user } = usePrivy()
  const { wallets } = useWallets()

  // Privy v3.8+ Ethereum Gas 赞助
  const { sendTransaction } = useSendTransaction({
    onSuccess: (txReceipt) => {
      console.log('[Privy] ✅ Ethereum transaction successful:', txReceipt)
    },
    onError: (error) => {
      console.error('[Privy] ❌ Ethereum transaction failed:', error)
    }
  })

  const { trade } = useStores()

  // TRON 钱包自动创建和管理
  const { tronAddress, tronWalletId, tronPublicKey, isCreating: isTronWalletCreating } = useTronWallet(true)

  const [selectedChain, setSelectedChain] = useState('Solana')
  const [selectedToken, setSelectedToken] = useState('USDC')
  const [depositAddress, setDepositAddress] = useState('')
  const [bridgeInProgress, setBridgeInProgress] = useState(false)
  const [bridgeStep, setBridgeStep] = useState<'idle' | 'tron-eth' | 'eth-sol' | 'completed'>('idle')
  const [pollingOrderId, setPollingOrderId] = useState<string | null>(null) // 正在轮询的订单 ID

  // 判断当前选择的链是否是 Cobo
  const selectedChainConfig = SUPPORTED_BRIDGE_CHAINS.find((c) => c.name === selectedChain)
  const isCoboChain = selectedChainConfig?.type === 'cobo'

  // 获取用户的 Cobo 钱包（自动创建）
  const {
    walletId: coboWalletId,
    walletData: coboWalletData,
    isLoading: coboWalletLoading,
    error: coboWalletError
  } = useCoboWallet({
    tradeAccountId: trade.currentAccountInfo?.id,
    enabled: open && isCoboChain && !!trade.currentAccountInfo?.id,
    autoCreate: true  // 🔥 启用自动创建钱包
  })

  // 获取 Cobo 充值地址（仅在选择 Cobo 链且已有钱包时启用）
  const {
    address: coboAddress,
    isLoading: coboAddressLoading,
    error: coboAddressError,
    isNew: coboAddressIsNew
  } = useCoboDepositAddress({
    tradeAccountId: trade.currentAccountInfo?.id,
    chainId: selectedChainConfig?.id as 'ETH' | 'SOL' | 'TRON' | 'ARBITRUM_ETH' | 'BASE_ETH' | 'MATIC' | 'BSC_BNB' | 'HYPEREVM_HYPE',
    walletId: coboWalletId || '',
    enabled: open && isCoboChain && !!coboWalletId && !!trade.currentAccountInfo?.id
  })

  // Cobo 充值监听（仅在选择 Cobo 链且已有钱包时启用）
  const {
    transactions: coboTransactions,
    deposits: coboDeposits,
    latestDeposit: coboLatestDeposit,
    confirmingDeposit: coboConfirmingDeposit,
    isMonitoring: coboIsMonitoring,
    startMonitoring: coboStartMonitoring,
    stopMonitoring: coboStopMonitoring,
    getConfirmationProgress,
    getConfirmationPercentage
  } = useCoboDepositMonitor({
    depositAddress: coboAddress || undefined,
    walletIds: coboWalletId ? [coboWalletId] : [],
    enabled: open && isCoboChain && !!coboAddress && !!coboWalletId,
    pollInterval: 10000, // 10秒轮询
    onDepositConfirming: (tx) => {
      console.log('[Cobo] 确认进度:', getConfirmationProgress(tx))
      // 可以在 UI 上显示进度条
    },
    onDepositDetected: (tx) => {
      console.log('[Cobo] 充值到账:', tx)
      if (onDepositDetected) {
        onDepositDetected(tx.destination.amount, tx.token_id, tx.chain_id)
      }
    }
  })

  // 获取所有链的钱包地址
  const ethereumAccount = user?.linkedAccounts?.find((account: any) => account.type === 'wallet' && account.chainType === 'ethereum') as any

  const solanaAccount = user?.linkedAccounts?.find((account: any) => account.type === 'wallet' && account.chainType === 'solana') as any

  // 使用充值监听 hook - 传递所有链的地址（仅 Privy 链）
  const { deposit, isListening, clearDeposit, resetDetection } = useDepositListener({
    enabled: open && !isCoboChain, // Cobo 链使用独立的监听机制
    chains: [selectedChain as 'Tron' | 'Ethereum' | 'Solana'],
    pollInterval: 5000,
    tronAddress: tronAddress || undefined,
    ethereumAddress: ethereumAccount?.address || undefined,
    solanaAddress: solanaAccount?.address || undefined
  })

  // 获取钱包地址
  useEffect(() => {
    if (!open) return

    // 对于 Solana 链，始终使用 PDA 地址
    if (selectedChain === 'Solana') {
      const pdaAddress = trade.currentAccountInfo?.pdaTokenAddress
      if (pdaAddress) {
        setDepositAddress(pdaAddress)
        console.log(`[TransferCrypto] Using Solana PDA address:`, pdaAddress)
      } else {
        setDepositAddress('')
        console.warn(`[TransferCrypto] No PDA address found`)
      }
      return
    }

    // 如果是 Cobo 链（非 Solana），使用 Cobo 地址
    if (isCoboChain) {
      console.log(`[TransferCrypto] Cobo chain status:`, {
        selectedChain,
        chainId: selectedChainConfig?.id,
        coboWalletId,
        coboWalletLoading,
        coboWalletError,
        coboAddress,
        coboAddressLoading,
        coboAddressError
      })

      if (coboAddress) {
        setDepositAddress(coboAddress)
        console.log(`[TransferCrypto] Using Cobo address for ${selectedChain}:`, coboAddress)
      } else if (coboAddressLoading || coboWalletLoading) {
        setDepositAddress('')
        console.log(`[TransferCrypto] Loading Cobo address for ${selectedChain}...`)
      } else if (coboAddressError || coboWalletError) {
        setDepositAddress('')
        console.error(`[TransferCrypto] Cobo error:`, coboAddressError || coboWalletError)
      } else if (!coboWalletId) {
        setDepositAddress('')
        console.log(`[TransferCrypto] Waiting for Cobo wallet ID...`)
      }
      return
    }

    // 原有的 Privy 钱包逻辑
    const loadAddress = () => {
      // 找到对应的链配置
      const chainConfig = SUPPORTED_BRIDGE_CHAINS.find((c) => c.name === selectedChain)
      if (!chainConfig) {
        console.warn(`[TransferCrypto] Chain config not found for: ${selectedChain}`)
        setDepositAddress('')
        return
      }

      const chainType = chainConfig.id // 'tron' | 'ethereum' | 'solana'

      // 对于 Solana，使用 PDA 地址
      if (chainType === 'solana') {
        const pdaAddress = trade.currentAccountInfo?.pdaTokenAddress
        if (pdaAddress) {
          setDepositAddress(pdaAddress)
          console.log(`[TransferCrypto] Using Solana PDA address:`, pdaAddress)
        } else {
          console.warn(`[TransferCrypto] No PDA address found`)
          setDepositAddress('')
        }
        return
      }

      // 对于 TRON，优先使用 hook 返回的地址
      if (chainType === 'tron') {
        if (tronAddress) {
          setDepositAddress(tronAddress)
          console.log(`[TransferCrypto] Using TRON wallet from hook:`, tronAddress)
          return
        }

        // 如果 hook 还在创建中，等待
        if (isTronWalletCreating) {
          console.log(`[TransferCrypto] TRON wallet is being created...`)
          setDepositAddress('')
          return
        }
      }

      // 其他链从 user.linkedAccounts 查找钱包
      const walletAccount = user?.linkedAccounts?.find(
        (account: any) => account.type === 'wallet' && account.chainType === chainType
      ) as any

      if (walletAccount?.address) {
        setDepositAddress(walletAccount.address)
        console.log(`[TransferCrypto] Using ${selectedChain} wallet:`, walletAccount.address)
      } else {
        console.warn(`[TransferCrypto] No ${selectedChain} wallet found for chainType: ${chainType}`)
        console.warn('[TransferCrypto] Available accounts:', user?.linkedAccounts)
        setDepositAddress('')
      }
    }

    loadAddress()
  }, [
    open,
    selectedChain,
    user,
    trade.currentAccountInfo,
    tronAddress,
    isTronWalletCreating,
    isCoboChain,
    coboWalletId,
    coboWalletLoading,
    coboWalletError,
    coboAddress,
    coboAddressLoading,
    coboAddressError
  ])

  // Cobo 充值监听 - 地址加载完成后自动启动
  // 使用 ref 避免 callback 变化导致的死循环
  const coboStartMonitoringRef = React.useRef(coboStartMonitoring)
  const coboStopMonitoringRef = React.useRef(coboStopMonitoring)
  coboStartMonitoringRef.current = coboStartMonitoring
  coboStopMonitoringRef.current = coboStopMonitoring

  useEffect(() => {
    // 只有在对话框打开、是 Cobo 链、地址已加载时才启动监听
    if (open && isCoboChain && coboAddress && !coboAddressLoading) {
      console.log('[Cobo] Starting deposit monitoring for address:', coboAddress)
      coboStartMonitoringRef.current()
    } else {
      // 其他情况都停止监听
      coboStopMonitoringRef.current()
    }

    // 组件卸载或依赖变化时确保停止监听
    return () => {
      coboStopMonitoringRef.current()
    }
  }, [isCoboChain, coboAddress, coboAddressLoading, open])

  // 对话框关闭时重置检测状态
  useEffect(() => {
    if (!open) {
      resetDetection()
    }
  }, [open, resetDetection])

  // 检测到充值后自动触发桥接
  useEffect(() => {
    console.log('[TransferCrypto] useEffect triggered:', {
      hasDeposit: !!deposit,
      bridgeInProgress,
      depositData: deposit
    })

    if (deposit && !bridgeInProgress) {
      console.log('[TransferCrypto] Deposit detected:', deposit)
      message.success(`Detected ${deposit.amount} ${deposit.token} on ${deposit.chain}!`)

      // 触发桥接 - 使用 rawBalance（最小单位）
      // rawBalance 是十六进制字符串，需要转换为十进制数字字符串
      let amountToUse = deposit.amount
      if (deposit.rawBalance && deposit.rawBalance.startsWith('0x')) {
        amountToUse = BigInt(deposit.rawBalance).toString() // 转换为十进制字符串
        console.log('[TransferCrypto] Converted rawBalance:', deposit.rawBalance, '→', amountToUse)
      } else if (deposit.rawBalance) {
        amountToUse = deposit.rawBalance
      }

      handleAutoBridge(amountToUse, deposit.token, deposit.chain)

      // 清除检测记录
      clearDeposit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deposit])

  // 通知后端开始监控订单 + 前端立即充值
  const notifyBackendBridgeOrder = async (orderId: string, amount: string, token: string, chain: string) => {
    try {
      const targetAddress = trade.currentAccountInfo?.pdaTokenAddress
      if (!targetAddress) {
        console.error('[Bridge] ❌ Backend PDA token address not found!')
        return
      }

      const notifyUrl = new URL(`${API_BASE_URL}/api/debridge-monitor/submit`)
      notifyUrl.searchParams.append('orderId', orderId)
      notifyUrl.searchParams.append('toAddress', targetAddress)
      notifyUrl.searchParams.append('amount', amount)
      notifyUrl.searchParams.append('token', token)
      notifyUrl.searchParams.append('chain', chain)

      console.log('[Bridge] 📡 Notifying backend to monitor order:', {
        orderId,
        targetAddress,
        amount,
        token,
        chain,
        url: notifyUrl.toString()
      })

      // 提交后端监控（不等待结果）
      fetch(notifyUrl.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000)
      })
        .then((response) => {
          if (response.ok) {
            console.log('[Bridge] ✅ Backend notification successful')
          } else {
            console.error('[Bridge] ❌ Backend notification failed:', response.status)
          }
        })
        .catch((error) => {
          console.error('[Bridge] ❌ Failed to notify backend:', error)
        })

      // 🔥 前端立即调用充值 API（不等后端）
      console.log('[Bridge] 💰 Calling recharge API immediately...')
      const rechargeUrl = `https://client-test.mullet.top/api/trade-solana/recharge/swap?toAddress=${targetAddress}&amount=${amount}`

      const rechargeResponse = await fetch(rechargeUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(10000) // 10秒超时
      })

      if (rechargeResponse.ok) {
        const rechargeData = await rechargeResponse.json()
        console.log('[Bridge] ✅ Recharge successful:', rechargeData)
        message.success('🎉 充值成功！资金已到账')
      } else {
        const errorText = await rechargeResponse.text()
        console.error('[Bridge] ❌ Recharge failed:', rechargeResponse.status, errorText)
        message.warning('充值请求已提交，后端将自动重试')
      }
    } catch (error) {
      console.error('[Bridge] ❌ Recharge error:', error)
      message.info('充值处理中，后端将自动完成')
    }
  }

  // 自动桥接
  const handleAutoBridge = async (amount: string, token: string, chain: string) => {
    try {
      setBridgeInProgress(true)
      console.log('[Bridge] Starting with params:', { amount, token, chain, tronAddress, tronWalletId })
      message.loading('正在启动跨链桥接...', 0)

      // 从 user.linkedAccounts 获取钱包地址
      const tronAccount = user?.linkedAccounts?.find((account: any) => account.type === 'wallet' && account.chainType === 'tron') as any
      const ethAccount = user?.linkedAccounts?.find((account: any) => account.type === 'wallet' && account.chainType === 'ethereum') as any
      const solAccount = user?.linkedAccounts?.find((account: any) => account.type === 'wallet' && account.chainType === 'solana') as any

      // 使用 useTronWallet hook 的返回值
      // publicKey 可能为 null（Privy Tier 2 限制），但后端签名不需要它
      if (!tronAddress || !tronWalletId) {
        console.error('[Bridge] Missing TRON wallet info:', { tronAddress, tronWalletId })
        throw new Error('TRON 钱包信息不完整，请刷新页面重试')
      }

      if (!ethAccount || !solAccount) {
        throw new Error('缺少必需的钱包。请确保已创建 Ethereum 和 Solana 钱包。')
      }

      // 构建钱包对象（兼容旧接口）
      const tronWallet = { address: tronAddress }
      const ethWallet = wallets.find((w) => (w as any).chainType === 'ethereum') || { address: ethAccount.address }
      const solWallet = { address: solAccount.address }

      const accessToken = await getAccessToken()
      if (!accessToken) {
        throw new Error('无法获取访问令牌，请重新登录')
      }

      // 检查最低金额：Tron $20, Ethereum $3
      // amount 是最小单位格式（如 USDT: 20000000 = 20 USD）
      const minAmountUSD = chain === 'Tron' ? 20 : chain === 'Ethereum' ? 3 : 10
      const minAmountSmallestUnit = minAmountUSD * 1_000_000 // 转换为最小单位

      const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount

      if (amountNum < minAmountSmallestUnit) {
        const amountUSD = amountNum / 1_000_000
        throw new Error(
          `金额过小。最低金额: $${minAmountUSD} USD，当前金额: $${amountUSD.toFixed(
            2
          )} USD。跨链桥接有固定费用约 $2-3，小额转账费用占比过高。`
        )
      }

      if (chain === 'Tron') {
        // Tron → Ethereum
        console.log('[Bridge] Step 1: Tron → Ethereum')
        setBridgeStep('tron-eth')
        message.loading('步骤 1/2: 正在从 Tron 桥接到 Ethereum...', 0)

        const tronTokenInfo = SUPPORTED_TOKENS.tron.find((t) => t.symbol === token)
        if (!tronTokenInfo) throw new Error(`Token ${token} 在 Tron 上不受支持`)

        console.log('[Bridge] TRON wallet info:', {
          walletId: tronWalletId,
          publicKey: tronPublicKey?.slice(0, 10) + '...',
          address: tronAddress
        })

        const tronResult = await debridgeService.bridgeTronToEthereum({
          tokenAddress: tronTokenInfo.address,
          amount,
          fromAddress: tronWallet.address,
          ethereumAddress: ethWallet.address,
          walletId: tronWalletId,
          publicKey: tronPublicKey || '', // 允许空字符串，后端不需要此参数
          accessToken,
          useGasSponsorship: true
        })

        message.success(`✅ TRON 交易成功: ${tronResult.txHash.slice(0, 8)}...`)
        console.log('[Bridge] TRON tx:', tronResult.txHash)
        console.log('[Bridge] Order ID:', tronResult.orderId)
        console.log('[Bridge] Full TRON result:', tronResult)

        if (!tronResult.orderId) {
          throw new Error('❌ deBridge 未返回 Order ID，无法继续桥接。请检查交易状态或联系支持。')
        }

        // 等待订单完成
        message.loading('等待 TRON → Ethereum 桥接完成 (约 3-5 分钟)...', 0)
        await debridgeService.waitForOrderCompletion(tronResult.orderId)
        message.success('✅ TRON → Ethereum 桥接完成!')

        // Ethereum → Solana
        console.log('[Bridge] Step 2: Ethereum → Solana')
        setBridgeStep('eth-sol')
        message.loading('步骤 2/2: 正在从 Ethereum 桥接到 Solana...', 0)

        const ethTokenInfo = SUPPORTED_TOKENS.ethereum.find((t) => t.symbol === token)
        if (!ethTokenInfo) throw new Error(`Token ${token} 在 Ethereum 上不受支持`)

        const ethResult = await debridgeService.bridgeEthereumToSolana({
          tokenAddress: ethTokenInfo.address,
          amount: tronResult.dstChainTokenOutAmount,
          solanaAddress: solWallet.address,
          privyWallet: ethWallet,
          sendTransaction // Privy v3.8 Gas 赞助
        })

        message.success(`✅ Ethereum 交易成功: ${ethResult.txHash.slice(0, 8)}...`)
        console.log('[Bridge] ETH tx:', ethResult.txHash)
        console.log('[Bridge] Order ID:', ethResult.orderId || 'NOT_AVAILABLE')

        // 🔥 通知后端监控最终的 ETH→SOL 订单（如果有 orderId）
        if (ethResult.orderId) {
          await notifyBackendBridgeOrder(ethResult.orderId, tronResult.dstChainTokenOutAmount, token, 'Ethereum→Solana')
        }

        // 等待最终确认（如果有 orderId）
        if (ethResult.orderId) {
          message.loading('等待 Ethereum → Solana 桥接完成 (约 2-3 分钟)...', 0)
          await debridgeService.waitForOrderCompletion(ethResult.orderId)
          console.log('[Bridge] ✅ waitForOrderCompletion completed for TRON→ETH→SOL')
        } else {
          console.warn('[Bridge] ⚠️ No orderId, waiting 2.5 minutes for bridge to complete...')
          message.loading('等待 Ethereum → Solana 桥接完成 (约 2-3 分钟)...', 0)
          await new Promise((resolve) => setTimeout(resolve, 150_000)) // 2.5 分钟
          console.log('[Bridge] ✅ Manual wait completed for TRON→ETH→SOL')
        }
      } else if (chain === 'Ethereum') {
        // Ethereum → Solana 直接桥接
        console.log('[Bridge] Direct: Ethereum → Solana')
        setBridgeStep('eth-sol')
        message.loading('正在从 Ethereum 桥接到 Solana...', 0)

        const ethTokenInfo = SUPPORTED_TOKENS.ethereum.find((t) => t.symbol === token)
        if (!ethTokenInfo) throw new Error(`Token ${token} 在 Ethereum 上不受支持`)

        const ethResult = await debridgeService.bridgeEthereumToSolana({
          tokenAddress: ethTokenInfo.address,
          amount,
          solanaAddress: solWallet.address,
          privyWallet: ethWallet,
          sendTransaction // Privy v3.8 Gas 赞助
        })

        message.success(`✅ Ethereum 交易成功: ${ethResult.txHash.slice(0, 8)}...`)
        console.log('[Bridge] ETH tx:', ethResult.txHash)
        console.log('[Bridge] Order ID:', ethResult.orderId || 'NOT_AVAILABLE')

        // 🔥 通知后端监控 ETH→SOL 订单（如果有 orderId）
        if (ethResult.orderId) {
          await notifyBackendBridgeOrder(ethResult.orderId, amount, token, 'Ethereum→Solana')
        }

        // 等待最终确认（如果有 orderId）
        if (ethResult.orderId) {
          message.loading('等待 Ethereum → Solana 桥接完成 (约 2-3 分钟)...', 0)
          await debridgeService.waitForOrderCompletion(ethResult.orderId)
          console.log('[Bridge] ✅ waitForOrderCompletion completed for ETH→SOL')
        } else {
          console.warn('[Bridge] ⚠️ No orderId, waiting 2.5 minutes for bridge to complete...')
          message.loading('等待 Ethereum → Solana 桥接完成 (约 2-3 分钟)...', 0)
          await new Promise((resolve) => setTimeout(resolve, 150_000)) // 2.5 分钟
          console.log('[Bridge] ✅ Manual wait completed for ETH→SOL')
        }
      }

      // 通知完成
      if (onDepositDetected) {
        onDepositDetected(amount, token, chain)
      }

      message.destroy()
      message.success('🎉 跨链桥接全部完成! 后端会自动充值到账')
      setBridgeStep('completed')

      // 延迟关闭，让用户看到完成状态
      setTimeout(() => {
        onClose()
        setBridgeStep('idle')
      }, 2000)
    } catch (error) {
      console.error('[Bridge] Failed:', error)
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      message.error(`桥接失败: ${errorMessage}`)

      // 提供更友好的错误提示
      if (errorMessage.includes('Amount too small')) {
        message.warning('提示：跨链桥接最低金额为 $10 USD，小额转账手续费占比较高')
      } else if (errorMessage.includes('wallet')) {
        message.info('请确保已连接所有需要的钱包 (TRON、Ethereum、Solana)')
      } else if (errorMessage.includes('token')) {
        message.info('请检查选择的代币是否正确')
      }
    } finally {
      setBridgeInProgress(false)
      if (bridgeStep !== 'completed') {
        setBridgeStep('idle')
      }
      message.destroy()
    }
  }

  // 复制地址
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositAddress)
    message.success('Address copied!')
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <ArrowLeftOutlined
              style={{ cursor: 'pointer', fontSize: 16 }}
              onClick={() => {
                onClose()
                onBack()
              }}
            />
          )}
          <span>Transfer Crypto</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
      className="transfer-crypto-dialog"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Token 和 Chain 选择器 - 并排显示 */}
        <div style={{ display: 'flex', gap: 16 }}>
          {/* Token 选择 */}
          <div style={{ flex: 1 }}>
            <Text strong>Supported token</Text>
            <Select value={selectedToken} onChange={setSelectedToken} style={{ width: '100%', marginTop: 8 }} size="large">
              <Select.Option value="USDT">
                <Space>
                  <Avatar src={TOKEN_ICONS.USDT} size="small" />
                  USDT
                </Space>
              </Select.Option>
              <Select.Option value="USDC">
                <Space>
                  <Avatar src={TOKEN_ICONS.USDC} size="small" />
                  USDC
                </Space>
              </Select.Option>
            </Select>
          </div>

          {/* 链选择 */}
          <div style={{ flex: 1 }}>
            <Text strong>
              Supported chain
              <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                Min ${selectedChainConfig?.minDeposit}
              </Text>
            </Text>
            <Select value={selectedChain} onChange={setSelectedChain} style={{ width: '100%', marginTop: 8 }} size="large">
              {SUPPORTED_BRIDGE_CHAINS.map((chain) => (
                <Select.Option key={chain.name} value={chain.name}>
                  <Space>
                    <Avatar src={CHAIN_ICONS[chain.name]} size="small" />
                    {chain.displayName || chain.name}
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        {/* 充值地址和二维码 */}
        {depositAddress ? (
          <>
            {/* QR Code - 无黑框 */}
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <QRCode value={depositAddress} size={180} bgColor={token.colorBgContainer} />
                {/* 链图标叠加 */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 40,
                    height: 40,
                    background: token.colorBgContainer,
                    borderRadius: '50%',
                    padding: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  <Avatar src={CHAIN_ICONS[selectedChain]} size={28} />
                </div>
              </div>
              <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
                Scan to deposit on {selectedChain}
              </Text>
            </div>

            {/* 充值地址 */}
            <div>
              <Text strong style={{ fontSize: 13 }}>
                Your deposit address
                {isCoboChain ? (
                  <Tooltip
                    title={
                      <div style={{ fontSize: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Cobo 托管充值说明</div>
                        <div>• 这是您的专属充值地址，充值将直接到账</div>
                        <div>• 仅支持 {selectedToken} 充值，请勿转入其他代币</div>
                        <div>• 充值到账后将自动显示在您的账户余额中</div>
                        <div>• 最小充值金额: ${selectedChainConfig?.minDeposit}</div>
                      </div>
                    }
                    placement="top"
                  >
                    <Text type="secondary" style={{ marginLeft: 8, fontSize: 12, cursor: 'help' }}>
                      ⓘ Cobo托管钱包 {coboAddressIsNew && <span style={{ color: '#52c41a' }}>(新地址)</span>}
                    </Text>
                  </Tooltip>
                ) : (
                  <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                    ⓘ Auto-bridge to Solana
                  </Text>
                )}
              </Text>
              <Input
                value={depositAddress}
                readOnly
                suffix={<CopyOutlined onClick={handleCopyAddress} style={{ cursor: 'pointer', color: '#1890ff' }} />}
                style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 13 }}
                size="large"
              />
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin />
            <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
              Loading wallet address...
            </Text>
          </div>
        )}

        {/* 状态显示 - 仅Privy钱包显示监听和桥接状态 */}
        {!isCoboChain && isListening && depositAddress && !bridgeInProgress && (
          <div style={{ padding: 12, background: token.colorInfoBg, border: `1px solid ${token.colorInfoBorder}`, borderRadius: 4 }}>
            <Space>
              <Spin size="small" />
              <Text>Monitoring deposits...</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                ({selectedChain} - {depositAddress.slice(0, 6)}...{depositAddress.slice(-4)})
              </Text>
            </Space>
          </div>
        )}

        {/* Cobo 充值监听状态 */}
        {isCoboChain && coboIsMonitoring && depositAddress && (
          <div style={{ padding: 12, background: token.colorInfoBg, border: `1px solid ${token.colorInfoBorder}`, borderRadius: 4 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <Space>
                <Spin size="small" />
                <Text>监听充值中...</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ({selectedChainConfig?.id} - {depositAddress.slice(0, 6)}...{depositAddress.slice(-4)})
                </Text>
              </Space>

              {/* 显示确认中的交易（支持多笔） */}
              {coboTransactions
                .filter((tx) => tx.status === 'Confirming')
                .map((tx, index) => {
                  // 获取区块链浏览器链接
                  const getExplorerUrl = (chainId: string, txHash: string) => {
                    const explorers: Record<string, string> = {
                      ARBITRUM_ETH: `https://arbiscan.io/tx/${txHash}`,
                      BASE_ETH: `https://basescan.org/tx/${txHash}`,
                      ETH: `https://etherscan.io/tx/${txHash}`,
                      SOL: `https://solscan.io/tx/${txHash}`,
                      TRON: `https://tronscan.org/#/transaction/${txHash}`,
                      MATIC: `https://polygonscan.com/tx/${txHash}`,
                      BSC_BNB: `https://bscscan.com/tx/${txHash}`
                    }
                    return explorers[chainId] || '#'
                  }

                  return (
                    <div
                      key={tx.transaction_id}
                      style={{
                        marginTop: 8,
                        padding: 8,
                        background: token.colorBgContainer,
                        borderRadius: 4,
                        border: `1px solid ${token.colorBorderSecondary}`
                      }}
                    >
                      <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                          <Text strong style={{ fontSize: 13 }}>
                            {tx.destination.amount} {tx.token_id.split('_').pop()}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {getConfirmationProgress(tx)}
                          </Text>
                        </Space>
                        <div>
                          <div
                            style={{
                              height: 6,
                              background: token.colorFillSecondary,
                              borderRadius: 3,
                              overflow: 'hidden'
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${getConfirmationPercentage(tx)}%`,
                                background: 'linear-gradient(90deg, #1890ff 0%, #52c41a 100%)',
                                transition: 'width 0.3s ease'
                              }}
                            />
                          </div>
                          <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
                            区块确认中... ({getConfirmationPercentage(tx)}%)
                          </Text>
                        </div>
                        {tx.transaction_hash && (
                          <a
                            href={getExplorerUrl(tx.chain_id, tx.transaction_hash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 11, color: token.colorLink }}
                          >
                            TxHash: {tx.transaction_hash.slice(0, 10)}...{tx.transaction_hash.slice(-8)} ↗
                          </a>
                        )}
                      </Space>
                    </div>
                  )
                })}

              {/* 显示最新完成的充值 */}
              {coboLatestDeposit && (
                <div
                  style={{
                    marginTop: 8,
                    padding: 8,
                    background: token.colorSuccessBg,
                    borderRadius: 4,
                    border: `1px solid ${token.colorSuccessBorder}`
                  }}
                >
                  <Space>
                    <span style={{ fontSize: 16 }}>✅</span>
                    <div>
                      <Text strong style={{ color: token.colorSuccess, fontSize: 13 }}>
                        充值成功！
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                        {coboLatestDeposit.destination.amount} {coboLatestDeposit.token_id}
                      </Text>
                    </div>
                  </Space>
                </div>
              )}

              {coboDeposits.length > 0 && !coboConfirmingDeposit && !coboLatestDeposit && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    最近充值: {coboDeposits.length} 笔
                  </Text>
                </div>
              )}

              {/* 完成按钮 */}
              <Button type="primary" block onClick={onClose} style={{ marginTop: 12 }}>
                完成
              </Button>
            </Space>
          </div>
        )}

        {!isCoboChain && bridgeInProgress && (
          <div style={{ padding: 12, background: token.colorWarningBg, border: `1px solid ${token.colorWarningBorder}`, borderRadius: 4 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <Spin size="small" />
                <Text strong>跨链桥接进行中...</Text>
              </Space>
              {bridgeStep === 'tron-eth' && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ⏳ 步骤 1/2: Tron → Ethereum (预计 3-5 分钟)
                </Text>
              )}
              {bridgeStep === 'eth-sol' && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ⏳ 步骤 2/2: Ethereum → Solana (预计 2-3 分钟)
                </Text>
              )}
              {bridgeStep === 'completed' && (
                <Text type="success" style={{ fontSize: 12 }}>
                  ✅ 桥接完成！资金已到达 Solana
                </Text>
              )}
            </Space>
          </div>
        )}

        {/* 说明 - 仅 Privy 钱包显示桥接说明 */}
        {!isCoboChain && (
          <div style={{ padding: 12, background: token.colorBgLayout, borderRadius: 4 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              • 发送 {selectedToken} 到上面的地址
              <br />• 最低充值金额: ${SUPPORTED_BRIDGE_CHAINS.find((c) => c.name === selectedChain)?.minDeposit || 10}
              <br />• 资金将自动桥接到 Solana
              <br />• 桥接时间: 约 5-10 分钟
              <br />• 手续费: 跨链桥接费用 + Gas 费 (由平台赞助)
              <br />
              <br />
              💡 <strong>工作原理：</strong>
              <br />
              1. 检测到充值后自动启动桥接
              <br />
              2. Tron → Ethereum (3-5 分钟)
              <br />
              3. Ethereum → Solana (2-3 分钟)
              <br />
              4. 完成后资金到达 Solana 账户
            </Text>
          </div>
        )}
      </Space>
    </Modal>
  )
}

export default TransferCryptoDialog
