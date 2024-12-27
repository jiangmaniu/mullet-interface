import { useTheme } from '@/context/themeProvider'
import Header from '@/pages/webapp/components/Base/Header'
import FlashList from '@/pages/webapp/components/Base/List/FlashList'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { readAllMessage } from '@/services/api/message'
import { observer, useLocalObservable } from 'mobx-react'
import { useEffect } from 'react'
import MessageStore from './MessageStore'

function Message() {
  const i18n = useI18n()
  const { theme, cn } = useTheme()

  const { listData, resetPage, getList, getUnreadMessageCount, unReadCount } = useLocalObservable(() => MessageStore)
  const { list, hasMore, refreshing } = listData

  useEffect(() => {
    onRefresh()
  }, [])

  // 下拉刷新
  const onRefresh = async () => {
    resetPage()
    getList()
  }

  // 加载更多
  const onEndReached = () => {
    getList(true)
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

    navigateTo(`/app/user-center/message/${id}`)
  }

  // 滚动容器高度
  const ContainerHeight = document.body.clientHeight - 10

  const renderItem = (item: Message.MessageItem) => {
    const isUnRead = item.isRead === 'UNREAD'
    return (
      <View onClick={() => handleClickItem(item.id)} className={cn('flex-row items-start gap-x-2 py-2 border-b')} borderColor="weak">
        <View>
          <img src={isUnRead ? '/images/message-email-active.png' : '/images/message-email.png'} style={{ width: 26, height: 26 }} />
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

  return (
    <Basiclayout bgColor="secondary" scrollY headerColor={theme.colors.backgroundColor.secondary}>
      <Header
        title={i18n.t('app.pageTitle.Message')}
        right={
          <>
            {unReadCount > 0 && (
              <View onClick={handleReadAll}>
                <img src="/images/clear-icon.png" style={{ width: 36, height: 36 }} />
              </View>
            )}
          </>
        }
        back
      />
      <FlashList
        data={list}
        renderItem={renderItem}
        showMoreText={true}
        estimatedItemSize={68} // 估算的 item 高度
        height={ContainerHeight}
        hasMore={hasMore}
        refreshing={refreshing}
        contentContainerStyle={{ padding: 12 }}
        emptyConfig={{
          image: '/images/message-empty.png',
          imageStyle: { width: 134, height: 134 }
        }}
        onEndReached={onEndReached}
      />
    </Basiclayout>
  )
}

export default observer(Message)
