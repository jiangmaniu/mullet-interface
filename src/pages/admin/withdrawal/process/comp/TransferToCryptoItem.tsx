import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { AutoComplete, FormInstance } from 'antd'
import { useState } from 'react'

import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { message } from '@/utils/message'

type IProps = {
  form: FormInstance
}

/**转入表单项 */
export default function TransferToCryptoItem({ form }: IProps) {
  const [open, setOpen] = useState(false)
  const intl = useIntl()
  const { initialState } = useModel('@@initialState')

  const currentUser = initialState?.currentUser
  const list = [
    {
      label: 'addr1 (1234567890xxxxxxxabcdabcd)',
      value: '1234567890xxxxxxxabcdabcd'
    },
    {
      label: 'addr2 (123456789xxxxxxxabcdabcd2)',
      value: '123456789xxxxxxxabcdabcd2'
    }
  ]

  const [searchValue, setSearchValue] = useState('')
  const searchList = list.filter((item) => item.label.includes(searchValue))

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  return (
    <div className="relative">
      <ProForm.Item
        label={
          <span className="text-sm text-primary font-medium">
            <FormattedMessage id="mt.tibidizhi" />
          </span>
        }
        name="toAccountId"
        rules={[
          {
            required: true,
            validator(rule, value, callback) {
              if (!value) {
                return callback(intl.formatMessage({ id: 'mt.shurudizhi' }))
              }

              return callback()
            }
          }
        ]}
      >
        <AutoComplete
          size="large"
          onChange={(value) => {
            form.setFieldValue('toAccountId', value)
          }}
          options={searchList} // 设置自动完成的选项
          onSearch={handleSearch} // 监听搜索事件
          placeholder={intl.formatMessage({ id: 'mt.shurudizhi' })}
        />
      </ProForm.Item>
      <div className="absolute top-[34px] right-2 flex flex-row items-center gap-2 z-10">
        <SelectSuffixIcon opacity={0.5} />
        <div className="bg-gray-250 h-3 w-[1px] "></div>
        <span
          className="text-primary text-sm font-pf-bold leading-8 hover:underline cursor-pointer"
          onClick={() => {
            message.info('敬请期待')
          }}
        >
          <FormattedMessage id="mt.dizhiguanli" />
        </span>
      </div>
    </div>
  )
}
