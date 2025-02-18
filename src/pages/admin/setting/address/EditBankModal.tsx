import { FormattedMessage, getIntl, useModel } from '@umijs/max'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import ProFormText from '@/components/Admin/Form/ProFormText'
import Modal from '@/components/Admin/Modal'
import Button from '@/components/Base/Button'
import { ProForm } from '@ant-design/pro-components'
import { Form } from 'antd'
import TransferMethodSelectItem from '../../withdrawal/process/comp/TransferMethodSelectItem'

type IProps = {
  trigger?: JSX.Element
  item?: Wallet.WithdrawalBank
  onUpdateItem: (values: any) => Promise<void>
}

function EditBankModal({ item, onUpdateItem }: IProps, ref: any) {
  const modalRef = useRef<any>()

  const { initialState } = useModel('@@initialState')
  const accountList = initialState?.currentUser?.accountList || []

  useImperativeHandle(ref, () => {
    return modalRef.current
  })

  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      onUpdateItem(values).finally(() => {
        setLoading(false)
      })
    })
  }

  return (
    <Modal
      width={430}
      maskClosable
      title={item ? <FormattedMessage id="mt.xiugai" /> : <FormattedMessage id="mt.tianjia" />}
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
          remark: item?.remark
        }}
        className="flex flex-col gap-6"
      >
        <TransferMethodSelectItem form={form} disabled={!!item} />

        <ProFormText name="id" hidden />

        <div>
          <span>{getIntl().formatMessage({ id: 'mt.xingming' })}:</span> <span>{item?.userName}</span>
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
