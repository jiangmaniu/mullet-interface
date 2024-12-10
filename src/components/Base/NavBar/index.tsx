import { NavBar as AntdNavBar, NavBarProps } from 'antd-mobile'

import Iconfont from '@/components/Base/Iconfont'

type IProps = NavBarProps & {
  title?: React.ReactNode
}

// 移动端公共导航组件
function NavBar({ title, ...res }: IProps) {
  return (
    <AntdNavBar backArrow={<Iconfont name="fanhui" width={30} height={30} />} {...res}>
      {title}
    </AntdNavBar>
  )
}

export default NavBar
