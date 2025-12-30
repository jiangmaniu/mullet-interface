import React, { useState, useEffect, useContext } from 'react'
import { Modal, Input, Select, Button, message, QRCode, Typography, Space, Spin, Avatar, theme as antdTheme, Alert, Tooltip } from 'antd'
import { CopyOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { SUPPORTED_BRIDGE_CHAINS, SUPPORTED_TOKENS } from '@/config/lifiConfig'
import { TOKEN_ICONS, CHAIN_ICONS } from '@/config/tokenIcons'
import { debridgeService } from '@/services/debridgeService'
import { useDepositListener } from '@/hooks/useDepositListenerV2'
import { useStores } from '@/context/mobxProvider'
import { useServerWallet } from '@/hooks/useServerWallet'
import type { SupportedChain } from '@/services/serverWalletService'
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

  const { trade } = useStores()

  const [selectedChain, setSelectedChain] = useState('Tron')
  const [selectedToken, setSelectedToken] = useState('USDC')
  const [depositAddress, setDepositAddress] = useState('')
  const [bridgeInProgress, setBridgeInProgress] = useState(false)
  const [bridgeStep, setBridgeStep] = useState<'idle' | 'tron-eth' | 'eth-sol' | 'completed'>('idle')

  // 判断当前选择的链是否是 Cobo
  const selectedChainConfig = SUPPORTED_BRIDGE_CHAINS.find((c) => c.name === selectedChain)
  const isCoboChain = selectedChainConfig?.type === 'cobo'
  const isPrivyChain = selectedChainConfig?.type === 'privy'

  // Privy Server Wallet - 根据选择的链创建钱包
  // 将链名转换为 API 需要的格式
  const getChainId = (chainName: string): SupportedChain => {
    const chainMap: Record<string, SupportedChain> = {
      'Tron': 'tron',
      'Ethereum': 'ethereum',
      'Solana': 'solana',
      'Arbitrum': 'arbitrum',
      'BSC': 'bsc',
    }
    return chainMap[chainName] || 'tron'
  }

  const currentChainId = getChainId(selectedChain)
  const tradeAccountId = trade.currentAccountInfo?.id
  
  // 🔥 直接使用 useServerWallet，传入当前账户 ID，确保切换账户后地址正确更新
  const { 
    address: serverWalletAddress, 
    walletId: serverWalletId, 
    isCreating: isServerWalletCreating 
  } = useServerWallet(
    currentChainId, 
    open && isPrivyChain && !!tradeAccountId, 
    tradeAccountId
  )
  
  // 🔥 额外获取 BSC/EVM 钱包信息，用于 TRON → BSC → Solana 桥接
  const { 
    address: evmWalletAddress, 
    walletId: evmWalletId,
  } = useServerWallet(
    'bsc', // BSC 代表所有 EVM 链，地址相同
    open && currentChainId === 'tron' && !!tradeAccountId, // 仅在 TRON 页面时获取
    tradeAccountId
  )
  
  // 最终地址
  const finalServerWalletAddress = serverWalletAddress
  const finalServerWalletId = serverWalletId
  const finalIsCreating = isServerWalletCreating

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

  // 使用后端API充值监听 hook（V2版本）- 通过后端监控链上交易
  const { deposit, deposits, isListening, clearDeposit, resetDetection } = useDepositListener({
    enabled: open && !isCoboChain && !!finalServerWalletAddress, // Cobo 链使用独立的监听机制
    pollInterval: 5000,
    chain: selectedChain.toLowerCase() as 'tron' | 'ethereum' | 'solana' | 'arbitrum' | 'bsc',
    address: finalServerWalletAddress || ''
  })

  // 获取钱包地址
  useEffect(() => {
    if (!open) return

    // 如果是 Cobo 链，使用 Cobo 地址
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

    // Privy Server Wallet 逻辑（适用于所有 Privy 链）
    if (isPrivyChain) {
      console.log(`[TransferCrypto] Privy chain status:`, {
        selectedChain,
        chainId: currentChainId,
        finalServerWalletAddress,
        finalIsCreating
      })

      if (finalServerWalletAddress) {
        setDepositAddress(finalServerWalletAddress)
        console.log(`[TransferCrypto] Using Server Wallet address for ${selectedChain}:`, finalServerWalletAddress)
      } else if (finalIsCreating) {
        setDepositAddress('')
        console.log(`[TransferCrypto] Creating Server Wallet for ${selectedChain}...`)
      } else {
        setDepositAddress('')
        console.log(`[TransferCrypto] Waiting for Server Wallet...`)
      }
      return
    }

    // 备用逻辑：如果既不是 Cobo 也不是 Privy，尝试从 user.linkedAccounts 查找
    const loadAddress = () => {
      const chainConfig = SUPPORTED_BRIDGE_CHAINS.find((c) => c.name === selectedChain)
      if (!chainConfig) {
        console.warn(`[TransferCrypto] Chain config not found for: ${selectedChain}`)
        setDepositAddress('')
        return
      }

      const chainType = chainConfig.id

      // 从 user.linkedAccounts 查找钱包
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
    finalServerWalletAddress,
    finalIsCreating,
    isCoboChain,
    isPrivyChain,
    currentChainId,
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

      // 触发桥接 - 使用 rawAmount（最小单位）
      // rawAmount 可能是十六进制字符串，需要转换为十进制数字字符串
      let amountToUse = deposit.amount
      if (deposit.rawAmount && deposit.rawAmount.startsWith('0x')) {
        amountToUse = BigInt(deposit.rawAmount).toString() // 转换为十进制字符串
        console.log('[TransferCrypto] Converted rawAmount:', deposit.rawAmount, '→', amountToUse)
      } else if (deposit.rawAmount) {
        amountToUse = deposit.rawAmount
      }

      handleAutoBridge(amountToUse, deposit.token, deposit.chain)

      // 清除检测记录
      clearDeposit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deposit])

  // 自动桥接
  const handleAutoBridge = async (amount: string, token: string, chain: string) => {
    try {
      setBridgeInProgress(true)
      
      // 🔥 标准化 chain 名称（首字母大写）
      const chainNameMap: Record<string, string> = {
        'tron': 'Tron',
        'ethereum': 'Ethereum',
        'solana': 'Solana',
        'bsc': 'BSC',
        'polygon': 'Polygon',
        'arbitrum': 'Arbitrum',
        'optimism': 'Optimism',
        'base': 'Base',
        'avalanche': 'Avalanche',
      }
      const normalizedChain = chainNameMap[chain.toLowerCase()] || chain
      
      console.log('[Bridge] Starting with params:', { amount, token, chain: normalizedChain, originalChain: chain, finalServerWalletAddress, finalServerWalletId })

      // 从 user.linkedAccounts 获取钱包地址
      const solAccount = user?.linkedAccounts?.find((account: any) => account.type === 'wallet' && account.chainType === 'solana') as any

      // 使用 useServerWallet hook 的返回值
      if (!finalServerWalletAddress || !finalServerWalletId) {
        console.error('[Bridge] Missing Server Wallet info:', { finalServerWalletAddress, finalServerWalletId })
        throw new Error('Server Wallet 信息不完整，请刷新页面重试')
      }

      if (!solAccount) {
        throw new Error('缺少 Solana 钱包，请确保已创建 Solana 钱包')
      }

      const solWallet = { address: solAccount.address }

      const accessToken = await getAccessToken()
      if (!accessToken) {
        throw new Error('无法获取访问令牌，请重新登录')
      }

      // 检查最低金额
      const minAmountUSD = normalizedChain === 'Tron' ? 20 : 10
      const minAmountSmallestUnit = minAmountUSD * 1_000_000

      const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount

      if (amountNum < minAmountSmallestUnit) {
        const amountUSD = amountNum / 1_000_000
        throw new Error(
          `金额过小。最低金额: $${minAmountUSD} USD，当前金额: $${amountUSD.toFixed(2)} USD`
        )
      }

      if (normalizedChain === 'Tron') {
        // 🔥 Tron → BSC → Solana (两步跨链，通过后端执行)
        console.log('[Bridge] TRON → BSC → Solana (2 steps via backend)')
        
        // 检查 EVM 钱包是否已准备好
        if (!evmWalletAddress || !evmWalletId) {
          throw new Error('EVM 钱包信息未就绪，请稍后重试')
        }
        
        // Step 1: TRON → BSC
        setBridgeStep('tron-eth')
        message.loading('步骤 1/2: 正在从 TRON 桥接到 BSC...', 0)

        const step1Response = await fetch(`${API_BASE_URL}/api/server-wallet-bridge/bridge-tron-to-bsc`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            walletId: finalServerWalletId,
            walletAddress: finalServerWalletAddress,
            evmWalletId,  // 🔥 传递 EVM 钱包 ID
            evmWalletAddress,  // 🔥 传递 EVM 钱包地址（BSC 接收地址）
            amount,
            token
          })
        })

        if (!step1Response.ok) {
          const errorData = await step1Response.json().catch(() => ({}))
          throw new Error(errorData.message || errorData.error || `TRON→BSC 桥接失败: ${step1Response.status}`)
        }

        const step1Result = await step1Response.json()
        console.log('[Bridge] ✅ TRON→BSC result:', step1Result)
        message.success(`✅ TRON 交易成功: ${step1Result.txHash.slice(0, 8)}...`)

        // 等待 TRON→BSC 完成
        if (step1Result.orderId) {
          message.loading('等待 TRON → BSC 桥接完成 (约 3-5 分钟)...', 0)
          await debridgeService.waitForOrderCompletion(step1Result.orderId, 600000, 15000)
        } else {
          message.loading('等待 TRON → BSC 桥接完成 (约 3-5 分钟)...', 0)
          await new Promise(resolve => setTimeout(resolve, 180000)) // 3分钟
        }

        // Step 2: BSC → Solana
        setBridgeStep('eth-sol')
        message.loading('步骤 2/2: 正在从 BSC 桥接到 Solana...', 0)

        // 使用第一步返回的 EVM 钱包信息
        const bscWalletId = step1Result.evmWalletId || evmWalletId
        const bscWalletAddress = step1Result.evmWalletAddress || evmWalletAddress
        
        console.log('[Bridge] Step 2 using BSC wallet:', { bscWalletId, bscWalletAddress: bscWalletAddress?.slice(0, 10) })

        // 获取 BSC 上的余额并桥接到 Solana
        const step2Response = await fetch(`${API_BASE_URL}/api/server-wallet-bridge/bridge-to-solana`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            chain: 'bsc',
            walletId: bscWalletId,  // 🔥 使用 BSC 钱包 ID
            walletAddress: bscWalletAddress,  // 🔥 使用 BSC 钱包地址
            amount: step1Result.dstAmount || amount, // 使用第一步的输出金额
            token,
            solanaAddress: solWallet.address
          })
        })

        if (!step2Response.ok) {
          const errorData = await step2Response.json().catch(() => ({}))
          throw new Error(errorData.message || errorData.error || `BSC→Solana 桥接失败: ${step2Response.status}`)
        }

        const step2Result = await step2Response.json()
        console.log('[Bridge] ✅ BSC→Solana result:', step2Result)
        message.success(`✅ BSC 交易成功: ${step2Result.txHash.slice(0, 8)}...`)

        // 等待最终确认
        if (step2Result.orderId) {
          message.loading('等待 BSC → Solana 桥接完成 (约 2-3 分钟)...', 0)
          await debridgeService.waitForOrderCompletion(step2Result.orderId)
        } else {
          message.loading('等待 BSC → Solana 桥接完成 (约 2-3 分钟)...', 0)
          await new Promise(resolve => setTimeout(resolve, 120000))
        }

      } else if (['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'Avalanche'].includes(normalizedChain)) {
        // 🔥 EVM → Solana: 调用后端 API 执行桥接
        console.log(`[Bridge] Direct: ${normalizedChain} → Solana (via backend)`)
        setBridgeStep('eth-sol')
        message.loading(`正在从 ${normalizedChain} 桥接到 Solana...`, 0)

        // 调用后端 Server Wallet Bridge API
        const bridgeResponse = await fetch(`${API_BASE_URL}/api/server-wallet-bridge/bridge-to-solana`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            chain: normalizedChain.toLowerCase(),
            walletId: finalServerWalletId,
            walletAddress: finalServerWalletAddress,
            amount,
            token,
            solanaAddress: solWallet.address
          })
        })

        if (!bridgeResponse.ok) {
          const errorData = await bridgeResponse.json().catch(() => ({}))
          throw new Error(errorData.message || errorData.error || `桥接失败: ${bridgeResponse.status}`)
        }

        const bridgeResult = await bridgeResponse.json()
        console.log('[Bridge] ✅ Backend bridge result:', bridgeResult)
        
        message.success(`✅ ${normalizedChain} 交易成功: ${bridgeResult.txHash.slice(0, 8)}...`)
        console.log(`[Bridge] ${normalizedChain} tx:`, bridgeResult.txHash)
        console.log('[Bridge] Order ID:', bridgeResult.orderId || 'NOT_AVAILABLE')

        // 等待最终确认（如果有 orderId）
        if (bridgeResult.orderId) {
          message.loading(`等待 ${normalizedChain} → Solana 桥接完成 (约 2-3 分钟)...`, 0)
          await debridgeService.waitForOrderCompletion(bridgeResult.orderId)
          console.log(`[Bridge] ✅ waitForOrderCompletion completed for ${normalizedChain}→SOL`)
        } else {
          console.warn('[Bridge] ⚠️ No orderId, waiting 2 minutes for bridge to complete...')
          message.loading(`等待 ${normalizedChain} → Solana 桥接完成 (约 2-3 分钟)...`, 0)
          await new Promise((resolve) => setTimeout(resolve, 120_000)) // 2 分钟
          console.log(`[Bridge] ✅ Manual wait completed for ${normalizedChain}→SOL`)
        }
      }

      message.destroy()
      message.success('🎉 跨链桥接全部完成!')
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
                  <Tooltip
                    title={
                      <div style={{ fontSize: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>💡 工作原理</div>
                        <div>• 发送 {selectedToken} 到上面的地址</div>
                        <div>• 最低充值金额: ${selectedChainConfig?.minDeposit || 20}</div>
                        {selectedChain !== 'Solana' && (
                          <>
                            <div>• 资金将自动桥接到 Solana</div>
                            <div>• 桥接时间: 约 {selectedChain === 'Tron' ? '10-15' : '5-10'} 分钟</div>
                            <div>• 手续费: 跨链桥接费用 + Gas 费 (由平台赞助)</div>
                            <div style={{ marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 8 }}>
                              <div>1. 检测到充值后自动启动桥接</div>
                              {selectedChain === 'Tron' ? (
                                <>
                                  <div>2. Tron → BSC (5-8 分钟)</div>
                                  <div>3. BSC → Solana (5-7 分钟)</div>
                                  <div>4. 完成后资金到达 Solana 账户</div>
                                </>
                              ) : (
                                <>
                                  <div>2. {selectedChain} → Solana (5-10 分钟)</div>
                                  <div>3. 完成后资金到达 Solana 账户</div>
                                </>
                              )}
                            </div>
                          </>
                        )}
                        {selectedChain === 'Solana' && (
                          <div>• 到账时间: 通常 1-2 分钟</div>
                        )}
                      </div>
                    }
                    placement="top"
                  >
                    <Text type="secondary" style={{ marginLeft: 8, fontSize: 12, cursor: 'help' }}>
                      ⓘ Auto-bridge to Solana
                    </Text>
                  </Tooltip>
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
        {!isCoboChain && depositAddress && !bridgeInProgress && (
          <div style={{ padding: 12, background: deposit ? token.colorSuccessBg : token.colorInfoBg, border: `1px solid ${deposit ? token.colorSuccessBorder : token.colorInfoBorder}`, borderRadius: 4 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              {/* 检测到充值 - 显示成功状态 */}
              {deposit && (
                <div
                  style={{
                    padding: 8,
                    background: token.colorSuccessBg,
                    borderRadius: 4,
                  }}
                >
                  <Space>
                    <span style={{ fontSize: 16 }}>✅</span>
                    <div>
                      <Text strong style={{ color: token.colorSuccess, fontSize: 13 }}>
                        充值成功！
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                        {deposit.amount} {deposit.token}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                        {selectedChain} • {new Date(deposit.timestamp || '').toLocaleTimeString()}
                      </Text>
                    </div>
                  </Space>
                </div>
              )}

              {/* 监听中状态 */}
              {isListening && !deposit && (
                <Space>
                  <Spin size="small" />
                  <Text>Monitoring deposits...</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    ({selectedChain} - {depositAddress.slice(0, 6)}...{depositAddress.slice(-4)})
                  </Text>
                </Space>
              )}

              {/* 充值历史记录 */}
              {deposits.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    新充值 ({deposits.length})
                  </Text>
                  <div style={{ marginTop: 4 }}>
                    {deposits.slice(0, 5).map((d, index) => {
                      // 区块链浏览器链接
                      const getExplorerUrl = (chain: string, address: string) => {
                        const explorers: Record<string, string> = {
                          solana: `https://solscan.io/account/${address}`,
                          ethereum: `https://etherscan.io/address/${address}`,
                          arbitrum: `https://arbiscan.io/address/${address}`,
                          bsc: `https://bscscan.com/address/${address}`,
                          tron: `https://tronscan.org/#/address/${address}`,
                        }
                        return explorers[chain.toLowerCase()] || '#'
                      }

                      return (
                        <div
                          key={`${d.timestamp}-${index}`}
                          style={{
                            padding: '6px 0',
                            borderBottom: index < deposits.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <Space size="small">
                            <Text style={{ fontSize: 12 }}>
                              {d.amount} {d.token}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              {new Date(d.timestamp || '').toLocaleTimeString()}
                            </Text>
                          </Space>
                          <a
                            href={getExplorerUrl(d.chain, d.address || depositAddress)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 11, color: token.colorLink }}
                          >
                            查看 ↗
                          </a>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 完成按钮 */}
              <Button type="primary" block onClick={onClose} style={{ marginTop: 8 }}>
                完成
              </Button>
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


      </Space>
    </Modal>
  )
}

export default TransferCryptoDialog
