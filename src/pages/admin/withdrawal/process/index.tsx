import './index.less'

import { PageLoading } from '@ant-design/pro-components'
import { FormattedMessage, useModel, useParams } from '@umijs/max'
import { Form } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import PageContainer from '@/components/Admin/PageContainer'
import { stores } from '@/context/mobxProvider'
import { cn } from '@/utils/cn'
import { push } from '@/utils/navigator'

import { Step1 } from './comp/Step1'
import { Step2 } from './comp/Step2'
import { Step3 } from './comp/Step3'

// 汇率换算
export const transferCurr = (value?: number) => {
  const val = value || 0

  // TODO: 汇率换算
  return val * 1
}

export default function DepositProcess() {
  const [form] = Form.useForm()

  const params = useParams()
  const method = params?.method as string

  const methodId = Form.useWatch('methodId', form)
  const toAccountId = Form.useWatch('toAccountId', form)

  useEffect(() => {
    if (form) {
      form.setFieldValue('methodId', method)
    }
  }, [form])

  const methodInfo = useMemo(() => {
    return stores.deposit.withdrawalMethods.find((item) => item.id === methodId)
  }, [methodId])

  useEffect(() => {
    if (form && methodInfo) {
      // form.setFieldValue('address', methodInfo?.address)
      // 20241202：默认选择 USD, 目前只有 USD 币种；
      form.setFieldValue('currency', 'USD')
      form.setFieldValue('type', methodInfo.type)

      // 设置链信息
      if (methodInfo.type === 'crypto') {
        form.setFieldValue('crypto', methodInfo?.crypto)
        form.setFieldValue('chain', methodInfo?.chain)
        form.setFieldValue('name', undefined)
        form.setFieldValue('bankName', undefined)
      }

      // 设置用户银行卡信息
      if (methodInfo.type === 'bank') {
        form.setFieldValue('crypto', undefined)
        form.setFieldValue('chain', undefined)
        form.setFieldValue('name', 'username') // user.bankList.find(v => v.id === toAccountId)?.name
        form.setFieldValue('bankName', methodInfo?.bankName)
      }
    }
  }, [form, methodInfo])

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号
  const toAccountInfo = useMemo(() => {
    return accountList.find((item) => item.id === toAccountId)
  }, [toAccountId, accountList])

  const [step, setStep] = useState(0)

  const generateAddress = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      code: 200,
      success: true,
      data: {
        address: '0x1234567890abcdef'
      }
    }
  }

  const sendVerificationCode = async () => {
    return new Promise((resolve) => setTimeout(resolve, 2000))
  }

  const generateOrder = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      code: 200,
      success: true
    }
  }

  const [values, setValues] = useState<Record<string, any> | undefined>(undefined)
  const handleSubmit0 = async () => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true)
        generateAddress()
          .then((res) => {
            // TODO: 生成充值地址
            form.setFieldValue('address', '0x1234567890abcdef')

            setValues(values)
            setStep(1)
          })
          .finally(() => {
            setLoading(false)
          })
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

        generateOrder()
          .then((res) => {
            // push('/withdrawal/order')
            setStep(2)
          })
          .finally(() => {
            setLoading(false)
          })
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  const handleSubmit2 = async () => {
    push('/withdrawal')
    // setStep(3)
  }

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('values', values)
  }, [values])

  return (
    <PageContainer
      pageBgColorMode={step === 0 ? 'white' : 'gray'}
      fluidWidth
      backUrl="/withdrawal"
      backTitle={<FormattedMessage id="mt.quanbushoukuanfangshi" />}
    >
      <div className=" flex max-w-screen">
        <div className="flex-shrink">
          {step === 0 && (
            <div className="text-primary font-bold text-[24px] mb-9">
              <FormattedMessage id="mt.chujin" />
            </div>
          )}
          {loading && (
            <div className=" flex justify-center items-center h-full w-full absolute top-0 left-0 z-10">
              <PageLoading />
            </div>
          )}
          <div className={cn(step === 0 ? 'block' : 'hidden')}>
            <Step1
              form={form}
              loading={loading}
              methodInfo={methodInfo}
              currentUser={currentUser}
              toAccountInfo={toAccountInfo}
              handleSubmit={handleSubmit0}
            />
          </div>
          <div className="flex flex-col gap-21">
            <div className={cn(step === 1 ? 'block' : 'hidden')}>
              <Step2
                form={form}
                values={values}
                toAccountInfo={toAccountInfo}
                loading={loading}
                setStep={setStep}
                handleSubmit={handleSubmit1}
              />
            </div>
            <div className={cn(step === 2 ? 'block' : 'hidden')}>
              <Step3 handleSubmit={handleSubmit2} />
            </div>
            <div className={cn(' w-[340px] md:w-[536px] max-w-full', step === 1 || step === 2 ? 'block' : 'hidden')}>
              <span className="text-primary text-sm font-semibold">
                <FormattedMessage id="mt.chujinxuzhi" />
              </span>
              <p className="text-secondary text-xs mt-5">
                1. 出金金额少於50U，收取3U手續費 <br />
                <br />
                2.用戶交易量少於出金金额50%，收取出金金额5%手續費 <br />
                <br />
                3.當前有處理中的訂單時，無法出金 <br />
                <br />
                4.出金時間（GMT+8)：工作日09:00-18:00，不在此時段提交的出金訂單，會在下一工作日處理 <br />
                <br />
                5.請務必確認設備安全，防止信息被篡改或洩漏
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
