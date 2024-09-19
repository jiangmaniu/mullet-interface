import { useModel } from '@umijs/max'

import { useTheme } from '@/context/themeProvider'
import { gray } from '@/theme/theme.config'
import { cn } from '@/utils/cn'

import Logo from '../../Admin/Header/Logo'
import { HeaderRightContent } from '../../Admin/RightContent'

export default function Header() {
  const { openTradeSidebar } = useModel('global')
  const { isDark } = useTheme()
  const logoProps = isDark
    ? {
        textColor: 'white',
        iconColor1: 'white',
        iconColor2: 'white'
      }
    : {}

  return (
    <>
      <header className="h-[66px] z-[19] bg-transparent"></header>
      <header
        className="h-[66px] fixed top-0 z-[100] w-full border-b border-[rgba(5,5,5,0.06)] dark:border-[var(--divider-line-color)] bg-primary"
        style={{ background: isDark ? gray[675] : '#fff' }}
      >
        <div className="px-4 h-[66px] relative flex items-center">
          <div className={cn('flex items-center', !openTradeSidebar ? 'w-[200px]' : 'w-[284px]')}>
            <div className="flex items-center">
              <a className="flex items-center m-h-[22px] h-full">
                <Logo {...logoProps} />
              </a>
            </div>
          </div>
          <div className="flex items-center flex-1">
            {/* <div className="flex-1 h-full">
              <HeaderTabsView />
            </div> */}
            <div className="min-w-[565px] h-full box-border flex-1">
              <div className="h-full">
                <div className="flex items-center justify-end h-full">
                  <HeaderRightContent theme={isDark ? 'white' : 'black'} isTrade />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
