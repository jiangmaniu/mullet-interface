import './index.less'

import { PageLoading, ProForm, ProFormText } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel, useParams, useSearchParams } from '@umijs/max'
import { Form } from 'antd'
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { stores, useStores } from '@/context/mobxProvider'
import { generateDepositOrder } from '@/services/api/wallet'

import { useTheme } from '@/context/themeProvider'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { push } from '@/utils/navigator'
import { appendHideParamIfNeeded } from '@/utils/request'
import { observer } from 'mobx-react'
import { WebviewComponentProps } from '../../WebviewPage'
import ConfirmModal from './ConfirmModal'
import TransferCrypto from './TranserCrypto'
import TransferMethodSelectItem from './TransferMethodSelectItem'
import TransferOTC from './TransferOTC'
import TransferToFormSelectItem from './TransferToFormSelectItem'

const DepositProcess = forwardRef(({ onDisabledChange }: WebviewComponentProps, ref) => {
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
  useLayoutEffect(() => {
    if (methods.length === 0) {
      const language = intl.locale.replace('-', '').replace('_', '').toUpperCase() as Wallet.Language
      stores.wallet.getDepositMethods({ language })

      return
    }
  }, [methods, intl])

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
  const { trade } = useStores()
  const { currentAccountInfo } = trade

  const [step, setStep] = useState(0)

  const [createTime, setCreateTime] = useState()

  // const [paymentInfo, setPaymentInfo] = useState<Wallet.GenerateDepositOrderResult>()

  const handleSubmit0 = async () => {
    form.validateFields().then((values) => {
      setLoading(true)
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
  }

  useImperativeHandle(ref, () => ({
    onSubmit: handleSubmit0
  }))

  const [loading, setLoading] = useState(false)

  const confirmModalRef = useRef<any>()

  const handleTimeout = () => {
    setStep(0)
    confirmModalRef.current?.show()
  }

  const handleReset = () => {
    form.setFieldValue('address', '')

    setStep(0)
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
    amount &&
      form
        .validateFields(['amount'])
        .then((values) => {
          setValid(true)
        })
        .catch((err) => {
          setValid(false)
        })
  }, [amount])

  const disabled = loading || !methodId || !toAccountId || (methodInfo?.paymentType === 'OTC' && !amount) || !valid

  useEffect(() => {
    if (disabled) {
      onDisabledChange?.(true)
    } else {
      onDisabledChange?.(false)
    }
  }, [disabled])

  const { theme } = useTheme()
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
              {/* {methodInfo?.type === 'crypto' && <TransferCrypto form={form} />} */}
              {methodInfo?.paymentType === 'CHAIN' && <TransferCrypto form={form} handleTimeout={handleTimeout} ref={cryptoRef} />}
              {methodInfo?.paymentType === 'OTC' && <TransferOTC form={form} methodInfo={methodInfo} />}

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
            <div className="text-primary text-sm font-semibold">
              <FormattedMessage id="mt.rujinxuzhi" />
            </div>
            <div className="text-secondary text-xs">
              {methodInfo?.notice ? (
                <p className="leading-7" dangerouslySetInnerHTML={{ __html: methodInfo?.notice?.replace(/\n/g, '<br>') }} />
              ) : (
                <div className="text-xs text-gray-400">
                  <FormattedMessage id="mt.zanwuneirong" />
                </div>
              )}
            </div>
          </div>
        </div>
        <ConfirmModal ref={confirmModalRef} handleReset={handleReset} />
      </div>
    </BasicLayout>
  )
})

export default observer(DepositProcess)
