import './index.less'

import { ProFormDateRangePicker } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl, useModel, useSearchParams } from '@umijs/max'
import { Segmented } from 'antd'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import ProFormSelect from '@/components/Admin/Form/ProFormSelect'
import PageContainer from '@/components/Admin/PageContainer'
import { useStores } from '@/context/mobxProvider'

import Deposit from './comp/Deposit'
import Transfer from './comp/Transfer'
import Withdrawal from './comp/Withdrawal'

export type IParams = {
  startTime?: string
  endTime?: string
  accountId: any
}

type ITabKey = 'deposit' | 'withdrawal' | 'transfer'

export default function Record() {
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList || []
  const { ws, trade } = useStores()

  const [tabKey, setTabKey] = useState<ITabKey>('transfer')
  const intl = useIntl()
  const [params, setParams] = useState({} as IParams)
  const [searchParams] = useSearchParams()
  const searchKey = searchParams.get('key') as ITabKey

  useEffect(() => {
    setParams({ ...params, accountId: accountList?.[0]?.id })
  }, [accountList])

  useEffect(() => {
    if (searchKey) {
      setTabKey(searchKey)
    }
  }, [searchKey])

  const filterClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-select-selector,.ant-picker-range': {
        borderRadius: '16px !important'
      }
    }
  })

  return (
    <PageContainer pageBgColorMode="white" fluidWidth>
      <div className="text-[24px] font-bold text-primary mb-7">
        <FormattedMessage id="mt.churujinjilu" />
      </div>

      <div className="flex items-center justify-between my-4 flex-wrap gap-y-4">
        <Segmented
          className="account"
          onChange={(key: any) => {
            setTabKey(key)
          }}
          value={tabKey}
          options={[
            { label: <FormattedMessage id="mt.rujin" />, value: 'deposit' },
            { label: <FormattedMessage id="mt.chujin" />, value: 'withdrawal' },
            { label: <FormattedMessage id="mt.huazhuan" />, value: 'transfer' }
          ]}
          style={{ width: 300 }}
          block
        />
        <div className={classNames('flex items-center gap-x-3', filterClassName)}>
          <ProFormSelect
            options={accountList.filter((item) => !item.isSimulate).map((item) => ({ ...item, value: item.id, label: item.name }))}
            placeholder={intl.formatMessage({ id: 'mt.xuanzezhanghu' })}
            fieldProps={{
              value: params.accountId,
              allowClear: false,
              size: 'middle',
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
                const startTime = value ? dayjs(value[0]).format('YYYY-MM-DD') + ' 00:00:00' : undefined
                const endTime = value ? dayjs(value[1]).format('YYYY-MM-DD') + ' 23:59:59' : undefined
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
      {tabKey === 'deposit' && <Deposit params={params} />}
      {tabKey === 'withdrawal' && <Withdrawal params={params} />}
      {tabKey === 'transfer' && <Transfer params={params} />}
    </PageContainer>
  )
}
