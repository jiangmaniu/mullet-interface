import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import FlashList from '@/pages/webapp/components/Base/List/FlashList'
import ActivityIndicator from '@/pages/webapp/components/Base/Loading/ActivityIndicator'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { useEffect } from 'react'
import PendingItem from './PendingItem'

/**
 * 挂单列表
 */
function PendingList() {
  const { t } = useI18n()
  const { cn, theme } = useTheme()
  const { trade } = useStores()
  const { currentAccountInfo } = trade
  const pendingList = toJS(trade.pendingList)

  useEffect(() => {
    trade.getPendingList()
  }, [currentAccountInfo.id])

  const onEndReached = () => {
    // if (tabIndex == 0) {
    //   if ((PAGE_SIZE * pageNum) <= tradeList.length) {
    //     setPageNum(pageNum + 1)
    //   }
    // } else {
    //   if ((PAGE_SIZE * pageNum) <= pendingList.length) {
    //     setPageNum(pageNum + 1)
    //   }
    // }
  }

  if (trade.pendingListLoading)
    return (
      <View className={cn('mt-[100px] flex items-center justify-center')}>
        <ActivityIndicator size={30} />
      </View>
    )

  const renderItem = (item: Order.OrderPageListItem) => {
    return <PendingItem item={item} />
  }

  return (
    <FlashList
      data={pendingList}
      renderItem={renderItem}
      style={{ marginInline: 14, paddingTop: 4, paddingBottom: 60 }}
      showMoreText={false}
      ListEmptyComponent={
        <View className={cn('w-full flex items-center flex-col justify-center h-80')}>
          <img src={'/images/icon-zanwucangwei.png'} style={{ width: 120, height: 120 }} />
          <Text size="sm" color="weak">
            {t('pages.position.No Order')}
          </Text>
          <Button type="primary" style={{ marginTop: 22, width: 143 }} href="/app/trade">
            <View className={cn('flex flex-row items-center gap-2')}>
              <Iconfont name="zhanghu-jiaoyi" size={20} color={theme.colors.textColor.reverse} />
              <Text size="base" weight="bold" color="white">
                {t('pages.position.Go Trade')}
              </Text>
            </View>
          </Button>
        </View>
      }
    />
  )
}

export default observer(PendingList)
