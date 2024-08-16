import { FormattedMessage } from '@umijs/max'

import Tags from '@/components/Admin/Tags'
import { CURRENCY } from '@/constants'

export default ({ item }: { item: any }) => {
  return (
    <div className=" rounded-xl bg-white h-16 border border-gray-150 opacity-60 pl-5 pr-4 py-3 flex flex-row justify-between gap-1 w-full items-center">
      <div className=" flex gap-1 items-center">
        <img src={item.img} alt="" className="w-8 h-8 rounded-full" />
        <div className=" flex flex-col items-start">
          <span className="text-sm font-semibold text-black-800">{item.pinzhong}</span>
          <span className="flex items-center gap-1">
            <Tags size="tiny" color={item.zhuangtai === '空' ? 'red' : 'green'}>
              {item.zhuangtai}
            </Tags>
            <Tags size="tiny" color="gray">
              {item.desc}
            </Tags>
          </span>
        </div>
      </div>

      <div className=" flex flex-col gap-1 items-end">
        <div className=" flex gap-1 items-end">
          <span className=" text-sm font-normal">
            <FormattedMessage id="mt.fenrun" />
          </span>
          <span className=" text-base text-green leading-5 !font-dingpro-medium">
            {item.fenrun}&nbsp;{CURRENCY}
          </span>
        </div>
        <div className=" flex gap-2 items-center">
          <span className=" text-xs text-gray-500 font-normal">{item.shijian}</span>
          <span className=" bg-gray-500 h-[9px] w-[1px]"></span>
          <span className=" text-xs text-gray-500 font-normal">{item.name}</span>
        </div>
      </div>
    </div>
  )
}
