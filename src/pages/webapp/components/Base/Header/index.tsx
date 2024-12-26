import { NavBar, NavBarProps } from 'antd-mobile'

import Iconfont from '@/components/Base/Iconfont'
import { onBack as handleBack } from '@/utils/navigator'
import { useEmotionCss } from '@ant-design/use-emotion-css'

type IProps = NavBarProps & {
  title?: React.ReactNode
  onBack?: () => void
  /**是否展示返回箭头 */
  back?: boolean
}

// 移动端公共导航组件
function Header({ title, onBack, back = true, ...res }: IProps) {
  const className = useEmotionCss(({ token }) => {
    return {
      '.adm-nav-bar-back-arrow': {
        display: 'flex',
        alignItems: 'center'
      },
      '.adm-nav-bar-back': {
        display: back ? 'flex' : 'none'
      }
    }
  })

  return (
    <NavBar
      backArrow={
        <>
          {back && (
            <Iconfont
              name="fanhui"
              width={30}
              height={30}
              onClick={() => {
                if (onBack) {
                  onBack()
                } else {
                  handleBack()
                }
              }}
            />
          )}
        </>
      }
      className={className}
      {...res}
    >
      {title}
    </NavBar>
  )
}

export default Header
