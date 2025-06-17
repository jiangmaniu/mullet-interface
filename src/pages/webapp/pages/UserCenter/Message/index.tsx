import Tabs from '@/components/Base/Tabs'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import Header from '@/pages/webapp/components/Base/Header'
import FlashList from '@/pages/webapp/components/Base/List/FlashList'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { readAllMessage } from '@/services/api/message'
import { FormattedMessage, useSearchParams } from '@umijs/max'
import { observer, useLocalObservable } from 'mobx-react'
import { useEffect, useState } from 'react'
import MessageStore from './MessageStore'

type ITabKey = 'NOTICE' | 'ANNOUNCEMENT'

function Message() {
  const i18n = useI18n()
  const { theme, cn } = useTheme()
  const { global } = useStores()
  const { listData, resetPage, getList, getUnreadMessageCount, unReadCount } = useLocalObservable(() => MessageStore)
  const { list, hasMore, refreshing } = listData
  const [activeKey, setActiveKey] = useState<ITabKey>('NOTICE')
  const [searchParams] = useSearchParams()

  const getMessage = (loadMore?: boolean, key?: ITabKey) => {
    const tabKey = key || activeKey
    getList(loadMore, tabKey === 'NOTICE' ? 'SINGLE' : 'GROUP')
  }

  useEffect(() => {
    const activeKey = searchParams.get('activeKey')
    if (activeKey) {
      setActiveKey(activeKey as ITabKey)
      getMessage(false, activeKey as ITabKey)
    }
  }, [searchParams])

  useEffect(() => {
    onRefresh()
  }, [])

  // 下拉刷新
  const onRefresh = async () => {
    resetPage()
    getMessage()
  }

  // 加载更多
  const onEndReached = () => {
    getMessage(true)
  }

  const refreshCount = () => {
    getUnreadMessageCount()
  }

  const handleReadAll = async () => {
    await readAllMessage()
    refreshCount()
    onRefresh()
  }

  // 点击消息
  const handleClickItem = async (id: any) => {
    // 列表不刷新接口，标记已读
    listData.list = list.map((item) => {
      if (item.id === id) {
        item.isRead = 'READ'
      }
      return item
    })

    navigateTo(`/app/user-center/message/${id}?activeKey=${activeKey}`)
  }

  // 滚动容器高度
  const ContainerHeight = document.body.clientHeight - 70

  const renderItem = (item: Message.MessageItem) => {
    const isUnRead = item.isRead === 'UNREAD'
    return (
      <View onClick={() => handleClickItem(item.id)} className={cn('flex-row items-start gap-x-2 py-2 border-b')} borderColor="weak">
        <View>
          <img
            src={isUnRead ? '/img/webapp/message-email-active.png' : '/img/webapp/message-email.png'}
            style={{ width: 26, height: 26 }}
          />
        </View>
        <View className={cn('flex-1')}>
          <Text color={isUnRead ? 'primary' : 'weak'} size="sm" weight="medium" className={cn('pb-1 line-clamp-2')}>
            {item.title}
          </Text>
          <Text leading="base" size="xs" color={isUnRead ? 'secondary' : 'weak'} className={cn('line-clamp-2')}>
            {item.content}
          </Text>
          <Text leading="base" size="xxs" color={isUnRead ? 'secondary' : 'weak'} className={cn('pt-2')}>
            {item.createTime}
          </Text>
        </View>
      </View>
    )
  }

  const tabItems = [
    {
      key: 'NOTICE',
      label: <FormattedMessage id="mt.zhanneixin" />
    },
    {
      key: 'ANNOUNCEMENT',
      label: <FormattedMessage id="mt.gonggao" />
    }
  ]

  return (
    <Basiclayout bgColor="primary" headerColor={theme.colors.backgroundColor.primary} className="pb-[env(--safe-area-inset-bottom)]">
      <Header
        title={i18n.t('app.pageTitle.Message')}
        right={
          <>
            {unReadCount > 0 && (
              <View onClick={handleReadAll}>
                <img src="/img/webapp/clear-icon.png" style={{ width: 36, height: 36 }} />
              </View>
            )}
          </>
        }
        back
      />
      <Tabs
        items={tabItems}
        onChange={(key) => {
          resetPage()
          setActiveKey(key as ITabKey)
          getMessage(false, key as ITabKey)
        }}
        tabBarGutter={46}
        tabBarStyle={{ paddingLeft: 27 }}
        size="small"
        activeKey={activeKey}
        marginBottom={0}
      />
      <FlashList
        data={list}
        renderItem={renderItem}
        showMoreText={true}
        estimatedItemSize={68} // 估算的 item 高度
        height={ContainerHeight}
        hasMore={hasMore}
        refreshing={refreshing || listData.loading}
        contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
        emptyConfig={{
          image: '/img/webapp/message-empty.png',
          imageStyle: { width: 134, height: 134 }
        }}
        onEndReached={onEndReached}
      />
    </Basiclayout>
  )
}

export default observer(Message)
