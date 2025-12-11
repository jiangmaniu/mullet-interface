import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'

import Button from '@/components/Base/Button'
import InputNumber from '@/components/Base/InputNumber'
import Modal from '@/components/Base/Modal'
import { useStores } from '@/context/mobxProvider'
import { withdrawByAddress } from '@/services/api/tradeCore/account'
import { message } from '@/utils/message'
import { Form, Input, Select, Space, Avatar, Spin } from 'antd'
import { SUPPORTED_BRIDGE_CHAINS } from '@/config/lifiConfig'
import { CHAIN_ICONS } from '@/config/tokenIcons'
import { debridgeService } from '@/services/debridgeService'

// 出金弹窗
export default observer(
  forwardRef((props, ref) => {
    const intl = useIntl()
    const [open, setOpen] = useState(false)
    const { trade } = useStores()
    const [submitLoading, setSubmitLoading] = useState(false)
    const [form] = Form.useForm()
    const { fetchUserInfo } = useModel('user')
    const [accountItem, setAccountItem] = useState({} as User.AccountItem)
    const [selectedChain, setSelectedChain] = useState('Solana') // 默认 Solana
    
    // Privy 钱包集成
    const { ready, authenticated } = usePrivy()
    const { wallets } = useWallets()
    
    // 桥接状态
    const [isBridging, setIsBridging] = useState(false)
    const [bridgeStatus, setBridgeStatus] = useState('')

    const accountMoney = accountItem.money as number

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
        form.setFieldValue('targetChain', 'Solana') // 设置默认目标链
      }
    }

    // 对外暴露接口
    useImperativeHandle(ref, () => {
      return {
        show,
        close
      }
    })

    // 避免重复渲染
    if (!open) return

    // 执行跨链桥接
    const executeWithdrawBridge = async (
      targetChain: string,
      destinationAddress: string,
      amountInSmallestUnit: string
    ) => {
      setIsBridging(true)
      
      try {
        // 获取 Solana 钱包
        const solanaWallet = wallets.find((w) => w.walletClientType === 'privy' && w.chainType === 'solana')
        if (!solanaWallet) {
          throw new Error('未找到 Solana 钱包，请先连接 Privy Solana 钱包')
        }

        // Ethereum 桥接
        if (targetChain === 'Ethereum') {
          const minAmount = 10 * 1_000_000 // $10 最小金额
          if (parseInt(amountInSmallestUnit) < minAmount) {
            throw new Error(`Ethereum 桥接最小金额为 $10 USD`)
          }

          setBridgeStatus('正在桥接到 Ethereum...')
          await debridgeService.bridgeSolanaToEthereum({
            amount: amountInSmallestUnit,
            ethereumAddress: destinationAddress,
            solanaWallet
          })
          
          message.success('桥接交易已提交，预计 2-5 分钟到账')
          return true
        }

        // Tron 桥接（两步）
        if (targetChain === 'Tron') {
          const minAmount = 20 * 1_000_000 // $20 最小金额
          if (parseInt(amountInSmallestUnit) < minAmount) {
            throw new Error(`Tron 桥接最小金额为 $20 USD（需要两步桥接）`)
          }

          // 获取 Ethereum 钱包
          const ethWallet = wallets.find((w) => w.walletClientType === 'privy' && w.chainType === 'ethereum')
          if (!ethWallet) {
            throw new Error('未找到 Ethereum 钱包，请先连接 Privy Ethereum 钱包')
          }

          setBridgeStatus('步骤 1/2: 桥接 Solana → Ethereum...')
          const result = await debridgeService.bridgeSolanaToTron({
            amount: amountInSmallestUnit,
            tronAddress: destinationAddress,
            solanaWallet,
            ethereumWallet: ethWallet
          })

          setBridgeStatus('步骤 1/2 完成')
          message.warning(
            '第一步桥接完成。请等待 Ethereum 到账（约 2-5 分钟），然后手动触发第二步 Ethereum → Tron',
            8
          )
          
          return true
        }

        return false
      } catch (error: any) {
        console.error('Bridge error:', error)
        message.error(error.message || '桥接失败')
        throw error
      } finally {
        setIsBridging(false)
        setBridgeStatus('')
      }
    }

    const handleSubmit = async (values: any) => {
      console.log('values', values)
      const { money, withdrawAddress, targetChain = 'Solana' } = values || {}
      console.log('Target Chain:', targetChain)
      
      setSubmitLoading(true)
      
      try {
        // 如果目标链不是 Solana，需要通过跨链桥接
        if (targetChain !== 'Solana') {
          console.log('🌉 Starting cross-chain withdrawal via deBridge...')
          
          // 检查 Privy 认证
          if (!ready || !authenticated) {
            message.error('请先登录 Privy 钱包')
            return
          }
          
          // 转换金额为最小单位（USDC 6位小数）
          const amountInUsd = parseFloat(money)
          const amountInSmallestUnit = (amountInUsd * 1_000_000).toString()
          
          // 执行跨链桥接
          const bridgeSuccess = await executeWithdrawBridge(
            targetChain,
            withdrawAddress,
            amountInSmallestUnit
          )
          
          if (bridgeSuccess) {
            // 记录桥接订单到后端
            await withdrawByAddress({
              accountId: accountItem.id,
              money: Number(money),
              remark: `Cross-chain bridge to ${targetChain}`,
              withdrawAddress,
              targetChain
            })
            
            close()
            message.success('跨链出金已提交')
            form.resetFields()
            fetchUserInfo(true)
          }
        } else {
          // 直接提款到 Solana（无需跨链）
          const res = await withdrawByAddress({
            accountId: accountItem.id,
            money: Number(money),
            remark: '',
            withdrawAddress,
            targetChain
          })
          
          if (res.success) {
            close()
            message.info(intl.formatMessage({ id: 'common.opSuccess' }))
            form.resetFields()
            fetchUserInfo(true)
          }
        }
      } catch (error: any) {
        console.error('Withdrawal error:', error)
        message.error(error.message || '提款失败')
      } finally {
        setSubmitLoading(false)
      }
    }

    return (
      <>
        <Modal
          title={
            <div className="flex items-center">
              <FormattedMessage id="mt.chujin" />
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
                  value={selectedChain}
                  onChange={(value) => {
                    setSelectedChain(value)
                    form.setFieldValue('targetChain', value)
                  }}
                  size="large"
                  className="!h-[38px]"
                >
                  {SUPPORTED_BRIDGE_CHAINS.map((chain) => (
                    <Select.Option key={chain.name} value={chain.name}>
                      <Space>
                        <Avatar src={CHAIN_ICONS[chain.name]} size="small" />
                        {chain.name}
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
                rules={[{ required: true, message: intl.formatMessage({ id: 'mt.mubiaodizhi' }) }]}
              >
                <Input 
                  size="large" 
                  className="!h-[38px]" 
                  placeholder={
                    selectedChain === 'Ethereum' 
                      ? '请输入 Ethereum 地址 (以 0x 开头)' 
                      : selectedChain === 'Tron'
                      ? '请输入 Tron 地址 (以 T 开头)'
                      : '请输入 Solana 地址'
                  } 
                />
              </Form.Item>

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
                      if (!Number(accountMoney)) {
                        return Promise.reject(new Error(intl.formatMessage({ id: 'mt.yuebuzu' })))
                      }
                      if (Number(value) > accountMoney) {
                        return Promise.reject(new Error(intl.formatMessage({ id: 'mt.dangqianzhanghuyuebuzu' })))
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
                      {!!accountMoney && (
                        <span
                          onClick={() => form.setFieldValue('money', accountMoney)}
                          className="text-xs cursor-pointer hover:text-brand text-primary"
                        >
                          {intl.formatMessage({ id: 'mt.zuidazhi' })} {accountMoney} USD
                        </span>
                      )}
                    </>
                  }
                  placeholder={intl.formatMessage({ id: 'mt.jine' })}
                />
              </Form.Item>
              
              {/* 显示目标链信息 */}
              {selectedChain && selectedChain !== 'Solana' && (
                <div className="text-sm mt-4 px-4 py-2 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600 font-medium">
                      ⚠️ 跨链桥接到 {selectedChain}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1 space-y-1">
                    <div>• 桥接费用: ${selectedChain === 'Tron' ? '4-6' : '2-3'} USD</div>
                    <div>• 预计时间: {selectedChain === 'Tron' ? '5-10' : '2-5'} 分钟</div>
                    {selectedChain === 'Tron' && (
                      <div className="text-orange-600 mt-1">
                        ※ Tron 需要两步桥接（经 Ethereum 中转）
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <Button type="primary" htmlType="submit" block className="mt-8" loading={submitLoading}>
                {intl.formatMessage({ id: 'mt.queding' })}
              </Button>
            </div>
          </Form>
        </Modal>
        
        {/* 桥接进度遮罩 */}
        {isBridging && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
              <Spin size="large" />
              <div className="text-lg font-medium">{bridgeStatus || '正在处理跨链桥接...'}</div>
              <div className="text-sm text-gray-500">请勿关闭此页面</div>
            </div>
          </div>
        )}
      </>
    )
  })
)
