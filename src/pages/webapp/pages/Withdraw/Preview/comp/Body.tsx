import { PageLoading } from '@ant-design/pro-components'
import { FormattedMessage, getIntl, useIntl } from '@umijs/max'
import { Form } from 'antd'
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { stores } from '@/context/mobxProvider'

import { DEFAULT_CURRENCY_DECIMAL } from '@/constants'
import { useTheme } from '@/context/themeProvider'
import { ModalRef } from '@/pages/webapp/components/Base/SheetModal'
import { generateWithdrawOrder } from '@/services/api/wallet'
import { formatNum } from '@/utils'
import { withdrawExchangeRate } from '@/utils/deposit'
import { validateNonEmptyFields } from '@/utils/form'
import { message } from '@/utils/message'
import { replace } from '@/utils/navigator'
import { appendHideParamIfNeeded } from '@/utils/request'
import { md5 } from 'js-md5'
import { observer } from 'mobx-react'
import { WebviewComponentProps } from '../../WebviewPage'
import SecurityCertificationModal from './SecurityCertificationModal'
import Step2 from './Step2'
import { debridgeService } from '@/services/debridgeService'
import { usePrivy, useWallets } from '@privy-io/react-auth'

const Notice = observer(({ methodId }: { methodId: string }) => {
  const methodInfo = stores.wallet.withdrawalMethods.find((item) => item.id === methodId)
  return (
    <div className="text-secondary text-xs">
      {methodInfo?.notice ? (
        <p className="leading-7" dangerouslySetInnerHTML={{ __html: methodInfo?.notice?.replace(/\n/g, '<br>') }} />
      ) : (
        <div className="text-xs text-gray-400">
          <FormattedMessage id="mt.zanwuneirong" />
        </div>
      )}
    </div>
  )
})

const WithdrawalPreview = forwardRef(({ onDisabledChange }: WebviewComponentProps, ref) => {
  const { theme } = useTheme()
  const [form] = Form.useForm()
  const { user } = usePrivy()
  const { wallets } = useWallets()

  const methods = stores.wallet.withdrawalMethods
  const intl = useIntl()

  const [bridgeInProgress, setBridgeInProgress] = useState(false)
  const [bridgeStatus, setBridgeStatus] = useState('')

  const withdrawalMethodInitialized = stores.wallet.withdrawalMethodInitialized
  const [prevIntl, setPrevIntl] = useState(intl.locale) // 防止重复请求

  useLayoutEffect(() => {
    const now = Date.now().valueOf()
    if (prevIntl !== intl.locale || now - withdrawalMethodInitialized > 1000 * 30) {
      const language = intl.locale.replace('-', '').replace('_', '').toUpperCase() as Wallet.Language
      stores.wallet.getWithdrawalMethods({ language })

      setPrevIntl(intl.locale)
      return
    }
  }, [withdrawalMethodInitialized, intl.locale])

  const methodId = Form.useWatch('methodId', form)
  const fromAccountId = Form.useWatch('fromAccountId', form)
  const amount = Form.useWatch('amount', form)
  const actualAmount = Form.useWatch('actualAmount', form)
  const symbol = Form.useWatch('symbol', form)
  const currency = Form.useWatch('currency', form)
  const exchangeRate = Form.useWatch('exchangeRate', form)
  const targetChain = Form.useWatch('targetChain', form) || 'Solana' // 目标链

  const [step, setStep] = useState(0)

  const securityCertificationModalRef = useRef<ModalRef>(null)
  const handleSubmit0 = async () => {
    // 1. 打開安全驗證
    securityCertificationModalRef.current?.show()

    // form
    //   .validateFields()
    //   .then((values) => {
    //     onSuccess?.(values)
    //   })
    //   .catch((err) => {
    //     console.log('err', err)
    //   })
  }

  const [loading, setLoading] = useState(false)

  const methodInfo = useMemo(() => methods.find((item) => item.id === methodId), [methodId, methods])

  useImperativeHandle(ref, () => ({
    onSubmit: handleSubmit0
  }))

  const disabled = !amount || !actualAmount || Number(actualAmount) <= 0 || loading

  useEffect(() => {
    if (disabled) {
      onDisabledChange?.(true)
    } else {
      onDisabledChange?.(false)
    }
  }, [disabled])

  const handleSubmit1 = async (params: any) => {
    console.log('params', params)

    if (!params.password || !params.code) {
      message.info(getIntl().formatMessage({ id: 'mt.qingshuruzhanghaomimayanzhengma' }))
      return
    }

    form
      .validateFields()
      .then(async (values) => {
        setLoading(true)
        
        try {
          const targetChain = values.targetChain || 'Solana'
          
          // 如果目标链不是 Solana，需要先执行跨链桥接
          if (targetChain !== 'Solana') {
            console.log('[Withdraw] Starting cross-chain bridge:', { targetChain, amount: values.amount })
            setBridgeInProgress(true)
            setBridgeStatus(`正在桥接到 ${targetChain}...`)
            
            // 执行 Solana → 目标链的桥接
            await executeWithdrawBridge(values.toAccountId, values.amount, targetChain)
            
            setBridgeStatus('桥接完成')
            setBridgeInProgress(false)
          }

          // 调用原有的出金接口
          generateWithdrawOrder({
            address: values.toAccountId,
            bankName: values.bankName,
            bankCard: values.bankCard,
            baseOrderAmount: values.amount,
            channelId: values.methodId,
            password: md5(params.password),
            phoneCode: params.code,
            tradeAccountId: values.fromAccountId
          })
            .then((res) => {
              if (res.success) {
                replace(appendHideParamIfNeeded(`/app/withdraw/wait/${res.data.id}`))
              } else {
                message.info(res.message)
              }
            })
            .finally(() => {
              setLoading(false)
            })
        } catch (error) {
          console.error('[Withdraw] Bridge failed:', error)
          message.error(error instanceof Error ? error.message : '跨链桥接失败')
          setBridgeInProgress(false)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log('err', err)
        setLoading(false)
      })
  }

  /**
   * 执行出金跨链桥接：Solana → 目标链 (ETH/TRON)
   */
  const executeWithdrawBridge = async (destinationAddress: string, amount: string, targetChain: string) => {
    // 获取 Solana 钱包
    const solanaWallet = wallets.find((w: any) => w.walletClientType === 'privy' && w.chainType === 'solana')
    if (!solanaWallet) {
      throw new Error('未找到 Solana 钱包')
    }

    console.log('[WithdrawBridge] Executing bridge:', {
      from: 'Solana',
      to: targetChain,
      amount,
      destination: destinationAddress
    })

    const amountInUsd = parseFloat(amount)
    const amountInSmallestUnit = (amountInUsd * 1_000_000).toString() // 转换为 6 位小数
    
    // 检查最小金额（deBridge 限制）
    const minAmount = targetChain === 'Tron' ? 20 : 10 // Tron 需要 $20，ETH 需要 $10
    if (amountInUsd < minAmount) {
      throw new Error(`金额太小，最少需要 $${minAmount} USD（当前: $${amountInUsd.toFixed(2)}）`)
    }

    try {
      // 根据目标链执行不同的桥接
      if (targetChain === 'Ethereum') {
        setBridgeStatus('正在桥接到 Ethereum...')
        
        await debridgeService.bridgeSolanaToEthereum({
          amount: amountInSmallestUnit,
          ethereumAddress: destinationAddress,
          solanaWallet
        })
        
        console.log('[WithdrawBridge] ✅ Solana → Ethereum bridge completed')
        
      } else if (targetChain === 'Tron') {
        setBridgeStatus('步骤 1/2: 正在桥接到 Ethereum...')
        
        // 获取 Ethereum 钱包（中转用）
        const ethWallet = wallets.find((w: any) => w.chainType === 'ethereum')
        if (!ethWallet) {
          throw new Error('未找到 Ethereum 钱包，无法完成 Tron 桥接')
        }
        
        const result = await debridgeService.bridgeSolanaToTron({
          amount: amountInSmallestUnit,
          tronAddress: destinationAddress,
          solanaWallet,
          ethereumWallet: ethWallet
        })
        
        console.log('[WithdrawBridge] ✅ Step 1/2 completed:', result.txHash)
        
        // 提示用户需要等待第二步
        message.warning({
          content: '步骤 1/2 完成：资金已发送到 Ethereum。请等待 2-5 分钟后手动触发 Ethereum → Tron 桥接。',
          duration: 10
        })
      }
      
      message.success(`✅ 跨链桥接${targetChain === 'Tron' ? '（步骤 1/2）' : ''}完成`)
      
    } catch (error) {
      console.error('[WithdrawBridge] Bridge failed:', error)
      throw error
    }
  }

  useEffect(() => {
    validateNonEmptyFields(form)
  }, [intl.locale])

  return (
    <div className="bg-gray-55">
      {/* 桥接进度提示 */}
      {bridgeInProgress && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <PageLoading />
            <div style={{ marginTop: 16, fontSize: 14 }}>{bridgeStatus}</div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1 items-center pt-9">
        <span className=" text-sm font-normal">
          <FormattedMessage id="mt.shijidaozhang" />
        </span>
        <span className=" text-[42px] leading-[46px] font-dingpro-medium">
          {formatNum(actualAmount, { precision: DEFAULT_CURRENCY_DECIMAL })}&nbsp;{symbol}
        </span>
        <span className=" text-sm font-medium mt-1">
          <FormattedMessage id="mt.tixianjine" />
          &nbsp;{formatNum(amount, { precision: DEFAULT_CURRENCY_DECIMAL })}&nbsp;{currency}
        </span>
        
        {/* 显示目标链信息 */}
        {targetChain && targetChain !== 'Solana' && (
          <div className="text-sm mt-2 px-4 py-2 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2">
              <span className="text-orange-600 font-medium">
                ⚠️ 跨链桥接到 {targetChain}
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-1 space-y-1">
              <div>• 桥接费用: ${targetChain === 'Tron' ? '4-6' : '2-3'} USD</div>
              <div>• 预计时间: {targetChain === 'Tron' ? '5-10' : '2-5'} 分钟</div>
              {targetChain === 'Tron' && (
                <div className="text-orange-600 mt-1">
                  ※ Tron 需要两步桥接（经 Ethereum 中转）
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="text-sm mt-3">
          <span className=" text-secondary">
            <FormattedMessage id="mt.cankaohuilv" />
          </span>
          &nbsp;
          <span className="text-primary">
            {`1 ${currency} ≈ ${formatNum(withdrawExchangeRate(methodInfo), {
              precision: DEFAULT_CURRENCY_DECIMAL
            })} ${symbol}`}
          </span>
        </div>
      </div>

      {loading && (
        <div className=" flex justify-center items-center h-full w-full absolute top-0 left-0 z-10">
          <PageLoading />
        </div>
      )}

      <Step2 form={form} loading={loading} methodInfo={methodInfo} />

      <div className="flex flex-col justify-start items-start gap-4 flex-1 pt-2.5 px-[14px] mt-1.5 border-t border-[#f0f0f0] bg-white">
        <div className="text-primary text-base font-semibold">
          <FormattedMessage id="mt.chujinxuzhi" />
        </div>
        <div className="text-secondary text-xs">
          {methodInfo?.notice ? (
            <p className="leading-6" dangerouslySetInnerHTML={{ __html: methodInfo?.notice?.replace(/\n/g, '<br>') }} />
          ) : (
            <div className="text-xs text-gray-400">
              <FormattedMessage id="mt.zanwuneirong" />
            </div>
          )}
        </div>
      </div>
      <SecurityCertificationModal ref={securityCertificationModalRef} onSubmit={handleSubmit1} />
    </div>
  )
})

export default observer(WithdrawalPreview)
