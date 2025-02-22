import { useTheme } from '@/context/themeProvider'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { useIntl, useSearchParams } from '@umijs/max'
import { Segmented } from 'antd'
import { useEffect, useState } from 'react'
import DepositList from '../Payment/comp/DepositList'
import TransferList from '../Payment/comp/TransferList'
import WithdrawList from '../Payment/comp/WithdrawList'

export default function PaymentRecord() {
  const { theme } = useTheme()
  const intl = useIntl()

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
    {
      label: intl.formatMessage({ id: 'mt.huazhuan' }),
      value: 'HUAZHUAN'
    }
  ]

  useEffect(() => {
    if (type) {
      setKey(type)
    }
  }, [type])

  const onUpload = (item: any) => {
    // @ts-ignore
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'push',
        params: {
          path: '/webview/deposit/otc',
          query: {
            id: item?.id
          }
        }
      })
    )
  }

  return (
    <Basiclayout
      fixedHeight
      scrollY
      bgColor="secondary"
      headerColor="secondary"
      style={{ paddingBottom: 80 }}
      footerClassName="flex items-center justify-center"
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
        {key === 'RUJIN' && <DepositList onUpload={onUpload} />}
        {key === 'HUAZHUAN' && <TransferList />}
      </div>
    </Basiclayout>
  )
}
