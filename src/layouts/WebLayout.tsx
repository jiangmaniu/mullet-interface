import { Outlet, useLocation } from '@umijs/max'
import classNames from 'classnames'

import TabBottomBar from '@/components/H5/TabBottomBar'
// import Footer from '@/components/Web/Footer'
import Header from '@/components/Web/Header'
import { useEnv } from '@/context/envProvider'

export default function WebLayout() {
  const { isPc, isMobileOrIpad } = useEnv()
  const { pathname } = useLocation()
  const isTradeLayout = pathname.indexOf('/trade') !== -1

  if (isMobileOrIpad) {
    // 渲染移动端入口
    return <TabBottomBar />
  }

  if (isTradeLayout) {
    return (
      <div className="bg-primary">
        <Header />
        <Outlet />
      </div>
    )
  }

  return (
    <div className="bg-primary">
      <Header />
      <div
        className={classNames('pt-24 pb-24 max-myxl:pb-14 min-h-screen mx-auto', {
          'myxl:w-[1300px]': pathname !== '/'
        })}
      >
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  )
}
