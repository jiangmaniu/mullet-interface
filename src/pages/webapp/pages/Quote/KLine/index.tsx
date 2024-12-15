import { useRef } from 'react'

import Header from '@/pages/webapp/components/Base/Header'

export default function KLine() {
  const sidebarRef = useRef()
  const buyAndSellRef = useRef<any>(null)

  return (
    <div className="min-h-[100vh] bg-white">
      <Header />
      K线页面
    </div>
  )
}
