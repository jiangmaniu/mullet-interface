import { HeaderRightContent } from '../RightContent'
import Logo from './Logo'

export default function Header() {
  return (
    <div className="flex items-center justify-between px-4 fixed top-0 left-0 w-full z-30 bg-white">
      <Logo />
      <HeaderRightContent key="content" isAdmin />
    </div>
  )
}
