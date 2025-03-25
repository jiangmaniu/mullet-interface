import Iconfont from '@/components/Base/Iconfont'
import { getEnv } from '@/env'
import { cn } from '@/utils/cn'
import { push } from '@/utils/navigator'
import { appendHideParamIfNeeded } from '@/utils/request'
import { useLayoutEffect, useState } from 'react'

export default function DepositMethod({
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
        'rounded-xl flex flex-col bg-white',
        status !== 'locked' ? 'cursor-pointer hover:shadow-[0px_0px_12px_0px_rgba(0,0,0,0.1)]' : 'filter grayscale-50 opacity-50'
      )}
      onClick={() => {
        if (status === 'unlocked') {
          push(appendHideParamIfNeeded(`/app/deposit/process/${item.id}` + (tradeAccountId ? `?tradeAccountId=${tradeAccountId}` : '')))
        }
      }}
    >
      <div className="px-[14px] pt-3 pb-1.5 flex justify-between">
        <div className="flex flex-row items-center gap-2">
          <img src={`${getEnv().imgDomain}${item.channelIcon}`} alt={item.channelRevealName} width={28} height={28} />
          <div className=" text-base text-primary">{item.channelRevealName}</div>
        </div>
        <div className="text-sm text-secondary">
          {status === 'locked' && <Iconfont name="geren-suo" width={20} height={20} color="black" />}
        </div>
      </div>
      <div className="px-4 py-3 border-t border-gray-70 flex flex-col gap-1">
        {explanation &&
          Object.entries(explanation).map(([key, value]) => (
            <div className="flex flex-row items-center justify-between gap-[18px]" key={key}>
              <div className=" text-xs text-secondary font-normal min-w-20 ">{value?.title}</div>
              <div className="text-xs font-bold text-gray-900">{value?.content}</div>
            </div>
          ))}
      </div>
    </div>
  )
}
