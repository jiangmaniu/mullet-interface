import { history } from '@umijs/max'
import { NavBar, NavBarProps } from 'antd-mobile'

import Iconfont from '@/components/Base/Iconfont'

type IProps = NavBarProps & {
  title?: React.ReactNode
  onBack?: () => void
}

// 移动端公共导航组件
function Header({ title, onBack, ...res }: IProps) {
  return (
    <NavBar
      backArrow={
        <Iconfont
          name="fanhui"
          width={30}
          height={30}
          onClick={() => {
            onBack?.()
            history.back()
          }}
        />
      }
      {...res}
    >
      {title}
    </NavBar>
  )
}

export default Header
