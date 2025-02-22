import { formatNum } from '@/utils'
import { depositTransferCurr } from '@/utils/deposit'
import { ProFormText } from '@ant-design/pro-components'
import { FormattedMessage, getIntl, useIntl } from '@umijs/max'
import { Form, FormInstance } from 'antd'

type IProps = {
  form: FormInstance
  methodInfo?: Wallet.fundsMethodPageListItem
}

export default function TransferOTC({ form, methodInfo }: IProps) {
  const intl = useIntl()

  const currency = Form.useWatch('currency', form)
  const amount = Form.useWatch('amount', form)

  const items = [
    {
      label: 'USD',
      key: 'USD',
      onClick: () => {
        form.setFieldValue('currency', 'USD')
      }
    }
  ]

  const tips = `${getIntl().formatMessage({ id: 'mt.rujinxianzhi' })} ${formatNum(methodInfo?.singleAmountMin || 0)} - ${formatNum(
    methodInfo?.singleAmountMax || 99999
  )} ${methodInfo?.baseCurrency}`

  return (
    <div className="flex flex-col ">
      <div className="text-sm text-primary font-medium mb-3">
        <FormattedMessage id="mt.jine" />
      </div>
      {/* <div className=" border h-[38px]  border-[rgb(217,217,217)] hover:border-gray-500 py-1 px-[7px] rounded-[9px] flex-shrink flex flex-row items-center gap-2">
        <div className="flex-1"> */}
      <ProFormText
        name="amount"
        fieldProps={{
          size: 'large',
          // style: {
          //   border: 'none'
          // },
          suffix: <div className="text-primary text-sm !font-dingpro-medium">{currency}</div>
        }}
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

              if (Number(value) > (methodInfo?.singleAmountMax || 99999)) {
                return callback(tips)
              }

              return callback()
            }
          }
        ]}
      />
      {/* </div>

        <Dropdown menu={{ items }} trigger={['click']}>
          <Space size={2}>
            <div className="text-primary text-sm !font-dingpro-medium">{currency}</div>
            <SelectSuffixIcon opacity={0.5} />
          </Space>
        </Dropdown>
      </div> */}
      <div className="flex justify-between text-gray-500 text-xs mt-2">
        {/* <span>{methodInfo?.options?.limit?.desc}</span> */}
        <span>
          {`${formatNum(methodInfo?.singleAmountMin || 0)} - ${formatNum(methodInfo?.singleAmountMax || 99999)} ${
            methodInfo?.baseCurrency
          }`}
        </span>
        <span>
          ≈ {depositTransferCurr(amount, methodInfo as Wallet.fundsMethodPageListItem)} {methodInfo?.symbol}
        </span>
      </div>
      <div className="text-secondary text-sm mt-5 flex flex-row items-center justify-between gap-4">
        <span className="flex-shrink-0">
          <FormattedMessage id="mt.dairujinjine" />
        </span>
        <div className="flex-1 overflow-hidden flex-grow w-full h-1 border-dashed border-b border-gray-250"></div>
        <span className="flex-shrink-0">
          {depositTransferCurr(amount, methodInfo as Wallet.fundsMethodPageListItem)} {methodInfo?.symbol}
        </span>
      </div>
    </div>
  )
}
