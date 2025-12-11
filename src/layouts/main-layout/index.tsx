// import GlobalBg from './_layout/bg'
import { MainLayoutHeader } from './_layout/header'
// import { PageLoadingWrapper } from './_layout/page-loading-wrapper'
import React from 'react'

import { Outlet } from '@umijs/max'
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    // <PageLoadingWrapper>
    <div className="relative flex min-h-screen flex-col bg-secondary">
      <MainLayoutHeader />

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
