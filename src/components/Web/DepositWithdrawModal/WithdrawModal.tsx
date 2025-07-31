import { FormattedMessage, useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useImperativeHandle, useState } from 'react'

import Button from '@/components/Base/Button'
import InputNumber from '@/components/Base/InputNumber'
import Modal from '@/components/Base/Modal'
import { Input } from 'antd'

// 出金弹窗
export default observer(
  forwardRef((props, ref) => {
    const intl = useIntl()
    const [open, setOpen] = useState(false)
    const [amount, setAmount] = useState(0)
    const [address, setAddress] = useState('')

    const close = () => {
      setOpen(false)
      setAmount(0)
      setAddress('')
    }

    const show = () => {
      setOpen(true)
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

    const maxValue = 100

    const handleSubmit = async () => {
      const params = {
        amount: Number(amount),
        address
      }
      console.log('handleSubmit', params)
    }

    return (
      <>
        <Modal title={<FormattedMessage id="mt.chujin" />} open={open} onClose={close} footer={null} width={580} centered>
          <div className="mt-8">
            <InputNumber
              onChange={(value) => setAmount(value)}
              value={amount}
              showAddMinus={false}
              showFloatTips={false}
              addonAfter={
                <span onClick={() => setAmount(maxValue)} className="text-xs cursor-pointer hover:text-brand text-primary">
                  {intl.formatMessage({ id: 'mt.zuidazhi' })} {maxValue}
                </span>
              }
              placeholder={intl.formatMessage({ id: 'mt.jine' })}
            />
            <Input
              size="large"
              onChange={(e) => setAddress(e.target.value)}
              className="!mt-5 !h-[38px]"
              placeholder={intl.formatMessage({ id: 'mt.mubiaodizhi' })}
            />
            <Button type="primary" block className="mt-8" disabled={!Number(amount) || !address} onClick={handleSubmit}>
              {intl.formatMessage({ id: 'mt.queding' })}
            </Button>
          </div>
        </Modal>
      </>
    )
  })
)
