import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useModel } from '@umijs/max'
import { observer } from 'mobx-react'

import Iconfont from '@/components/Base/Iconfont'
import SwitchLanguage from '@/components/SwitchLanguage'

import HeaderTabsView from '../HeaderTabsView'
import { Message } from '../RightContent'
import { AvatarDropdown } from '../RightContent/AvatarDropdown'
import Tabs from '../Tabs'

function Nav() {
  const { sidebarCollapsed, setSidebarCollapsed, setTopTabKey, topTabKey, topTabItems } = useModel('global')

  const sidebarWidth = sidebarCollapsed ? 64 : 300
  const sidebarDom = <div style={{ width: sidebarWidth }}></div>
  return (
    <>
      {/* 占位 */}
      <div className="h-[100px]"></div>
      <nav
        className="z-[99] left-0 w-screen fixed bg-white mx-auto px-4 flex flex-col h-[100px]"
        style={{ borderBlockEnd: '1px solid rgba(5, 5, 5, 0.06)' }}
      >
        <div className="flex items-center justify-between h-[64px]">
          <div className="flex">
            {/* 占位 */}
            {sidebarDom}
            <div onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              {sidebarCollapsed ? (
                <MenuUnfoldOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
              ) : (
                <MenuFoldOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
              )}
            </div>
          </div>
          {/* 顶部菜单 */}
          {!!topTabItems.length && (
            <div className="flex-1 h-full flex items-start">
              <Tabs
                tabBarGutter={60}
                hiddenBottomLine
                showTopTabLine
                activeKey={topTabKey}
                tabList={topTabItems}
                hiddenTabbarLine
                onChangeTab={(activeKey) => {
                  setTopTabKey(activeKey)
                }}
              />
            </div>
          )}
          {/* 右侧区域 */}
          <div className="flex justify-end items-center max-w-[600px]">
            <div className="mr-8 flex items-center">
              <Iconfont name="qiehuan-jiaoyishijian" />
              <span className="text-sm texg-gray font-semibold pl-1">GMT+8</span>
            </div>
            <Message />
            <SwitchLanguage isAdmin key="lang" />
            <AvatarDropdown menu={true} />
          </div>
        </div>
        <div className="h-[36px]"></div>
        <div className="flex absolute top-[60px]">
          {sidebarDom}
          <HeaderTabsView />
        </div>
      </nav>
    </>
  )
}

export default observer(Nav)
