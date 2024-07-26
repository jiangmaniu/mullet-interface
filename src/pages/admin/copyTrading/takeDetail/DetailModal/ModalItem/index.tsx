import { FormattedMessage } from '@umijs/max'
import dayjs from 'dayjs'

import Iconfont from '@/components/Base/Iconfont'
import { formatNum } from '@/utils'

export default ({ item, onClick }: { item: any; onClick: (item: any) => void }) => {
  return (
    <div className=" rounded-xl bg-white h-16 border border-gray-150 opacity-60 pl-5 pr-4 py-3 flex flex-row justify-between gap-1 w-full items-center">
      <div className="flex flex-row items-center gap-[4rem]">
        <span className=" text-sm font-semibold text-black-800">{dayjs().format('YYYY-MM-DD')}</span>

        <div className="flex flex-col items-start gap-1">
          <span className=" text-sm font-semibold text-black-800 !font-dingpro-medium">{formatNum(item.daidanfenrun)}</span>
          <span className=" text-xs text-gray-500">
            <FormattedMessage id="mt.daidanfenrun" />
          </span>
        </div>
        <div className="flex flex-col items-start gap-1">
          <span className=" text-sm font-semibold text-black-800">{item.gensui}</span>
          <span className=" text-xs text-gray-500">
            {' '}
            <FormattedMessage id="mt.gensuirenshu" />
          </span>
        </div>
      </div>
      <div
        onClick={() => {
          onClick(item)
        }}
        className="w-7 h-7  rounded-lg bg-white flex items-center justify-center border border-solid border-gray-150 cursor-pointer"
      >
        <Iconfont name="gengduo-caozuo" width={10} color="black" height={10} />
      </div>
    </div>
  )
}
