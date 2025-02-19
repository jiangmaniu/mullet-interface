import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useParams, useSearchParams } from '@umijs/max'
import { Button, Form } from 'antd'
import { FormInstance } from 'antd/lib'

import Iconfont from '@/components/Base/Iconfont'
import { formatNum } from '@/utils'

import ProFormText from '@/components/Admin/Form/ProFormText'
import { DEFAULT_CURRENCY_DECIMAL } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { cn } from '@/utils/cn'
import { transferHandlingFee } from '@/utils/deposit'
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

  const disabled = !amount || !actualAmount || Number(actualAmount) <= 0 || loading

  return (
    <div className="flex md:flex-row flex-col justify-start gap-10 md:gap-20 flex-1 ">
      <div className="flex-1 form-item-divider-left flex-shrink min-w-[566px] max-w-[700px]">
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
          <ProFormText name="bankName" hidden />
          <ProFormText name="actualAmount" hidden />
          <ProFormText name="symbol" hidden />

          <TransferMethodSelectItem form={form} methodInfo={methodInfo} />
          <TransferFormSelectItem form={form} />
          {methodInfo?.paymentType === 'OTC' ? <TransferToBankItem form={form} /> : <TransferToCryptoItem form={form} />}

          <TransferAmount form={form} currentUser={currentUser} methodInfo={methodInfo} />

          <Button type="primary" htmlType="submit" size="large" className="mt-2" onClick={handleSubmit} disabled={disabled}>
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
              {formatNum(transferHandlingFee(handlingFee, methodInfo as Wallet.fundsMethodPageListItem), { precision: 2 })} {currency}
            </span>
          </div>
          <div
            className={cn('text-secondary text-sm  flex flex-row items-center justify-between gap-4', {
              // 'text-red': Number(actualAmount) < 0
            })}
          >
            <span className="flex-shrink-0">
              <FormattedMessage id="mt.shijidaozhang" />
            </span>
            <div className="flex-1 overflow-hidden flex-grow w-full h-1 border-dashed border-b border-gray-250"></div>
            <span className="flex-shrink-0">
              {formatNum(Math.max(actualAmount, 0), { precision: DEFAULT_CURRENCY_DECIMAL })}
              &nbsp;{methodInfo?.symbol}
            </span>
          </div>
        </ProForm>
      </div>
      <div className="flex flex-col justify-start items-start gap-4">
        <div className="text-primary text-sm font-semibold">
          <FormattedMessage id="mt.chujinxuzhi" />
        </div>
        <div className="text-secondary text-xs">
          {methodInfo?.notice ? (
            <p dangerouslySetInnerHTML={{ __html: methodInfo?.notice?.replace(/\n/g, '<br>') }} />
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

export default observer(Step1)
