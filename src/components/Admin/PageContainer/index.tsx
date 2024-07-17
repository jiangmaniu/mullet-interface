import { PageContainerProps } from '@ant-design/pro-components'
import { useModel, useSelectedRoutes } from '@umijs/max'
import classNames from 'classnames'
import { TabBarExtraContent } from 'rc-tabs/lib/interface'
import { useEffect, useState } from 'react'

import { useEnv } from '@/context/envProvider'
import { bgColorBase } from '@/theme/theme.config'
import { push } from '@/utils/navigator'

import Tabs, { ITabItem } from '../Tabs'

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
  tabBarExtraContent,
  onChangeTab,
  headerWrapperStyle
}: IProps & PageContainerProps) {
  const { setPageBgColor } = useModel('global')
  const { isMobileOrIpad, isMobile } = useEnv()
  const routes = useSelectedRoutes()
  const [tabKey, setTabKey] = useState(tabList[0]?.key || '')

  const lastRoute = routes
    .at(-1)
    ?.pathname?.split('/')
    .filter((v) => v)
    .filter((item) => !['zh-TW', 'en-US'].includes(item))

  const backPath = lastRoute
    ?.filter((v) => v)
    ?.slice(0, -1)
    .join('/')

  useEffect(() => {
    setPageBgColor(pageBgColorMode === 'white' ? '#fff' : bgColorBase)
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
            background: '#fff',
            height: 70,
            borderBottom: '1px solid rgba(218, 218, 218, .3)',
            ...headerStyle
            // paddingInline: '9.5%'
          }}
          className={classNames('flex items-center', {
            'sticky top-[66px] z-[99]': fixedHeader
          })}
        >
          <div className={classNames('w-[1120px]', !fluidWidth ? 'm-auto' : '')}>
            <div className="flex flex-col items-start">
              {renderHeader?.()}
              <Tabs
                tabList={tabList}
                activeKey={tabKey}
                tabBarGutter={57}
                tabBarStyle={{ paddingLeft: 0 }}
                onChangeTab={(activeKey, activeLabel) => {
                  setTabKey(activeKey)
                  onChangeTab?.(activeKey, activeLabel)
                }}
                tabBarExtraContent={tabBarExtraContent}
                marginBottom={0}
                indicator={{ size: 45 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 返回按钮 */}
      {backTitle && backPath && (
        <div
          className={classNames('pt-7 flex items-center px-6 justify-center sticky top-[66px] z-10')}
          style={{ background: pageBgColorMode === 'white' ? '#fff' : bgColorBase, ...backStyle }}
        >
          <div className="flex items-center relative -left-2 w-[1120px]">
            <div
              className="hover:bg-gray-150 rounded-full cursor-pointer"
              onClick={() => {
                push(backUrl || `/${backPath}`)
              }}
            >
              <img src="/img/uc/arrow-left.png" width={40} height={40} />
            </div>
            <div className="text-[24px] font-bold ml-3 w-full">{backTitle}</div>
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <div style={contentStyle} className={classNames('py-7 flex items-center justify-center', 'px-6')}>
        <div className="w-[1120px]">{children}</div>
      </div>
    </div>
  )
}
