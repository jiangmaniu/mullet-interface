import { PageContainerProps } from '@ant-design/pro-components'
import { history, useModel, useSelectedRoutes } from '@umijs/max'
import { TabBarExtraContent } from 'rc-tabs/lib/interface'
import { useEffect, useState } from 'react'

import { useEnv } from '@/context/envProvider'
import { cn } from '@/utils/cn'
import { push } from '@/utils/navigator'

import Tabs, { ITabItem } from '../Tabs'
import { Iconify } from '@/libs/ui/components/icons'
import { IconButton } from '@/libs/ui/components/button'

interface IProps {
  children: React.ReactNode
  contentStyle?: React.CSSProperties
  style?: React.CSSProperties
  /**页面背景颜色 */
  pageBgColorMode?: 'white' | 'gray'
  /**是否固定头部区域 */
  fixedHeader?: boolean
  /**自定义渲染头部区域 */
  renderHeader?: () => React.ReactNode
  /**返回按钮标题 */
  backTitle?: React.ReactNode
  /**左右间距使用百分百，不固定宽度 */
  fluidWidth?: boolean
  backUrl?: string
  backStyle?: React.CSSProperties
  tabList?: ITabItem[]
  tabActiveKey?: string
  /** 持久化 tab 當前值 */
  tabPersistence?: boolean
  tabBarExtraContent?: TabBarExtraContent
  onChangeTab?: (activeKey: string, activeLabel: string) => void
  headerWrapperStyle?: React.CSSProperties
}
export default function PageContainer({
  children,
  contentStyle,
  pageBgColorMode,
  fixedHeader = true,
  renderHeader,
  backTitle,
  fluidWidth,
  backUrl,
  backStyle,
  style = {},
  tabList = [],
  tabActiveKey,
  tabPersistence,
  tabBarExtraContent,
  onChangeTab,
  headerWrapperStyle
}: IProps & PageContainerProps) {
  const { setPageBgColor } = useModel('global')
  const { isMobileOrIpad, isMobile } = useEnv()
  const routes = useSelectedRoutes()
  const [tabKey, setTabKey] = useState(tabList[0]?.key || '')

  const onSetTabKey = (tabKey: string) => {
    setTabKey(tabKey)

    if (tabPersistence) {
      // 配置到路由錨點中
      // push(`${backPath}#${tabKey}`)
      const { pathname, search } = history.location
      history.push(`${pathname}${search}#${tabKey}`)
    }
  }

  const lastRoute = routes
    .at(-1)
    ?.pathname?.split('/')
    .filter((v) => v)
    .filter((item) => !['zh-TW', 'en-US', 'vi-VN'].includes(item))

  const backPath = lastRoute
    ?.filter((v) => v)
    ?.slice(0, -1)
    .join('/')

  useEffect(() => {
    setPageBgColor(pageBgColorMode === 'white' ? 'var(--color-white)' : 'var(--bg-base-gray)')
  }, [pageBgColorMode])

  useEffect(() => {
    if (tabActiveKey) {
      setTabKey(tabActiveKey)
    }
  }, [tabActiveKey])

  const headerStyle: React.CSSProperties = {
    ...(tabList.length
      ? {
          height: 108,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end'
        }
      : {}),
    ...headerWrapperStyle
  }

  return (
    <div style={{ ...style }}>
      {/* 头部区域 */}
      {renderHeader && (
        <div
          style={{
            overflow: 'hidden',
            height: 70,
            borderBottom: '1px solid rgba(218, 218, 218, .3)',
            ...headerStyle
            // paddingInline: '9.5%'
          }}
          className={cn('flex items-center bg-navigation backdrop-blur-base justify-center', {
            'sticky top-[60px] z-[10]': fixedHeader
          })}
        >
          <div className={cn('xl:w-1300 w-1120 mx-4', !fluidWidth ? 'm-auto' : '')}>
            <div className="flex flex-col items-start">
              {renderHeader?.()}
              <Tabs
                tabList={tabList}
                activeKey={tabKey}
                tabBarGutter={57}
                tabBarStyle={{ paddingLeft: 0 }}
                onChangeTab={(activeKey, activeLabel) => {
                  onSetTabKey(activeKey)
                  onChangeTab?.(activeKey, activeLabel)
                }}
                tabBarExtraContent={tabBarExtraContent}
                marginBottom={0}
                // indicator={{ size: 64 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 返回按钮 */}
      {backTitle && backPath && (
        <div
          className={cn('py-2 md:py-3 flex items-center px-5 md:px-6 justify-center sticky top-[66px] z-10')}
          style={{ background: pageBgColorMode === 'white' ? '#fff' : 'var(--bg-base-gray)', ...backStyle }}
        >
          <div className="flex items-center relative -left-2 xl:w-1300 w-1120 mx-0 md:mx-4">
            <IconButton
              onClick={() => {
                push(backUrl || `/${backPath}`)
              }}
            >
              <Iconify icon={'iconoir:arrow-left'} className="size-5" />
            </IconButton>
            <div className="text-[24px] font-bold ml-1 md:ml-3 w-full">{backTitle}</div>
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <div style={contentStyle} className={cn('py-7 flex items-center justify-center', 'px-6')}>
        <div className="w-1120 xl:w-1300 ">{children}</div>
      </div>
    </div>
  )
}
