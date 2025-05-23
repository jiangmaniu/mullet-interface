import { formatNum } from '@/utils'
import { depositTransferCurr } from '@/utils/deposit'
import { ProFormText } from '@ant-design/pro-components'
import { FormattedMessage, getIntl, useIntl } from '@umijs/max'
import { Form, FormInstance } from 'antd'

type IProps = {
  form: FormInstance
  methodInfo?: Wallet.fundsMethodPageListItem
}

export default function TransferAmount({ form, methodInfo }: IProps) {
  const intl = useIntl()

  const currency = Form.useWatch('currency', form)
  const amount = Form.useWatch('amount', form)

  // const toAccountId = Form.useWatch('toAccountId', form)

  // const { initialState } = useModel('@@initialState')

  // const currentUser = initialState?.currentUser
  // const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号

  // const toAccountInfo = accountList.find((item) => item.id === toAccountId) // 转入账号信息
  // // 当前账户占用的保证金 = 逐仓保证金 + 全仓保证金（可用保证金）
  // const occupyMargin = Number(toFixed(Number(toAccountInfo?.margin || 0) + Number(toAccountInfo?.isolatedMargin || 0)))
  // const money = toAccountInfo?.money || 0
  // // 可用余额
  // const availableMoney = Number(toFixed(money - occupyMargin))

  const tips = `${formatNum(methodInfo?.singleAmountMin || 0)} - ${formatNum(methodInfo?.singleAmountMax || 99999)}`

  return (
    <div className="flex flex-col ">
      <div className="text-sm text-primary font-medium mb-3">
        <FormattedMessage id="mt.jine" />
      </div>

      <ProFormText
        name="amount"
        fieldProps={{
          className: 'extra-large',
          size: 'large',
          // style: {
          //   border: 'none'
          // }
          style: {
            height: 50
          },
          suffix: <div className="text-primary text-sm !font-dingpro-medium">{currency}</div>,
          onChange: (e) => {
            console.log('e', e)
          }
        }}
        placeholder="0.00"
        rules={[
          {
            required: true,
            validator(rule, value, callback) {
              // 必须要数字类型
              if (isNaN(Number(value))) {
                return callback(intl.formatMessage({ id: 'mt.qingshurushuzi' }))
              }

              if (Number(value) < (methodInfo?.singleAmountMin || 0)) {
                return callback(`${getIntl().formatMessage({ id: 'mt.rujinxianzhi' })} ${tips} ${methodInfo?.baseCurrency}`)
              }

              // if (Number(value) > availableMoney) {
              //   return callback(intl.formatMessage({ id: 'mt.yuebuzu' }))
              // }

              if (Number(value) > (methodInfo?.singleAmountMax || 99999)) {
                return callback(`${getIntl().formatMessage({ id: 'mt.rujinxianzhi' })} ${tips} ${methodInfo?.baseCurrency}`)
              }

              return callback()
            }
          }
        ]}
      />

      <div className="flex justify-between text-gray-500 text-xs mt-2">
        {/* <span>{methodInfo?.options?.limit?.desc}</span> */}
        {amount && (
          <div className="mt-[2px] text-xs">
            <FormattedMessage id="mt.ninjiangzhifujine" /> &nbsp;
            <span className="text-primary">
              {amount ? depositTransferCurr(amount, methodInfo as Wallet.fundsMethodPageListItem) : '0'} {methodInfo?.symbol}
            </span>
          </div>
        )}
        {/* <span>
          ≈ {depositTransferCurr(amount, methodInfo as Wallet.fundsMethodPageListItem)} {methodInfo?.symbol}
        </span> */}
      </div>
      {/* <div className="text-secondary text-sm mt-5 flex flex-row items-center justify-between gap-4">
        <span className="flex-shrink-0">
          <FormattedMessage id="mt.dairujinjine" />
        </span>
        <div className="flex-1 overflow-hidden flex-grow w-full h-1 border-dashed border-b border-gray-250"></div>
        <span className="flex-shrink-0">
          {amount ? depositTransferCurr(amount, methodInfo as Wallet.fundsMethodPageListItem) : '0'} {methodInfo?.symbol}
        </span>
      </div> */}
    </div>
  )
}
