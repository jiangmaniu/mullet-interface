import { PageContainerProps } from '@ant-design/pro-components'
import { useModel, useSelectedRoutes } from '@umijs/max'
import classNames from 'classnames'
import { useEffect } from 'react'

import { useEnv } from '@/context/envProvider'
import { bgColorBase } from '@/theme/theme.config'
import { push } from '@/utils/navigator'

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
  style = {}
}: IProps & PageContainerProps) {
  const { setPageBgColor } = useModel('global')
  const { isMobileOrIpad, isMobile } = useEnv()
  const routes = useSelectedRoutes()

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

  return (
    <div style={{ ...style }}>
      {/* 头部区域 */}
      {renderHeader && (
        <div
          style={{
            overflow: 'hidden',
            background: '#fff',
            height: 70,
            lineHeight: 70,
            borderBottom: '1px solid rgba(218, 218, 218, .3)'
            // paddingInline: '9.5%'
          }}
          className={classNames('flex items-center', {
            'sticky top-[66px] z-[99]': fixedHeader
          })}
        >
          <div className={classNames('w-[1200px]', !fluidWidth ? 'm-auto' : '')}>{renderHeader?.()}</div>
        </div>
      )}

      {/* 返回按钮 */}
      {backTitle && backPath && (
        <div className={classNames('pt-7 flex items-center px-6 justify-center')} style={backStyle}>
          <div className="flex items-center relative -left-2 w-[1200px]">
            <div
              className="hover:bg-gray-100 rounded-full cursor-pointer"
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
        <div className="w-[1200px]">{children}</div>
      </div>
    </div>
  )
}
