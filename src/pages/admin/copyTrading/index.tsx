import { FormattedMessage, useModel } from '@umijs/max'
import { useState } from 'react'

import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'
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
        <div
          className="w-full mb-2 cursor-pointer h-[5rem] bg-no-repeat bg-contain px-[1.125rem] py-4 flex items-center "
          style={{
            backgroundImage: 'url(/img/gendan-banner.png)',
            backgroundSize: '100% 100%'
          }}
        >
          <div
            className="p-[1px] rounded-xl xl:h-[50px] h-[46px] w-[10rem] ml-auto "
            style={{
              background: 'linear-gradient(315deg, rgba(236, 236, 236, 0.61), rgba(255, 255, 255, 1))'
            }}
          >
            <Button
              type="primary"
              height={48}
              style={{
                background: 'linear-gradient( 270deg, #8035FE 0%, #183EFC 100%)',
                width: '100%',
                borderRadius: 12
              }}
              onClick={() => {
                // todo 跳转
              }}
            >
              <FormattedMessage id="mt.lijicanjia" />
            </Button>
          </div>
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
