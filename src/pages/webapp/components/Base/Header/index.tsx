import { NavBar, NavBarProps } from 'antd-mobile'

import Iconfont from '@/components/Base/Iconfont'
import useHideHeader from '@/pages/webapp/hooks/useHideHeader'
import { cn } from '@/utils/cn'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { history } from '@umijs/max'

type IProps = NavBarProps & {
  title?: React.ReactNode
  onBack?: () => void
  /**是否展示返回箭头 */
  back?: boolean
  left?: React.ReactNode
}

// 移动端公共导航组件
function Header({ title, onBack, back = true, left, ...res }: IProps) {
  const { isHideHeader } = useHideHeader()
  const className = useEmotionCss(({ token }) => {
    return {
      '.adm-nav-bar-back-arrow': {
        display: 'flex',
        alignItems: 'center'
      },
      '.adm-nav-bar-back': {
        display: back ? 'flex' : 'none'
      },
      '.adm-nav-bar-back span': {
        height: '100%',
        display: 'flex',
        alignItems: 'center'
      },
      '.adm-nav-bar-title': {
        fontWeight: 600
      }
    }
  })

  if (isHideHeader) return <></>

  return (
    <NavBar
      backArrow={<></>}
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
                if (onBack) {
                  onBack()
                } else {
                  history.back()
                }
              }}
            />
          ) : null}
        </>
      }
      className={cn(className)}
      {...res}
    >
      {title}
    </NavBar>
  )
}

export default Header
