import { FormattedMessage, useIntl } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

import ProFormSelect from '@/components/Admin/Form/ProFormSelect'
import { stores } from '@/context/mobxProvider'
import { getEnv } from '@/env'
import { cn } from '@/utils/cn'
import { observer } from 'mobx-react'

type IProps = {
  form: FormInstance
  disabled?: boolean
  methodInfo?: Wallet.fundsMethodPageListItem
}

/**转入表单项 */
function TransferMethodSelectItem({ form, disabled, methodInfo }: IProps) {
  const [open, setOpen] = useState(false)
  const [openCurrency, setOpenCurrency] = useState(false)
  const intl = useIntl()

  const type = methodInfo?.paymentType
  const tips = methodInfo?.tips

  const currencyList = [
    {
      value: 'CNY',
      title: '🇨🇳 CNY'
    },
    {
      value: 'RMB',
      title: '🇨🇳 RMB'
    },
    {
      value: 'USD',
      title: '🇺🇸 USD'
    },
    {
      value: 'HKD',
      title: '🇭🇰 HKD'
    },
    {
      value: 'EUR',
      title: '🇪🇺 EUR'
    }
  ]

  // const fromAccountId = Form.useWatch('fromAccountId', form) // 转出
  const methodId = Form.useWatch('methodId', form) // 转入
  const currency = Form.useWatch('currency', form) // 货币类型

  const methods = stores.wallet.withdrawalMethods

  useEffect(() => {
    if (form && methodInfo) {
      // form.setFieldValue('address', methodInfo?.address)
      // 20241202：默认选择 USD, 目前只有 USD 币种；
      form.setFieldValue('type', methodInfo?.paymentType)
      form.setFieldValue('currency', methodInfo?.baseCurrency)
      form.setFieldValue('symbol', methodInfo?.symbol)
      form.setFieldValue('exchangeRate', methodInfo?.exchangeRate)

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
  }, [form, methodInfo?.paymentType, methodInfo?.baseCurrency, methodInfo?.symbol, methodInfo?.exchangeRate])

  return (
    <div>
      <div className="flex flex-row gap-2 items-end">
        <div className={cn('flex-1')}>
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
              style: {
                height: 44
              },
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
                    className={classNames('cursor-pointer rounded-lg border  border-gray-150 pb-[6px] pt-[11px] hover:bg-[#f5f5f5]', {
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
                  <img src={`${getEnv().imgDomain}${item.channelIcon}`} alt="" className="w-5 h-5 rounded-full" />
                  <div className="flex-1 text-sm text-primary truncate">
                    {item.channelRevealName}&nbsp;({item.channelNo})
                  </div>
                </div>
              )
            }))}
          />
        </div>
        {type === 'OTC' && (
          <div className="text-sm text-primary font-medium w-[116px] h-[44px] rounded-lg border-gray-250 border flex items-center justify-center">
            {currencyList.find((item) => item.value === methodInfo?.symbol)?.title}
          </div>
        )}

        {/* {type === 'OTC' && (
          <ProFormSelect
            name="currency"
            placeholder={intl.formatMessage({ id: 'mt.huobileixing' })}
            allowClear={false}
            disabled={true}
            fieldProps={{
              open: openCurrency,
              style: {
                minWidth: 110
              },
              onDropdownVisibleChange: (visible) => setOpenCurrency(visible),
              // suffixIcon: <SelectSuffixIcon opacity={0.5} />,
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
        )} */}
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
