import { FormattedMessage, useModel } from '@umijs/max'
import { useState } from 'react'

import PageContainer from '@/components/Admin/PageContainer'
import Hidden from '@/components/Base/Hidden'

import CopyTrading from './comp/CopyTrading'
import Square from './comp/Square'
import Take from './comp/Take'

// 跟单管理
export default function copyTrading() {
  const [tabKey, setTabKey] = useState('square')
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  const tabList = [
    {
      label: <FormattedMessage id="mt.gendanguangchang" />,
      key: 'square',
      icon: 'gendanguangchang', // 填写iconfont的name，不要icon-前缀
      component: <Square />
    },
    {
      label: <FormattedMessage id="mt.gendanguanli" />,
      key: 'copyTrading',
      icon: 'gendanguanli',
      component: <CopyTrading />
    },
    {
      label: <FormattedMessage id="mt.daidanguanli" />,
      key: 'take',
      icon: 'daidanguanli',
      component: <Take />
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
      <div className="pb-[26px]">
        {tabList.map((item, idx) => (
          <Hidden show={item.key === tabKey} key={idx}>
            {item.component}
          </Hidden>
        ))}
      </div>
    </PageContainer>
  )
}
