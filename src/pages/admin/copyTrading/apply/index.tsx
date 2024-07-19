import Header from '@/components/Admin/Header'
import Button from '@/components/Base/Button'

// 申请成为带单员
export default function Apply() {
  return (
    <div>
      <Header />
      <div className="h-[57px]"></div>
      <div className="bg-gray-50 w-[623px] mx-auto h-[988px] mt-8 flex justify-center p-6">
        <div>申请成为带单员</div>
        <Button href="/copy-trading">返回跟单页</Button>
      </div>
    </div>
  )
}
