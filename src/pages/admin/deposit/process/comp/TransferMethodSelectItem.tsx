import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import classNames from 'classnames'
import { useState } from 'react'

import ProFormSelect from '@/components/Admin/Form/ProFormSelect'
import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { stores } from '@/context/mobxProvider'
import { IDepositMethod } from '@/mobx/deposit/types'

type IProps = {
  form: FormInstance
  methodInfo?: IDepositMethod
}

/**转入表单项 */
export default function TransferMethodSelectItem({ form, methodInfo }: IProps) {
  const [open, setOpen] = useState(false)
  const intl = useIntl()
  const { initialState } = useModel('@@initialState')

  const currentUser = initialState?.currentUser
  const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号

  // const fromAccountId = Form.useWatch('fromAccountId', form) // 转出
  const methodId = Form.useWatch('methodId', form) // 转入
  // const methodInfo = stores.deposit.methods.find((item) => item.title === methodId) // 转入账号信息

  return (
    <div>
      <ProFormSelect
        label={
          <span className="text-sm text-primary font-medium">
            <FormattedMessage id="mt.zhifufangshi" />
          </span>
        }
        name="methodId"
        placeholder={intl.formatMessage({ id: 'mt.xuanzezhifufangshi' })}
        allowClear={false}
        fieldProps={{
          open,
          onDropdownVisibleChange: (visible) => setOpen(visible),
          suffixIcon: (
            <>
              <SelectSuffixIcon opacity={0.5} />
              {/* <div className="bg-gray-250 h-3 w-[1px] mr-3"></div>
            <div className="text-primary text-sm py-3 !font-dingpro-medium">
              {formatNum(availableMoney, { precision: toAccountInfo?.currencyDecimal })} USD
            </div> */}
            </>
          ),
          showSearch: false,
          listHeight: 300,
          optionRender: (option) => {
            const item = option?.data || {}

            return (
              <div
                onClick={() => {
                  setOpen(false)
                }}
                className={classNames('cursor-pointer rounded-lg border  border-gray-250 pb-[6px] pt-[11px] hover:bg-[#f5f5f5]', {
                  'bg-[#f5f5f5]': item.id === methodId
                })}
              >
                <div className="flex w-full py-2 ml-[10px]">{item.title}</div>
              </div>
            )
          },
          // 回填到选择框的 Option 的属性值，默认是 Option 的子元素
          optionLabelProp: 'title'
        }}
        rules={[
          {
            required: true,
            validator(rule, value, callback) {
              if (!methodId) {
                return Promise.reject(intl.formatMessage({ id: 'mt.xuanzezhifufangshi' }))
              }
              return Promise.resolve()
            }
          }
        ]}
        options={stores.deposit.methods.map((item) => ({
          // ...item,
          value: item.title,
          label: (
            <div className="flex justify-between w-full gap-2">
              <img src={item.icon} alt="" className="w-5 h-5 rounded-full bg-gray" />
              <div className="flex-1 text-sm font-bold text-primary truncate">{item.title}</div>
            </div>
          )
        }))}
      />
      {methodInfo?.depositTips && (
        <div className="text-xs bg-gray-120 rounded-lg py-2 px-2.5 mt-2.5">
          <div dangerouslySetInnerHTML={{ __html: methodInfo?.depositTips || '' }} />
        </div>
      )}
    </div>
  )
}
