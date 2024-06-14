import { WEB_HOME_PAGE } from '@/constants'
import { push } from '@/utils/navigator'

export default function Logo() {
  return (
    <img
      src="/logo.svg"
      alt="logo"
      onClick={() => {
        push(WEB_HOME_PAGE)
      }}
      className="!h-[48px] w-[171px]"
    />
  )
}
