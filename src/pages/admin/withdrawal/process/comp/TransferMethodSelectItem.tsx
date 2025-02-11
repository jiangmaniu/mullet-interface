import { FormattedMessage, useIntl } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import classNames from 'classnames'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'

import ProFormSelect from '@/components/Admin/Form/ProFormSelect'
import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { stores } from '@/context/mobxProvider'
import { observer } from 'mobx-react'

type IProps = {
  form: FormInstance
  type?: 'bank' | 'crypto'
  tips?: string
  disabled?: boolean
}

/**转入表单项 */
function TransferMethodSelectItem({ form, type = 'crypto', tips, disabled }: IProps) {
  const [open, setOpen] = useState(false)
  const [openCurrency, setOpenCurrency] = useState(false)
  const intl = useIntl()
  const currencyList = [
    {
      value: 'USD',
      title: '🇺🇸 USD'
    },
    {
      value: 'CNY',
      title: '🇨🇳 CNY'
    }
  ]

  // const fromAccountId = Form.useWatch('fromAccountId', form) // 转出
  const methodId = Form.useWatch('methodId', form) // 转入
  const currency = Form.useWatch('currency', form) // 货币类型

  const methods = stores.wallet.withdrawalMethods
  useLayoutEffect(() => {
    if (methods.length === 0) {
      const language = intl.locale.replace('-', '').replace('_', '').toUpperCase() as Wallet.Language
      stores.wallet.getWithdrawalMethods({ language })
      return
    }
  }, [methods, intl])

  const methodInfo = useMemo(() => {
    return methods.find((item) => item.channelId === methodId)
  }, [methodId, methods])

  useEffect(() => {
    if (form && methodInfo) {
      // form.setFieldValue('address', methodInfo?.address)
      // 20241202：默认选择 USD, 目前只有 USD 币种；
      form.setFieldValue('type', methodInfo?.type)
      form.setFieldValue('currency', methodInfo?.baseCurrency)

      // 设置链信息
      // if (methodInfo.type === 'crypto') {
      //   form.setFieldValue('currency', methodInfo?.options?.crypto?.value)
      //   form.setFieldValue('chain', methodInfo?.options?.chain?.value)
      //   form.setFieldValue('name', undefined)
      //   form.setFieldValue('bankName', undefined)
      // }

      // // 设置用户银行卡信息
      // if (methodInfo.type === 'bank') {
      //   form.setFieldValue('currency', 'USD')
      //   form.setFieldValue('chain', undefined)
      //   form.setFieldValue('name', 'username') // user.bankList.find(v => v.id === toAccountId)?.name
      //   form.setFieldValue('bankName', methodInfo?.options?.bankName?.value)
      // }
    }
  }, [form, methodInfo])

  return (
    <div>
      <div className="flex flex-row gap-2 items-end">
        <div className="flex-1">
          <ProFormSelect
            label={
              <span className="text-sm text-primary font-medium">
                <FormattedMessage id="mt.chujinfangshi" />
              </span>
            }
            disabled={disabled}
            className="flex-1"
            name="methodId"
            placeholder={intl.formatMessage({ id: 'mt.xuanzechujinfangshi' })}
            allowClear={false}
            fieldProps={{
              open,
              onDropdownVisibleChange: (visible) => setOpen(visible),

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
                      'bg-[#f5f5f5]': item.channelId === methodId
                    })}
                  >
                    <div className="flex w-full py-2 ml-[10px]">{item.label}</div>
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
            options={methods.map((item) => ({
              // ...item,
              value: item.channelId,
              label: (
                <div className="flex justify-between w-full gap-2">
                  <img src={item.icon} alt="" className="w-5 h-5 rounded-full bg-gray" />
                  <div className="flex-1 text-sm font-bold text-primary truncate">
                    {item.channelRevealName}&nbsp;({item.channelNo})
                  </div>
                </div>
              )
            }))}
          />
        </div>
        {type === 'bank' && (
          <ProFormSelect
            name="currency"
            placeholder={intl.formatMessage({ id: 'mt.huobileixing' })}
            allowClear={false}
            fieldProps={{
              open: openCurrency,
              style: {
                minWidth: 110
              },
              onDropdownVisibleChange: (visible) => setOpenCurrency(visible),
              suffixIcon: <SelectSuffixIcon opacity={0.5} />,
              showSearch: false,
              listHeight: 300,

              // 回填到选择框的 Option 的属性值，默认是 Option 的子元素
              optionLabelProp: 'title'
            }}
            rules={[
              {
                required: true,
                validator(rule, value, callback) {
                  if (!currency) {
                    return Promise.reject(intl.formatMessage({ id: 'mt.xuanzehuobileixing' }))
                  }
                  return Promise.resolve()
                }
              }
            ]}
            options={currencyList.map((item) => ({
              // ...item,
              value: item.value,
              label: (
                <div className="flex justify-between w-full gap-2">
                  <div className="flex-1 text-sm font-bold text-primary truncate">{item.title}</div>
                </div>
              )
            }))}
          />
        )}
      </div>
      {tips && (
        <div className="text-xs bg-gray-120 rounded-lg py-2 px-2.5 mt-2.5">
          <div dangerouslySetInnerHTML={{ __html: tips || '' }} />
        </div>
      )}
    </div>
  )
}

export default observer(TransferMethodSelectItem)
