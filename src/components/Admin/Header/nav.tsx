import { cn } from '@/utils/cn'
import { push } from '@/utils/navigator'

export const HeaderNav = () => {
  const navOptions = [
    {
      label: 'Trade',
      path: '/trade',
      isActive: location.pathname.indexOf('/trade') !== -1
    },
    {
      label: 'MTLP',
      path: '/lp',
      isActive: location.pathname.indexOf('/lp') !== -1
    },
    {
      label: 'Vault',
      path: '/vault',
      isActive: location.pathname.indexOf('/vault') !== -1
    }
  ]
  return (
    <div className="flex items-center gap-x-4 text-sm font-bold">
      {navOptions.map((item) => (
        <div
          key={item.path}
          onClick={() => push(item.path)}
          className={cn(' text-[#6a7073] hover:text-primary  cursor-pointer', item.isActive ? 'text-primary' : '')}
        >
          {item.label}
        </div>
      ))}
    </div>
  )
}
