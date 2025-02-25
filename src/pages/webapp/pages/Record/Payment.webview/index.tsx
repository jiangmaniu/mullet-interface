import { useTheme } from '@/context/themeProvider'
import { getEnv } from '@/env'
import Header from '@/pages/webapp/components/Base/Header'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { getIntl, useIntl, useSearchParams } from '@umijs/max'
import { Segmented } from 'antd'
import { useEffect, useState } from 'react'
import DepositList from './comp/DepositList'
import TransferList from './comp/TransferList'
import WithdrawList from './comp/WithdrawList'

type IStatusMap = {
  [key in Wallet.IWithdrawalOrderStatus]: {
    text: string
    color: string
    options?: {
      text: string
      fn: () => void
    }
  }
}

export const statusMap: IStatusMap = {
  WAIT: {
    text: getIntl().formatMessage({ id: 'mt.daishenghe' }),
    color: '#9C9C9C'
  },
  SUCCESS: {
    text: getIntl().formatMessage({ id: 'mt.tongguo' }),
    color: '#45A48A'
  },
  RECEIPT: {
    text: getIntl().formatMessage({ id: 'mt.yidaozhang' }),
    color: '#45A48A'
  },
  REJECT: {
    text: getIntl().formatMessage({ id: 'mt.shenheshibai' }),
    color: '#C54747'
  },
  FAIL: {
    text: getIntl().formatMessage({ id: 'mt.shibai' }),
    color: '#C54747'
  }
}

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
    ...(!ENV?.HIDE_CREATE_ACCOUNT
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
        {key === 'RUJIN' && <DepositList />}
        {key === 'HUAZHUAN' && <TransferList />}
      </div>
    </Basiclayout>
  )
}
