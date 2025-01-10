import { FormattedMessage, useIntl, useModel, useSearchParams } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

import ProFormSelect from '@/components/Admin/Form/ProFormSelect'
import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { formatNum, toFixed } from '@/utils'

type IProps = {
  form: FormInstance
}

/**转出表单项 */
export default function TransferFromFormSelectItem({ form }: IProps) {
  const [open, setOpen] = useState(false)
  const intl = useIntl()
  const { initialState } = useModel('@@initialState')
  const [searchParams] = useSearchParams()
  const currentUser = initialState?.currentUser
  const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号

  const fromAccountId = Form.useWatch('fromAccountId', form) // 转出
  const toAccountId = Form.useWatch('toAccountId', form) // 转入
  const fromAccountInfo = accountList.find((item) => item.id === fromAccountId) // 转出账号信息
  const toAccountInfo = accountList.find((item) => item.id === toAccountId) // 转入账号信息

  // 当前账户占用的保证金 = 逐仓保证金 + 全仓保证金（可用保证金）
  const occupyMargin = Number(toFixed(Number(fromAccountInfo?.margin || 0) + Number(fromAccountInfo?.isolatedMargin || 0)))
  const money = fromAccountInfo?.money || 0
  // 可用余额
  const availableMoney = Number(toFixed(money - occupyMargin))

  const searchFrom = searchParams.get('from')

  useEffect(() => {
    form.setFieldValue('fromAccountId', searchFrom)
  }, [searchFrom])

  return (
    <ProFormSelect
      label={
        <span className="text-sm text-primary font-medium">
          <FormattedMessage id="mt.zhuanchuzhanghao" />
        </span>
      }
      name="fromAccountId"
      placeholder={intl.formatMessage({ id: 'mt.xuanzezhuanchuzhanghao' })}
      allowClear={false}
      initialValue={searchFrom}
      fieldProps={{
        open,
        onDropdownVisibleChange: (visible) => setOpen(visible),
        suffixIcon: (
          <>
            <SelectSuffixIcon opacity={0.5} />
            <div className="bg-gray-250 h-3 w-[1px] mr-3"></div>
            <div className="text-primary text-sm py-3 !font-dingpro-medium">
              {formatNum(availableMoney, { precision: fromAccountInfo?.currencyDecimal })} USD
            </div>
          </>
        ),
        showSearch: false,
        listHeight: 300,
        onChange: (value) => {
          form.validateFields(['money'])
        },
        optionRender: (option) => {
          const item = option?.data || {}

          return (
            <div
              onClick={() => {
                setOpen(false)
              }}
              className={classNames('cursor-pointer rounded-lg border border-gray-250 pb-[6px] pt-[11px] hover:bg-[#f5f5f5]', {
                'bg-[#f5f5f5]': item.id === fromAccountId
              })}
            >
              <div className="flex w-full py-2 ml-[10px]">{item.label}</div>
            </div>
          )
        },
        // 回填到选择框的 Option 的属性值，默认是 Option 的子元素
        optionLabelProp: 'label'
      }}
      rules={[
        {
          required: true,
          validator(rule, value, callback) {
            setTimeout(() => {
              form.validateFields(['toAccountId'])
            }, 300)
            if (!fromAccountId) {
              return Promise.reject(intl.formatMessage({ id: 'mt.xuanzezhuanchuzhanghao' }))
            }
            if (toAccountId === fromAccountId) {
              return Promise.reject(intl.formatMessage({ id: 'mt.zhuanruzhanchuzhanghaobunengxiangtong' }))
            }
            return Promise.resolve()
          }
        }
      ]}
      options={accountList.map((item) => ({
        ...item,
        value: item.id,
        label: (
          <div className="flex justify-between w-full">
            {item?.synopsis?.abbr && (
              <div className="flex px-1">
                <div className="flex items-center justify-center rounded bg-gray text-white text-xs py-[2px] px-2 mr-[6px]">
                  {item?.synopsis?.abbr}
                </div>
              </div>
            )}
            <div className="flex-1 text-sm font-bold text-primary truncate">
              {item.name} / {item?.id}
            </div>
          </div>
        )
      }))}
    />
  )
}
