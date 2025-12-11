import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import { AutoComplete, FormInstance, Select, Space, Avatar } from 'antd'
import { useLayoutEffect, useState } from 'react'

import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { stores } from '@/context/mobxProvider'
import { getWithdrawalAddressList } from '@/services/api/wallet'
import { push } from '@/utils/navigator'
import { observer } from 'mobx-react'
import { SUPPORTED_BRIDGE_CHAINS } from '@/config/lifiConfig'
import { CHAIN_ICONS } from '@/config/tokenIcons'

type IProps = {
  form: FormInstance
}

/**转入表单项 */
function TransferToCryptoItem({ form }: IProps) {
  const intl = useIntl()

  const [searchValue, setSearchValue] = useState('')
  const [selectedChain, setSelectedChain] = useState('Solana') // 默认 Solana（不需要桥接）

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

  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      {/* 目标链选择 */}
      <ProForm.Item
        label={
          <span className="text-sm text-primary font-medium">
            目标链
          </span>
        }
        name="targetChain"
        initialValue="Solana"
      >
        <Select 
          value={selectedChain} 
          onChange={(value) => {
            setSelectedChain(value)
            form.setFieldValue('targetChain', value)
          }} 
          style={{ width: '100%' }} 
          size="large"
        >
          {SUPPORTED_BRIDGE_CHAINS.map((chain) => (
            <Select.Option key={chain.name} value={chain.name}>
              <Space>
                <Avatar src={CHAIN_ICONS[chain.name]} size="small" />
                {chain.name}
              </Space>
            </Select.Option>
          ))}
        </Select>
      </ProForm.Item>

      {/* 目标地址 */}
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
        <div
          style={{
            position: 'relative',
            width: '100%',
            border: '1px solid #d9d9d9',
            borderRadius: '9px'
          }}
        >
          <AutoComplete
            style={{
              height: '42px',
              width: '256px',
              textOverflow: 'ellipsis'
            }}
            className="custom-autocomplete"
            open={open}
            onDropdownVisibleChange={(value) => {
              setOpen(value)
            }}
            onChange={(value) => {
              form.setFieldValue('toAccountId', value)
            }}
            options={bankList} // 设置自动完成的选项
            onSearch={handleSearch} // 监听搜索事件
            placeholder={
              selectedChain === 'Ethereum' 
                ? '请输入 Ethereum 地址 (以 0x 开头)' 
                : selectedChain === 'Tron'
                ? '请输入 Tron 地址 (以 T 开头)'
                : '请输入 Solana 地址'
            }
          />

          <div className="absolute bottom-[5px] right-2 flex flex-row items-center gap-2 z-10">
            <div
              onClick={() => {
                setOpen(true)
              }}
            >
              <SelectSuffixIcon opacity={0.5} />
            </div>
            <div className="bg-gray-250 h-3 w-[1px] "></div>
            <span
              className="text-primary text-sm font-pf-bold leading-8 hover:underline cursor-pointer"
              onClick={() => {
                // @ts-ignore
                if (window.ReactNativeWebView) {
                  // @ts-ignore
                  window.ReactNativeWebView.postMessage('dizhiguanli')
                } else {
                  push('/app/wallet-address')
                }
              }}
            >
              <FormattedMessage id="mt.dizhiguanli" />
            </span>
          </div>
        </div>
      </ProForm.Item>
    </div>
  )
}

export default observer(TransferToCryptoItem)
