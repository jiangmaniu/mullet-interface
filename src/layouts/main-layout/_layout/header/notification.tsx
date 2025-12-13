'use client'

import { useState } from 'react'

import { IconButton } from '@/libs/ui/components/button'
import { IconBell, IconLanguage } from '@/libs/ui/components/icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/libs/ui/components/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/libs/ui/components/tabs'
import { Trans } from '@/libs/lingui/react/macro'
import { GeneralTooltip } from '@/components/tooltip'
import { useStores } from '@/context/mobxProvider'
import { observer, useLocalObservable } from 'mobx-react'
import { cn } from '@/libs/ui/lib/utils'
import { getMyMessageInfo, readAllMessage } from '@/services/api/message'
import MessageStore from '@/pages/webapp/pages/UserCenter/Message/MessageStore'
import { EMPTY_CONFIDENTIAL_TRANSFER_ACCOUNT_DISCRIMINATOR } from '@solana-program/token-2022'
import { EmptyNoData } from '@/components/empty/no-data'
import VirtualList from 'rc-virtual-list'
import { Badge } from '@/libs/ui/components/badge'
import { BNumber } from '@/libs/utils/number/b-number'

enum NotificationTabsEnum {
  NOTICE = 'NOTICE',
  ANNOUNCEMENT = 'ANNOUNCEMENT'
}

export const Notification = observer(() => {
  const [value, setValue] = useState<NotificationTabsEnum>(NotificationTabsEnum.NOTICE)
  const { global } = useStores()
  const { messageList } = global
  const getMessage = (isRefresh?: boolean, key?: NotificationTabsEnum) => {
    const tabKey = key || value
    global.getMessageList(isRefresh, tabKey === 'NOTICE' ? 'SINGLE' : 'GROUP')
  }
  const ContainerHeight = messageList.length > 5 ? 500 : 400
  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
    if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 1) {
      getMessage(false)
    }
  }
  const messageStore = useLocalObservable(() => MessageStore)
  const unReadCount = messageStore.unReadCount

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <GeneralTooltip align={'center'} content={<Trans>站内信</Trans>}>
            <IconButton className="size-9 relative">
              {BNumber.from(unReadCount).gt(0) && (
                <Badge variant={'message'} position="top-right">
                  {unReadCount}
                </Badge>
              )}
              <IconBell className="size-5" />
              <span className="sr-only">Notification</span>
            </IconButton>
          </GeneralTooltip>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-h-[700px] w-[330px] p-0">
        <Tabs
          value={value}
          variant={'underline'}
          size={'md'}
          onValueChange={(value) => {
            setValue(value)
            getMessage(true, value)
          }}
        >
          <TabsList className="border-b-0 px-0">
            <TabsTrigger value={NotificationTabsEnum.NOTICE}>
              <Trans>通知</Trans>
            </TabsTrigger>
            <TabsTrigger value={NotificationTabsEnum.ANNOUNCEMENT}>
              <Trans>公告</Trans>
            </TabsTrigger>
          </TabsList>
          <div className=" py-3 h-full">
            <TabsContent value="notification">
              <div>通知</div>
            </TabsContent>
            <TabsContent value="announcement">
              <div>公告</div>
            </TabsContent>
            {!messageList.length ? (
              <EmptyNoData />
            ) : (
              <>
                <VirtualList
                  data={messageList}
                  height={ContainerHeight}
                  styles={{
                    verticalScrollBarThumb: {
                      width: 6,
                      borderRadius: 4
                    },
                    verticalScrollBar: {
                      background: 'transparent'
                    }
                  }}
                  // itemHeight={41}
                  itemKey="id"
                  onScroll={onScroll}
                >
                  {(item) => {
                    return <NotificationListItem activeTab={value} item={item} key={item.id} />
                  }}
                </VirtualList>
              </>
            )}
          </div>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
})

const NotificationListItem = observer(({ activeTab, item }: { activeTab: NotificationTabsEnum; item: Message.MessageItem }) => {
  const isUnRead = item.isRead === 'UNREAD'
  const { global } = useStores()
  const handleClickItem = async (id: any) => {
    const res = await getMyMessageInfo({ id })
    if (res.success) {
      MessageStore.getUnreadMessageCount()
      global.messageList = global.messageList.map((item) => {
        if (item.id === id) {
          item.isRead = 'READ'
        }
        return item
      })
    }
  }

  return (
    <div
      className={cn('flex flex-col gap-xs p-xl', {
        'hover:bg-move-in cursor-pointer': isUnRead,
        'pointer-events-none': !isUnRead
      })}
      onClick={() => {
        if (isUnRead) {
          handleClickItem(item.id)
        }
      }}
    >
      <div className="flex justify-between gap-2 items-center">
        <div className="text-paragraph-p2 text-content-1">{item.title}</div>
        {isUnRead && <div className="size-2 rounded-full bg-market-fall"></div>}
      </div>
      <div className="text-paragraph-p3 text-content-4">{item.content}</div>
      <div className="text-paragraph-p3 text-content-4">{item.createTime}</div>
    </div>
  )
})
