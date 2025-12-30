// import GlobalBg from './_layout/bg'
import { MainLayoutHeader } from './_layout/header'
// import { PageLoadingWrapper } from './_layout/page-loading-wrapper'
import React from 'react'
// import Header from '@/components/Web/Header'
import { ServerWalletsProvider } from '@/context/ServerWalletsProvider'

import { Outlet } from '@umijs/max'

/**
 * MainLayout
 * 🔥 ServerWalletsProvider: 在进入主布局时预加载所有链的钱包地址
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ServerWalletsProvider>
      <div className="relative flex min-h-screen flex-col bg-secondary">
        <MainLayoutHeader />

        <div className="flex flex-1">
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </ServerWalletsProvider>
  )
}
