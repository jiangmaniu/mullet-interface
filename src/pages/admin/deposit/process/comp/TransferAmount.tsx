import { FormattedMessage, useIntl } from '@umijs/max'
import { Form, FormInstance } from 'antd'

import ProFormText from '@/components/Admin/Form/ProFormText'
type IProps = {
  form: FormInstance
  currentUser?: User.UserInfo
  methodInfo?: Wallet.fundsMethodPageListItem
}

export default function TransferAmount({ form, currentUser, methodInfo }: IProps) {
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

  // 汇率换算
  const transferCurr = (value?: number) => {
    const val = value || 0

    // TODO: 汇率换算
    return val * 1.0
  }

  return (
    <div>
      <ProFormText name="currency" hidden />
      {/* <div className="text-sm text-primary font-medium mb-3">
        <FormattedMessage id="mt.jine" />
      </div>
      <div className=" border h-[38px]  border-[rgb(217,217,217)] hover:border-gray-500 py-1 px-[7px] rounded-[9px] flex-shrink flex flex-row items-center gap-2">
        <div className="flex-1">
          <ProFormText
            name="amount"
            placeholder={intl.formatMessage({ id: 'mt.qingshurushuzi' })}
            fieldProps={{
              size: 'small',
              style: {
                border: 'none'
              }
            }}
          />
        </div>

        <Dropdown menu={{ items }} trigger={['click']}>
          <Space size={2}>
            <div className="text-primary text-sm !font-dingpro-medium">{currency}</div>
            <SelectSuffixIcon opacity={0.5} />
          </Space>
        </Dropdown>
      </div> */}
      <div className="flex justify-between text-gray-500 text-xs mt-2">
        <span>{methodInfo?.options?.limit?.desc}</span>
        <span>
          ≈ {transferCurr(amount)} {currency}
        </span>
      </div>
      <div className="text-secondary text-sm mt-5 flex flex-row items-center justify-between gap-4">
        <span className="flex-shrink-0">
          <FormattedMessage id="mt.dairujinjine" />
        </span>
        <div className="flex-1 overflow-hidden flex-grow w-full h-1 border-dashed border-b border-gray-250"></div>
        <span className="flex-shrink-0">
          {transferCurr(amount)} {currency}
        </span>
      </div>
    </div>
  )
}
