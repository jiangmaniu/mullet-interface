import { FormattedMessage, useModel } from '@umijs/max'
import { useState } from 'react'

import PageContainer from '@/components/Admin/PageContainer'

// 跟单管理
export default function copyTrading() {
  const [tabKey, setTabKey] = useState('')
  const [showPersonInfo, setShowPersonInfo] = useState(false)
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const phone = currentUser?.userInfo?.phone

  const tabList = [
    {
      label: <FormattedMessage id="mt.gendanguangchang" />,
      key: 'square',
      icon: 'geren-shezhi' // 填写iconfont的name，不要icon-前缀
    },
    {
      label: <FormattedMessage id="mt.gendanguanli" />,
      key: 'copyTrading',
      icon: 'geren-shezhi'
    },
    {
      label: <FormattedMessage id="mt.daidanguanli" />,
      key: 'take',
      icon: 'geren-shezhi'
    }
  ]

  return (
    <PageContainer
      pageBgColorMode="white"
      fluidWidth
      tabList={tabList}
      renderHeader={() => (
        <div className="w-full mb-2 cursor-pointer">
          <img src="/img/gendan-banner.png" className="w-full h-[80px] bg-gray-100" />
        </div>
      )}
      headerWrapperStyle={{ height: 160 }}
      onChangeTab={(activeKey) => {
        setTabKey(activeKey)
      }}
      tabActiveKey={tabKey}
    >
      <div className="pb-[26px]"></div>
    </PageContainer>
  )
}
