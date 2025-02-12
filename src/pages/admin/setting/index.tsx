import { FormattedMessage, useModel, useSearchParams } from '@umijs/max'
import { useEffect, useState } from 'react'

import PageContainer from '@/components/Admin/PageContainer'
import Address from './Address'
import Security from './Security'

export default function Setting() {
  const { fetchUserInfo } = useModel('user')

  const tabList = [
    {
      label: <FormattedMessage id="mt.anquanshezhi" />,
      key: 'security'
    },
    {
      label: <FormattedMessage id="mt.chujindizhi" />,
      key: 'address'
    }
  ]

  const [tabKey, setTabKey] = useState('security')

  const [searchParams] = useSearchParams()
  const key = searchParams.get('key') as string

  useEffect(() => {
    key && setTabKey(key)
  }, [key])

  useEffect(() => {
    // 刷新用户信息
    fetchUserInfo(false)
  }, [])

  return (
    <PageContainer
      pageBgColorMode="white"
      fluidWidth
      tabList={tabList}
      renderHeader={() => (
        <div className="text-[24px] font-bold text-primary">
          <FormattedMessage id="mt.shezhi" />
        </div>
      )}
      onChangeTab={(activeKey) => {
        setTabKey(activeKey)
      }}
      tabActiveKey={tabKey}
    >
      {tabKey === 'security' && <Security />}
      {tabKey === 'address' && <Address />}
    </PageContainer>
  )
}
