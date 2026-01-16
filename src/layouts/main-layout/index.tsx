// import GlobalBg from './_layout/bg'
import { MainLayoutHeader } from './_layout/header'
// import { PageLoadingWrapper } from './_layout/page-loading-wrapper'
import React from 'react'
import { ServerWalletsProvider } from '@/context/ServerWalletsProvider'
import { GlobalDepositMonitorProvider } from '@/context/GlobalDepositMonitor'

import { Outlet } from '@umijs/max'

/**
 * MainLayout
 * 🔥 ServerWalletsProvider: 在进入主布局时预加载所有链的钱包地址
 * 🔥 GlobalDepositMonitorProvider: 全局监听充值，持续检测新充值事件
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ServerWalletsProvider>
      <GlobalDepositMonitorProvider>
        <div className="relative flex min-h-screen flex-col bg-secondary">
          <MainLayoutHeader />

          <div className="flex flex-1">
            <div className="w-full">
              <Outlet />
            </div>
          </div>
        </div>
      </GlobalDepositMonitorProvider>
    </ServerWalletsProvider>
  )
}
