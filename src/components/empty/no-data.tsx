import { IconEmptyNoData } from '@/libs/ui/components/icons'
import { cn } from '@/libs/ui/lib/utils'
import { Trans } from '../t'

export const EmptyNoData = ({ className, text = <Trans>暂无数据</Trans> }: { className?: string; text?: React.ReactNode }) => {
  return (
    <div className={cn('mx-auto flex flex-col items-center justify-center h-full py-2xl', className)}>
      <IconEmptyNoData className="text-brand-secondary-1" />
      <div className="text-paragraph-p3 text-content-6 mt-2">{text}</div>
    </div>
  )
}
