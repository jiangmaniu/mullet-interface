import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import { useState } from 'react'

import ProFormSelect from '@/components/Admin/Form/ProFormSelect'
import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { hiddenCenterPartStr } from '@/utils'
import { push } from '@/utils/navigator'

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

  const toAccountId = Form.useWatch('toAccountId', form) // 转出

  return (
    <div className="relative">
      <ProFormSelect
        name="toAccountId"
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
          optionLabelProp: 'label'
        }}
        rules={[
          {
            required: true,
            validator(rule, value, callback) {
              if (!toAccountId) {
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
            // message.info('敬请期待')
            push('/setting?key=address')
          }}
        >
          <FormattedMessage id="mt.yinghangkaguanli" />
        </span>
      </div>
    </div>
  )
}
