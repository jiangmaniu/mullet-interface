import { ProFormSelect, ProFormTextArea } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import { useMemo } from 'react'

import ProFormText from '@/components/Admin/Form/ProFormText'
import Button from '@/components/Base/Button'
import { SOURCE_CURRENCY } from '@/constants'
import { formatNum, hiddenCenterPartStr } from '@/utils'

import { AccountTag } from '../AccountTag'

type IProps = {
  form: FormInstance
  info: TradeFollowLead.LeadDetailItem | null
}

export default ({ form, info }: IProps) => {
  const intl = useIntl()

  const { initialState } = useModel('@@initialState')
  const accountList = initialState?.currentUser?.accountList?.filter((item) => !item.isSimulate) || [] // 真实账号列表

  const tradeAccountId = Form.useWatch('tradeAccountId', form)

  // 選中賬戶的餘額
  const money = useMemo(() => {
    const item = accountList.find((item) => item.id === tradeAccountId)
    return item?.money || 0
  }, [tradeAccountId])

  return (
    <div className="flex flex-col justify-between gap-4.5 w-full max-w-full">
      {/* 带单账户 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-primary">
          <FormattedMessage id="mt.daidanzhanghu" />
        </span>
        {/* <Select
          suffixIcon={null}
          size="large"
          placeholder={`${intl.formatMessage({ id: 'common.qingxuanze' })}${intl.formatMessage({ id: 'mt.daidanzhanghu' })}`}
          labelRender={(item) => (
            <span className=" flex flex-row gap-2.5 items-center justify-between">
              <span className="flex flex-row justify-between items-center gap-1.5 ">
                <AccountTag type="meifen" />
                <span>{item.value}</span>
              </span>
              <span className=" text-sm !font-dingpro-medium"> 231.3 USD</span>
            </span>
          )}
          options={accountList.map((item) => ({
            ...item,
            value: item.id,
            label: `${item.name} #${hiddenCenterPartStr(item?.id, 4)}`
          }))}
        /> */}
        <div className="hide-form-item">
          <ProFormText name="leadId" rules={[{ required: true, message: intl.formatMessage({ id: 'mt.xitongcuowu' }) }]} />
        </div>

        <ProFormSelect
          name="tradeAccountId"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'common.qingxuanze' })
            }
          ]}
          fieldProps={{
            disabled: true,
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
                          <AccountTag size="auto" color={item.groupName} code={item.groupCode}>
                            {/* {item.groupName} */}
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
          placeholder={`${intl.formatMessage({ id: 'common.qingxuanze' })}${intl.formatMessage({ id: 'mt.daidanzhanghu' })}`}
          // options={accountList}
          options={accountList.map((item) => ({
            ...item,
            value: item.id,
            label: `${item.name} #${hiddenCenterPartStr(item?.id, 4)}`
          }))}
        />
      </div>
      {/* 名称 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-primary">
          <FormattedMessage id="mt.mingcheng" />
        </span>
        <ProFormText
          name="projectName"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'common.qingshuru' })
            },
            {
              pattern: /^.{1,10}$/,
              message: intl.formatMessage({ id: 'mt.qingxianzhizaishigezifuyinei' })
            }
          ]}
          fieldProps={{
            size: 'large',
            style: {
              width: '100%',
              height: '2.8125rem',
              lineHeight: '2.8125rem'
            },
            count: {
              show: true,
              max: 10
            },
            placeholder: `${intl.formatMessage({ id: 'common.qingshuru' })}${intl.formatMessage({ id: 'mt.mingcheng' })}`
          }}
        />
      </div>
      {/* 介绍 */}
      <div className="flex flex-col  justify-between gap-2.5 w-full max-w-full">
        <span className=" text-sm font-normal text-primary">
          <FormattedMessage id="mt.jieshao" />
        </span>
        <ProFormTextArea
          name="desc"
          rules={[
            {
              required: true,

              message: intl.formatMessage({ id: 'common.qingshuru' })
            },
            {
              pattern: /^.{1,200}$/,
              message: intl.formatMessage({ id: 'mt.qingxianzhizailiangbaizifuyinei' })
            }
          ]}
          fieldProps={{
            placeholder: `${intl.formatMessage({ id: 'common.qingshuru' })}${intl.formatMessage({ id: 'mt.jieshao' })}`,
            maxLength: 200,
            count: {
              show: true,
              max: 200
            }
          }}
        ></ProFormTextArea>
      </div>
      {/* 保存 */}
      <div className=" justify-self-end flex flex-col items-start justify-between gap-2.5 w-[532px] max-w-full">
        <Button
          height={48}
          type="primary"
          style={{
            width: '100%',
            borderRadius: 8
          }}
          onClick={() => {
            // todo 跳转
            form.submit()
          }}
        >
          <div className=" flex items-center gap-1">
            <span className=" font-semibold text-base ">
              <FormattedMessage id="common.baocun" />
            </span>
          </div>
        </Button>
      </div>
    </div>
  )
}
