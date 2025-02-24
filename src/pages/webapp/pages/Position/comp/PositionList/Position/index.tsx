import Iconfont from '@/components/Base/Iconfont'
import { ORDER_TYPE, TRADE_BUY_SELL } from '@/constants/enum'
import { useLoading } from '@/context/loadingProvider'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { RecordModalItem } from '@/mobx/trade'
import Button from '@/pages/webapp/components/Base/Button'
import FlashList from '@/pages/webapp/components/Base/List/FlashList'
import ActivityIndicator from '@/pages/webapp/components/Base/Loading/ActivityIndicator'
import SheetModal, { SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { useModel } from '@umijs/max'
import { useNetwork } from 'ahooks'
import { debounce } from 'lodash'
import { observer } from 'mobx-react'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PositionItem from './PositionItem'
import MarketCloseConfirmModal from './PositionModal/MarketCloseConfirmModal'
import PositionContent from './PositionModal/PositionContent'
import TopTabbar from './PositionModal/TopTabbar'
import { Params } from './PositionModal/TopTabbar/types'

const RenderItem = forwardRef(
  ({
    item,
    onPress
  }: {
    item: Order.BgaOrderPageListItem
    onPress: (item: Order.BgaOrderPageListItem, tabKey: Params['tabKey'], cb?: () => void) => Promise<void>
  }) => {
    // item 是否在滚动条中的可视范围内
    // 弹窗打开的时候，不渲染item
    return <PositionItem item={item} modalVisible={false} onPress={onPress} />
  }
)

/**
 * 持仓单列表
 */
function PositionList() {
  const { t } = useI18n()
  const { cn, theme } = useTheme()
  const { trade, ws } = useStores()
  const { fetchUserInfo } = useModel('user')
  const { currentAccountInfo } = trade
  const [visibleItems, setVisibleItems] = useState<string[]>([])
  const [prevPositionIds, setPrevPositionIds] = useState<string[]>([])
  const networkState = useNetwork()
  const isOnline = networkState.online

  const positionList = useMemo(
    () => trade.positionList?.map((item) => ({ ...item, visible: visibleItems.includes(item.id as never) })) || [],
    [trade.positionList.length, visibleItems]
  )
  const symbolList = positionList.map((item) => item.symbol) as string[]

  const tabbarRef = useRef<any>(null)
  const [item, setItem] = useState<Order.BgaOrderPageListItem | null>(null)
  const modalRef = useRef<SheetRef>(null)
  const marketCloseModalRef = useRef<SheetRef>(null)
  const [tabKey, setTabKey] = useState<Params['tabKey']>('CLOSE_POSITION')
  const [submitTrigger, setSubmitTrigger] = useState(false)

  const { showLoading, hideLoading } = useLoading()

  const onPress = async (item: Order.BgaOrderPageListItem, tabKey: Params['tabKey'], cb?: () => void) => {
    cb && cb()

    setItem(item)
    setTabKey(tabKey)
    setSubmitTrigger(true)
  }

  useEffect(() => {
    if (submitTrigger) {
      if (tabKey === 'CLOSE_MARKET_POSITION') {
        onMarketClose()
        setSubmitTrigger(false)
        return
      }

      modalRef.current?.sheet?.present()
      hideLoading()

      setSubmitTrigger(false)
    }
  }, [submitTrigger])

  const close = () => {
    modalRef.current?.sheet?.dismiss()
    setItem(null)
  }

  const onConfirm = async () => {
    tabbarRef.current?.submit()
  }

  useEffect(() => {
    if (!currentAccountInfo.id) return
    trade.getPositionList(true).catch((err) => {})
  }, [trade, currentAccountInfo.id])

  const onViewableItemsChanged = debounce((viewableItems) => {
    const newVisibleItems = viewableItems?.map((item: Order.BgaOrderPageListItem) => item.id) || []

    setVisibleItems(newVisibleItems)
  }, 100)

  // const handleSubscribe = () => {
  //   setTimeout(() => {
  //     // 打开行情订阅
  //     trade.subscribePositionSymbol({})
  //   })
  // }

  // useEffect(() => {
  //   // 如果网络断开，在连接需要重新重新建立新的连接
  //   if (!isOnline) {
  //     ws.close()
  //   }

  //   if (isOnline) {
  //     setTimeout(() => {
  //       handleSubscribe()
  //     }, 200)
  //   }

  // }, [symbolList.length, isOnline])

  // usePageVisibility(
  //   () => {
  //     // 用户从后台切换回前台时执行的操作
  //     handleSubscribe()
  //   },
  //   () => {
  //     // 用户从前台切换到后台时执行的操作
  //   }
  // )

  // 保证金确认
  const submitPosition = useCallback(async () => {
    if (!item) return

    const count = item.orderVolume
    // 平仓下一个反方向的单
    const params = {
      symbol: item?.symbol,
      buySell: item?.buySell === TRADE_BUY_SELL.BUY ? TRADE_BUY_SELL.SELL : TRADE_BUY_SELL.BUY, // 订单方向
      orderVolume: count,
      tradeAccountId: item?.tradeAccountId,
      executeOrderId: item?.id, // 持仓单号
      type: ORDER_TYPE.MARKET_ORDER // 订单类型
    } as Order.CreateOrder

    const res = await trade.createOrder(params)

    if (res.success) {
      // 关闭弹窗
      close()

      // 更新账户余额信息
      fetchUserInfo(true)
    }
  }, [item, t, trade.createOrder, close, fetchUserInfo])

  const onMarketClose = () => {
    if (trade.positionConfirmChecked) {
      submitPosition()
    } else {
      showLoading({
        color: theme.colors.textColor.primary
      })
      marketCloseModalRef.current?.sheet?.present()
      hideLoading()
    }
  }

  useEffect(() => {
    // 找到新增的 id 加入 visibleItems， 解决 loading 问题
    if (prevPositionIds.length > 0) {
      // 找到新的 positionIds
      const newPositionIds = trade.positionList?.map((item) => item.id) || []
      // 找到 prevPositionIds 中不在 newPositionIds 中的元素
      const diffPositionIds = newPositionIds.filter((id) => !prevPositionIds.includes(id))

      setVisibleItems([...visibleItems, ...diffPositionIds])
    }
    // 更新 prevPositionIds
    setPrevPositionIds(trade.positionList?.map((item) => item.id) || [])
  }, [trade.positionList.length])

  if (trade.positionListLoading)
    return (
      <View className={cn('mt-[100px] flex items-center justify-center')}>
        <ActivityIndicator size={30} />
      </View>
    )

  return (
    <>
      <FlashList
        data={positionList}
        renderItem={(item) => {
          return <RenderItem item={item} onPress={onPress} />
        }}
        style={{ marginInline: 14, paddingTop: 4, paddingBottom: 90 }}
        // showMoreText={false}
        onViewableItemsChanged={onViewableItemsChanged}
        ListEmptyComponent={
          <View className={cn('w-full flex items-center flex-col justify-center h-80 mt-[30px]')}>
            <img src={'/img/webapp/icon-zanwucangwei.png'} style={{ width: 120, height: 120 }} />
            <Text size="sm" color="weak">
              {t('pages.position.No Position')}
            </Text>
            <Button type="primary" style={{ marginTop: 22, width: 143 }} height={46} href="/app/trade">
              <View className={cn('flex flex-row items-end gap-2')}>
                <Iconfont name="zhanghu-jiaoyi" size={20} color={theme.colors.textColor.reverse} />
                <Text size="base" weight="bold" color="white" className="relative top-[1px] -left-1">
                  {t('pages.position.Go Trade')}
                </Text>
              </View>
            </Button>
          </View>
        }
      />
      <SheetModal
        ref={modalRef}
        // height={'90%'}
        autoHeight
        backgroundStyle={{ backgroundColor: theme.colors.backgroundColor.primary }}
        onConfirm={onConfirm}
        confirmText={t('common.operate.Confirm')}
        onDismiss={() => {
          // 重置内容
          trade.setRecordModalItem({} as RecordModalItem)
        }}
        dragOnContent={false}
        showLoading
      >
        {item && (
          <PositionContent item={item} close={close}>
            <TopTabbar ref={tabbarRef} close={close} rawItem={item} tabKey={tabKey} />
          </PositionContent>
        )}
      </SheetModal>
      {/* 市价平仓弹窗 */}
      {item && (
        <MarketCloseConfirmModal
          ref={marketCloseModalRef}
          item={item}
          onClose={() => {
            setItem(null)
          }}
        />
      )}
    </>
  )
}

export default observer(PositionList)
