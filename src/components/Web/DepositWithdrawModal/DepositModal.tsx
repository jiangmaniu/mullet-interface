import { FormattedMessage, useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import Button from '@/components/Base/Button'
import CopyComp from '@/components/Base/Copy'
import InputNumber from '@/components/Base/InputNumber'
import JumpingLoader from '@/components/Base/JumpingLoader'
import Modal from '@/components/Base/Modal'
import useTransfer from '@/hooks/web3/useTransfer'

// 入金弹窗
export default observer(
  forwardRef((props, ref) => {
    const intl = useIntl()
    const [open, setOpen] = useState(false)
    const [amount, setAmount] = useState(0)
    const { onTransfer, transferSuccess, error } = useTransfer()
    const [showLoadingModal, setShowLoadingModal] = useState(false)

    const close = () => {
      setOpen(false)
      setAmount(0)
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

    useEffect(() => {
      console.log('transferSuccess', transferSuccess)
      // 关闭动画等待弹窗
      if (transferSuccess) {
        setShowLoadingModal(false)
      }
    }, [transferSuccess])

    const maxValue = 100

    const handleSubmit = async () => {
      setTimeout(() => {
        setShowLoadingModal(true)
        close()
      }, 100)
      // @TODO 调起钱包签名 往固定地址转账
      await onTransfer({
        amount: Number(amount),
        toAddress: '9ZyYhhBz5LvTLCTdVFDVgdWURy6PssztZTAMkWMNX7iJ'
      })
    }

    useEffect(() => {
      if (error) {
        setShowLoadingModal(false)
      }
    }, [error])

    return (
      <>
        <Modal title={<FormattedMessage id="mt.rujin" />} open={open} onClose={close} footer={null} width={580} centered>
          <div className="mt-10 gap-y-6 flex flex-col">
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
            {/* 提供地址存 */}
            <div>
              <div className="text-sm font-medium">{intl.formatMessage({ id: 'mt.rujindizhi' })}</div>
              <div className="rounded-md bg-gray-50 dark:bg-[#21262A] p-2 mt-1">
                <CopyComp>9ZyYhhBz5LvTLCTdVFDVgdWURy6PssztZTAMkWMNX7iJ</CopyComp>
              </div>
            </div>
            <Button type="primary" block className="mt-8" disabled={!Number(amount)} onClick={handleSubmit}>
              {intl.formatMessage({ id: 'mt.queding' })}
            </Button>
          </div>
        </Modal>
        {/* 登录入金弹窗动画 */}
        <Modal open={showLoadingModal} onClose={() => setShowLoadingModal(false)} footer={null} width={580} centered>
          <div className="flex flex-col items-center justify-center h-[200px]">
            <JumpingLoader />
            <div className="mt-8 flex flex-col items-center">
              <div className="pb-1">签名交易</div>
              <div>您需要在钱包中签署此交易</div>
            </div>
          </div>
        </Modal>
      </>
    )
  })
)
