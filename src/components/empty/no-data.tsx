import { IconEmptyNoData } from '@/libs/ui/components/icons'
import { cn } from '@/libs/ui/lib/utils'

export const EmptyNoData = ({ className }: { className?: string }) => {
  return (
    <div className={cn('mx-auto flex flex-col items-center justify-center h-full py-2xl', className)}>
      <IconEmptyNoData className="text-brand-secondary-1" />
      <div className="text-paragraph-p3 text-content-6 mt-2">暂无记录</div>
    </div>
  )
}
