import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import { useState } from 'react'

import ProFormSelect from '@/components/Admin/Form/ProFormSelect'
import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { hiddenCenterPartStr } from '@/utils'
import { message } from '@/utils/message'

type IProps = {
  form: FormInstance
}

/**转入表单项 */
export default function TransferToBankItem({ form }: IProps) {
  const [open, setOpen] = useState(false)
  const intl = useIntl()
  const { initialState } = useModel('@@initialState')

  const currentUser = initialState?.currentUser
  const bankList = [
    {
      name: 'masterCard',
      id: '1234567890'
    },
    {
      name: 'ICBC',
      id: '1234567891'
    }
  ]

  const toBankAccountId = Form.useWatch('toBankAccountId', form) // 转出

  return (
    <div className="relative">
      <ProFormSelect
        name="toBankAccountId"
        label={
          <span className="text-sm text-primary font-medium">
            <FormattedMessage id="mt.yinghangzhanghu" />
          </span>
        }
        placeholder={intl.formatMessage({ id: 'mt.xuanzeyinghangzhanghu' })}
        allowClear={false}
        fieldProps={{
          open,
          onDropdownVisibleChange: (visible) => setOpen(visible),
          suffixIcon: <></>,
          showSearch: false,
          listHeight: 300,
          // optionRender: (option) => {
          //   const item = option?.data || {}

          //   return (
          //     <div
          //       onClick={() => {
          //         setOpen(false)
          //       }}
          //       className={classNames('cursor-pointer rounded-lg border border-gray-250 pb-[6px] pt-[11px] hover:bg-[#f5f5f5]', {
          //         'bg-[#f5f5f5]': item.id === toBankAccountId
          //       })}
          //     >
          //       <div className="flex w-full py-2 ml-[10px]">{item.label}</div>
          //     </div>
          //   )
          // },
          // 回填到选择框的 Option 的属性值，默认是 Option 的子元素
          optionLabelProp: 'label'
        }}
        rules={[
          {
            required: true,
            validator(rule, value, callback) {
              if (!toBankAccountId) {
                return Promise.reject(intl.formatMessage({ id: 'mt.xuanzezhuanruzhanghao' }))
              }
              return Promise.resolve()
            }
          }
        ]}
        options={bankList.map((item) => ({
          ...item,
          value: item.id,
          label: (
            <div className="flex justify-between w-full">
              <div className="flex-1 text-sm font-bold text-primary truncate">
                {item.name} / {hiddenCenterPartStr(item?.id, 4)}
              </div>
            </div>
          )
        }))}
      />

      <div className="absolute top-[34px] right-2 flex flex-row items-center gap-2 z-10">
        <SelectSuffixIcon opacity={0.5} />
        <div className="bg-gray-250 h-3 w-[1px] "></div>
        <span
          className="text-primary text-sm font-pf-bold leading-8 hover:underline cursor-pointer"
          onClick={() => {
            message.info('敬请期待')
          }}
        >
          <FormattedMessage id="mt.yinghangkaguanli" />
        </span>
      </div>
    </div>
  )
}
