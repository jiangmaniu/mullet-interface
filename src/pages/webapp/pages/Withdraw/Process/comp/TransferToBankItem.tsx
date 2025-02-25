import { FormattedMessage, useIntl } from '@umijs/max'
import { AutoComplete, FormInstance } from 'antd'
import { useLayoutEffect, useState } from 'react'

import { getWithdrawalBankList } from '@/services/api/wallet'
import { ProFormItem } from '@ant-design/pro-components'

type IProps = {
  form: FormInstance
}

/**转入表单项 */
export default function TransferToBankItem({ form }: IProps) {
  const intl = useIntl()

  const [rawList, setRawList] = useState<Wallet.WithdrawalBank[]>([])
  const [bankList, setBankList] = useState<{ value: string; label: string }[]>([])
  const [cardList, setCardList] = useState<{ value: string; label: string }[]>([])

  useLayoutEffect(() => {
    getWithdrawalBankList({
      current: 1,
      size: 1000
    }).then((res) => {
      if (res.success) {
        const list = res.data?.records || []
        setRawList(list)

        const bankNames = Array.from(new Set(list.map((item) => item.bankName || '')))
        setBankList(
          bankNames.map((name) => ({
            value: name,
            label: name
          }))
        )

        const bankCards = Array.from(new Set(list.map((item) => item.bankCard || '')))
        setCardList(
          bankCards.map((card) => ({
            value: card,
            label: card
          }))
        )
      }
    })
  }, [])

  return (
    <>
      {/* <ProFormSelect
        name="bankName"
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
          optionLabelProp: 'label',
          onChange(value, option) {
            console.log('value', value)
            console.log('option', option)
          }
        }}
        rules={[
          {
            required: true,
            validator(rule, value, callback) {
              if (!value) {
                return Promise.reject(intl.formatMessage({ id: 'mt.xuanzeyinhangzhanghu' }))
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
      /> */}
      <ProFormItem name="bankName" label={<FormattedMessage id="mt.yinhangmingcheng" />}>
        <AutoComplete
          size="large"
          className="fix-select-search-input"
          options={bankList}
          placeholder={intl.formatMessage({ id: 'mt.qingshuruyinhangmincheng' })}
          onChange={(value) => {
            console.log('value', value)
          }}
        />
      </ProFormItem>

      <ProFormItem name="bankCard" label={<FormattedMessage id="mt.yinghangzhanghu" />}>
        <AutoComplete
          size="large"
          className="fix-select-search-input"
          options={cardList}
          placeholder={intl.formatMessage({ id: 'mt.qingshuruyinhangmingcheng' })}
          onChange={(value) => {
            console.log('value', value)

            const bankName = rawList.find((item) => item.bankCard === value)?.bankName

            if (bankName) {
              form.setFieldsValue({
                bankName: bankName
              })
            }
          }}
        />
      </ProFormItem>

      {/* <div className="absolute top-[34px] right-2 flex flex-row items-center gap-2 z-10">
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
      </div> */}
    </>
  )
}
