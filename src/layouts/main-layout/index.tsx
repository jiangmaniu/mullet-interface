// import GlobalBg from './_layout/bg'
import { MainLayoutHeader } from './_layout/header'
// import { PageLoadingWrapper } from './_layout/page-loading-wrapper'
import React from 'react'
// import Header from '@/components/Web/Header'

import { Outlet } from '@umijs/max'
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    // <PageLoadingWrapper>
    <div className="relative flex min-h-screen flex-col bg-secondary">
      <MainLayoutHeader />
      {/* <Header /> */}

      <div className="flex flex-1">
        <div className="w-full">
          <Outlet />
        </div>
      </div>
      {/* <GlobalBg /> */}
    </div>
    // </PageLoadingWrapper>
  )
}
