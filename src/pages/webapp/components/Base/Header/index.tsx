import { NavBar, NavBarProps } from 'antd-mobile'

import Iconfont from '@/components/Base/Iconfont'

type IProps = NavBarProps & {
  title?: React.ReactNode
  onBack?: () => void
  back?: boolean
  left?: React.ReactNode
}

// 移动端公共导航组件
function Header({ title, onBack, back = true, left, ...res }: IProps) {
  return (
    <NavBar
      backIcon={false}
      back={
        <>
          {left ? (
            left
          ) : back ? (
            <Iconfont
              name="fanhui"
              width={36}
              height={36}
              onClick={() => {
                onBack?.()
                history.back()
              }}
            />
          ) : null}
        </>
      }
      {...res}
    >
      {title}
    </NavBar>
  )
}

export default Header
