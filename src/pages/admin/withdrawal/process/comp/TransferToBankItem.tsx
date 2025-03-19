import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { AutoComplete, FormInstance } from 'antd'
import { useLayoutEffect, useState } from 'react'

import { getWithdrawalBankList } from '@/services/api/wallet'
import { ProFormItem } from '@ant-design/pro-components'

type IProps = {
  form: FormInstance
}

/**转入表单项 */
export default function TransferToBankItem({ form }: IProps) {
  const [open, setOpen] = useState(false)
  const intl = useIntl()
  const { initialState } = useModel('@@initialState')

  const currentUser = initialState?.currentUser

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
      <ProFormItem
        name="bankName"
        label={<FormattedMessage id="mt.yinhangmingcheng" />}
        rules={[
          { required: true, message: intl.formatMessage({ id: 'common.qingshuru' }) + intl.formatMessage({ id: 'mt.yinhangmingcheng' }) }
        ]}
      >
        <AutoComplete
          size="large"
          className="fix-select-search-input"
          options={bankList}
          placeholder={intl.formatMessage({ id: 'mt.qingshuruyinhangmincheng' })}
          onChange={(value) => {
            form.setFieldValue('bankName', value)
          }}
        />
      </ProFormItem>

      <ProFormItem
        name="bankCard"
        label={<FormattedMessage id="mt.yinghangzhanghu" />}
        rules={[
          {
            required: true,
            // message: intl.formatMessage({ id: 'common.qingshuru' }) + intl.formatMessage({ id: 'mt.yinghangzhanghu' }),
            validator(rule, value, callback) {
              if (!value) {
                return Promise.reject(intl.formatMessage({ id: 'common.qingshuru' }) + intl.formatMessage({ id: 'mt.yinghangzhanghu' }))
              } else if (value && !/^[0-9]+$/.test(value)) {
                return Promise.reject(intl.formatMessage({ id: 'mt.qingshurushuzi' }))
              } else {
                return Promise.resolve()
              }
            }
          }
        ]}
      >
        <AutoComplete
          size="large"
          className="fix-select-search-input"
          options={cardList}
          placeholder={intl.formatMessage({ id: 'mt.qingshuruyinhangmingcheng' })}
          onChange={(value) => {
            form.setFieldValue('bankCard', value)

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
