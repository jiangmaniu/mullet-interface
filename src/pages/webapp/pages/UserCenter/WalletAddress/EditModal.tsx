import { FormattedMessage, getIntl, useIntl, useModel } from '@umijs/max'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import ProFormText from '@/components/Admin/Form/ProFormText'
import { useEnv } from '@/context/envProvider'
import SheetModal, { SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { modifyWithdrawalAddress } from '@/services/api/wallet'
import { message } from '@/utils/message'
import { ProForm } from '@ant-design/pro-components'
import { Form } from 'antd'
import TransferMethodSelectItem from '../../Withdraw.webview/Process/comp/TransferMethodSelectItem'

type IProps = {
  reload: () => void
}

function EditModal({ reload }: IProps, ref: any) {
  const modalRef = useRef<any>()
  const bottomSheetModalRef = useRef<SheetRef>(null)
  const { isPc } = useEnv()
  const intl = useIntl()
  const [item, setItem] = useState({} as Wallet.WithdrawalAddress)
  const { initialState } = useModel('@@initialState')

  useImperativeHandle(ref, () => {
    return {
      show: (item: Wallet.WithdrawalAddress) => {
        bottomSheetModalRef.current?.sheet.present()
        setItem(item)
      },
      close: bottomSheetModalRef.current?.sheet.dismiss
    }
  })

  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()

  const handleSubmit = async () => {
    const values = await form.validateFields()
    setLoading(true)
    if (values.id) {
      const res = await modifyWithdrawalAddress({
        id: values.id,
        remark: values.remark
      })
      if (res.success) {
        message.info(res.msg)
        reload()
        modalRef.current?.close()
      }
    }
  }

  useEffect(() => {
    form.setFieldsValue({
      id: item?.id,
      methodId: item?.channelId,
      address: item?.address,
      remark: item?.remark
    })
  }, [item])

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      autoHeight
      title={intl.formatMessage({ id: 'mt.xiugaidizhi' })}
      onDismiss={() => {
        setItem({} as Wallet.WithdrawalAddress)
        form.resetFields()
      }}
      children={
        <div className="mx-4">
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
            <TransferMethodSelectItem form={form} disabled={!!item} />

            <ProFormText name="id" hidden />

            <ProFormText
              name="address"
              disabled={!!item}
              label={<FormattedMessage id="mt.chujindizhi" />}
              placeholder={getIntl().formatMessage({ id: 'mt.shurudizhi' })}
              rules={[
                {
                  required: false,
                  message: getIntl().formatMessage({ id: 'mt.shurudizhi' })
                }
              ]}
            />
            <ProFormText
              name="remark"
              disabled={false}
              label={<FormattedMessage id="mt.beizhu" />}
              placeholder={getIntl().formatMessage({ id: 'mt.beizhu' })}
            />
          </ProForm>
        </div>
      }
      onConfirm={handleSubmit}
    />
  )
}

export default forwardRef(EditModal)
