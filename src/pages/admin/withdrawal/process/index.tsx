import './index.less'

import { useIntl } from '@ant-design/pro-components'
import { FormattedMessage, useModel } from '@umijs/max'
import { Form } from 'antd'
import { useLayoutEffect, useMemo, useState } from 'react'

import PageContainer from '@/components/Admin/PageContainer'
import { stores } from '@/context/mobxProvider'
import { cn } from '@/utils/cn'
import { push } from '@/utils/navigator'

import { generateWithdrawOrder } from '@/services/api/wallet'
import { md5 } from 'js-md5'
import { observer } from 'mobx-react'
import Step1 from './comp/Step1'
import { Step2 } from './comp/Step2'
import { Step3 } from './comp/Step3'

const Notice = observer(({ methodId }: { methodId: string }) => {
  const methodInfo = stores.wallet.withdrawalMethods.find((item) => item.id === methodId)
  return (
    <div className="text-weak text-xs">
      {methodInfo?.notice ? (
        <p className="leading-6" dangerouslySetInnerHTML={{ __html: methodInfo?.notice?.replace(/\n/g, '<br>') }} />
      ) : (
        <div className="text-xs text-gray-400">
          <FormattedMessage id="mt.zanwuneirong" />
        </div>
      )}
    </div>
  )
})

function WithdrawalProcess() {
  const [form] = Form.useForm()

  const methods = stores.wallet.withdrawalMethods
  const intl = useIntl()

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

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号
  const fromAccountInfo = useMemo(() => {
    return accountList.find((item) => item.id === fromAccountId)
  }, [fromAccountId, accountList])

  const [step, setStep] = useState(0)

  // const [values, setValues] = useState<Record<string, any> | undefined>(undefined)
  const handleSubmit0 = async () => {
    form
      .validateFields()
      .then((values) => {
        setStep(1)
        // generateWithdrawOrder({
        //   address: values.toAccountId,
        //   baseOrderAmount: values.amount,
        //   channelId: values.methodId,
        //   password: values.password,
        //   phoneCode: values.code,
        //   tradeAccountId: values.fromAccountId,
        // })
        //   .then((res) => {
        //     // 回填生成的订单 id
        //     form.setFieldValue('orderId', res?.data?.id ?? 'xxxx')

        //     setValues({
        //       ...values,
        //       orderId: res?.data?.id ?? 'xxxx'
        //     })

        //     setStep(1)
        //   })
        //   .finally(() => {
        //     setLoading(false)
        //   })
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  const handleSubmit1 = async () => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true)

        generateWithdrawOrder({
          address: values.toAccountId,
          bankName: values.bankName,
          bankCard: values.bankCard,
          baseOrderAmount: values.amount,
          channelId: values.methodId,
          password: md5(values.password),
          phoneCode: values.code,
          tradeAccountId: values.fromAccountId
        })
          .then((res) => {
            // 回填生成的订单 id
            // form.setFieldValue('orderId', res?.data?.id ?? 'xxxx')

            // setValues({
            //   ...values,
            //   orderId: res?.data?.id ?? 'xxxx'
            // })

            if (res.success) {
              setStep(2)
            }
          })
          .finally(() => {
            setLoading(false)
          })

        // confirmWithdrawOrder({
        //   orderId: values.orderId,
        //   password: md5(values.password as string),
        //   code: values.code
        // })
        //   .then((res) => {
        //     // push('/withdrawal/order')
        //     setStep(2)
        //   })
        //   .finally(() => {
        //     setLoading(false)
        //   })
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  const handleSubmit2 = async () => {
    push('/record?key=withdrawal')
    // setStep(3)
  }

  const [loading, setLoading] = useState(false)

  const methodInfo = useMemo(() => methods.find((item) => item.id === methodId), [methodId, methods])

  return (
    <PageContainer
      pageBgColorMode={step === 0 ? 'white' : 'gray'}
      backStyle={{ justifyContent: 'flex-start' }}
      backUrl="/withdrawal"
      backTitle={<FormattedMessage id="mt.quanbuchujinfangshi" />}
    >
      {step === 0 && (
        <div className="text-primary font-bold text-[24px] mb-9">
          <FormattedMessage id="mt.chujin" />
        </div>
      )}
      {/* {loading && (
        <div className=" flex justify-center items-center h-full w-full absolute top-0 left-0 z-10">
          <PageLoading />
        </div>
      )} */}
      {/* <div className={cn(step === 0 ? 'block' : 'hidden')}>

      </div> */}
      {step === 0 && (
        <Step1
          form={form}
          loading={loading}
          currentUser={currentUser}
          fromAccountInfo={fromAccountInfo}
          handleSubmit={handleSubmit0}
          methodInfo={methodInfo}
        />
      )}
      <div className="flex flex-col gap-21">
        {step === 1 && (
          <Step2
            form={form}
            fromAccountInfo={fromAccountInfo}
            loading={loading}
            setStep={setStep}
            handleSubmit={handleSubmit1}
            methodInfo={methodInfo}
          />
        )}
        <div className={cn(step === 2 ? 'block' : 'hidden')}>
          <Step3 handleSubmit={handleSubmit2} />
        </div>
        <div className={cn('w-[340px] md:w-[580px] max-w-full', step === 1 ? 'block' : 'hidden')}>
          <span className="text-primary text-base font-semibold">
            <FormattedMessage id="mt.chujinxuzhi" />
          </span>
          <Notice methodId={methodId} />
        </div>
      </div>
    </PageContainer>
  )
}

export default observer(WithdrawalProcess)
