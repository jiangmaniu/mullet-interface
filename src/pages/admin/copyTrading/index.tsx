import './style.less'

import { FormattedMessage, history, useModel } from '@umijs/max'
import classNames from 'classnames'
import _ from 'lodash'
import { useEffect, useMemo, useState } from 'react'

import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'
import Hidden from '@/components/Base/Hidden'
import { useUpdateFollowStatus } from '@/hooks/useUpdateFollowStatus'
import { shadeColor } from '@/utils/color'
import { push } from '@/utils/navigator'

import CopyTrading from './comp/CopyTrading'
import Square from './comp/Square'
import Take from './comp/Take'

// 跟单管理
export default function copyTrading() {
  const { initialState } = useModel('@@initialState')
  const updateFollowStatus = useUpdateFollowStatus()

  const currentUser = initialState?.currentUser

  // tab持久化
  const hash = history.location.hash?.replace(/^#/, '')

  const [tabKey, setTabKey] = useState(hash || 'square')

  const toSquare = () => {
    setTabKey('square')
  }

  const tabList = [
    {
      label: <FormattedMessage id="mt.gendanguangchang" />,
      key: 'square',
      icon: 'gendanguangchang', // 填写iconfont的name，不要icon-前缀
      iconWidth: 22,
      iconHeight: 22,
      component: <Square active={tabKey === 'square'} />
    },
    {
      label: <FormattedMessage id="mt.gendanguanli" />,
      key: 'copyTrading',
      icon: 'gendanguanli',
      iconWidth: 22,
      iconHeight: 22,
      component: <CopyTrading active={tabKey === 'copyTrading'} toSquare={toSquare} />
    },
    {
      label: <FormattedMessage id="mt.daidanguanli" />,
      key: 'take',
      icon: 'daidanguanli',
      iconWidth: 22,
      iconHeight: 22,
      component: <Take active={tabKey === 'take'} />
    }
  ]

  const [scrollY, setScrollY] = useState(0)
  const fadeHeight = 72 // 当滚动条向下移动 fadeHeight 的时候 banner 收起

  const hideBanner = useMemo(() => scrollY >= fadeHeight, [scrollY])

  const handleScroll = _.debounce(
    () => {
      // 获取滚动条距离视口顶部的高度
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      setScrollY(scrollTop)
    },
    50,
    {
      leading: true,
      trailing: true
    }
  )

  useEffect(() => {
    // 绑定滚动事件
    window.addEventListener('scroll', handleScroll)

    // 更新賬號的跟單狀態
    updateFollowStatus()

    // 清除滚动事件监听器
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <PageContainer
      pageBgColorMode="white"
      fluidWidth
      tabList={tabList}
      tabPersistence={true}
      renderHeader={() => (
        <div
          className={classNames([
            'w-full mb-5.5 cursor-pointer h-[5rem] bg-no-repeat bg-contain px-[1.125rem] py-4 flex items-center ',
            hideBanner && 'animate-fade-out-up'
          ])}
          style={{
            backgroundImage: 'url(/img/gendan-banner.png)',
            backgroundSize: '100% 100%'
          }}
        >
          <div
            className="p-[1px] rounded-xl xl:h-[50px] h-[46px] w-[10rem] ml-auto hover:bg-transparent "
            style={{
              background: 'linear-gradient(315deg, rgba(236, 236, 236, 0.61), rgba(255, 255, 255, 1))'
            }}
          >
            <Button
              type="primary"
              className="lijicanjia"
              height={48}
              style={{
                background: shadeColor('#183efc', 50),
                width: '100%',
                borderRadius: 12
              }}
              onClick={() => {
                // todo 跳转
                push('/copy-trading/apply')
              }}
            >
              <span className=" font-pf-bold">
                <FormattedMessage id="mt.lijicanjia" />
              </span>
            </Button>
          </div>
        </div>
      )}
      headerWrapperStyle={{ height: hideBanner ? 50 : 160, transition: 'height 0.25s linear' }}
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
