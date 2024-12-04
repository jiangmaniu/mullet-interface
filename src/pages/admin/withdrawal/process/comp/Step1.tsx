import { ProForm, ProFormText } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'
import { Button, Form } from 'antd'
import { FormInstance } from 'antd/lib'

import Iconfont from '@/components/Base/Iconfont'
import { IWithdrawalMethod } from '@/mobx/deposit/types'
import { formatNum } from '@/utils'

import { transferCurr } from '..'
import TransferAmount from './TransferAmount'
import TransferMethodSelectItem from './TransferMethodSelectItem'
import TransferToBankItem from './TransferToBankItem'
import TransferToCryptoItem from './TransferToCryptoItem'
import TransferToFormSelectItem from './TransferToFormSelectItem'

export const Step1 = ({
  form,
  loading,
  methodInfo,
  currentUser,
  toAccountInfo,
  handleSubmit
}: {
  form: FormInstance<any>
  loading: boolean
  methodInfo?: IWithdrawalMethod
  currentUser?: User.UserInfo
  toAccountInfo?: User.AccountItem
  handleSubmit: () => void
}) => {
  const amount = Form.useWatch('amount', form)
  const currency = Form.useWatch('currency', form)

  return (
    <div className="flex md:flex-row flex-col justify-start gap-10 md:gap-20 flex-1 ">
      <div className="flex-1 form-item-divider-left flex-shrink min-w-[340px] max-w-[700px]">
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
          <ProFormText name="handlingFee" hidden />
          <ProFormText name="currency" hidden />
          <ProFormText name="type" hidden />
          <ProFormText name="crypto" hidden />
          <ProFormText name="chain" hidden />
          <ProFormText name="name" hidden />
          <ProFormText name="bankName" hidden />

          <TransferMethodSelectItem form={form} methodInfo={methodInfo} />
          <TransferToFormSelectItem form={form} />

          {methodInfo?.type === 'crypto' ? <TransferToCryptoItem form={form} /> : <TransferToBankItem form={form} />}

          <TransferAmount form={form} currentUser={currentUser} />

          <Button type="primary" htmlType="submit" size="large" className="mt-2" onClick={handleSubmit} disabled={loading}>
            <div className="flex flex-row items-center gap-2">
              <FormattedMessage id="mt.tixian" />
              <Iconfont name="zhixiang" color="white" width={18} height={18} />
            </div>
          </Button>
          <div className="text-secondary text-sm flex flex-row items-center justify-between gap-4">
            <span className="flex-shrink-0">
              <FormattedMessage id="mt.shouxufei" />
            </span>
            <div className="flex-1 overflow-hidden flex-grow w-full h-1 border-dashed border-b border-gray-250"></div>
            <span className="flex-shrink-0">
              {transferCurr(amount)} {currency}
            </span>
          </div>
          <div className="text-secondary text-sm  flex flex-row items-center justify-between gap-4">
            <span className="flex-shrink-0">
              <FormattedMessage id="mt.shijidaozhang" />
            </span>
            <div className="flex-1 overflow-hidden flex-grow w-full h-1 border-dashed border-b border-gray-250"></div>
            <span className="flex-shrink-0">
              {formatNum(transferCurr(amount), { precision: toAccountInfo?.currencyDecimal })} {currency}
            </span>
          </div>
        </ProForm>
      </div>
      <div className="flex flex-col justify-start items-start gap-4">
        <div className="text-primary text-sm font-semibold">
          <FormattedMessage id="mt.rujinxuzhi" />
        </div>
        <div className="text-secondary text-xs">
          {methodInfo?.depositNotice ? (
            <div dangerouslySetInnerHTML={{ __html: methodInfo?.depositNotice }} />
          ) : (
            <div className="text-xs text-gray-400">
              <FormattedMessage id="mt.zanwuneirong" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
