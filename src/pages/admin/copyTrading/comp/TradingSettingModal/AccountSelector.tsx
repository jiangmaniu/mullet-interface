import { ProFormSelect } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { FormInstance } from 'antd'

import { SOURCE_CURRENCY } from '@/constants'
import { formatNum, hiddenCenterPartStr } from '@/utils'

import { AccountTag } from '../AccountTag'

export default ({ form, money }: { form: FormInstance; money: number }) => {
  const intl = useIntl()

  const { initialState } = useModel('@@initialState')
  const accountList = initialState?.currentUser?.accountList?.filter((item) => !item.isSimulate) || [] // 真实账号列表

  return (
    <>
      {/* 跟单账户 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-primary">
          <FormattedMessage id="mt.gendanzhanghu" />
        </span>
        <ProFormSelect
          name="accountGroupId"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'mt.qingxuanze' })
            }
          ]}
          fieldProps={{
            onChange: (val) => {
              const item = accountList.find((item) => item.id === val)
              if (item) {
                console.log(item)
                form.setFieldValue('accountGroupId', String(item.accountGroupId))
                form.setFieldValue('accountId', String(item.id))
                form.setFieldValue('clientId', String(item.clientId))
              }
            },
            style: {
              height: 42
            },
            suffixIcon: (
              <div className="flex items-center gap-1">
                <span className=" w-[1px] h-[11px] bg-gray-260"></span>
                <span className=" text-primary text-sm !font-dingpro-medium">
                  {formatNum(money, { precision: 2 })} {SOURCE_CURRENCY}
                </span>
              </div>
            ),
            labelRender: (val) => {
              const item = accountList.find((item) => item.accountGroupId === val.value)

              return (
                <>
                  {item && (
                    <span className=" flex flex-row  items-center justify-between">
                      <span className="flex flex-row justify-between items-center flex-1">
                        <span className="flex flex-row justify-between items-center gap-1.5 ">
                          <AccountTag type="meifen" />
                          <span>{hiddenCenterPartStr(item.id, 4)}</span>
                        </span>
                        <span className=" w-5 h-5"></span>
                      </span>
                    </span>
                  )}
                </>
              )
            },
            optionRender: (option) => {
              const item = option?.data || {}

              return (
                <span className=" flex flex-row  items-center justify-between">
                  <span className="flex flex-row justify-between items-center flex-1">
                    <span className="flex flex-row justify-between items-center gap-1.5 ">
                      <AccountTag type="meifen" />
                      <span>{hiddenCenterPartStr(item.id, 4)}</span>
                    </span>
                    <span className=" w-5 h-5"></span>
                  </span>
                  <div className="flex items-center gap-1">
                    <span className=" w-[1px] h-[11px] bg-gray-260"></span>
                    <span className=" text-sm !font-dingpro-medium">
                      {!Number(item.money) ? '0.00' : formatNum(item.money, { precision: 2 })} {SOURCE_CURRENCY}
                    </span>
                  </div>
                </span>
              )
            }
          }}
          placeholder={`${intl.formatMessage({ id: 'mt.qingxuanze' })}${intl.formatMessage({ id: 'mt.gendanzhanghu' })}`}
          // options={accountList}
          options={accountList.map((item) => ({
            ...item,
            value: item.id,
            label: `${item.name} #${hiddenCenterPartStr(item?.id, 4)}`
          }))}
        />
      </div>
    </>
  )
}
