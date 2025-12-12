import { useLocation } from '@umijs/max'
import { cn } from '@/libs/ui/lib/utils'
import { useMemo } from 'react'
import Link from '@/libs/ui/next/link'
import { Tabs, TabsList, TabsTrigger } from '@/libs/ui/components/tabs'
import { IconMtlp } from '@/libs/ui/components/icons'

/**
 * 替代 Next.js 的 useSelectedLayoutSegment
 * 从当前路径中提取第一个路由段
 */
const useSelectedLayoutSegment = () => {
  const location = useLocation()

  return useMemo(() => {
    const pathname = location.pathname
    // 移除语言前缀（如 /en-US 或 /zh-CN）
    const pathWithoutLang = pathname.replace(/^\/(en-US|zh-CN|zh-TW|ja-JP|ko-KR)/, '')
    // 获取第一个路由段
    const segments = pathWithoutLang.split('/').filter(Boolean)
    return segments[0] || null
  }, [location.pathname])
}

export const MainLayoutHeaderNav = () => {
  const activeSegment = useSelectedLayoutSegment()
  return (
    <div className="gap-medium flex">
      <Tabs value={activeSegment} variant={'outline'} size={'md'} onValueChange={() => {}}>
        <TabsList>
          {[
            {
              path: '/trade',
              label: '交易',
              activeSegment: 'trade'
            },

            {
              path: '/lp',
              label: <IconMtlp className="w-[52px] h-[14px]" />,
              activeSegment: 'lp'
            },
            {
              path: '/vaults',
              label: '金库',
              activeSegment: 'vaults'
            }
            // {
            //   path: '/points',
            //   label: '积分',
            //   activeSegment: 'points'
            // }
          ].map((item, key) => {
            const isActiveNav = activeSegment === item.activeSegment
            return (
              <Link
                key={key}
                href={item.path}
                // className={cn('rounded-[8px] border border-transparent px-4 py-2.5 text-[14px] leading-[16px]', {
                //   'border-[#3B3D52] text-white': isActiveNav,
                //   'text-[#9FA0B0] hover:text-white': !isActiveNav
                // })}
              >
                <TabsTrigger value={item.activeSegment}>{item.label}</TabsTrigger>
              </Link>
            )
          })}
        </TabsList>
      </Tabs>
    </div>
  )
}
