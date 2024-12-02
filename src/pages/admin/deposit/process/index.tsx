import './index.less'

import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useParams } from '@umijs/max'
import { Button, Form } from 'antd'
import { useEffect } from 'react'

import PageContainer from '@/components/Admin/PageContainer'
import { stores } from '@/context/mobxProvider'

import TransferAddress from './comp/TranserAddress'
import TransferMethodSelectItem from './comp/TransferMethodSelectItem'
import TransferToFormSelectItem from './comp/TransferToFormSelectItem'

export default function DepositProcess() {
  const [form] = Form.useForm()

  const params = useParams()
  const method = params?.method as string

  const methodInfo = stores.deposit.methods.find((item) => item.title === method)

  useEffect(() => {
    form && form.setFieldValue('address', methodInfo?.address)
  }, [form, methodInfo])

  useEffect(() => {
    if (methodInfo) {
      form.setFieldValue('methodId', methodInfo.id)
    }
  }, [methodInfo])

  return (
    <PageContainer pageBgColorMode="white" fluidWidth backTitle={<FormattedMessage id="mt.quanbuzhifufangshi" />}>
      <div className="text-primary font-bold text-[24px] mb-9">
        <FormattedMessage id="mt.rujin" />
      </div>

      <div className="flex md:flex-row flex-col justify-between gap-10 md:gap-20 flex-1 ">
        <div className="flex-1 form-item-divider-left">
          <ProForm
            onFinish={async (values: Account.TransferAccountParams) => {
              return
            }}
            submitter={false}
            layout="vertical"
            form={form}
            className="flex flex-col gap-6"
          >
            <TransferMethodSelectItem form={form} />
            <TransferToFormSelectItem form={form} />
            <TransferAddress form={form} />

            <Button type="primary" htmlType="submit" size="large">
              <FormattedMessage id="mt.jixu" />
            </Button>
          </ProForm>
        </div>
        <div className="flex flex-col justify-start items-start gap-4">
          <div className="text-primary text-sm font-semibold">
            <FormattedMessage id="mt.rujinxuzhi" />
          </div>
          <div className="text-secondary text-xs">
            <div dangerouslySetInnerHTML={{ __html: methodInfo?.depositNotice || '' }} />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
