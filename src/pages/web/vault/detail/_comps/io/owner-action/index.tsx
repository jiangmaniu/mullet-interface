import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/utils/cn'
import { useState } from 'react'
import { DistributeModal } from './distribute-modal'

export const VaultOwnerAction = () => {
  const [isDistributeModalOpen, setIsDistributeModalOpen] = useState(false)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={cn('py-[5px] leading-[18px] min-h-max min-w-max px-[10px] gap-2 border-[#3B3D52]')} variant="outline">
            <span>创建者操作</span>
            <Icons.lucide.ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[156px]" sideOffset={8} align="end">
          <DropdownMenuItem>金库交易</DropdownMenuItem>
          <DropdownMenuItem>启用取款平仓</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDistributeModalOpen(true)}>分发</DropdownMenuItem>
          <DropdownMenuItem>关闭仓库</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DistributeModal open={isDistributeModalOpen} onOpenChange={setIsDistributeModalOpen} />
    </>
  )
}
