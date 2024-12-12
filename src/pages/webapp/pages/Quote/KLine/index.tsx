import { useRef } from 'react'

export default function KLine() {
  const sidebarRef = useRef()
  const buyAndSellRef = useRef<any>(null)

  return <div className="min-h-[100vh] bg-white">K线页面</div>
}
