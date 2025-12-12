import { IconEmptyNoData } from '@/libs/ui/components/icons'

export const EmptyNoData = () => {
  return (
    <div className="mx-auto flex flex-col items-center justify-center h-full">
      <IconEmptyNoData className="text-brand-secondary-1" />
      <div className="text-paragraph-p3 text-content-6 mt-2">暂无记录</div>
    </div>
  )
}
