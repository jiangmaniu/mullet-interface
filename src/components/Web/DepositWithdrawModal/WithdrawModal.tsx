import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'

import Button from '@/components/Base/Button'
import InputNumber from '@/components/Base/InputNumber'
import Modal from '@/components/Base/Modal'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { withdrawByAddress } from '@/services/api/tradeCore/account'
import { message } from '@/utils/message'
import { Form, Input, Select, Space, Avatar } from 'antd'
import { useCachedServerWallet } from '@/context/ServerWalletsProvider'
import { useServerWallet } from '@/hooks/useServerWallet'
import { CHAIN_ICONS, getTokenIcon } from '@/config/tokenIcons'
import { SUPPORTED_BRIDGE_CHAINS, SUPPORTED_TOKENS } from '@/config/lifiConfig'
import type { SupportedChain } from '@/services/serverWalletService'
import { API_BASE_URL } from '@/constants/api'

// 使用统一的链配置 - 只使用 Privy 链
const SUPPORTED_CHAINS = SUPPORTED_BRIDGE_CHAINS.filter(chain => chain.type === 'privy').map((chain) => ({
  name: chain.name,
  displayName: chain.displayName,
  chainId: chain.id
}))

// 地址验证规则
const ADDRESS_VALIDATION: Record<string, RegExp> = {
  Solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  Ethereum: /^0x[a-fA-F0-9]{40}$/,
  Tron: /^T[a-zA-Z0-9]{33}$/,
  Arbitrum: /^0x[a-fA-F0-9]{40}$/,
  Base: /^0x[a-fA-F0-9]{40}$/,
  Polygon: /^0x[a-fA-F0-9]{40}$/,
  BSC: /^0x[a-fA-F0-9]{40}$/
}

// 出金弹窗 - 使用 Privy Server Wallet
export default observer(
  forwardRef((props, ref) => {
    const intl = useIntl()
    const [open, setOpen] = useState(false)
    const { trade } = useStores()
    const { theme } = useTheme()
    const [submitLoading, setSubmitLoading] = useState(false)
    const [form] = Form.useForm()
    const { fetchUserInfo } = useModel('user')
    const [accountItem, setAccountItem] = useState({} as User.AccountItem)
    const [selectedChain, setSelectedChain] = useState('Solana')
    const [selectedToken, setSelectedToken] = useState('USDC')
    const { user, getAccessToken } = usePrivy()
    const [walletBalance, setWalletBalance] = useState<string>('0') // Solana 钱包余额
    const [loadingBalance, setLoadingBalance] = useState(false)

    const tradeAccountId = accountItem?.id || trade.currentAccountInfo?.id

    // 获取 Solana 钱包地址（源钱包 - 出金时从这里转出）
    const cachedWallet = useCachedServerWallet('solana') // 出金总是从 Solana 钱包转出
    const { address: serverWalletAddress, isCreating: isServerWalletCreating } = useServerWallet(
      'solana',
      open && !!tradeAccountId && !cachedWallet.address,
      tradeAccountId
    )
    const solanaWalletAddress = cachedWallet.address || serverWalletAddress
    const isWalletLoading = cachedWallet.isLoading || isServerWalletCreating

    const close = () => {
      setOpen(false)
      form.resetFields()
    }

    const show = (item?: User.AccountItem) => {
      setOpen(true)
      const rawItem = item || trade.currentAccountInfo
      if (rawItem) {
        setAccountItem(rawItem)
        form.setFieldValue('accountId', rawItem.id)
        form.setFieldValue('targetChain', 'Solana')
        form.setFieldValue('targetToken', 'USDC')
      }
    }

    // 对外暴露接口
    useImperativeHandle(ref, () => {
      return {
        show,
        close
      }
    })

    // 查询 Solana 钱包余额
    useEffect(() => {
      if (!open || !solanaWalletAddress) return

      const fetchBalance = async () => {
        setLoadingBalance(true)
        try {
          const accessToken = await getAccessToken()
          if (!accessToken) {
            console.error('[WithdrawModal] No access token')
            return
          }

          // 调用后端 API 查询余额
          const response = await fetch(`${API_BASE_URL}/api/solana-wallet/balance?address=${solanaWalletAddress}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            // 假设返回的是 USDC 余额（6位小数）
            const balanceUSD = data.usdcBalance || data.balance || '0'
            setWalletBalance(balanceUSD)
            console.log('[WithdrawModal] Wallet balance:', balanceUSD)
          } else {
            console.error('[WithdrawModal] Failed to fetch balance:', response.status)
            setWalletBalance('0')
          }
        } catch (error) {
          console.error('[WithdrawModal] Failed to fetch balance:', error)
          setWalletBalance('0')
        } finally {
          setLoadingBalance(false)
        }
      }

      fetchBalance()
    }, [open, solanaWalletAddress, getAccessToken])

    // 避免重复渲染
    if (!open) return null

    // 获取选中链支持的代币
    const getChainTokens = (chainName: string) => {
      const chainKey = chainName.toLowerCase() as keyof typeof SUPPORTED_TOKENS
      return SUPPORTED_TOKENS[chainKey] || SUPPORTED_TOKENS.solana
    }

    // 提交提现请求
    const handleSubmit = async (values: any) => {
      console.log('[WithdrawModal] 🚀 Starting Privy withdraw...')
      console.log('[WithdrawModal] Form values:', values)

      const { money, withdrawAddress, targetChain, targetToken } = values

      if (!tradeAccountId) {
        message.error('请先选择交易账户')
        return
      }

      if (!solanaWalletAddress) {
        message.error('Solana 钱包未就绪，请稍后重试')
        return
      }

      setSubmitLoading(true)

      try {
        const accessToken = await getAccessToken()
        if (!accessToken) {
          throw new Error('无法获取访问令牌，请重新登录')
        }

        // 获取选中的链配置
        const selectedChainConfig = SUPPORTED_CHAINS.find((c) => c.name === targetChain)
        if (!selectedChainConfig) {
          throw new Error('不支持的目标链')
        }

        // 将 USD 金额转换为最小单位（USDC/USDT 都是 6 位小数）
        const amountInMinUnits = Math.floor(Number(money) * 1_000_000).toString()

        console.log('[WithdrawModal] 💰 Withdraw params:', {
          tradeAccountId,
          fromAddress: solanaWalletAddress,
          toAddress: withdrawAddress,
          targetChain,
          targetToken,
          amountUSD: money,
          amountMinUnits: amountInMinUnits,
        })

        // 如果目标链是 Solana，使用直接转账
        if (targetChain === 'Solana') {
          // 直接 Solana 链上转账
          const response = await fetch(`${API_BASE_URL}/api/solana-wallet/transfer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              tradeAccountId,
              toAddress: withdrawAddress,
              token: targetToken,
              amount: amountInMinUnits,
            }),
          })

          const result = await response.json()
          
          if (result.success || result.txHash) {
            // 记录提现到交易系统
            await withdrawByAddress({
              accountId: accountItem.id,
              money: Number(money),
              remark: `Privy withdraw ${targetToken} to ${targetChain}`,
              withdrawAddress,
              targetChain
            })

            message.success(`提现成功！交易哈希: ${(result.txHash || '').slice(0, 12)}...`)
            close()
            form.resetFields()
            fetchUserInfo(true)
          } else {
            throw new Error(result.error || result.message || '提现失败')
          }
        } else {
          // 跨链提现 - 使用 DeBridge 桥接
          const response = await fetch(`${API_BASE_URL}/api/debridge/withdraw`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              userId: tradeAccountId,
              sourceAddress: solanaWalletAddress,
              destinationChain: selectedChainConfig.chainId.toUpperCase(),
              destinationToken: targetToken,
              destinationAddress: withdrawAddress,
              amount: amountInMinUnits,
            }),
          })

          const result = await response.json()

          if (result.success) {
            // 记录提现到交易系统
            await withdrawByAddress({
              accountId: accountItem.id,
              money: Number(money),
              remark: `Privy bridge ${targetToken} to ${targetChain}`,
              withdrawAddress,
              targetChain
            })

            message.success(`跨链提现订单已创建！订单ID: ${result.data?.orderId || ''}`)
            close()
            form.resetFields()
            fetchUserInfo(true)
          } else {
            throw new Error(result.msg || result.error || '创建跨链订单失败')
          }
        }
      } catch (error: any) {
        console.error('[WithdrawModal] ❌ Withdraw error:', error)
        message.error(error.message || '提现失败，请稍后重试')
      } finally {
        setSubmitLoading(false)
      }
    }

    // 地址验证器
    const validateAddress = (_: any, value: string) => {
      if (!value) {
        return Promise.reject(new Error('请输入目标地址'))
      }

      const pattern = ADDRESS_VALIDATION[selectedChain]
      if (pattern && !pattern.test(value)) {
        return Promise.reject(new Error(`无效的 ${selectedChain} 地址格式`))
      }

      return Promise.resolve()
    }

    return (
      <>
        <Modal
          title={
            <div className="flex items-center">
              <FormattedMessage id="mt.chujin" />
              <span className="ml-2 text-sm text-gray-500 font-normal">(通过 Privy 钱包出金)</span>
            </div>
          }
          open={open}
          onClose={close}
          footer={null}
          width={580}
          centered
        >
          <Form onFinish={handleSubmit} layout="vertical" form={form}>
            <div className="mt-8">
              {/* 目标链选择器 */}
              <Form.Item
                required
                label="目标链"
                name="targetChain"
                initialValue="Solana"
                rules={[{ required: true, message: '请选择目标链' }]}
              >
                <Select
                  onChange={(value) => {
                    console.log('[WithdrawModal] 🔄 Chain selected:', value)
                    setSelectedChain(value)
                    form.setFieldValue('targetChain', value)
                    // 清空地址字段以重新验证
                    form.setFieldValue('withdrawAddress', '')
                    // 检查当前代币是否在新链支持
                    const tokens = getChainTokens(value)
                    const currentToken = form.getFieldValue('targetToken')
                    if (!tokens.find(t => t.symbol === currentToken)) {
                      form.setFieldValue('targetToken', tokens[0]?.symbol || 'USDC')
                      setSelectedToken(tokens[0]?.symbol || 'USDC')
                    }
                  }}
                  size="large"
                  className="!h-[38px]"
                >
                  {SUPPORTED_CHAINS.map((chain) => (
                    <Select.Option key={chain.name} value={chain.name}>
                      <Space>
                        <Avatar src={CHAIN_ICONS[chain.name]} size="small" />
                        {chain.displayName}
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* 目标代币选择器 */}
              <Form.Item
                required
                label="目标代币"
                name="targetToken"
                initialValue="USDC"
                rules={[{ required: true, message: '请选择目标代币' }]}
              >
                <Select
                  onChange={(value) => {
                    console.log('[WithdrawModal] 🔄 Token selected:', value)
                    setSelectedToken(value)
                  }}
                  size="large"
                  className="!h-[38px]"
                >
                  {getChainTokens(selectedChain).map((token) => (
                    <Select.Option key={token.symbol} value={token.symbol}>
                      <Space>
                        <Avatar src={getTokenIcon(token.symbol)} size="small" />
                        {token.symbol}
                        <span className="text-gray-400 text-xs">({token.name})</span>
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                className="!mt-5"
                required
                label={intl.formatMessage({ id: 'mt.mubiaodizhi' })}
                name="withdrawAddress"
                rules={[{ required: true, message: '请输入目标地址' }, { validator: validateAddress }]}
              >
                <Input
                  size="large"
                  className="!h-[38px]"
                  placeholder={
                    selectedChain === 'Ethereum'
                      ? '请输入 Ethereum 地址 (以 0x 开头)'
                      : selectedChain === 'Tron'
                      ? '请输入 Tron 地址 (以 T 开头)'
                      : selectedChain === 'Solana'
                      ? '请输入 Solana 地址'
                      : selectedChain === 'Arbitrum'
                      ? '请输入 Arbitrum 地址 (以 0x 开头)'
                      : selectedChain === 'Base'
                      ? '请输入 Base 地址 (以 0x 开头)'
                      : selectedChain === 'Polygon'
                      ? '请输入 Polygon 地址 (以 0x 开头)'
                      : selectedChain === 'BSC'
                      ? '请输入 BSC 地址 (以 0x 开头)'
                      : '请输入目标地址'
                  }
                />
              </Form.Item>

              {/* 钱包余额显示 */}
              <div
                className={`mb-4 px-3 py-2 rounded-lg border ${
                  theme.isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100/50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>可取金额:</span>
                  {loadingBalance || isWalletLoading ? (
                    <span className={`text-sm ${theme.isDark ? 'text-gray-400' : 'text-gray-500'}`}>加载中...</span>
                  ) : (
                    <span
                      className={`text-sm font-semibold ${
                        parseFloat(walletBalance) > 0
                          ? theme.isDark
                            ? 'text-green-500'
                            : 'text-green-600'
                          : theme.isDark
                          ? 'text-red-400'
                          : 'text-red-500'
                      }`}
                    >
                      {walletBalance || '0'} USD
                    </span>
                  )}
                </div>
                {!loadingBalance && !isWalletLoading && parseFloat(walletBalance || '0') === 0 && (
                  <div className={`mt-1 text-xs ${theme.isDark ? 'text-red-400' : 'text-red-500'}`}>
                    ⚠️ 钱包余额不足，请先充值
                  </div>
                )}
                {solanaWalletAddress && (
                  <div className={`mt-1 text-xs ${theme.isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    钱包: {solanaWalletAddress.slice(0, 6)}...{solanaWalletAddress.slice(-4)}
                  </div>
                )}
              </div>

              <Form.Item
                className="!mt-5"
                required
                label={intl.formatMessage({ id: 'mt.jine' })}
                name="money"
                rules={[
                  {
                    required: true,
                    validator: (_, value) => {
                      if (!Number(value)) {
                        return Promise.reject(new Error(intl.formatMessage({ id: 'mt.qingshurujine' })))
                      }
                      if (loadingBalance || isWalletLoading) {
                        return Promise.reject(new Error('正在加载钱包余额...'))
                      }
                      const availableBalance = parseFloat(walletBalance || '0')
                      if (availableBalance === 0) {
                        return Promise.reject(new Error('钱包余额为 0，请先充值'))
                      }
                      if (Number(value) > availableBalance) {
                        return Promise.reject(new Error(`余额不足，可用: ${walletBalance} USD`))
                      }
                      if (Number(value) < 1) {
                        return Promise.reject(new Error('最低提现金额为 1 USD'))
                      }
                      return Promise.resolve()
                    }
                  }
                ]}
              >
                <InputNumber
                  showAddMinus={false}
                  showFloatTips={false}
                  addonAfter={
                    <>
                      {!loadingBalance && !isWalletLoading && walletBalance && parseFloat(walletBalance) > 0 && (
                        <span
                          onClick={() => form.setFieldValue('money', parseFloat(walletBalance))}
                          className="text-xs cursor-pointer hover:text-brand text-primary"
                        >
                          {intl.formatMessage({ id: 'mt.zuidazhi' })} {walletBalance} USD
                        </span>
                      )}
                    </>
                  }
                  placeholder={intl.formatMessage({ id: 'mt.jine' })}
                />
              </Form.Item>

              {/* 提现信息提示 */}
              <div
                className={`text-sm mt-4 px-4 py-3 rounded-lg border ${
                  theme.isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-medium ${theme.isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    ℹ️ 提现 {selectedToken} 到 {selectedChain}
                  </span>
                </div>
                <div className={`text-xs space-y-1 ${theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div>• 提现通过 Privy Server Wallet 处理</div>
                  <div>• 预计到账时间: {selectedChain === 'Solana' ? '即时 (1-2秒)' : '2-10 分钟'}</div>
                  <div>• 网络费用由平台支付 (Gas Sponsorship)</div>
                  {selectedChain !== 'Solana' && (
                    <div>• 跨链提现使用 DeBridge 桥接</div>
                  )}
                  {isWalletLoading && <div className="text-blue-600 mt-2">🔄 正在加载钱包信息...</div>}
                </div>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                className="mt-8"
                loading={submitLoading || isWalletLoading}
                disabled={!solanaWalletAddress || isWalletLoading}
              >
                {isWalletLoading ? '正在加载钱包...' : intl.formatMessage({ id: 'mt.queding' })}
              </Button>
            </div>
          </Form>
        </Modal>
      </>
    )
  })
)
