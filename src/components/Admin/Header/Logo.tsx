import { useTheme } from '@/context/themeProvider'
import ENV from '@/env/config'
import { useModel } from '@umijs/max'

export default function Logo({
  textColor = '#231916',
  iconColor1 = '#00A29A',
  iconColor2 = '#183EFC'
}: {
  textColor?: string
  iconColor1?: string
  iconColor2?: string
}) {
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const { theme } = useTheme()

  return (
    // <img
    //   src={ENV.logo}
    //   alt="logo"
    //   onClick={() => {
    //     push(WEB_HOME_PAGE)
    //   }}
    //   className="!h-[48px] w-[171px]"
    // />
    <span
      className="!h-[auto] w-[171px] cursor-default"
      onClick={(e) => {
        e.stopPropagation()
        // if (STORAGE_GET_TOKEN()) {
        //   if (!currentUser?.accountList?.length) return
        //   push(WEB_HOME_PAGE)
        // } else {
        //   push('/user/login')
        // }
      }}
    >
      <img className="!h-[48px] w-[171px]" src={theme.isDark ? ENV.logoDark : ENV.logo} alt="logo" />
    </span>
  )
}
