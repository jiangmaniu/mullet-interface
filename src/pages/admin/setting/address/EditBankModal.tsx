import { FormattedMessage, getIntl } from '@umijs/max'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import ProFormText from '@/components/Admin/Form/ProFormText'
import Modal from '@/components/Admin/Modal'
import Button from '@/components/Base/Button'
import { ProForm } from '@ant-design/pro-components'
import { Form } from 'antd'

type IProps = {
  trigger?: JSX.Element
  item?: Wallet.WithdrawalBank
  onUpdateItem: (values: any) => Promise<void>
}

function EditBankModal({ item, onUpdateItem }: IProps, ref: any) {
  const modalRef = useRef<any>()

  useImperativeHandle(ref, () => {
    return modalRef.current
  })

  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      onUpdateItem(values)
        .then(() => {
          modalRef.current.close()
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  return (
    <Modal
      width={430}
      maskClosable
      title={item?.id ? <FormattedMessage id="mt.xiugai" /> : <FormattedMessage id="mt.tianjia" />}
      footer={null}
      ref={modalRef}
    >
      <ProForm
        onFinish={async (values: Account.TransferAccountParams) => {
          return
        }}
        disabled={loading}
        submitter={false}
        layout="vertical"
        form={form}
        initialValues={{
          id: item?.id,
          methodId: item?.channelId,
          address: item?.address,
          remark: item?.remark,
          bankName: item?.bankName,
          bankCard: item?.bankCard,
          userName: item?.userName
        }}
        className="flex flex-col gap-6"
      >
        <ProFormText name="id" hidden />
        <div>
          <span> {getIntl().formatMessage({ id: 'mt.xingming' })}:</span> <span className=" text-lg">{item?.userName}</span>
        </div>
        <ProFormText
          name="bankName"
          disabled={!!item}
          label={<FormattedMessage id="mt.kaihuyinhang" />}
          rules={[
            {
              required: true,
              message: getIntl().formatMessage({ id: 'mt.shurudizhi' })
            }
          ]}
        />{' '}
        <ProFormText
          name="bankCard"
          disabled={!!item}
          label={<FormattedMessage id="mt.yinhangzhanghu" />}
          rules={[
            {
              required: true,
              message: getIntl().formatMessage({ id: 'mt.shurudizhi' })
            }
          ]}
        />
        <ProFormText name="remark" label={<FormattedMessage id="mt.beizhu" />} placeholder={getIntl().formatMessage({ id: 'mt.beizhu' })} />
        <Button type="primary" className="w-full" onClick={handleSubmit}>
          <FormattedMessage id="common.queren" />
        </Button>
      </ProForm>
    </Modal>
  )
}

export default forwardRef(EditBankModal)
