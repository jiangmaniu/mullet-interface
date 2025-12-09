import { Outlet, useLocation } from '@umijs/max'
import { observer } from 'mobx-react-lite'

// import Footer from '@/components/Web/Footer'
import Header from '@/components/Web/Header'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'

import { useEmotionCss } from '@ant-design/use-emotion-css'

function WebLayout() {
  const { isPc, isMobileOrIpad } = useEnv()
  const { pathname } = useLocation()
  const { global } = useStores()
  const isTradeLayout = pathname.indexOf('/trade') !== -1

  const bgClassName = useEmotionCss(() => {
    return {
      // backgroundImage: 'linear-gradient(279deg, rgba(51, 85, 199, 0) 20%, rgba(51, 85, 199, 0.4) 49%, rgba(51, 85, 199, 0) 82%)',
      backgroundColor: '#0E123A'
    }
  })

  if (isTradeLayout) {
    return (
      <div className="bg-primary">
        <Header />
        <Outlet />
      </div>
    )
  }

  return (
    <div className="">
      <Header />
      123123
      <div
      // className={classNames('pt-24 pb-24 max-myxl:pb-14 min-h-screen mx-auto', {
      //   'myxl:w-[1300px]': pathname !== '/'
      // })}
      >
        <Outlet />
      </div>
      {/* <Footer /> */}
      <div className={`flex items-end fixed inset-0 -z-40 ${bgClassName}`}>
        <img src="/img/new/common/bg.svg" alt="bg" className="h-full object-cover" />
      </div>
    </div>
  )
}
export default observer(WebLayout)
