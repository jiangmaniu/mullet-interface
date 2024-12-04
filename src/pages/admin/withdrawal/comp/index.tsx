import { cn } from '@/utils/cn'
import { push } from '@/utils/navigator'

export default function DepositMethod({ item }: { item: Wallet.WithdrawMethod }) {
  return (
    <div
      className={cn(
        ' border border-gray-250 rounded-lg flex flex-col',
        item.status !== 'locked' ? 'cursor-pointer hover:shadow-md' : 'filter grayscale-50 opacity-50'
      )}
      onClick={() => {
        if (item.status === 'unlocked') {
          push(`/withdrawal/process/${item.id}`)
        }
      }}
    >
      <div className="pl-[14px] pr-[18px] py-2 flex justify-between">
        <div className="flex flex-row items-center gap-2">
          {/* <Iconfont name={item.icon} width={24} height={24} color="black" /> */}
          <div className=" text-base text-gary-900">{item.title}</div>
        </div>
        <div className="text-sm text-secondary">{item.status}</div>
      </div>
      <div className="pl-[14px] pr-[18px] py-4 border-t border-gray-250 flex flex-col gap-[10px]">
        {item.options &&
          Object.entries(item.options).map(([key, value]) => (
            <div className="flex flex-row items-center justify-start gap-[18px]" key={key}>
              <div className=" text-sm text-secondary min-w-20 ">{value.title}</div>
              <div className="text-sm font-semibold text-gray-900">{value.desc}</div>
            </div>
          ))}
      </div>
    </div>
  )
}
