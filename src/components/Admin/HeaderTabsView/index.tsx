import { FormattedMessage, useModel } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { MenuInfo } from 'rc-menu/lib/interface'

import Dropdown from '@/components/Base/Dropdown'
import Iconfont from '@/components/Base/Iconfont'
import TabsScroll from '@/components/Base/TabsScroll'
import { useStores } from '@/mobx'
import { colorTextPrimary } from '@/theme/theme.config'
import { replace } from '@/utils/navigator'

import styles from './index.less'

function HeaderTabsView() {
  const { global } = useStores()
  const { sidebarCollapsed } = useModel('global')
  const activeKey = global.currentOpenMenuPath
  const showClose = global.openMenuList.length > 1

  const onMenuClick = (event: MenuInfo) => {
    const { key } = event
    global.closeOpenMenuPath(key)
  }

  return (
    <div className={styles.header_view_tabs} style={{ width: `calc(100vw - ${sidebarCollapsed ? 87 : 323}px)` }}>
      <div className="flex items-center flex-1 w-[92%]">
        <TabsScroll
          activeKey={activeKey}
          tabList={global.openMenuList.map((item, idx) => {
            const isActive = activeKey === item
            const menuPath = item
              .split('/')
              // .filter((v) => v && isNaN(Number(v))) // 排除/test/12 数字的路径，是详情页
              .join('.')

            const isDetail = /\d/gi.test(item) // 是否存在数字，则为详情页路由
            // 父级菜单路径
            const parentPath = item
              .split('/')
              .filter((v) => v && isNaN(Number(v)))
              .join('.')

            return {
              key: item,
              style: { marginRight: 0, paddingBottom: 0 },
              title: (
                <div
                  className={classNames(
                    'flex cursor-pointer items-center group justify-center font-medium border-x px-3 py-[5px] rounded-t-xl',
                    idx > 0 ? '!border-l-0' : '',
                    isActive ? 'bg-primary' : 'border-t border-gray-150 bg-white',
                    {
                      'hover:px-[13px]': showClose
                    }
                  )}
                  onClick={() => {
                    // 设置当前当前的path
                    global.setActiveMenuPath(item)

                    // 跳转菜单
                    replace(item)
                  }}
                  style={{ transition: 'color .5s cubic-bezier(.645,.045,.355,1),padding .5s cubic-bezier(.645,.045,.355,1)' }}
                >
                  <span className={classNames('select-none px-2 text-sm font-semibold', isActive ? 'text-white' : 'text-gray-secondary')}>
                    {<FormattedMessage id={`menu${isDetail ? `.${parentPath}` : menuPath}`} />}
                  </span>
                  <Iconfont
                    name="guanbi"
                    width={0}
                    height={20}
                    color={isActive ? '#fff' : colorTextPrimary}
                    onClick={(e) => {
                      e.stopPropagation()
                      global.removeOpenMenuList(item, idx)
                    }}
                    className={classNames(
                      { 'group-hover:!w-[14px]': showClose },
                      {
                        '!w-[14px]': showClose && isActive
                      }
                    )}
                  />
                </div>
              )
            }
          })}
        />
      </div>
      {showClose && (
        <Dropdown
          menu={{
            selectedKeys: [],
            onClick: onMenuClick,
            items: [
              {
                key: 'all',
                label: <FormattedMessage id="mt.guanbisuoyou" />
              },
              {
                key: 'other',
                label: <FormattedMessage id="mt.guanbiqita" />
              }
            ]
          }}
        >
          <div className="w-[100px] flex items-center justify-end pr-5 cursor-pointer">
            <Iconfont name="gengduo" width={24} height={24} />
            <span className="text-sm font-medium text-gray-secondary">
              <FormattedMessage id="common.more" />
            </span>
          </div>
        </Dropdown>
      )}
    </div>
  )
}

export default observer(HeaderTabsView)
