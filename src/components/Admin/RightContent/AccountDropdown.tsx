import { CopyOutlined } from '@ant-design/icons'
import { FormattedMessage, useModel } from '@umijs/max'
import { ConfigProvider, Dropdown } from 'antd'
import { observer } from 'mobx-react'

import Iconfont from '@/components/Base/Iconfont'
import { copyContent, hiddenCenterPartStr } from '@/utils'
import { onLogout, push } from '@/utils/navigator'

import { HeaderTheme } from '../Header/types'

type IProps = {
  /**主题 */
  theme: HeaderTheme
}

// 账户信息下拉框
function AccountDropdown({ theme }: IProps) {
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  return (
    <ConfigProvider
      theme={{
        token: {
          boxShadowSecondary: 'none'
        }
      }}
    >
      <Dropdown
        placement="topRight"
        dropdownRender={(origin) => {
          return (
            <div className="flex flex-col bg-white dark:bg-[var(--dropdown-bg)] w-[290px] z-[800] rounded-xl shadow-dropdown dark:shadow-none dark:border-[--dropdown-border-color] dark:border">
              <div className="flex items-center justify-between w-full px-5 pt-5">
                <div className="flex items-center">
                  <img src="/img/user-icon.png" width={40} height={40} />
                  <div className="flex flex-col pl-[14px]">
                    <span className="text-primary font-semibold">
                      HI,{hiddenCenterPartStr(currentUser?.userInfo?.account, 6)}
                      <span
                        className="pl-1 cursor-pointer"
                        onClick={() => {
                          copyContent(currentUser?.userInfo?.account)
                        }}
                      >
                        <CopyOutlined style={{ fontSize: 14 }} />
                      </span>
                    </span>
                    {currentUser?.isKycAuth && (
                      <span className="text-green text-xs pt-[6px]">
                        <FormattedMessage id="mt.yirenzheng" />
                      </span>
                    )}
                    {!currentUser?.isKycAuth && (
                      <span className="text-red text-xs pt-[6px]">
                        <FormattedMessage id="mt.weirenzheng" />
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    onLogout()
                  }}
                >
                  <img width={22} height={22} src="/img/logout-icon.png" />
                </div>
              </div>
              <div className="p-2">{origin}</div>
            </div>
          )
        }}
        menu={{
          onClick: (e) => {
            const { key } = e
            push(`/${key}`)
          },
          items: [
            {
              label: (
                <div className="py-1">
                  <FormattedMessage id="mt.zhanghu" />
                </div>
              ),
              icon: <Iconfont name="zhanghu" width={20} height={20} color={'var(--color-text-primary)'} />,
              key: 'account'
            },
            {
              label: (
                <div className="py-1">
                  <FormattedMessage id="mt.churujinjilu" />
                </div>
              ),
              icon: <Iconfont name="geren-churujinjilu" width={20} height={20} color={'var(--color-text-primary)'} />,
              key: 'record'
            },
            {
              label: (
                <div className="py-1">
                  <FormattedMessage id="mt.shezhi" />
                </div>
              ),
              icon: <Iconfont name="geren-shezhi" width={20} height={20} color={'var(--color-text-primary)'} />,
              key: 'setting'
            }
          ]
        }}
      >
        <Iconfont
          name="user"
          width={36}
          height={36}
          color={theme}
          className=" cursor-pointer rounded-lg"
          hoverStyle={{
            background: theme === 'black' ? '#fbfbfb' : '#222222'
          }}
        />
      </Dropdown>
    </ConfigProvider>
  )
}

export default observer(AccountDropdown)
