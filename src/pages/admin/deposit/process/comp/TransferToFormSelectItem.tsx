import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import classNames from 'classnames'
import { useState } from 'react'

import ProFormSelect from '@/components/Admin/Form/ProFormSelect'
import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { formatNum, toFixed } from '@/utils'
import { getAccountSynopsisByLng } from '@/utils/business'
import { InfoCircleOutlined } from '@ant-design/icons'

type IProps = {
  form: FormInstance
}

/**转入表单项 */
export default function TransferToFormSelectItem({ form }: IProps) {
  const [open, setOpen] = useState(false)
  const intl = useIntl()
  const { initialState } = useModel('@@initialState')

  const currentUser = initialState?.currentUser
  const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号

  // const fromAccountId = Form.useWatch('fromAccountId', form) // 转出
  const toAccountId = Form.useWatch('toAccountId', form) // 转入
  // const fromAccountInfo = accountList.find((item) => item.id === fromAccountId) // 转出账号信息
  const toAccountInfo = accountList.find((item) => item.id === toAccountId) // 转入账号信息

  // 当前账户占用的保证金 = 逐仓保证金 + 全仓保证金（可用保证金）
  const occupyMargin = Number(toFixed(Number(toAccountInfo?.margin || 0) + Number(toAccountInfo?.isolatedMargin || 0)))
  const money = toAccountInfo?.money || 0
  // 可用余额
  const availableMoney = Number(toFixed(money - occupyMargin))

  return (
    <div>
      <ProFormSelect
        label={
          <span className="text-sm text-primary font-medium">
            <FormattedMessage id="mt.zhuanruzhanghao" />
          </span>
        }
        name="toAccountId"
        placeholder={intl.formatMessage({ id: 'mt.xuanzezhuanruzhanghao' })}
        allowClear={false}
        fieldProps={{
          open,
          onDropdownVisibleChange: (visible) => setOpen(visible),
          suffixIcon: (
            <>
              <SelectSuffixIcon opacity={0.5} />
              <div className="bg-gray-250 h-3 w-[1px] mr-3"></div>
              <div className="text-primary text-sm py-3 !font-dingpro-medium">
                {formatNum(availableMoney, { precision: toAccountInfo?.currencyDecimal })} USD
              </div>
            </>
          ),
          showSearch: false,
          listHeight: 300,
          optionRender: (option) => {
            const item = option?.data || {}

            return (
              <div
                onClick={() => {
                  setOpen(false)
                }}
                className={classNames('cursor-pointer rounded-lg border border-gray-150 pb-[6px] pt-[11px] hover:bg-[#f5f5f5]', {
                  'bg-[#f5f5f5]': item.id === toAccountId
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
              // setTimeout(() => {
              //   form.validateFields(['fromAccountId'])
              // }, 300)
              if (!toAccountId) {
                return Promise.reject(intl.formatMessage({ id: 'mt.xuanzezhuanruzhanghao' }))
              }
              // if (toAccountId === fromAccountId) {
              //   return Promise.reject(intl.formatMessage({ id: 'mt.zhuanruzhanchuzhanghaobunengxiangtong' }))
              // }
              return Promise.resolve()
            }
          }
        ]}
        options={accountList.map((item) => {
          const synopsis = getAccountSynopsisByLng(item.synopsis)
          return {
            ...item,
            value: item.id,
            label: (
              <div className="flex justify-between items-center w-full">
                {synopsis?.abbr && (
                  <div className="flex px-1">
                    <div className="flex items-center justify-center rounded bg-gray text-white text-xs py-[2px] px-2 mr-[6px]">
                      {synopsis?.abbr}
                    </div>
                  </div>
                )}
                <div className="flex-1 text-sm font-bold text-primary truncate">
                  {item.name} / {item?.id}
                </div>
              </div>
            )
          }
        })}
      />
      <div className="text-xs text-secondary mt-2.5 flex items-center">
        <InfoCircleOutlined style={{ fontSize: 14, marginRight: 4 }} />
        <FormattedMessage id="mt.yizhanghuhuobihuiru" />
      </div>
    </div>
  )
}
