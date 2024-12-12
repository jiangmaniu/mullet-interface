import { FormattedMessage, Outlet, useLocation } from '@umijs/max'
import { useEffect } from 'react'

import SwitchLanguage from '@/components/SwitchLanguage'
import { useTheme } from '@/context/themeProvider'

/**
 * 登录、注册、忘记密码页面的布局
 * @returns
 */
export default function UserLayout() {
  const { pathname } = useLocation()
  const { setMode } = useTheme()

  // @TODO 临时设置切换主题，后面删除
  useEffect(() => {
    if (pathname !== '/trade') {
      setMode('light')
    }
  }, [pathname])

  const links = [
    { icon: '/img/uc/app_icon2.svg' },
    { icon: '/img/uc/app_icon3.svg' },
    { icon: '/img/uc/app_icon4.svg' },
    { icon: '/img/uc/app_icon5.svg' },
    { icon: '/img/uc/app_icon6.svg' }
  ]
  return (
    <div className="flex flex-col bg-[url(/img/uc/login-bg.png)] bg-no-repeat bg-[size:100%_100%] h-full overflow-hidden bg-gray-50">
      <div className="flex gap-x-4 justify-end items-center pr-5 pt-3">
        <SwitchLanguage isAdmin={false} />
        <div className="cursor-pointer relative -top-[1px]">
          <img src="/img/uc/kefu.png" width={28} height={28} />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <div className="flex mb-7 justify-center">
        <div className="w-[1200px] flex flex-col items-center justify-center">
          <div className="mb-5">
            {links.map((item, idx) => {
              return (
                <a target="_blank" key={idx} className="inline-block p-4 mr-5">
                  <img src={item.icon} width={28} height={28} />
                </a>
              )
            })}
          </div>
          <div className="text-center text-xs mb-2 text-gray-380">
            <FormattedMessage id="mt.fengxianjinggao" />
            :Digital asset trading is an emerging industry with bright prospects, but it also co
            <br />
            <span>StelluX © 2023Cookie Preferences</span>
          </div>
        </div>
      </div>
    </div>
  )
}
