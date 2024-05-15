import { Outlet } from '@umijs/max'

import SwitchLanguage from '@/components/SwitchLanguage'

/**
 * 登录、注册、忘记密码页面的布局
 * @returns
 */
export default function UserLayout() {
  const links = [
    { icon: '/img/uc/app_icon2.svg' },
    { icon: '/img/uc/app_icon3.svg' },
    { icon: '/img/uc/app_icon4.svg' },
    { icon: '/img/uc/app_icon5.svg' },
    { icon: '/img/uc/app_icon6.svg' }
  ]
  return (
    <div className="flex flex-col bg-[url(/img/uc/login-bg.png)] bg-no-repeat bg-[size:100%_100%] h-screen overflow-hidden bg-gray-50">
      <div className="flex gap-x-4 justify-end items-center pr-5 pt-3">
        <SwitchLanguage isAdmin={false} />
        <div className="cursor-pointer relative -top-[1px]">
          <img src="/img/uc/kefu.png" width={28} height={28} />
        </div>
      </div>
      <Outlet />
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
            風險警告:Digital asset trading is an emerging industry with bright prospects, but it also co
            <br />
            <span>StelluX © 2023Cookie Preferences</span>
          </div>
        </div>
      </div>
    </div>
  )
}
