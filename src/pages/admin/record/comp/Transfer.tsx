import { FormattedMessage } from '@umijs/max'

import Iconfont from '@/components/Base/Iconfont'

// 划转记录
export default function Transfer({ params }: any) {
  const renderItem = () => {
    return (
      <div className="mb-5">
        <div className="flex items-center pb-2">
          <Iconfont name="shijian1" color={'var(--color-red)'} width={20} height={20} />
          <div className="text-primary pl-1">2023.02.12 12:32:22</div>
        </div>
        <div className="border border-gray-150 rounded-lg px-3 py-5 grid grid-cols-3">
          <div className="flex items-center">
            <div className="bg-gray-125 rounded-full p-2 w-10 h-10 mr-3 flex items-center justify-center">
              <Iconfont name="huazhuan" width={18} height={18} />
            </div>
            <div>
              <div className="text-base text-primary font-pf-bold">
                <FormattedMessage id="mt.huazhuan" />
              </div>
              <div className="text-sm text-secondary">
                <FormattedMessage id="mt.danhao" />
                ：2042197400471
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="bg-black rounded py-[2px] px-2 mr-[6px] text-white text-xs">SUX</div>
              <div className="text-primary text-sm font-pf-bold">59524566</div>
            </div>
            <div className="mx-5 relative top-[2px]">
              <Iconfont name="zhixiang" width={34} height={28} color="var(--color-text-primary)" />
            </div>
            <div className="flex items-center">
              <div className="bg-black rounded py-[2px] px-2 mr-[6px] text-white text-xs">SUX</div>
              <div className="text-primary text-sm font-pf-bold">59524566</div>
            </div>
          </div>
          <div className="text-primary text-xl font-dingpro-medium flex items-center justify-end mr-5">1,000 USD</div>
        </div>
      </div>
    )
  }
  return <div>{Array.from({ length: 4 }, (k, v) => v).map((item) => renderItem())}</div>
}
