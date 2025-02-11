import Iconfont from '@/components/Base/Iconfont'
import ENV from '@/env/server'
import { cn } from '@/utils/cn'
import { push } from '@/utils/navigator'
import { useLayoutEffect, useState } from 'react'

export default function WithdrawalMethod({
  item,
  status,
  tradeAccountId
}: {
  item: Wallet.fundsMethodPageListItem
  status: Wallet.IMethodStatus
  tradeAccountId: string | undefined
}) {
  const [explanation, setExplanation] = useState<Record<string, any>[]>([])
  useLayoutEffect(() => {
    try {
      const parsedExplanation = JSON.parse(item.explanation || '{}')
      setExplanation(parsedExplanation)
    } catch (error) {
      console.error(error)
    }
  }, [])

  return (
    <div
      className={cn(
        ' border border-gray-250 rounded-lg flex flex-col',
        status !== 'locked' ? 'cursor-pointer hover:shadow-md' : 'filter grayscale-50 opacity-50'
      )}
      onClick={() => {
        if (status === 'unlocked') {
          push(`/withdrawal/process/${item.id}` + (tradeAccountId ? `?tradeAccountId=${tradeAccountId}` : ''))
        }
      }}
    >
      <div className="pl-[14px] pr-[18px] py-2 flex justify-between">
        <div className="flex flex-row items-center gap-2">
          {/* <Iconfont name={item.icon} width={24} height={24} color="black" /> */}
          <img src={`${ENV.imgDomain}${item.channelIcon}`} alt={item.channelRevealName} width={24} height={24} />
          <div className=" text-base text-gary-900">{item.channelRevealName}</div>
        </div>
        <div className="text-sm text-secondary">
          {status === 'locked' && <Iconfont name="geren-suo" width={16} height={16} color="black" />}
        </div>
      </div>
      <div className="pl-[14px] pr-[18px] py-4 border-t border-gray-250 flex flex-col gap-[10px]">
        {explanation &&
          Object.entries(explanation).map(([key, value]) => (
            <div className="flex flex-row items-center justify-start gap-[18px]" key={key}>
              <div className=" text-sm text-secondary  min-w-20 ">{value?.title}</div>
              <div className="text-sm font-semibold text-gray-900">{value?.content}</div>
            </div>
          ))}
      </div>
    </div>
  )
}
