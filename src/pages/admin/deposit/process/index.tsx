import './index.less'

import { PageLoading, ProForm, ProFormText } from '@ant-design/pro-components'
import { FormattedMessage, useModel, useParams } from '@umijs/max'
import { Button, Form } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'

import PageContainer from '@/components/Admin/PageContainer'
import Iconfont from '@/components/Base/Iconfont'
import { stores } from '@/context/mobxProvider'
import { generateDepositOrder } from '@/services/api/wallet'

import TransferCrypto from './comp/TranserCrypto'
import TransferAmount from './comp/TransferAmount'
import TransferMethodSelectItem from './comp/TransferMethodSelectItem'
import TransferToFormSelectItem from './comp/TransferToFormSelectItem'

export default function DepositProcess() {
  const [form] = Form.useForm()

  const params = useParams()
  const method = params?.method as string

  const methodId = Form.useWatch('methodId', form)
  // const toAccountId = Form.useWatch('toAccountId', form)

  const methodInfo = useMemo(() => {
    return stores.deposit.depositMethods.find((item) => item.id === methodId)
  }, [methodId])

  useEffect(() => {
    if (form) {
      form.setFieldValue('methodId', method)
    }
  }, [form])

  useEffect(() => {
    if (form && methodInfo) {
      // form.setFieldValue('address', methodInfo?.address)
      // 20241202：默认选择 USD, 目前只有 USD 币种；
      form.setFieldValue('currency', 'USD')
      form.setFieldValue('methodId', methodInfo.id)
    }
  }, [form, methodInfo])

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  // const toAccountInfo = useMemo(() => {
  //   return currentUser?.accountList?.find((item) => item.id === toAccountId)
  // }, [toAccountId])

  const step = useRef(0)

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

  const handleSubmit0 = async () => {
    form.validateFields().then((values) => {
      setLoading(true)
      generateDepositOrder({
        methodId: values.methodId,
        amount: values.amount,
        toAccountId: values.toAccountId,
        currency: values.currency
      })
        .then((res) => {
          // TODO: 生成充值地址
          form.setFieldValue('address', '0x1234567890abcdef')

          step.current = 1
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  const [loading, setLoading] = useState(false)

  return (
    <PageContainer pageBgColorMode="white" fluidWidth backUrl="/deposit" backTitle={<FormattedMessage id="mt.quanbuzhifufangshi" />}>
      <div className="text-primary font-bold text-[24px] mb-9">
        <FormattedMessage id="mt.rujin" />
      </div>
      {loading && (
        <div className=" flex justify-center items-center h-full w-full absolute top-0 left-0">
          <PageLoading />
        </div>
      )}
      <div className="flex md:flex-row flex-col justify-start gap-10 md:gap-20 flex-1 ">
        <div className="flex-1 form-item-divider-left flex-shrink  min-w-[340px] max-w-[700px]">
          <ProForm
            onFinish={async (values: Account.TransferAccountParams) => {
              return
            }}
            disabled={loading}
            submitter={false}
            layout="vertical"
            form={form}
            className="flex flex-col gap-6"
          >
            <ProFormText name="methodId" hidden />
            <TransferMethodSelectItem form={form} methodInfo={methodInfo} />
            <TransferToFormSelectItem form={form} />
            {methodInfo?.type === 'crypto' && <TransferCrypto form={form} />}
            <TransferAmount form={form} currentUser={currentUser} methodInfo={methodInfo} />

            {step.current === 0 && (
              <Button type="primary" htmlType="submit" size="large" className="mt-2" onClick={handleSubmit0} disabled={loading}>
                <div className="flex flex-row items-center gap-2">
                  <FormattedMessage id="mt.jixu" />
                  <Iconfont name="zhixiang" color="white" width={18} height={18} />
                </div>
              </Button>
            )}
            {step.current === 1 && (
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="mt-2"
                onClick={() => {
                  step.current = 1
                }}
              >
                <div className="flex flex-row items-center gap-2">
                  <Iconfont name="zhixiang" color="white" width={18} height={18} />
                  <FormattedMessage id="mt.xiazaierweima" />
                </div>
              </Button>
            )}
          </ProForm>
        </div>
        <div className="flex flex-col justify-start items-start gap-4">
          <div className="text-primary text-sm font-semibold">
            <FormattedMessage id="mt.rujinxuzhi" />
          </div>
          <div className="text-secondary text-xs">
            {methodInfo?.notice ? (
              <div dangerouslySetInnerHTML={{ __html: methodInfo?.notice }} />
            ) : (
              <div className="text-xs text-gray-400">
                <FormattedMessage id="mt.zanwuneirong" />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
