import { FormattedMessage, useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import Button from '@/components/Base/Button'
import InputNumber from '@/components/Base/InputNumber'
import JumpingLoader from '@/components/Base/JumpingLoader'
import Modal from '@/components/Base/Modal'
import Address from '@/components/Wallet/Address'
import { useStores } from '@/context/mobxProvider'
import usePrivyInfo from '@/hooks/web3/usePrivyInfo'
import useSPLTokenBalance from '@/hooks/web3/useSPLTokenBalance'
import useSPLTransfer from '@/hooks/web3/useSPLTransfer'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Form, Tooltip } from 'antd'

// 入金弹窗
export default observer(
  forwardRef((props, ref) => {
    const intl = useIntl()
    const [open, setOpen] = useState(false)
    const { onTransfer, transferSuccess, error, setError } = useSPLTransfer()
    const [showLoadingModal, setShowLoadingModal] = useState(false)
    const [form] = Form.useForm()
    const [accountItem, setAccountItem] = useState({} as User.AccountItem)
    const { trade } = useStores()
    const { hasEmbeddedWallet, address, hasExternalWallet, foundWallet } = usePrivyInfo()
    const { balance: walletBalance } = useSPLTokenBalance()

    const close = () => {
      setOpen(false)
      setError(false)
      form.resetFields()
    }

    const show = (item?: User.AccountItem) => {
      setOpen(true)
      const rawItem = item || trade.currentAccountInfo
      if (rawItem) {
        setAccountItem(rawItem)
      }
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

    const handleSubmit = async (values: any) => {
      console.log('values', values)

      // 调起钱包签名 往固定地址转账
      await onTransfer({
        amount: Number(values?.amount),
        toAddress: accountItem.pdaTokenAddress,
        onBeforeTransfer: () => {
          setTimeout(() => {
            setShowLoadingModal(true)
            close()
          }, 100)
        }
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
          {/* 外部钱包入金：通过钱包授权 */}
          {hasExternalWallet && (
            <Form onFinish={handleSubmit} layout="vertical" form={form}>
              <div className="mt-10 gap-y-6 flex flex-col">
                <Form.Item
                  name="amount"
                  required
                  label={intl.formatMessage({ id: 'mt.jine' })}
                  rules={[
                    {
                      required: true,
                      validator: (_, value) => {
                        if (!Number(value)) {
                          return Promise.reject(new Error(intl.formatMessage({ id: 'mt.qingshurujine' })))
                        }
                        if (!Number(walletBalance)) {
                          return Promise.reject(new Error(intl.formatMessage({ id: 'mt.yuebuzu' })))
                        }
                        if (Number(value) > walletBalance) {
                          return Promise.reject(new Error(intl.formatMessage({ id: 'mt.qianbaoyuebuzu' })))
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
                        {!!walletBalance && (
                          <span
                            onClick={() => form.setFieldValue('amount', walletBalance)}
                            className="text-xs cursor-pointer hover:text-brand text-primary"
                          >
                            {intl.formatMessage({ id: 'mt.zuidazhi' })} {walletBalance} USDC
                          </span>
                        )}
                      </>
                    }
                    placeholder={intl.formatMessage({ id: 'mt.jine' })}
                  />
                </Form.Item>

                {/* 外部钱包入金 */}
                {/* 转出地址 */}
                <Form.Item label={intl.formatMessage({ id: 'mt.zhuanchudizhi' })}>
                  <div className="rounded-md bg-gray-50 dark:bg-[#21262A] p-2 mt-1 flex items-center">
                    {foundWallet?.meta?.icon && <img src={foundWallet?.meta?.icon} alt="" className="w-4 h-4 mr-1" />}
                    <Address ellipsis={undefined} copyable address={address} />
                  </div>
                </Form.Item>
                <div className="flex items-center justify-center">
                  <img src="/img/transfer-arrow-down.png" width="29" height="29" />
                </div>

                {/* 转入地址 */}
                <Form.Item
                  label={
                    <span className="cursor-pointer">
                      <span className="mr-1">{intl.formatMessage({ id: 'mt.zhuanruzhizhi' })}</span>
                      <Tooltip title={intl.formatMessage({ id: 'mt.pdaTokenAddressTips' })}>
                        <InfoCircleOutlined style={{ fontSize: 14 }} />
                      </Tooltip>
                    </span>
                  }
                >
                  <div className="rounded-md bg-gray-50 dark:bg-[#21262A] p-2 mt-1">
                    {/* @TODO 暂时用pda的地址 后期可能先转入privy钱包 再转pda */}
                    <Address ellipsis={undefined} copyable address={accountItem.pdaTokenAddress || '--'} />
                  </div>
                </Form.Item>

                <Button type="primary" block className="mt-8" htmlType="submit">
                  {intl.formatMessage({ id: 'mt.queding' })}
                </Button>
              </div>
            </Form>
          )}

          {/* privy内嵌钱包：展示地址给用户 */}
          {hasEmbeddedWallet && (
            <div className="mt-10">
              <div className="gap-y-1 flex flex-col">
                <div className="text-primary">
                  <span className="mr-1 font-medium">{intl.formatMessage({ id: 'mt.zhuanruzhizhi' })}(PDA)</span>
                </div>
                <div className="rounded-md bg-gray-50 dark:bg-[#21262A] p-2 mt-1">
                  {/* 暂时展示pda地址，后期改为privy地址，然后监听privy地址 转到pda地址 @TODO */}
                  <Address ellipsis={undefined} copyable address={address} />
                </div>
                {/* 提示 */}
                <div className="text-xs mt-2 text-weak flex items-center">
                  <InfoCircleOutlined style={{ fontSize: 14 }} />
                  <span className="ml-1">{intl.formatMessage({ id: 'mt.zhuanruzhizhitips' })}</span>
                </div>
              </div>
              <Button type="primary" block className="mt-8" onClick={close}>
                {intl.formatMessage({ id: 'mt.queding' })}
              </Button>
            </div>
          )}
        </Modal>
        {/* 登录入金弹窗动画 */}
        <Modal open={showLoadingModal} onClose={() => setShowLoadingModal(false)} footer={null} width={580} centered>
          <div className="flex flex-col items-center justify-center h-[200px]">
            <JumpingLoader />
            <div className="mt-8 flex flex-col items-center">
              <div className="pb-1">{intl.formatMessage({ id: 'mt.qianmingjiaoyi' })}</div>
              <div>{intl.formatMessage({ id: 'mt.qianmingjiaoyitishi' })}</div>
            </div>
          </div>
        </Modal>
      </>
    )
  })
)
