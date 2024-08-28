import { ProFormDateRangePicker, ProFormSelect } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Segmented } from 'antd'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useState } from 'react'

import PageContainer from '@/components/Admin/PageContainer'
import { useStores } from '@/context/mobxProvider'

import Transfer from './comp/Transfer'

export default function Record() {
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList || []
  const { ws, trade } = useStores()

  const [tabKey, setTabKey] = useState<'deposit' | 'withdrawal' | 'transfer'>('transfer')
  const intl = useIntl()
  const [selectAccountId, setSelectAccountId] = useState<string>('')
  const [params, setParams] = useState<any>({})

  const filterClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-select-selector,.ant-picker-range': {
        borderRadius: '16px !important'
      }
    }
  })

  console.log('params', params)

  return (
    <PageContainer pageBgColorMode="white" fluidWidth>
      <div className="text-[24px] font-bold text-primary">
        <FormattedMessage id="mt.churujinjilu" />
      </div>
      <div className="flex items-center justify-between my-4">
        <Segmented
          className="account"
          onChange={(key: any) => {
            setTabKey(key)
          }}
          value={tabKey}
          options={[
            { label: <FormattedMessage id="mt.rujin" />, value: 'deposit', disabled: true },
            { label: <FormattedMessage id="mt.chujin" />, value: 'withdrawal', disabled: true },
            { label: <FormattedMessage id="mt.huazhuan" />, value: 'transfer' }
          ]}
          style={{ width: 300 }}
          block
        />
        <div className={classNames('flex items-center gap-x-3', filterClassName)}>
          <ProFormSelect
            options={accountList.map((item) => ({ ...item, value: item.id, label: item.name }))}
            placeholder={intl.formatMessage({ id: 'mt.xuanzezhanghu' })}
            fieldProps={{
              onChange: (value: any) => {
                setParams({
                  ...params,
                  accountId: value
                })
              }
            }}
            width={150}
          />
          <ProFormDateRangePicker
            fieldProps={{
              onChange: (value) => {
                const startTime = value ? dayjs(value[0]).format('YYYY-MM-DD') : undefined
                const endTime = value ? dayjs(value[1]).format('YYYY-MM-DD') : undefined
                setParams({
                  ...params,
                  startTime,
                  endTime
                })
              }
            }}
          />
        </div>
      </div>
      {/* {tabKey === 'deposit' && <Deposit />}
      {tabKey === 'withdrawal' && <Withdrawal />} */}
      {tabKey === 'transfer' && <Transfer params={params} />}
    </PageContainer>
  )
}
