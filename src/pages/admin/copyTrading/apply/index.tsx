import Logo from '@/components/Admin/Header/Logo'
import { HeaderRightContent } from '@/components/Admin/RightContent'
import Button from '@/components/Base/Button'

// 申请成为带单员
export default function Apply() {
  return (
    <div>
      <div className="flex items-center justify-between px-4 fixed top-0 left-0 w-full z-30 bg-white">
        <Logo />
        <HeaderRightContent key="content" isAdmin />
      </div>
      <div className="h-[57px]"></div>
      <div className="bg-gray-50 w-[623px] mx-auto h-[988px] mt-8 flex justify-center p-6">
        <div>申请成为带单员</div>
        <Button href="/copy-trading">返回跟单页</Button>
      </div>
    </div>
  )
}
