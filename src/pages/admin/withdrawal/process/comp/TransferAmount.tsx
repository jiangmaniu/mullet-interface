import { FormattedMessage, useIntl } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import { useEffect } from 'react'

import ProFormText from '@/components/Admin/Form/ProFormText'
import { formatNum, toFixed } from '@/utils'

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
const calcHandlingFee = (value?: number) => {
  const val = value || 0

  // TODO: 计算手续费
  return val * 0.035
}

export default function TransferAmount({ form, currentUser }: IProps) {
  const intl = useIntl()

  const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号
  const toAccountId = Form.useWatch('toAccountId', form) // 转入
  const toAccountInfo = accountList.find((item) => item.id === toAccountId) // 转入账号信息

  const currency = Form.useWatch('currency', form)

  // 当前账户占用的保证金 = 逐仓保证金 + 全仓保证金（可用保证金）
  const occupyMargin = Number(toFixed(Number(toAccountInfo?.margin || 0) + Number(toAccountInfo?.isolatedMargin || 0)))
  const money = toAccountInfo?.money || 0
  // 可用余额
  const availableMoney = Number(toFixed(money - occupyMargin))

  const handleSetAll = () => {
    const amount = formatNum(availableMoney, { precision: toAccountInfo?.currencyDecimal, raw: true })

    form.setFieldValue('amount', amount)
  }

  const amount = Form.useWatch('amount', form)

  useEffect(() => {
    // TODO: 计算手续费
    form.setFieldValue('handlingFee', calcHandlingFee(amount))
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
        <div className="text-primary text-sm font-pf-bold leading-8">{currency}</div>
      </div>
    </div>
  )
}
