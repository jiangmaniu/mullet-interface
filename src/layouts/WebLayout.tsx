import { Outlet, useLocation } from '@umijs/max'
import classNames from 'classnames'

// import Footer from '@/components/Web/Footer'
import Header from '@/components/Web/Header'

export default function WebLayout() {
  const { pathname } = useLocation()
  const isTradeLayout = pathname.indexOf('/trade') !== -1

  if (isTradeLayout) {
    return (
      <div className="dark:bg-dark-page">
        <Header />
        <Outlet />
      </div>
    )
  }

  return (
    <div className='bg-[url("/img/bg.png")] bg-[length:100%_100%] bg-no-repeat'>
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
