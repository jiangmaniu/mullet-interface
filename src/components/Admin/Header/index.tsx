import { cn } from '@/utils/cn'

import { HeaderRightContent } from '../RightContent'
import Logo from './Logo'
import { HeaderNav } from './nav'
import { HeaderTheme } from './types'

export default function Header({ classes, theme = 'black' }: { classes?: string; theme?: HeaderTheme }) {
  return (
    <div className={cn('flex items-center justify-between px-4 fixed top-0 left-0 w-full z-30 bg-primary', classes)}>
      <div className="flex gap-2">
        <Logo textColor="white" iconColor1="white" iconColor2="white" />
        <HeaderNav />
      </div>

      <HeaderRightContent key="content" isAdmin theme={theme} />
    </div>
  )
}
