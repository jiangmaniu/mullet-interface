import { history } from '@umijs/max'

export default function Logo() {
  return <img src="/logo.svg" alt="logo" onClick={() => history.push('/')} className="!h-[48px] w-[171px]" />
}
