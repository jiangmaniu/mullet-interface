import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useSignAndSendTransaction } from '@privy-io/react-auth/solana'

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
    const { ready, authenticated, user } = usePrivy()
    const { wallets } = useWallets()
    const { signAndSendTransaction } = useSignAndSendTransaction()
    
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

    // 执行 Solana 链上直接转账（同链转账，无需桥接）
    const executeSolanaTransfer = async (
      destinationAddress: string,
      amountInSmallestUnit: string
    ) => {
      console.log('[WithdrawModal] executeSolanaTransfer called')
      console.log('[WithdrawModal]   - destinationAddress:', destinationAddress)
      console.log('[WithdrawModal]   - amountInSmallestUnit:', amountInSmallestUnit)
      
      setIsBridging(true)
      setBridgeStatus('正在转账...')
      
      try {
        // 动态导入 Solana 依赖
        const { PublicKey, Transaction } = await import('@solana/web3.js')
        const { 
          TOKEN_PROGRAM_ID,
          getAssociatedTokenAddressSync,
          createAssociatedTokenAccountInstruction,
          createTransferInstruction,
        } = await import('@solana/spl-token')
        
        // 获取 Solana 钱包
        const solanaAccount = user?.linkedAccounts?.find(
          (account: any) => account.type === 'wallet' && account.chainType === 'solana'
        ) as any
        
        const solanaWallet = wallets.find((w) => (w as any).chainType === 'solana') || { address: solanaAccount?.address }
        
        if (!solanaWallet || !solanaWallet.address) {
          throw new Error('未找到 Solana 钱包，请先连接 Privy Solana 钱包')
        }

        const senderPubkey = new PublicKey(solanaWallet.address)
        const recipientPubkey = new PublicKey(destinationAddress)
        const transaction = new Transaction()

        // USDC Mint 地址
        const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        const mintPubkey = new PublicKey(USDC_MINT)
        
        // 获取发送者和接收者的 ATA
        const senderAta = getAssociatedTokenAddressSync(
          mintPubkey,
          senderPubkey,
          false,
          TOKEN_PROGRAM_ID
        )
        const recipientAta = getAssociatedTokenAddressSync(
          mintPubkey,
          recipientPubkey,
          false,
          TOKEN_PROGRAM_ID
        )

        // 创建 connection 来检查账户
        const { Connection } = await import('@solana/web3.js')
        const connection = new Connection(
          'https://rpc.ankr.com/solana/6399319de5985a2ee9496b8ae8590d7bba3988a6fb28d4fc80cb1fbf9f039fb3',
          'confirmed'
        )

        // 检查接收者 ATA 是否存在
        const recipientAtaInfo = await connection.getAccountInfo(recipientAta)
        if (!recipientAtaInfo) {
          // 创建接收者 ATA
          transaction.add(
            createAssociatedTokenAccountInstruction(
              senderPubkey,
              recipientAta,
              recipientPubkey,
              mintPubkey,
              TOKEN_PROGRAM_ID
            )
          )
        }

        // 添加转账指令
        transaction.add(
          createTransferInstruction(
            senderAta,
            recipientAta,
            senderPubkey,
            parseInt(amountInSmallestUnit),
            [],
            TOKEN_PROGRAM_ID
          )
        )

        // 安全过滤：移除 CloseAccount 指令防止租金退款漏洞
        // 使用 gas sponsorship 时，用户可以从租金退款中获利 (~$0.40/tx)
        const filteredInstructions = transaction.instructions.filter((instruction) => {
          const discriminator = instruction.data[0]
          return discriminator !== 0x0a // 0x0a = CloseAccount
        })

        // 重建安全的交易
        const secureTransaction = new Transaction()
        filteredInstructions.forEach(ix => secureTransaction.add(ix))

        // 获取最新 blockhash
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
        secureTransaction.recentBlockhash = blockhash
        secureTransaction.lastValidBlockHeight = lastValidBlockHeight
        secureTransaction.feePayer = senderPubkey

        // 序列化交易
        const serializedTx = secureTransaction.serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        })

        console.log('[WithdrawModal] Sending Solana transaction via signAndSendTransaction...')

        // 使用 Privy 的 signAndSendTransaction（支持 gas sponsorship）
        const result = await signAndSendTransaction({
          transaction: serializedTx,
          wallet: solanaWallet,
          options: {
            sponsor: true, // 启用 gas sponsorship - Privy 支付 gas 费
          },
        })

        const signature = result.signature
        
        console.log('[WithdrawModal] ✅ Solana transfer successful:', signature)
        console.log(`[WithdrawModal] 🎉 Check tx: https://solscan.io/tx/${signature}`)
        
        message.success(
          <span>
            转账成功！
            <a 
              href={`https://solscan.io/tx/${signature}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ marginLeft: 8, color: '#1890ff' }}
            >
              查看交易
            </a>
          </span>
        )
        
        return true
      } catch (error: any) {
        console.error('Solana transfer error:', error)
        message.error(error.message || 'Solana 转账失败')
        throw error
      } finally {
        setIsBridging(false)
        setBridgeStatus('')
      }
    }

    // 执行跨链桥接
    const executeWithdrawBridge = async (
      targetChain: string,
      destinationAddress: string,
      amountInSmallestUnit: string
    ) => {
      console.log('[WithdrawModal] executeWithdrawBridge called')
      console.log('[WithdrawModal]   - targetChain:', targetChain)
      console.log('[WithdrawModal]   - destinationAddress:', destinationAddress)
      console.log('[WithdrawModal]   - amountInSmallestUnit:', amountInSmallestUnit)
      
      setIsBridging(true)
      
      try {
        // 从 linkedAccounts 获取账户信息（备份）
        const solanaAccount = user?.linkedAccounts?.find(
          (account: any) => account.type === 'wallet' && account.chainType === 'solana'
        ) as any
        
        // 优先从 wallets 数组获取完整的钱包对象（包含 sendTransaction 方法）
        const solanaWallet = wallets.find((w) => (w as any).chainType === 'solana') || { address: solanaAccount?.address }
        
        if (!solanaWallet || !solanaWallet.address) {
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
            signAndSendTransaction,
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

          // 从 linkedAccounts 获取账户信息（备份）
          const ethAccount = user?.linkedAccounts?.find(
            (account: any) => account.type === 'wallet' && account.chainType === 'ethereum'
          ) as any
          
          // 优先从 wallets 数组获取完整的钱包对象
          const ethWallet = wallets.find((w) => (w as any).chainType === 'ethereum') || { address: ethAccount?.address }
          
          if (!ethWallet || !ethWallet.address) {
            throw new Error('未找到 Ethereum 钱包，请先连接 Privy Ethereum 钱包')
          }

          setBridgeStatus('步骤 1/2: 桥接 Solana → Ethereum...')
          const result = await debridgeService.bridgeSolanaToTron({
            amount: amountInSmallestUnit,
            tronAddress: destinationAddress,
            solanaWallet,
            signAndSendTransaction,
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
      console.log('[WithdrawModal] 📝 Form values:', values)
      const { money, withdrawAddress, targetChain = 'Solana' } = values || {}
      console.log('[WithdrawModal] 🎯 Target Chain:', targetChain)
      console.log('[WithdrawModal] 💰 Amount:', money)
      console.log('[WithdrawModal] 📍 Address:', withdrawAddress)
      console.log('[WithdrawModal] ❓ Is cross-chain?', targetChain !== 'Solana')
      
      setSubmitLoading(true)
      
      try {
        // 如果目标链不是 Solana，需要通过跨链桥接
        if (targetChain !== 'Solana') {
          console.log('[WithdrawModal] 🌉 Starting cross-chain withdrawal via deBridge...')
          console.log('[WithdrawModal] 🔐 Privy ready:', ready, 'authenticated:', authenticated)
          
          // 检查 Privy 认证
          if (!ready || !authenticated) {
            console.error('[WithdrawModal] ❌ Privy not ready or not authenticated')
            message.error('请先登录 Privy 钱包')
            setSubmitLoading(false)
            return
          }
          
          console.log('[WithdrawModal] ✅ Privy authentication OK, proceeding with bridge...')
          
          // 转换金额为最小单位（USDC 6位小数）
          const amountInUsd = parseFloat(money)
          const amountInSmallestUnit = (amountInUsd * 1_000_000).toString()
          
          console.log('[WithdrawModal] 💱 Amount conversion:', {
            amountInUsd,
            amountInSmallestUnit
          })
          
          // 执行跨链桥接
          const bridgeSuccess = await executeWithdrawBridge(
            targetChain,
            withdrawAddress,
            amountInSmallestUnit
          )
          
          console.log('[WithdrawModal] 🎯 Bridge result:', bridgeSuccess)
          
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
          // 直接提款到 Solana（链上转账，使用 gas sponsorship）
          console.log('[WithdrawModal] 💸 Starting Solana direct transfer...')
          
          // 检查 Privy 认证
          if (!ready || !authenticated) {
            console.error('[WithdrawModal] ❌ Privy not ready or not authenticated')
            message.error('请先登录 Privy 钱包')
            setSubmitLoading(false)
            return
          }
          
          // 转换金额为最小单位（USDC 6位小数）
          const amountInUsd = parseFloat(money)
          const amountInSmallestUnit = (amountInUsd * 1_000_000).toString()
          
          console.log('[WithdrawModal] 💱 Amount conversion:', {
            amountInUsd,
            amountInSmallestUnit
          })
          
          // 执行 Solana 转账
          const transferSuccess = await executeSolanaTransfer(
            withdrawAddress,
            amountInSmallestUnit
          )
          
          console.log('[WithdrawModal] 🎯 Transfer result:', transferSuccess)
          
          if (transferSuccess) {
            // 记录转账到后端
            await withdrawByAddress({
              accountId: accountItem.id,
              money: Number(money),
              remark: 'Solana direct transfer',
              withdrawAddress,
              targetChain: 'Solana'
            })
            
            close()
            message.success('Solana 转账成功')
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
                  onChange={(value) => {
                    console.log('[WithdrawModal] 🔄 Chain selected:', value)
                    setSelectedChain(value)
                    form.setFieldValue('targetChain', value) // 确保表单值被更新
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
                    form.getFieldValue('targetChain') === 'Ethereum' 
                      ? '请输入 Ethereum 地址 (以 0x 开头)' 
                      : form.getFieldValue('targetChain') === 'Tron'
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
