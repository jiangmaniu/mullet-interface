import { ProFormSelect } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import { useEffect, useMemo } from 'react'

import ProFormText from '@/components/Admin/Form/ProFormText'
import { SOURCE_CURRENCY } from '@/constants'
import { formatNum, hiddenCenterPartStr } from '@/utils'

import { AccountTag } from '../AccountTag'

export default ({
  form,
  lead,
  trader,
  readonly
}: {
  form: FormInstance
  lead: TradeFollowLead.LeadDetailItem | null
  trader: TradeFollowFollower.FollowDetailItem | null
  readonly: boolean
}) => {
  const intl = useIntl()

  const { initialState } = useModel('@@initialState')

  // 過濾只留下相同賬戶組
  const accountList = useMemo(
    () =>
      (initialState?.currentUser?.accountList?.filter((item) => !item.isSimulate) || []).filter((item) => {
        return item.groupName === lead?.groupName
      }),
    [initialState, lead?.groupName]
  )

  const money = Form.useWatch('money', form)

  useEffect(() => {
    if (trader) {
      if (readonly && trader.tradeAccountId) {
        const item = accountList.find((item) => item.id === trader.tradeAccountId)
        if (item) {
          form.setFieldValue('accountGroupId', String(item.accountGroupId))
          form.setFieldValue('accountId', String(item.id))
          form.setFieldValue('clientId', String(item.clientId))
          form.setFieldValue('money', item.money)
        }
      }
    }
  }, [form, trader, accountList, readonly])

  return (
    <>
      {/* 跟单账户 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-primary">
          <FormattedMessage id="mt.gendanzhanghu" />
        </span>
        <ProFormText name="accountGroupId" hidden />
        <ProFormText name="clientId" hidden />
        <ProFormText name="money" hidden />
        <ProFormSelect
          name="accountId"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'common.qingxuanze' })
            }
          ]}
          disabled={readonly}
          fieldProps={{
            onChange: (val) => {
              const item = accountList.find((item) => item.id === val)
              if (item) {
                form.setFieldValue('accountGroupId', String(item.accountGroupId))
                form.setFieldValue('accountId', String(item.id))
                form.setFieldValue('clientId', String(item.clientId))
                form.setFieldValue('money', item.money)
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
              const item = accountList.find((item) => item.id === val.value)

              return (
                <>
                  {item && (
                    <span className=" flex flex-row  items-center justify-between">
                      <span className="flex flex-row justify-between items-center flex-1">
                        <span className="flex flex-row justify-between items-center gap-1.5 ">
                          <AccountTag size="auto" color={item.groupName}>
                            {item.groupName}
                          </AccountTag>
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
                      <AccountTag size="auto" color={item.groupName}>
                        {item.groupName}
                      </AccountTag>
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
          placeholder={`${intl.formatMessage({ id: 'common.qingxuanze' })}${intl.formatMessage({ id: 'mt.gendanzhanghu' })}`}
          options={accountList.map((item) => ({
            ...item,
            value: item.id,
            label: `${item.name} #${hiddenCenterPartStr(item?.id, 4)}`,
            disabled: item?.followStatus === 1
          }))}
        />
      </div>
    </>
  )
}
