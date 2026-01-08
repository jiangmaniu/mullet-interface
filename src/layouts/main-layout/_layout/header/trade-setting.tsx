'use client'
import { useState } from 'react'

import { IconButton } from '@/libs/ui/components/button'
import { Iconify } from '@/libs/ui/components/icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/libs/ui/components/popover'
import { Trans } from '@/libs/lingui/react/macro'
import { GeneralTooltip } from '@/components/tooltip'
import { resetLayoutCache } from '@/pages/web/trade/_layouts/grid-layout'

export const TradeSetting = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <GeneralTooltip align={'center'} content={<Trans>交易设置</Trans>}>
            <IconButton className="size-9">
              <Iconify icon="iconoir:settings" className="size-5" />
              <span className="sr-only">Trade setting</span>
            </IconButton>
          </GeneralTooltip>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-h-[700px] p-3 min-h-[500px] w-[330px]">
        <div className="flex flex-col gap-2xl">
          <div className="text-important-2 text-content-1">
            <Trans>设置</Trans>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="text-paragraph-p3 text-content-4">颜色偏好</div>

            <div>
              <GeneralTooltip align={'center'} side="top" content={<Trans>布局重置</Trans>}>
                <IconButton variant={'ghost'} onClick={resetLayoutCache}>
                  <Iconify icon="iconoir:refresh-double" className="size-3" />
                  <span className="sr-only">Layout reset</span>
                </IconButton>
              </GeneralTooltip>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
