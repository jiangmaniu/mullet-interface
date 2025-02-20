import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useParams, useSearchParams } from '@umijs/max'
import { Form } from 'antd'
import { FormInstance } from 'antd/lib'

import { formatNum } from '@/utils'

import ProFormText from '@/components/Admin/Form/ProFormText'
import { DEFAULT_CURRENCY_DECIMAL } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { observer } from 'mobx-react'
import TransferAmount from './TransferAmount'
import TransferFormSelectItem from './TransferFormSelectItem'
import TransferMethodSelectItem from './TransferMethodSelectItem'
import TransferToBankItem from './TransferToBankItem'
import TransferToCryptoItem from './TransferToCryptoItem'

const Step1 = ({
  form,
  loading,
  currentUser,
  fromAccountInfo,
  handleSubmit,
  methodInfo
}: {
  form: FormInstance<any>
  loading: boolean
  currentUser?: User.UserInfo
  fromAccountInfo?: User.AccountItem
  handleSubmit: () => void
  methodInfo?: Wallet.fundsMethodPageListItem
}) => {
  const amount = Form.useWatch('amount', form)
  const currency = Form.useWatch('currency', form)

  const { trade } = useStores()
  const { currentAccountInfo } = trade

  const params = useParams()
  const method = params?.method as string

  // 手续费
  const handlingFee = Form.useWatch('handlingFee', form)
  // 实际到账金额
  const actualAmount = Form.useWatch('actualAmount', form)

  const [searchParams] = useSearchParams()
  const tradeAccountId = searchParams.get('tradeAccountId') as string

  return (
    <div className="flex md:flex-row flex-col justify-start gap-10 md:gap-20 flex-1 ">
      <div className="flex-1 form-item-divider-left flex-shrink ">
        <ProForm
          onFinish={async (values: Account.TransferAccountParams) => {
            return
          }}
          initialValues={{
            methodId: method,
            fromAccountId: tradeAccountId || currentAccountInfo.id,
            type: 'crypto'
          }}
          disabled={loading}
          submitter={false}
          layout="vertical"
          form={form}
          className="flex flex-col gap-6"
        >
          <ProFormText name="orderId" hidden />
          <ProFormText name="methodId" hidden />
          <ProFormText name="handlingFee" hidden />
          <ProFormText name="currency" hidden />
          <ProFormText name="type" hidden />
          <ProFormText name="crypto" hidden />
          <ProFormText name="chain" hidden />
          <ProFormText name="name" hidden />
          <ProFormText name="actualAmount" hidden />
          <ProFormText name="symbol" hidden />
          <ProFormText name="exchangeRate" hidden />
          <ProFormText name="amount" hidden />

          <TransferMethodSelectItem form={form} methodInfo={methodInfo} />
          <TransferFormSelectItem form={form} />
          {methodInfo?.paymentType === 'OTC' ? <TransferToBankItem form={form} /> : <TransferToCryptoItem form={form} />}

          <TransferAmount form={form} currentUser={currentUser} methodInfo={methodInfo} />

          {/* <Button type="primary" htmlType="submit" size="large" className="mt-2" onClick={handleSubmit} disabled={disabled}>
            <div className="flex flex-row items-center gap-2">
              <FormattedMessage id="mt.tixian" />
              <Iconfont name="zhixiang" color="white" width={18} height={18} />
            </div>
          </Button> */}
          <div className="flex flex-row items-center gap-[26px]">
            <div className="text-sm flex flex-col items-start ">
              <span className="text-secondary text-xs font-normal">
                <FormattedMessage id="mt.shouxufei" />
              </span>
              <span className=" text-sm font-pf-medium">
                {formatNum(handlingFee, { precision: 2 })} {currency}
              </span>
            </div>
            <div className=" w-[1px] h-6 bg-[#dadada]">{/*  */}</div>
            <div className="text-sm flex flex-col items-start ">
              <span className="text-secondary text-xs font-normal">
                <FormattedMessage id="mt.shijidaozhang" />
              </span>
              <span className=" text-sm font-pf-medium">
                {formatNum(Math.max(actualAmount, 0), { precision: DEFAULT_CURRENCY_DECIMAL })}
                &nbsp;{methodInfo?.symbol}
              </span>
            </div>
          </div>
        </ProForm>
      </div>
    </div>
  )
}

export default observer(Step1)
