import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import { AutoComplete, FormInstance } from 'antd'
import { useLayoutEffect, useState } from 'react'

import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { stores } from '@/context/mobxProvider'
import { push } from '@/utils/navigator'
import { observer } from 'mobx-react'

type IProps = {
  form: FormInstance
}

/**转入表单项 */
function TransferToCryptoItem({ form }: IProps) {
  const intl = useIntl()

  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const widthdrawAddress = stores.wallet.withdrawalAddress
  const searchList = widthdrawAddress.filter((item) => item.label?.includes(searchValue))

  const [initialed, setInitialed] = useState(false)
  useLayoutEffect(() => {
    if (!initialed && widthdrawAddress.length === 0) {
      stores.wallet.getWithdrawalAddressList()
      setInitialed(true)
      return
    }
  }, [widthdrawAddress, intl, initialed])

  return (
    <div className="relative">
      <ProForm.Item
        addonWarpStyle={{}}
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
          style={{
            height: '38px'
          }}
          onChange={(value) => {
            form.setFieldValue('toAccountId', value)
          }}
          options={searchList} // 设置自动完成的选项
          onSearch={handleSearch} // 监听搜索事件
          placeholder={intl.formatMessage({ id: 'mt.shurudizhi' })}
        />
      </ProForm.Item>
      <div className="absolute bottom-[2px] right-2 flex flex-row items-center gap-2 z-10">
        <SelectSuffixIcon opacity={0.5} />
        <div className="bg-gray-250 h-3 w-[1px] "></div>
        <span
          className="text-primary text-sm font-pf-bold leading-8 hover:underline cursor-pointer"
          onClick={() => {
            // message.info('敬请期待')
            push('/setting?key=address')
          }}
        >
          <FormattedMessage id="mt.dizhiguanli" />
        </span>
      </div>
    </div>
  )
}

export default observer(TransferToCryptoItem)
