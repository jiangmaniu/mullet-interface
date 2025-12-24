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
import { coboWithdraw, getCoboBalance } from '@/services/api/cobo'
import { message } from '@/utils/message'
import { Form, Input, Select, Space, Avatar } from 'antd'
import { useCoboWallet } from '@/hooks/useCoboWallet'
import { CHAIN_ICONS } from '@/config/tokenIcons'
import { SUPPORTED_BRIDGE_CHAINS } from '@/config/lifiConfig'

// 使用统一的链配置
const SUPPORTED_CHAINS = SUPPORTED_BRIDGE_CHAINS.map((chain) => ({
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

// 出金弹窗 - 使用 Cobo API
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
    const { user } = usePrivy()
    const [chainBalance, setChainBalance] = useState<string>('0') // 当前链的实际余额
    const [loadingBalance, setLoadingBalance] = useState(false)

    const accountMoney = accountItem.money as number

    // 使用 useCoboWallet hook 获取或创建 Cobo 钱包
    const {
      walletId: coboWalletId,
      walletData: coboWalletData,
      isLoading: coboWalletLoading,
      error: coboWalletError
    } = useCoboWallet({
      tradeAccountId: accountItem?.id || trade.currentAccountInfo?.id,
      enabled: open && !!(accountItem?.id || trade.currentAccountInfo?.id)
    })

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
      }
    }

    // 对外暴露接口
    useImperativeHandle(ref, () => {
      return {
        show,
        close
      }
    })

    // Token ID 映射 - 返回可能的多个 token (USDC/USDT)
    // 注意：Cobo的token_id命名规范：USDC = USDCOIN, USDT = TETHER
    const getPossibleTokenIds = (chainId: string): string[] => {
      const tokenMap: Record<string, string[]> = {
        SOL: ['SOL_USDT', 'SOL_USDC'],
        ETH: ['ETH_USDT', 'ETH_USDC'],
        TRON: ['TRON'], // TRON 使用原生代币
        ARBITRUM_ETH: ['ARBITRUM_USDCOIN', 'ARBITRUM_TETHER'],
        BASE_ETH: ['BASE_USDCOIN', 'BASE_TETHER'],
        MATIC: ['MATIC_USDT', 'MATIC_USDC'],
        BSC_BNB: ['BSC_USDT', 'BSC_USDC']
      }
      return tokenMap[chainId] || ['SOL_USDT']
    }

    // 获取第一个可用的 token_id（用于提现）
    const getTokenId = (chainId: string): string => {
      return getPossibleTokenIds(chainId)[0]
    }

    // 当选择的链改变时，查询该链所有可能代币的总余额
    useEffect(() => {
      // 只在弹窗打开且有交易账户ID时查询
      const effectiveTradeAccountId = accountItem?.id || trade.currentAccountInfo?.id
      if (!open || !effectiveTradeAccountId || !selectedChain) return

      const fetchChainBalance = async () => {
        setLoadingBalance(true)
        try {
          const chainConfig = SUPPORTED_CHAINS.find((c) => c.name === selectedChain)
          if (!chainConfig) return

          const possibleTokenIds = getPossibleTokenIds(chainConfig.chainId)
          let totalBalance = BigInt(0)
          let foundTokenId = ''

          // 查询所有可能的代币余额并累加
          for (const tokenId of possibleTokenIds) {
            try {
              // 🔥 使用 tradeAccountId 而不是 Privy userId
              const response = await getCoboBalance({ userId: String(effectiveTradeAccountId), tokenId })
              if (response.success && response.data) {
                const available = BigInt(response.data.available || '0')
                if (available > 0) {
                  totalBalance += available
                  if (!foundTokenId) foundTokenId = tokenId
                  console.log('[WithdrawModal] Found balance:', {
                    tokenId,
                    available: response.data.available,
                    availableUSD: Number(available) / 1_000_000
                  })
                }
              }
            } catch (error) {
              // 该代币不存在或查询失败，继续下一个
              console.log(`[WithdrawModal] Token ${tokenId} not found, trying next...`)
            }
          }

          // 转换为 USD（USDC/USDT 都是 6 位小数）
          const balanceUSD = Number(totalBalance) / 1_000_000
          setChainBalance(balanceUSD.toFixed(2))
          console.log('[WithdrawModal] Total chain balance:', {
            chain: selectedChain,
            tradeAccountId: effectiveTradeAccountId,
            tokens: possibleTokenIds,
            totalBalanceRaw: totalBalance.toString(),
            totalBalanceUSD: balanceUSD.toFixed(2)
          })
        } catch (error) {
          console.error('[WithdrawModal] Failed to fetch chain balance:', error)
          setChainBalance('0')
        } finally {
          setLoadingBalance(false)
        }
      }

      fetchChainBalance()
    }, [open, selectedChain, accountItem?.id, trade.currentAccountInfo?.id])

    // 避免重复渲染
    if (!open) return null

    // 提交提现请求
    const handleSubmit = async (values: any) => {
      console.log('[WithdrawModal] 🚀 Starting Cobo withdraw...')
      console.log('[WithdrawModal] Form values:', values)

      const { money, withdrawAddress, targetChain } = values
      const effectiveTradeAccountId = accountItem?.id || trade.currentAccountInfo?.id

      if (!effectiveTradeAccountId) {
        message.error('请先选择交易账户')
        return
      }

      if (!coboWalletId) {
        message.error('未找到 Cobo 钱包，请先创建钱包')
        return
      }

      setSubmitLoading(true)

      try {
        // 获取选中的链配置
        const selectedChainConfig = SUPPORTED_CHAINS.find((c) => c.name === targetChain)
        if (!selectedChainConfig) {
          throw new Error('不支持的目标链')
        }

        const chainId = selectedChainConfig.chainId
        const tokenId = getTokenId(chainId)

        // 将 USD 金额转换为最小单位（USDC/USDT 都是 6 位小数）
        const amountInMinUnits = Math.floor(Number(money) * 1_000_000).toString()

        console.log('[WithdrawModal] 💰 Withdraw params:', {
          tradeAccountId: effectiveTradeAccountId,
          chainId,
          tokenId,
          amountUSD: money,
          amountMinUnits: amountInMinUnits,
          toAddress: withdrawAddress,
          walletId: coboWalletId
        })

        // 调用 Cobo 提现 API - 使用 tradeAccountId 而不是 Privy userId
        const response = await coboWithdraw({
          userId: String(effectiveTradeAccountId),
          chainId,
          tokenId,
          amount: amountInMinUnits,
          toAddress: withdrawAddress,
          walletId: coboWalletId
        })

        console.log('[WithdrawModal] ✅ Withdraw response:', response)

        if (response.success) {
          // 记录提现到交易系统
          await withdrawByAddress({
            accountId: accountItem.id,
            money: Number(money),
            remark: `Cobo withdraw to ${targetChain}`,
            withdrawAddress,
            targetChain
          })

          const requestId = response.data?.requestId || ''
          message.success(`提现请求已提交！请求ID: ${requestId.slice(-8)}`)

          close()
          form.resetFields()
          fetchUserInfo(true)
        } else {
          const errorMsg = (response as any).error || '提现失败'
          throw new Error(errorMsg)
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
              <span className="ml-2 text-sm text-gray-500 font-normal">(通过 Cobo 钱包出金)</span>
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
                      : selectedChain === 'BNB'
                      ? '请输入 BSC 地址 (以 0x 开头)'
                      : '请输入目标地址'
                  }
                />
              </Form.Item>

              {/* 链余额显示 */}
              <div
                className={`mb-4 px-3 py-2 rounded-lg border ${
                  theme.isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100/50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>可取金额:</span>
                  {loadingBalance ? (
                    <span className={`text-sm ${theme.isDark ? 'text-gray-400' : 'text-gray-500'}`}>加载中...</span>
                  ) : (
                    <span
                      className={`text-sm font-semibold ${
                        parseFloat(chainBalance) > 0
                          ? theme.isDark
                            ? 'text-green-500'
                            : 'text-green-600'
                          : theme.isDark
                          ? 'text-red-400'
                          : 'text-red-500'
                      }`}
                    >
                      {chainBalance || '0'} USD
                    </span>
                  )}
                </div>
                {!loadingBalance && parseFloat(chainBalance || '0') === 0 && (
                  <div className={`mt-1 text-xs ${theme.isDark ? 'text-red-400' : 'text-red-500'}`}>
                    ⚠️ 该链余额不足，请先充值或选择其他链
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
                      if (loadingBalance) {
                        return Promise.reject(new Error('正在加载链余额...'))
                      }
                      // 从表单获取当前选择的链，确保使用最新的值
                      const currentChain = form.getFieldValue('targetChain') || selectedChain
                      const availableBalance = parseFloat(chainBalance || '0')
                      if (availableBalance === 0) {
                        return Promise.reject(new Error(`${currentChain} 链余额为 0，请先充值或选择其他链`))
                      }
                      if (Number(value) > availableBalance) {
                        return Promise.reject(new Error(`${currentChain} 链余额不足，可用: ${chainBalance} USD`))
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
                      {!loadingBalance && chainBalance && parseFloat(chainBalance) > 0 && (
                        <span
                          onClick={() => form.setFieldValue('money', parseFloat(chainBalance))}
                          className="text-xs cursor-pointer hover:text-brand text-primary"
                        >
                          {intl.formatMessage({ id: 'mt.zuidazhi' })} {chainBalance} USD
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
                  <span className={`font-medium ${theme.isDark ? 'text-blue-400' : 'text-blue-600'}`}>ℹ️ 提现到 {selectedChain}</span>
                </div>
                <div className={`text-xs space-y-1 ${theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div>• 提现通过 Cobo 钱包处理</div>
                  <div>• 预计到账时间: 2-10 分钟</div>
                  <div>• 网络费用由平台支付</div>
                  {coboWalletLoading && <div className="text-blue-600 mt-2">🔄 正在加载钱包信息...</div>}
                  {coboWalletError && <div className="text-red-600 mt-2">⚠️ {coboWalletError}</div>}
                  {coboWalletData?.isNew && <div className="text-green-600 mt-2">✅ 已自动创建 Cobo 钱包</div>}
                </div>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                className="mt-8"
                loading={submitLoading || coboWalletLoading}
                disabled={!coboWalletId || coboWalletLoading}
              >
                {coboWalletLoading ? '正在加载钱包...' : intl.formatMessage({ id: 'mt.queding' })}
              </Button>
            </div>
          </Form>
        </Modal>
      </>
    )
  })
)
