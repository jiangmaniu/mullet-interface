import { FormattedMessage, getIntl, useIntl } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import { useEffect } from 'react'

import ProFormText from '@/components/Admin/Form/ProFormText'
import { DEFAULT_CURRENCY_DECIMAL } from '@/constants'
import { formatNum, toFixed } from '@/utils'
import { transferHandlingFee, withdrawCountTransferCurr } from '@/utils/deposit'
import { observer } from 'mobx-react'

type IProps = {
  form: FormInstance
  currentUser?: User.UserInfo
  methodInfo?: Wallet.fundsMethodPageListItem
}

function TransferAmount({ form, currentUser, methodInfo }: IProps) {
  const intl = useIntl()

  const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号
  const fromAccountId = Form.useWatch('fromAccountId', form) // 转出
  const fromAccountInfo = accountList.find((item) => item.id === fromAccountId) // 转出账号信息

  // 当前账户占用的保证金 = 逐仓保证金 + 全仓保证金（可用保证金）
  const occupyMargin = Number(toFixed(Number(fromAccountInfo?.margin || 0) + Number(fromAccountInfo?.isolatedMargin || 0)))
  const money = fromAccountInfo?.money || 0
  // 可用余额
  const availableMoney = Number(toFixed(money - occupyMargin))

  const handleSetAll = () => {
    const amount = formatNum(availableMoney, { precision: fromAccountInfo?.currencyDecimal || DEFAULT_CURRENCY_DECIMAL, raw: true })

    form.setFieldValue('amount', amount)
    form.validateFields(['amount'])
  }

  const amount = Form.useWatch('amount', form)

  useEffect(() => {
    // TODO: 计算手续费 和 实际到账金额
    // const handlingFee = countHandingFee(amount, methodInfo)
    form.setFieldValue('handlingFee', transferHandlingFee(amount, methodInfo))
    form.setFieldValue('actualAmount', withdrawCountTransferCurr(amount, methodInfo))
  }, [amount])

  const tips = `${getIntl().formatMessage({ id: 'mt.chujinxianzhi' })} ${formatNum(methodInfo?.singleAmountMin || 0)} - ${formatNum(
    methodInfo?.singleAmountMax || 99999
  )} ${methodInfo?.baseCurrency}`

  return (
    <div className="relative">
      <ProFormText
        label={
          <span className="text-sm text-primary font-medium">
            <FormattedMessage id="mt.jine" />
          </span>
        }
        fieldProps={{
          allowClear: false
        }}
        name="amount"
        placeholder={tips}
        rules={[
          {
            required: true,
            validator(rule, value, callback) {
              // 必须要数字类型
              if (isNaN(Number(value))) {
                return callback(intl.formatMessage({ id: 'mt.qingshurushuzi' }))
              }

              if (Number(value) < (methodInfo?.singleAmountMin || 0)) {
                return callback(tips)
              }

              if (Number(value) > availableMoney) {
                return callback(intl.formatMessage({ id: 'mt.yuebuzu' }))
              }

              if (Number(value) > (methodInfo?.singleAmountMax || 99999)) {
                return callback(tips)
              }

              return callback()
            }
          }
        ]}
      />
      <div className="absolute top-[34px] right-2 flex flex-row items-center gap-2 z-10">
        <div className="text-primary text-sm cursor-pointer hover:underline z-10 leading-8" onClick={handleSetAll}>
          <FormattedMessage id="common.all" />
        </div>
        <div className="bg-gray-250 h-3 w-[1px] self-center"></div>
        <div className="text-primary text-sm font-pf-bold leading-8">{methodInfo?.baseCurrency || '--'}</div>
      </div>
    </div>
  )
}

export default observer(TransferAmount)
