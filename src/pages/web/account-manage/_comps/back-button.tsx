import { IconButton } from '@/libs/ui/components/button'
import { Iconify } from '@/libs/ui/components/icons'
import { cn } from '@/libs/ui/lib/utils'
import { push } from '@/utils/navigator'
import { useSelectedRoutes } from '@umijs/max'

export const AccountBackButton = ({ backPath, className }: { backPath?: string; className?: string }) => {
  const routes = useSelectedRoutes()
  const lastRoute = routes
    .at(-1)
    ?.pathname?.split('/')
    .filter((v) => v)
    .filter((item) => !['zh-TW', 'en-US', 'vi-VN'].includes(item))

  const defaultBackPath = lastRoute
    ?.filter((v) => v)
    ?.slice(0, -1)
    .join('/')

  return (
    <IconButton variant={'outline'} color={'default'}>
      <Iconify
        icon="iconoir:arrow-left-circle"
        className={cn('size-6 cursor-pointer  transition-all ', className)}
        onClick={() => {
          push(backPath || `/${defaultBackPath}`)
        }}
      />
    </IconButton>
  )
}
