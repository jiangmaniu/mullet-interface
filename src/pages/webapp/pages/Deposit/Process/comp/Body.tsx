import './index.less'

import { PageLoading, ProForm, ProFormText } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel, useParams, useSearchParams } from '@umijs/max'
import { Form } from 'antd'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { stores, useStores } from '@/context/mobxProvider'

import { useTheme } from '@/context/themeProvider'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { generateDepositOrder, getDepositOrderDetail } from '@/services/api/wallet'
import { validateNonEmptyFields } from '@/utils/form'
import { push } from '@/utils/navigator'
import { appendHideParamIfNeeded } from '@/utils/request'
import { observer } from 'mobx-react'
import { WebviewComponentProps } from '../../WebviewPage'
import CompleteModal from './CompleteModal'
import ConfirmModal from './ConfirmModal'
import ContinueModal from './ContinueModal'
import FailModal from './FailModal'
import TransferAmount from './TransferAmount'
import TransferCrypto from './TransferCrypto'
import TransferMethodSelectItem from './TransferMethodSelectItem'
import TransferToFormSelectItem from './TransferToFormSelectItem'

const DepositProcess = forwardRef(
  ({ onDisabledChange, step, setStep }: WebviewComponentProps & { step: number; setStep: (step: number) => void }, ref) => {
    const [form] = Form.useForm()

    const params = useParams()
    const method = params?.method as string

    const [searchParams] = useSearchParams()
    const tradeAccountId = searchParams.get('tradeAccountId') as string

    const methodId = Form.useWatch('methodId', form)
    const amount = Form.useWatch('amount', form)
    const methods = stores.wallet.depositMethods
    const toAccountId = Form.useWatch('toAccountId', form)

    const intl = useIntl()
    const depositMethodInitialized = stores.wallet.depositMethodInitialized
    const [prevIntl, setPrevIntl] = useState(intl.locale) // 防止重复请求

    useLayoutEffect(() => {
      const now = Date.now().valueOf()
      if (prevIntl !== intl.locale || now - depositMethodInitialized > 1000 * 30) {
        const language = intl.locale.replace('-', '').replace('_', '').toUpperCase() as Wallet.Language
        stores.wallet.getDepositMethods({ language })

        setPrevIntl(intl.locale)
        return
      }
    }, [depositMethodInitialized, intl.locale])

    const methodInfo = useMemo(() => {
      return methods.find((item) => item.id === methodId)
    }, [methodId, methods])

    useEffect(() => {
      if (form && methodInfo) {
        // form.setFieldValue('address', methodInfo?.address)
        // 20241202：默认选择 USD, 目前只有 USD 币种；
        form.setFieldValue('currency', 'USD')
      }
    }, [form, methodInfo])

    const { initialState } = useModel('@@initialState')
    const currentUser = initialState?.currentUser
    const { trade, ws } = useStores()
    const { currentAccountInfo } = trade

    const [orderId, setOrderId] = useState(-1)

    const handleSubmit0 = async () => {
      form.validateFields().then((values) => {
        setLoading(true)

        getDepositOrderDetail({ channelId: String(values.methodId) }).then((res) => {
          if (res.success && res.data?.id) {
            setOrderId(res.data.id)
            // TODO: 生成充值地址
            form.setFieldValue('address', res.data?.address)
            form.setFieldValue('createTime', res.data?.createTime)
            form.setFieldValue('canncelOrderTime', res.data?.canncelOrderTime)
            continueModalRef.current?.show()
            setLoading(false)
            return
          }

          generateDepositOrder({
            tradeAccountId: values.toAccountId,
            channelId: values.methodId,
            baseOrderAmount: values.amount
          })
            .then((res) => {
              if (res.success) {
                if (methodInfo?.paymentType === 'OTC') {
                  push(appendHideParamIfNeeded(`/app/deposit/otc/${res.data?.id}?backUrl=/app/deposit/process/${values.methodId}`))
                  return
                }

                setOrderId(res.data?.id || -1)
                // TODO: 生成充值地址
                form.setFieldValue('address', res.data?.address)
                form.setFieldValue('createTime', res.data?.createTime)
                form.setFieldValue('canncelOrderTime', res.data?.canncelOrderTime)

                setStep(1)
              }
            })
            .finally(() => {
              setLoading(false)
            })
        })
      })
    }

    useImperativeHandle(ref, () => ({
      onSubmit: handleSubmit0,
      download: handleDownload
    }))

    const [loading, setLoading] = useState(false)

    const confirmModalRef = useRef<any>()
    const continueModalRef = useRef<any>()
    const completeModalRef = useRef<any>()
    const failModalRef = useRef<any>()

    const handleTimeout = () => {
      setStep(0)
      confirmModalRef.current?.show()
    }

    const handleReset = () => {
      form.setFieldValue('address', '')

      setStep(0)
    }

    const handleGo = () => {
      if (methodInfo?.paymentType === 'OTC') {
        push(appendHideParamIfNeeded(`/app/deposit/otc/${orderId}?backUrl=/app/deposit/process/${methodId}`))
      } else {
        setStep(1)
        continueModalRef.current?.close()
      }
    }

    const cryptoRef = useRef<any>()

    const handleDownload = () => {
      cryptoRef.current?.download()
    }

    const escapedStr = (str: string) => {
      return str
        .replace(/\\/g, '\\\\') // 转义反斜杠
        .replace(/\n/g, '\\n') // 转义换行符
        .replace(/\t/g, '\\t') // 转义制表符
        .replace(/\r/g, '\\r') // 转义回车符
        .replace(/\f/g, '\\f') // 转义换页符
        .replace(/"/g, '\\"') // 转义双引号
    }

    const [valid, setValid] = useState(false)
    useEffect(() => {
      if (methodInfo?.paymentType === 'OTC') {
        amount &&
          form
            .validateFields(['amount'])
            .then((values) => {
              setValid(true)
            })
            .catch((err) => {
              setValid(false)
            })
      } else {
        setValid(true)
      }
    }, [methodInfo, amount])

    const disabled = loading || !methodId || !toAccountId || (methodInfo?.paymentType === 'OTC' && !amount) || !valid

    useEffect(() => {
      if (disabled) {
        onDisabledChange?.(true)
      } else {
        onDisabledChange?.(false)
      }
    }, [disabled])

    const { theme } = useTheme()

    const resolveMsg = useCallback(
      (data: CustomEvent) => {
        try {
          const res = JSON.parse(data.detail.data)
          const msgType = data.detail.msgType

          if (msgType === 'DEPOSIT' && res?.orderNo === String(orderId)) {
            if (res?.status === 'SUCCESS') {
              // 弹窗提示支付成功并跳转
              console.log('支付成功')
              completeModalRef.current?.show()
            } else if (res?.status === 'FAIL') {
              // 弹窗提示支付失敗
              console.log('支付失败')
              setStep(0)
              failModalRef.current?.show()
            }
          }
        } catch (error) {}
      },
      [orderId]
    )

    useLayoutEffect(() => {
      ws.subscribeNotify(false)

      // @ts-ignore
      window.addEventListener('RESOLVE_MSG', resolveMsg)

      return () => {
        ws.subscribeNotify(true)
        // @ts-ignore
        window.removeEventListener('RESOLVE_MSG', resolveMsg)
      }
    }, [resolveMsg])

    useEffect(() => {
      validateNonEmptyFields(form)
    }, [intl.locale])

    return (
      <BasicLayout bgColor="primary" headerColor={theme.colors.backgroundColor.primary}>
        <div className="px-[14px]">
          <div className=" font-bold text-xl pl-2.5 pb-6 pt-2.5">{intl.formatMessage({ id: 'mt.rujin' })}</div>
          {loading && (
            <div className=" flex justify-center items-center h-full w-full absolute top-0 left-0 z-10">
              <PageLoading />
            </div>
          )}

          <div className="flex md:flex-row flex-col justify-start gap-10 md:gap-20 flex-1 ">
            <div className="flex-1 form-item-divider-left flex-shrink ">
              <ProForm
                onFinish={async (values: Account.TransferAccountParams) => {
                  return
                }}
                initialValues={{
                  methodId: method,
                  toAccountId: tradeAccountId || currentAccountInfo.id
                }}
                disabled={loading}
                submitter={false}
                layout="vertical"
                form={form}
                className="flex flex-col gap-6"
              >
                <ProFormText name="methodId" hidden />
                <ProFormText name="createTime" hidden />
                <ProFormText name="currency" hidden />
                <ProFormText name="canncelOrderTime" hidden />
                <TransferMethodSelectItem form={form} tips={methodInfo?.tips} />
                <TransferToFormSelectItem form={form} />
                {methodInfo?.paymentType === 'CHAIN' && step === 1 && (
                  <TransferCrypto form={form} handleTimeout={handleTimeout} ref={cryptoRef} />
                )}
                {methodInfo?.paymentType === 'OTC' && <TransferAmount form={form} methodInfo={methodInfo} />}

                {/* {step === 0 && (
                <Button type="primary" htmlType="submit" size="large" className="mt-2" onClick={handleSubmit0} disabled={disabled}>
                  <div className="flex flex-row items-center gap-2">
                    <FormattedMessage id="mt.jixu" />
                    <Iconfont name="zhixiang" color="white" width={18} height={18} />
                  </div>
                </Button>
              )} */}
                {/* {step === 1 && (
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="mt-2"
                  onClick={() => {
                    // step.current = 1
                    // TODO: 下载二维码并把 step 设置为 2
                    setStep(2)
                    handleDownload()
                  }}
                >
                  <div className="flex flex-row items-center gap-2">
                    <Iconfont name="a-bianzu19" color="white" width={18} height={18} />
                    <FormattedMessage id="mt.xiazaierweima" />
                  </div>
                </Button>
              )}
              {step === 2 && (
                <Button
                  type="primary"
                  size="large"
                  className="mt-2"
                  onClick={() => {
                    push(`/record?key=deposit`)
                  }}
                >
                  <div className="flex flex-row items-center gap-2">
                    <FormattedMessage id="mt.chakanjindu" />
                  </div>
                </Button>
              )} */}
              </ProForm>
            </div>
            <div className="flex flex-col justify-start items-start gap-4">
              <div className="text-primary text-base font-semibold">
                <FormattedMessage id="mt.rujinxuzhi" />
              </div>
              <div className="text-weak text-xs">
                {methodInfo?.notice ? (
                  <p className="leading-6" dangerouslySetInnerHTML={{ __html: methodInfo?.notice?.replace(/\n/g, '<br>') }} />
                ) : (
                  <div className="text-xs text-gray-400">
                    <FormattedMessage id="mt.zanwuneirong" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <ConfirmModal ref={confirmModalRef} handleReset={handleReset} />
          <ContinueModal ref={continueModalRef} handleGo={handleGo} />
          <CompleteModal ref={completeModalRef} />
          <FailModal ref={failModalRef} />
        </div>
      </BasicLayout>
    )
  }
)

export default observer(DepositProcess)
