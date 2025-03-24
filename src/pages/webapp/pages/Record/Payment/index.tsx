import { useTheme } from '@/context/themeProvider'
import { getEnv } from '@/env'
import Header from '@/pages/webapp/components/Base/Header'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { push } from '@/utils/navigator'
import { appendHideParamIfNeeded } from '@/utils/request'
import { useIntl, useModel, useSearchParams } from '@umijs/max'
import { useTitle } from 'ahooks'
import { Segmented } from 'antd'
import { useEffect, useState } from 'react'
import DepositList from './comp/DepositList'
import TransferList from './comp/TransferList'
import WithdrawList from './comp/WithdrawList'

export default function PaymentRecord() {
  const { theme } = useTheme()
  const intl = useIntl()
  const ENV = getEnv()

  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')

  const [key, setKey] = useState('CHUJIN')
  const accountOptions = [
    {
      label: intl.formatMessage({ id: 'mt.chujin' }),
      value: 'CHUJIN'
    },
    {
      label: intl.formatMessage({ id: 'mt.rujin' }),
      value: 'RUJIN'
    },
    ...(!getEnv()?.HIDE_ACCOUNT_TRANSFER
      ? [
          {
            label: intl.formatMessage({ id: 'mt.huazhuan' }),
            value: 'HUAZHUAN'
          }
        ]
      : [])
  ]

  useEffect(() => {
    if (type) {
      setKey(type)
    }
  }, [type])

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  if (!currentUser?.id) {
    return <></>
  }

  useTitle(intl.formatMessage({ id: 'menu.recordPayment' }))

  return (
    <Basiclayout
      fixedHeight
      scrollY
      bgColor="secondary"
      headerColor="secondary"
      style={{ paddingBottom: 80 }}
      footerClassName="flex items-center justify-center"
      header={
        <Header
          title={intl.formatMessage({ id: 'mt.churujinjilu' })}
          style={{
            paddingLeft: 14,
            paddingRight: 14,
            backgroundColor: theme.colors.backgroundColor.secondary
          }}
          // back={back}
        />
      }
    >
      <div className="mt-4">
        <div className="px-[14px]">
          <Segmented
            className="record"
            onChange={(value: any) => {
              setKey(value)
            }}
            value={key}
            options={accountOptions}
            block
          />
        </div>
        {key === 'CHUJIN' && <WithdrawList />}
        {key === 'RUJIN' && (
          <DepositList
            onUpload={(item) => {
              push(appendHideParamIfNeeded(`/app/deposit/otc/${item?.id}`))
            }}
          />
        )}
        {key === 'HUAZHUAN' && <TransferList />}
      </div>
    </Basiclayout>
  )
}
