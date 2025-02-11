import { FormattedMessage, useIntl } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import { useEffect, useMemo } from 'react'

import ProFormText from '@/components/Admin/Form/ProFormText'
import { stores } from '@/context/mobxProvider'
import { formatNum, toFixed } from '@/utils'
import { observer } from 'mobx-react'

type IProps = {
  form: FormInstance
  currentUser?: User.UserInfo
}

// 汇率换算
const transferCurr = (value?: number) => {
  const val = value || 0

  // TODO: 汇率换算
  return val * 1.0
}

// 计算手续费
const calcHandlingFee = (value?: number, methodInfo?: Wallet.fundsMethodPageListItem) => {
  const val = value || 0

  if (!methodInfo) return 0

  const { userSingleFixedFee, userSingleLeastFee, userTradePercentageFee } = methodInfo

  const res = Math.max(val * (userTradePercentageFee || 0) * 0.01 + (userSingleFixedFee || 0), userSingleLeastFee || 0)

  return res
}

function TransferAmount({ form, currentUser }: IProps) {
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
    const amount = formatNum(availableMoney, { precision: fromAccountInfo?.currencyDecimal, raw: true })

    form.setFieldValue('amount', amount)
  }

  const amount = Form.useWatch('amount', form)

  const methodId = Form.useWatch('methodId', form)

  const methods = stores.wallet.withdrawalMethods

  const methodInfo = useMemo(() => {
    return methods.find((item) => item.id === methodId)
  }, [methodId, methods])

  useEffect(() => {
    console.log('methodInfo', methodInfo)
  }, [methodInfo])

  useEffect(() => {
    // TODO: 计算手续费 和 实际到账金额
    const handlingFee = calcHandlingFee(amount, methodInfo)
    form.setFieldValue('handlingFee', formatNum(handlingFee, { precision: 2 }))
    form.setFieldValue(
      'actualAmount',
      formatNum(Math.max(amount - handlingFee - (methodInfo?.userExchangeDifferencePercentage || 0), 0), { precision: 2 })
    )
  }, [amount])

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
        placeholder={intl.formatMessage({ id: 'mt.qingshurushuzi' })}
        rules={[
          {
            required: true,
            validator(rule, value, callback) {
              // 必须要数字类型
              if (isNaN(Number(value))) {
                return callback(intl.formatMessage({ id: 'mt.qingshurushuzi' }))
              }

              if (Number(value) > availableMoney) {
                return callback(intl.formatMessage({ id: 'mt.yuebuzu' }))
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
