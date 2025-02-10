import Iconfont from '@/components/Base/Iconfont'
import { cn } from '@/utils/cn'
import { push } from '@/utils/navigator'

export default function WithdrawalMethod({
  item,
  status,
  tradeAccountId
}: {
  item: Wallet.fundsMethodPageListItem
  status: Wallet.IMethodStatus
  tradeAccountId: string | undefined
}) {
  return (
    <div
      className={cn(
        ' border border-gray-250 rounded-lg flex flex-col',
        status !== 'locked' ? 'cursor-pointer hover:shadow-md' : 'filter grayscale-50 opacity-50'
      )}
      onClick={() => {
        if (status === 'unlocked') {
          push(`/withdrawal/process/${item.id}?tradeAccountId=${tradeAccountId}`)
        }
      }}
    >
      <div className="pl-[14px] pr-[18px] py-2 flex justify-between">
        <div className="flex flex-row items-center gap-2">
          {/* <Iconfont name={item.icon} width={24} height={24} color="black" /> */}
          <div className=" text-base text-gary-900">{item.channelRevealName}</div>
        </div>
        <div className="text-sm text-secondary">
          {status === 'locked' && <Iconfont name="geren-suo" width={16} height={16} color="black" />}
        </div>
      </div>
      <div className="pl-[14px] pr-[18px] py-4 border-t border-gray-250 flex flex-col gap-[10px]">
        {item.explanation}
        {/* {item.options &&
          Object.entries(item.options).map(([key, value]) => (
            <div className="flex flex-row items-center justify-start gap-[18px]" key={key}>
              <div className=" text-sm text-secondary  min-w-20 ">{value?.label}</div>
              <div className="text-sm font-semibold text-gray-900">{value?.desc}</div>
            </div>
          ))} */}
      </div>
    </div>
  )
}
