import { Outlet, useLocation } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'

// import Footer from '@/components/Web/Footer'
import Header from '@/components/Web/Header'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'

function WebLayout() {
  const { isPc, isMobileOrIpad } = useEnv()
  const { pathname } = useLocation()
  const { global } = useStores()
  const isTradeLayout = pathname.indexOf('/trade') !== -1

  // useSwitchPcOrMobile() // 切换 pc 和移动端布局

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
export default observer(WebLayout)
