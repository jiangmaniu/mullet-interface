import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useImperativeHandle, useState } from 'react'

import Button from '@/components/Base/Button'
import InputNumber from '@/components/Base/InputNumber'
import Modal from '@/components/Base/Modal'
import { useStores } from '@/context/mobxProvider'
import { withdrawByAddress } from '@/services/api/tradeCore/account'
import { message } from '@/utils/message'
import { Form, Input } from 'antd'

// 出金弹窗
export default observer(
  forwardRef((props, ref) => {
    const intl = useIntl()
    const [open, setOpen] = useState(false)
    const { trade } = useStores()
    const [submitLoading, setSubmitLoading] = useState(false)
    const [form] = Form.useForm()
    const { fetchUserInfo } = useModel('user')
    const [accountItem, setAccountItem] = useState({} as User.AccountItem)

    const accountMoney = accountItem.money as number

    const close = () => {
      setOpen(false)
      form.resetFields()
    }

    const show = (item?: User.AccountItem) => {
      setOpen(true)
      const rawItem = item || trade.currentAccountInfo
      if (rawItem) {
        setAccountItem(rawItem)
        form.setFieldValue('accountId', rawItem.id)
      }
    }

    // 对外暴露接口
    useImperativeHandle(ref, () => {
      return {
        show,
        close
      }
    })

    // 避免重复渲染
    if (!open) return

    const handleSubmit = async (values: any) => {
      console.log('values', values)
      const { money, withdrawAddress } = values || {}
      setSubmitLoading(true)
      const res = await withdrawByAddress({
        accountId: accountItem.id,
        money: Number(money),
        remark: '',
        withdrawAddress
      }).finally(() => {
        setSubmitLoading(false)
      })
      if (res.success) {
        close()
        message.info(intl.formatMessage({ id: 'common.opSuccess' }))
        form.resetFields()
        // 刷新用户信息
        fetchUserInfo(true)
      }
    }

    return (
      <>
        <Modal
          title={
            <div className="flex items-center">
              <FormattedMessage id="mt.chujin" />
            </div>
          }
          open={open}
          onClose={close}
          footer={null}
          width={580}
          centered
        >
          <Form onFinish={handleSubmit} layout="vertical" form={form}>
            <div className="mt-8">
              <Form.Item
                required
                label={intl.formatMessage({ id: 'mt.jine' })}
                name="money"
                rules={[
                  {
                    required: true,
                    validator: (_, value) => {
                      if (!Number(value)) {
                        return Promise.reject(new Error(intl.formatMessage({ id: 'mt.qingshurujine' })))
                      }
                      if (!Number(accountMoney)) {
                        return Promise.reject(new Error(intl.formatMessage({ id: 'mt.yuebuzu' })))
                      }
                      if (Number(value) > accountMoney) {
                        return Promise.reject(new Error(intl.formatMessage({ id: 'mt.dangqianzhanghuyuebuzu' })))
                      }
                      return Promise.resolve()
                    }
                  }
                ]}
              >
                <InputNumber
                  showAddMinus={false}
                  showFloatTips={false}
                  addonAfter={
                    <>
                      {!!accountMoney && (
                        <span
                          onClick={() => form.setFieldValue('money', accountMoney)}
                          className="text-xs cursor-pointer hover:text-brand text-primary"
                        >
                          {intl.formatMessage({ id: 'mt.zuidazhi' })} {accountMoney} USD
                        </span>
                      )}
                    </>
                  }
                  placeholder={intl.formatMessage({ id: 'mt.jine' })}
                />
              </Form.Item>
              <Form.Item
                className="!mt-5"
                required
                label={intl.formatMessage({ id: 'mt.mubiaodizhi' })}
                name="withdrawAddress"
                rules={[{ required: true, message: intl.formatMessage({ id: 'mt.mubiaodizhi' }) }]}
              >
                <Input size="large" className="!h-[38px]" placeholder={intl.formatMessage({ id: 'mt.mubiaodizhi' })} />
              </Form.Item>
              <Form.Item className="!mt-5" label={intl.formatMessage({ id: 'mt.zhanghu' })} name="accountId">
                <Input size="large" className="!h-[38px]" placeholder={intl.formatMessage({ id: 'mt.zhanghu' })} disabled />
              </Form.Item>
              <Button type="primary" htmlType="submit" block className="mt-8" loading={submitLoading}>
                {intl.formatMessage({ id: 'mt.queding' })}
              </Button>
            </div>
          </Form>
        </Modal>
      </>
    )
  })
)
