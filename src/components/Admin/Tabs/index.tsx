import { useEmotionCss } from '@ant-design/use-emotion-css'
import { TabsProps } from 'antd'
import classNames from 'classnames'
import { TabBarExtraContent } from 'rc-tabs/lib/interface'
import React, { useEffect, useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import TabsScroll from '@/components/Base/TabsScroll'
import { colorTextPrimary, colorTextSecondary } from '@/theme/theme.config'

import TabsComp from '../../Base/Tabs'

export type ITabItem = {
  label: React.ReactNode | string
  tab?: React.ReactNode | string // 处理过的tab
  key: string
  icon?: React.ReactNode | string
  iconWidth?: number
  iconHeight?: number
}

interface IProps extends TabsProps {
  tabList?: ITabItem[]
  onChangeTab?: (activeKey: string, activeLabel: string) => void
  tabBarStyle?: React.CSSProperties
  tabBarExtraContent?: TabBarExtraContent
  /**@name 隐藏tabbar下划线  */
  hiddenTabbarLine?: boolean
  /**@name 隐藏tabbar底部分割长线  */
  hiddenBottomLine?: boolean
  /**显示顶部tabbar选中下划线 */
  showTopTabLine?: boolean
  tabBarGutter?: number
  /**展示移动端Tabs组件 */
  showMobileTabs?: boolean
  tabPaddingBottom?: number
  marginBottom?: number
}

export default function Tabs({
  onChangeTab,
  tabList = [],
  tabBarStyle,
  tabBarExtraContent,
  hiddenTabbarLine,
  activeKey,
  type,
  tabBarGutter,
  showMobileTabs = false,
  tabPaddingBottom,
  hiddenBottomLine = true,
  marginBottom,
  ...res
}: IProps) {
  const [tabItems, setTabItems] = useState<ITabItem[]>([])
  const [tabKey, setTabKey] = useState(tabList[0]?.key || '')

  const hoverClassName = useEmotionCss(({ token }) => {
    return {
      '&:hover svg': {
        fill: `${colorTextPrimary} !important`
      },
      '&:hover span': {
        color: `${colorTextPrimary} !important`
      }
    }
  })

  useEffect(() => {
    let tabLabel: any = ''
    if (tabList.length) {
      const item = tabList.find((item) => item.key === tabKey) || ({} as ITabItem)
      tabLabel = item.label

      setTabItems(
        tabList.map((v: ITabItem) => {
          let tab = v.label
          if (v.icon && typeof v.icon === 'string') {
            const isActive = tabKey === v.key
            const color = isActive ? colorTextPrimary : colorTextSecondary

            tab = (
              <span
                className={classNames('flex justify-center items-center', hoverClassName)}
                onClick={() => {
                  if (showMobileTabs) {
                    handleChange(v.key)
                  }
                }}
              >
                <Iconfont name={v.icon} width={v.iconWidth || 26} color={color} height={v.iconHeight || 26} hoverColor={colorTextPrimary} />
                <span className="font-bold pl-1 text-base" style={{ color }}>
                  {v.label}
                </span>
              </span>
            )
          }

          return {
            ...v,
            tab
          }
        })
      )
    }
  }, [tabList])

  // 外部传入的key激活
  useEffect(() => {
    console.log('tabList')
    setTabKey(activeKey ?? tabList[0]?.key)
  }, [activeKey, tabList])

  const handleChange = (activeKey: string) => {
    setTabKey(activeKey)
    const activeLabel = tabList.find((v) => v.key === activeKey)?.label as string
    onChangeTab?.(activeKey, activeLabel)
  }

  // 自定义切换卡片
  if (type === 'card') {
    return (
      <>
        {tabItems.length > 0 && (
          <div className="flex custom-tabbar-card border-gray-150 border-b">
            {tabItems.map((item, idx) => (
              <div
                key={idx}
                className={classNames(
                  'min-w-[186px] relative hover:text-primary cursor-pointer border-gray-150 border-l border-t border-r flex items-center justify-center text-base rounded-t-2xl h-[50px] font-semibold',
                  item.key === tabKey ? 'bg-white !border-b-0 text-primary !z-[50]' : 'bg-[#F8FBFD] text-secondary'
                )}
                style={{ zIndex: tabItems.length - idx, left: -16 * idx, ...tabBarStyle }}
                onClick={() => handleChange(item.key)}
              >
                {item.tab}
                {item.key === tabKey && <div className="absolute -bottom-[1px] left-0 border-b border-white w-full" />}
              </div>
            ))}
          </div>
        )}
      </>
    )
  }

  return (
    <>
      {tabItems.length > 0 && (
        <>
          {!showMobileTabs && (
            <TabsComp
              items={tabItems.map((item, index) => {
                return {
                  label: <>{item.tab}</>,
                  key: String(item.key)
                }
              })}
              // tabBarGutter={60}
              activeKey={tabKey}
              tabBarStyle={{ paddingLeft: 20, height: 50, marginBottom: 0, ...tabBarStyle }}
              onChange={(activeKey: string) => {
                handleChange(activeKey)
              }}
              tabBarExtraContent={tabBarExtraContent}
              className={classNames({
                'custom-tabbar': hiddenTabbarLine
              })}
              hiddenBottomLine={hiddenBottomLine}
              tabBarGutter={tabBarGutter}
              marginBottom={marginBottom}
              {...res}
            />
          )}
          {showMobileTabs && (
            <TabsScroll
              tabList={tabItems.map((item, idx) => {
                return {
                  key: item.key,
                  title: item.tab
                }
              })}
              tabBarGutter={tabBarGutter}
              hiddenBottomLine={hiddenBottomLine}
              hiddenTabbarLine={hiddenTabbarLine}
              tabPaddingBottom={tabPaddingBottom || 18}
              activeKey={tabKey}
              style={{ '--active-line-height': '4px', ...tabBarStyle }}
            />
          )}
        </>
      )}
    </>
  )
}
