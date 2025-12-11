'use client'

import { useState } from 'react'

import { IconButton } from '@/libs/ui/components/button'
import { IconBell, IconLanguage } from '@/libs/ui/components/icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/libs/ui/components/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/libs/ui/components/tabs'
import { Trans } from '@/libs/lingui/react/macro'

export const Notification = () => {
  const [value, setValue] = useState<'notification' | 'announcement'>('notification')

  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton className="size-9">
          <IconBell className="size-5" />
          <span className="sr-only">Notification</span>
        </IconButton>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-h-[700px] min-h-[500px] w-[330px] p-0 px-2.5">
        <Tabs value={value} onValueChange={setValue}>
          <TabsList className="border-b-0 px-0">
            <TabsTrigger value="notification">
              <Trans>通知</Trans>
            </TabsTrigger>
            <TabsTrigger value="announcement">
              <Trans>公告</Trans>
            </TabsTrigger>
          </TabsList>
          <div className="px-1 py-3">
            <TabsContent value="notification">
              <div>通知</div>
            </TabsContent>
            <TabsContent value="announcement">
              <div>公告</div>
            </TabsContent>
          </div>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
