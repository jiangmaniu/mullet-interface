'use client'

import React from 'react'
import { Toaster } from '../ui/sonner'
import { AppFooter } from './app-footer'
import { AppHeader } from './app-header'

export function AppLayout({ children, links }: { children: React.ReactNode; links: { label: string; path: string }[] }) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <AppHeader links={links} />
        <main className="flex-grow container mx-auto p-4">{children}</main>
        <AppFooter />
      </div>
      <Toaster />
    </>
  )
}
