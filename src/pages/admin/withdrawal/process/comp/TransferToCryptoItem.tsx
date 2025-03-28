import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import { AutoComplete, FormInstance } from 'antd'
import { useLayoutEffect, useState } from 'react'

import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { stores } from '@/context/mobxProvider'
import { getWithdrawalAddressList } from '@/services/api/wallet'
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
  const withdrawalAddressInitialized = stores.wallet.withdrawalAddressInitialized

  useLayoutEffect(() => {
    const now = Date.now().valueOf()
    if (now - withdrawalAddressInitialized > 1000 * 30) {
      stores.wallet.getWithdrawalAddressList()
    }
  }, [widthdrawAddress, withdrawalAddressInitialized])

  const [bankList, setBankList] = useState<{ value: string; label: string }[]>([])

  useLayoutEffect(() => {
    getWithdrawalAddressList({
      current: 1,
      size: 1000
    }).then((res) => {
      if (res.success) {
        const list = res.data?.records || []

        setBankList(
          list.map((i) => ({
            value: i.address,
            label: i.address
          }))
        )
      }
    })
  }, [])

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
            // @ts-ignore
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
          options={bankList} // 设置自动完成的选项
          onSearch={handleSearch} // 监听搜索事件
          placeholder={intl.formatMessage({ id: 'mt.shurudizhi' })}
          suffixIcon={
            <div className="flex flex-row items-center gap-2 z-10">
              <SelectSuffixIcon opacity={0.5} />
              <div className="bg-gray-250 h-3 w-[1px] "></div>
              <span
                className="text-primary text-sm font-pf-bold leading-8 hover:underline cursor-pointer"
                onClick={() => {
                  // message.info('敬请期待')
                  push('/setting?key=address&subkey=cryptoAddress')
                }}
              >
                <FormattedMessage id="mt.dizhiguanli" />
              </span>
            </div>
          }
        />
      </ProForm.Item>
    </div>
  )
}

export default observer(TransferToCryptoItem)
