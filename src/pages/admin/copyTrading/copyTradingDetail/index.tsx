import { useModel } from '@umijs/max'
import { useEffect } from 'react'

import { push } from '@/utils/navigator'

import AccountSelect from '../comp/AccountSelect'

export default function CopyTradingDetail() {
  const { setPageBgColor } = useModel('global')

  useEffect(() => {
    // 设置当前页背景颜色
    setPageBgColor('#fff')
  }, [])

  return (
    <div style={{ background: 'linear-gradient(180deg, #F7FDFF 0%, #FFFFFF 100%)' }} className="min-h-screen">
      <div className="w-[1300px] mx-auto mt-6">
        <div className="flex items-center">
          <div
            className="hover:bg-gray-100 rounded-full cursor-pointer"
            onClick={() => {
              push(`/copy-trading`)
            }}
          >
            <img src="/img/uc/arrow-left.png" width={40} height={40} />
          </div>
          <div className="flex items-center w-full gap-x-5">
            <div className="ml-2 flex items-center">
              <img src="/img/gendan.png" width={24} height={24} />
              <div className="text-[20px] font-bold pl-2">跟单管理</div>
            </div>
            <AccountSelect />
          </div>
        </div>
        <div className="mt-7 pl-3">跟单管理-详情页</div>
      </div>
    </div>
  )
}
