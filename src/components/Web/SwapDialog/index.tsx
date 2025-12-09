import React, { useState, useEffect, useCallback } from 'react'
import { Modal, Select, Input, Button, message, Typography, Space, Spin, Divider, Avatar } from 'antd'
import { SwapOutlined, ReloadOutlined } from '@ant-design/icons'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { createConfig, getRoutes, executeRoute, EVM, Solana } from '@lifi/sdk'
import type { Route, RoutesRequest, ExecutionOptions } from '@lifi/sdk'
import { LIFI_CONFIG, SUPPORTED_TOKENS } from '@/config/lifiConfig'
import { TOKEN_ICONS, CHAIN_ICONS } from '@/config/tokenIcons'
import { findWalletByChain } from '@/utils/privyWalletHelpers'
import './index.less'

const { Text, Title } = Typography

interface SwapDialogProps {
  open: boolean
  onClose: () => void
  fromAsset?: string // 预选资产
  onSwapComplete?: (txHash: string) => void
}

/**
 * 资产兑换对话框
 * 使用 LiFi SDK 进行多链资产兑换
 */
const SwapDialog: React.FC<SwapDialogProps> = ({ open, onClose, fromAsset, onSwapComplete }) => {
  const { user, getAccessToken } = usePrivy()
  const { wallets } = useWallets()

  const [lifiConfigured, setLifiConfigured] = useState(false)
  const [fromChain, setFromChain] = useState('TRON')
  const [fromToken, setFromToken] = useState(fromAsset || 'USDT')
  const [fromAmount, setFromAmount] = useState('')
  const [toChain, setToChain] = useState('Solana')
  const [toToken, setToToken] = useState('USDT')
  const [quote, setQuote] = useState<Route | null>(null)
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)

  // 初始化 LiFi SDK
  useEffect(() => {
    if (!open || lifiConfigured) return

    const initLiFi = async () => {
      try {
        // 使用 createConfig 配置 LiFi SDK
        createConfig({
          integrator: LIFI_CONFIG.integrators[0].name,
          apiKey: LIFI_CONFIG.integrators[0].apiKey,
          providers: [EVM({}), Solana({})],
          routeOptions: {
            fee: 0.0025
          }
        })
        setLifiConfigured(true)
        console.log('[LiFi] SDK configured')
      } catch (error) {
        console.error('[LiFi] Initialization failed:', error)
        message.error('Failed to initialize swap service')
      }
    }

    initLiFi()
  }, [open])

  // 获取报价
  const fetchQuote = useCallback(async () => {
    if (!lifiConfigured || !fromAmount || parseFloat(fromAmount) <= 0) {
      setQuote(null)
      return
    }

    setIsLoadingQuote(true)
    try {
      const fromWallet = findWalletByChain(wallets, fromChain.toLowerCase() as 'tron' | 'ethereum' | 'solana')
      const toWallet = findWalletByChain(wallets, toChain.toLowerCase() as 'tron' | 'ethereum' | 'solana')

      if (!fromWallet || !toWallet) {
        throw new Error('Required wallets not found')
      }

      // 获取 token 地址
      const chainKeyFrom = fromChain.toLowerCase() as keyof typeof SUPPORTED_TOKENS
      const chainKeyTo = toChain.toLowerCase() as keyof typeof SUPPORTED_TOKENS

      const fromTokenInfo = SUPPORTED_TOKENS[chainKeyFrom]?.find((t) => t.symbol === fromToken)
      const toTokenInfo = SUPPORTED_TOKENS[chainKeyTo]?.find((t) => t.symbol === toToken)

      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error('Token not supported')
      }

      // 转换金额（根据 decimals）
      const amountWei = (parseFloat(fromAmount) * Math.pow(10, fromTokenInfo.decimals)).toString()

      // 获取链 ID
      const fromChainId = fromChain === 'TRON' ? 195 : fromChain === 'Ethereum' ? 1 : 1151111081099710
      const toChainId = toChain === 'TRON' ? 195 : toChain === 'Ethereum' ? 1 : 1151111081099710

      console.log('[LiFi] Fetching quote...')
      console.log('From:', fromChain, fromToken, fromAmount)
      console.log('To:', toChain, toToken)

      const routeRequest: RoutesRequest = {
        fromChainId,
        fromAmount: amountWei,
        fromTokenAddress: fromTokenInfo.address,
        fromAddress: fromWallet.address,
        toChainId,
        toTokenAddress: toTokenInfo.address,
        toAddress: toWallet.address,
        options: {
          slippage: LIFI_CONFIG.slippage / 100, // 转换为小数
          order: 'RECOMMENDED'
        }
      }

      const routesResponse = await getRoutes(routeRequest)

      if (!routesResponse || !routesResponse.routes || routesResponse.routes.length === 0) {
        throw new Error('No routes available')
      }

      const bestRoute = routesResponse.routes[0]
      setQuote(bestRoute)
      console.log('[LiFi] Quote received:', bestRoute)
    } catch (error) {
      console.error('[LiFi] Failed to get quote:', error)
      message.error(`Failed to get quote: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setQuote(null)
    } finally {
      setIsLoadingQuote(false)
    }
  }, [lifiConfigured, fromChain, fromToken, fromAmount, toChain, toToken, wallets])

  // 自动刷新报价（每 30 秒）
  useEffect(() => {
    if (!open || !fromAmount) return

    fetchQuote()
    const interval = setInterval(fetchQuote, 30000)
    return () => clearInterval(interval)
  }, [open, fromAmount, fetchQuote])

  // 执行兑换
  const handleSwap = async () => {
    if (!quote || !lifiConfigured) {
      message.error('No quote available')
      return
    }

    setIsSwapping(true)
    try {
      message.loading('Executing swap...', 0)

      console.log('[LiFi] Executing swap with route:', quote)

      // 使用 executeRoute 执行兑换
      const executionOptions: ExecutionOptions = {
        updateRouteHook: (updatedRoute: Route) => {
          console.log('[LiFi] Route update:', updatedRoute.steps?.[0])
          const step = updatedRoute.steps?.[0] as any
          if (step?.execution) {
            console.log('[LiFi] Execution status:', step.execution.status)
          }
        },
        executeInBackground: false
      }

      await executeRoute(quote, executionOptions)

      message.success('Swap completed!')

      if (onSwapComplete && quote.steps?.[0]) {
        const step = quote.steps[0] as any
        const txHash = step?.transactionHash || step?.txHash || 'unknown'
        onSwapComplete(txHash)
      }

      onClose()
    } catch (error) {
      console.error('[LiFi] Swap failed:', error)
      message.error(`Swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSwapping(false)
      message.destroy()
    }
  }

  // 计算预估到账
  const getEstimatedOutput = () => {
    if (!quote) return '--'
    const toAmount = quote.toAmount
    const chainKey = toChain.toLowerCase() as keyof typeof SUPPORTED_TOKENS
    const tokenInfo = SUPPORTED_TOKENS[chainKey]?.find((t) => t.symbol === toToken)
    const decimals = tokenInfo?.decimals || 6
    return (parseInt(toAmount) / Math.pow(10, decimals)).toFixed(2)
  }

  return (
    <Modal title="Swap Assets" open={open} onCancel={onClose} footer={null} width={500} className="swap-dialog">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* From */}
        <div>
          <Text strong>From</Text>
          <Space direction="vertical" size="small" style={{ width: '100%', marginTop: 8 }}>
            <Select value={fromChain} onChange={setFromChain} style={{ width: '100%' }} size="large">
              <Select.Option value="TRON">
                <Space>
                  <Avatar src={CHAIN_ICONS.TRON} size="small" />
                  TRON
                </Space>
              </Select.Option>
              <Select.Option value="Ethereum">
                <Space>
                  <Avatar src={CHAIN_ICONS.Ethereum} size="small" />
                  Ethereum
                </Space>
              </Select.Option>
              <Select.Option value="Solana">
                <Space>
                  <Avatar src={CHAIN_ICONS.Solana} size="small" />
                  Solana
                </Space>
              </Select.Option>
            </Select>

            <Input.Group compact style={{ display: 'flex' }}>
              <Input
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="Amount"
                size="large"
                style={{ flex: 1 }}
              />
              <Select value={fromToken} onChange={setFromToken} size="large" style={{ width: 120 }}>
                <Select.Option value="USDT">
                  <Space size="small">
                    <Avatar src={TOKEN_ICONS.USDT} size="small" />
                    USDT
                  </Space>
                </Select.Option>
                <Select.Option value="USDC">
                  <Space size="small">
                    <Avatar src={TOKEN_ICONS.USDC} size="small" />
                    USDC
                  </Space>
                </Select.Option>
              </Select>
            </Input.Group>
          </Space>
        </div>

        {/* Swap Icon */}
        <div style={{ textAlign: 'center' }}>
          <SwapOutlined style={{ fontSize: 24, color: '#1890ff' }} />
        </div>

        {/* To */}
        <div>
          <Text strong>To (Estimated)</Text>
          <Space direction="vertical" size="small" style={{ width: '100%', marginTop: 8 }}>
            <Select value={toChain} onChange={setToChain} style={{ width: '100%' }} size="large">
              <Select.Option value="Solana">
                <Space>
                  <Avatar src={CHAIN_ICONS.Solana} size="small" />
                  Solana
                </Space>
              </Select.Option>
              <Select.Option value="Ethereum">
                <Space>
                  <Avatar src={CHAIN_ICONS.Ethereum} size="small" />
                  Ethereum
                </Space>
              </Select.Option>
              <Select.Option value="TRON">
                <Space>
                  <Avatar src={CHAIN_ICONS.TRON} size="small" />
                  TRON
                </Space>
              </Select.Option>
            </Select>

            <Input.Group compact style={{ display: 'flex' }}>
              <Input
                value={getEstimatedOutput()}
                readOnly
                placeholder="--"
                size="large"
                style={{ flex: 1 }}
                suffix={isLoadingQuote && <Spin size="small" />}
              />
              <Select value={toToken} onChange={setToToken} size="large" style={{ width: 120 }}>
                <Select.Option value="USDT">
                  <Space size="small">
                    <Avatar src={TOKEN_ICONS.USDT} size="small" />
                    USDT
                  </Space>
                </Select.Option>
                <Select.Option value="USDC">
                  <Space size="small">
                    <Avatar src={TOKEN_ICONS.USDC} size="small" />
                    USDC
                  </Space>
                </Select.Option>
              </Select>
            </Input.Group>
          </Space>
        </div>

        {/* Quote Info */}
        {quote && (
          <div style={{ padding: 12, background: '#f0f2f5', borderRadius: 8 }}>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Rate</Text>
                <Text>
                  1 {fromToken} = 1.00 {toToken}
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Fee</Text>
                <Text>{LIFI_CONFIG.feePercent}%</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Slippage</Text>
                <Text>{LIFI_CONFIG.slippage}%</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Time</Text>
                <Text>~{quote.steps?.[0]?.estimate?.executionDuration || 300}s</Text>
              </div>
            </Space>
          </div>
        )}

        {/* Buttons */}
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button icon={<ReloadOutlined />} onClick={fetchQuote} loading={isLoadingQuote}>
            Refresh
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleSwap}
            loading={isSwapping}
            disabled={!quote || !fromAmount || parseFloat(fromAmount) <= 0}
            style={{ flex: 1, marginLeft: 12 }}
          >
            Swap
          </Button>
        </Space>

        {/* Warning */}
        <div style={{ padding: 12, background: '#fff7e6', border: '1px solid #ffd591', borderRadius: 4 }}>
          <Text type="warning" style={{ fontSize: 12 }}>
            ⚠️ Swap will bridge assets across chains. Transaction may take 5-10 minutes to complete.
          </Text>
        </div>
      </Space>
    </Modal>
  )
}

export default SwapDialog
