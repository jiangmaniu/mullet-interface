import React, { useState, useEffect } from 'react'
import { Modal, Input, Select, Button, message, QRCode, Typography, Space, Spin, Avatar, theme as antdTheme, Alert } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { SUPPORTED_BRIDGE_CHAINS, SUPPORTED_TOKENS } from '@/config/lifiConfig'
import { TOKEN_ICONS, CHAIN_ICONS } from '@/config/tokenIcons'
import { debridgeService } from '@/services/debridgeService'
import { useDepositListener } from '@/hooks/useDepositListener'
import { findPrivyWalletByChain } from '@/utils/privyWalletHelpers'
import { useStores } from '@/context/mobxProvider'
import { useTronWallet } from '@/hooks/useTronWallet'
import { useSessionSigner } from '@/hooks/useSessionSigner'
import './index.less'

const { Text } = Typography

interface TransferCryptoDialogProps {
  open: boolean
  onClose: () => void
  onDepositDetected?: (amount: string, token: string, chain: string) => void
}

/**
 * 跨链充值对话框
 * 支持 TRON / Ethereum / Solana 充值并自动桥接到 Solana
 */
const TransferCryptoDialog: React.FC<TransferCryptoDialogProps> = ({ open, onClose, onDepositDetected }) => {
  const { token } = antdTheme.useToken()
  const { getAccessToken, user } = usePrivy()
  const { wallets } = useWallets()
  const { trade } = useStores()
  
  // TRON 钱包自动创建和管理
  const { tronAddress, tronWalletId, tronPublicKey, isCreating: isTronWalletCreating } = useTronWallet(true)
  
  // Session Signer 授权管理
  const { 
    isSessionSignerAdded, 
    isChecking: isCheckingSessionSigner,
    isAdding: isAddingSessionSigner, 
    addSessionSigner 
  } = useSessionSigner()

  const [selectedChain, setSelectedChain] = useState('Tron')
  const [selectedToken, setSelectedToken] = useState('USDT')
  const [depositAddress, setDepositAddress] = useState('')
  const [bridgeInProgress, setBridgeInProgress] = useState(false)
  const [bridgeStep, setBridgeStep] = useState<'idle' | 'tron-eth' | 'eth-sol' | 'completed'>('idle')

  // 获取所有链的钱包地址
  const ethereumAccount = user?.linkedAccounts?.find(
    (account: any) => account.type === 'wallet' && account.chainType === 'ethereum'
  ) as any
  
  const solanaAccount = user?.linkedAccounts?.find(
    (account: any) => account.type === 'wallet' && account.chainType === 'solana'
  ) as any

  // 使用充值监听 hook - 传递所有链的地址
  const { deposit, isListening, clearDeposit } = useDepositListener({
    enabled: open,
    chains: [selectedChain as 'Tron' | 'Ethereum' | 'Solana'],
    pollInterval: 5000,
    tronAddress: tronAddress || undefined,
    ethereumAddress: ethereumAccount?.address || undefined,
    solanaAddress: solanaAccount?.address || undefined,
    detectExisting: true // 🔥 启用检测现有余额（用于 TRON→ETH 后继续 ETH→SOL）
  })

  // 获取钱包地址
  useEffect(() => {
    if (!open) return

    const loadAddress = () => {
      // 找到对应的链配置
      const chainConfig = SUPPORTED_BRIDGE_CHAINS.find((c) => c.name === selectedChain)
      if (!chainConfig) {
        console.warn(`[TransferCrypto] Chain config not found for: ${selectedChain}`)
        setDepositAddress('')
        return
      }

      const chainType = chainConfig.id // 'tron' | 'ethereum' | 'solana'

      // 对于 Solana，使用 Privy 钱包地址（而不是 PDA）
      // PDA 地址已注释，改用 Privy Solana 钱包
      if (chainType === 'solana') {
        // 注释掉 PDA 地址逻辑
        // const pdaAddress = trade.currentAccountInfo?.pdaTokenAddress
        // if (pdaAddress) {
        //   setDepositAddress(pdaAddress)
        //   console.log(`[TransferCrypto] Using Solana PDA address:`, pdaAddress)
        // } else {
        //   console.warn(`[TransferCrypto] No PDA address found`)
        //   setDepositAddress('')
        // }
        // return
        
        // 使用 Privy Solana 钱包地址
        const solanaAccount = user?.linkedAccounts?.find(
          (account: any) => account.type === 'wallet' && account.chainType === 'solana'
        ) as any
        
        if (solanaAccount?.address) {
          setDepositAddress(solanaAccount.address)
          console.log(`[TransferCrypto] Using Privy Solana wallet:`, solanaAccount.address)
        } else {
          console.warn(`[TransferCrypto] No Privy Solana wallet found`)
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
  }, [open, selectedChain, user, trade.currentAccountInfo, tronAddress, isTronWalletCreating])

  // 检测到充值后自动触发桥接
  useEffect(() => {
    if (deposit && !bridgeInProgress) {
      console.log('[TransferCrypto] Deposit detected:', deposit)
      message.success(`Detected ${deposit.amount} ${deposit.token} on ${deposit.chain}!`)

      // 触发桥接 - 使用 rawBalance（最小单位）而不是 amount（USD）
      handleAutoBridge(deposit.rawBalance || deposit.amount, deposit.token, deposit.chain)

      // 清除检测记录
      clearDeposit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deposit])

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
          privyWallet: ethWallet
        })

        message.success(`✅ Ethereum 交易成功: ${ethResult.txHash.slice(0, 8)}...`)
        console.log('[Bridge] ETH tx:', ethResult.txHash)

        // 等待最终确认
        if (ethResult.orderId) {
          message.loading('等待 Ethereum → Solana 桥接完成 (约 2-3 分钟)...', 0)
          await debridgeService.waitForOrderCompletion(ethResult.orderId)
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
          privyWallet: ethWallet
        })

        message.success(`✅ Ethereum 交易成功: ${ethResult.txHash.slice(0, 8)}...`)
        console.log('[Bridge] ETH tx:', ethResult.txHash)

        // 等待最终确认
        if (ethResult.orderId) {
          message.loading('等待 Ethereum → Solana 桥接完成 (约 2-3 分钟)...', 0)
          await debridgeService.waitForOrderCompletion(ethResult.orderId)
        }
      }

      // 通知后端跨链成功（带重试机制）
      try {
        console.log('[Bridge] Notifying backend of successful cross-chain transfer...')
        
        // 使用后端账户信息中的 Solana 地址（不是 Privy 钱包地址）
        const targetAddress = trade.currentAccountInfo?.address
        if (!targetAddress) {
          console.warn('[Bridge] ⚠️ Backend account address not found, skipping notification')
        } else {
          const notifyUrl = `https://client-test.mullet.top/api/trade-solana/recharge/swap?toAddress=${targetAddress}&amount=${amount}`
          
          console.log('[Bridge] Notification URL:', notifyUrl)
          console.log('[Bridge] Target address (backend account):', targetAddress)
          console.log('[Bridge] Amount:', amount)
          
          // 重试机制：最多重试 3 次
          let retryCount = 0
          const maxRetries = 3
          let notifySuccess = false
          
          while (retryCount < maxRetries && !notifySuccess) {
            try {
              if (retryCount > 0) {
                console.log(`[Bridge] Retry attempt ${retryCount}/${maxRetries}...`)
                // 等待 2 秒后重试
                await new Promise(resolve => setTimeout(resolve, 2000))
              }
              
              const notifyResponse = await fetch(notifyUrl, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                },
                signal: AbortSignal.timeout(10000) // 10秒超时
              })

              if (notifyResponse.ok) {
                // 验证返回数据格式
                const responseData = await notifyResponse.json()
                console.log('[Bridge] Backend response:', responseData)
                
                if (responseData.code === 200 && responseData.success === true) {
                  console.log('[Bridge] ✅ Backend notification sent successfully')
                  notifySuccess = true
                } else {
                  console.warn(`[Bridge] ⚠️ Backend returned error (attempt ${retryCount + 1}/${maxRetries}):`, responseData.msg || 'Unknown error')
                  retryCount++
                }
              } else {
                const errorText = await notifyResponse.text()
                console.warn(`[Bridge] ⚠️ Backend notification failed (attempt ${retryCount + 1}/${maxRetries}):`, notifyResponse.status, errorText)
                retryCount++
              }
            } catch (fetchError) {
              console.error(`[Bridge] ❌ Notification request failed (attempt ${retryCount + 1}/${maxRetries}):`, fetchError)
              retryCount++
            }
          }
          
          if (!notifySuccess) {
            console.error('[Bridge] ❌ Backend notification failed after 3 attempts')
          }
        }
      } catch (error) {
        console.error('[Bridge] ❌ Failed to notify backend:', error)
        // 不抛出错误，因为跨链已经成功，只是通知失败
      }

      // 通知完成
      if (onDepositDetected) {
        onDepositDetected(amount, token, chain)
      }

      message.destroy()
      message.success('🎉 跨链桥接全部完成! 资金已到达 Solana 账户')
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
    <Modal title="Add Funds - Transfer Crypto" open={open} onCancel={onClose} footer={null} width={500} className="transfer-crypto-dialog">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Session Signer 授权提示 */}
        {tronAddress && !isSessionSignerAdded && !isCheckingSessionSigner && (
          <Alert
            message="Server Signing Not Enabled"
            description={
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text style={{ fontSize: 13 }}>
                  To enable automated TRON transactions, please authorize server signing. 
                  This allows our backend to sign transactions on your behalf for seamless bridging.
                </Text>
                <Button 
                  type="primary" 
                  onClick={addSessionSigner}
                  loading={isAddingSessionSigner}
                  size="small"
                  style={{ marginTop: 4 }}
                >
                  {isAddingSessionSigner ? 'Authorizing...' : 'Authorize Server Signing'}
                </Button>
              </Space>
            }
            type="warning"
            showIcon
            style={{ marginBottom: 8 }}
          />
        )}

        {/* 链选择 */}
        <div>
          <Text strong>Select Chain</Text>
          <Select value={selectedChain} onChange={setSelectedChain} style={{ width: '100%', marginTop: 8 }} size="large">
            {SUPPORTED_BRIDGE_CHAINS.map((chain) => (
              <Select.Option key={chain.name} value={chain.name}>
                <Space>
                  <Avatar src={CHAIN_ICONS[chain.name]} size="small" />
                  {chain.name} - Min: ${chain.minDeposit}
                </Space>
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Token 选择 */}
        <div>
          <Text strong>Select Token</Text>
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
                <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                  ⓘ Auto-bridge to Solana
                </Text>
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

        {/* 状态显示 */}
        {isListening && depositAddress && !bridgeInProgress && (
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

        {bridgeInProgress && (
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

        {/* 说明 */}
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
      </Space>
    </Modal>
  )
}

export default TransferCryptoDialog
