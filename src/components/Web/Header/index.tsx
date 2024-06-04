import { useModel } from '@umijs/max'
import classNames from 'classnames'

import HeaderTabsView from '@/pages/web/trade/comp/HeaderTabsView'

import Logo from '../../Admin/Header/Logo'
import { HeaderRightContent } from '../../Admin/RightContent'

export default function Header() {
  const { openTradeSidebar } = useModel('global')
  return (
    <>
      <header className="h-[66px] z-[19] bg-transparent"></header>
      <header className="h-[66px] fixed top-0 z-[100] w-full border-b border-[rgba(5,5,5,0.06)] bg-white">
        <div className="px-4 h-[66px] relative flex items-center">
          <div className={classNames('flex items-center', !openTradeSidebar ? 'w-[200px]' : 'w-[284px]')}>
            <div className="flex items-center">
              <a className="flex items-center m-h-[22px] h-full">
                <Logo />
              </a>
            </div>
          </div>
          <div className="flex items-center flex-1">
            <div className="flex-1 h-full">
              <HeaderTabsView />
            </div>
            <div className="min-w-[565px] h-full box-border">
              <div className="h-full">
                <div className="flex items-center justify-end h-full">
                  <HeaderRightContent />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
