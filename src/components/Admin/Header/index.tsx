import classNames from 'classnames'

import { HeaderRightContent } from '../RightContent'
import Logo from './Logo'
import { HeaderTheme } from './types'

export default function Header({ classes, theme = 'black' }: { classes?: string; theme?: HeaderTheme }) {
  return (
    <div className={classNames('flex items-center justify-between px-4 fixed top-0 left-0 w-full z-30 bg-white', classes)}>
      <Logo textColor="white" iconColor1="white" iconColor2="white" />
      <HeaderRightContent key="content" isAdmin theme={theme} />
    </div>
  )
}
