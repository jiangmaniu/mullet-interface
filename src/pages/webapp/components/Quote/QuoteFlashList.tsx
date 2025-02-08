import { useIntl } from '@umijs/max'
import { debounce } from 'lodash'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { useMemo, useState } from 'react'

import { useEnv } from '@/context/envProvider'
import { useLoading } from '@/context/loadingProvider'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import FlashList from '../Base/List/FlashList'
import { Text } from '../Base/Text'
import { View } from '../Base/View'
import QuoteItem from './QuoteItem'
import { TabKey } from './QuoteTopTabbar'

type IProps = {
  /** 搜索框输入值 */
  searchValue?: string
  onItem?: (item?: Account.TradeSymbolListItem) => void
  tabKey?: TabKey
  tabValue?: string
  /**列表高度 */
  height?: number
  visible?: boolean
  position?: 'PAGE' | 'MODAL'
}

function QuoteFlashList({ height, searchValue, onItem, tabKey, tabValue, visible, position }: IProps) {
  const { cn, theme } = useTheme()
  const { trade, ws } = useStores()
  const { isPwaApp } = useEnv()
  const intl = useIntl()
  const symbolList = trade.symbolListAll
  const [visibleItems, setVisibleItems] = useState<string[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const { showLoading, hideLoading } = useLoading()

  const symbolListLoading = trade.symbolListLoading

  // 不使用全屏遮罩的loading，否则无法切换到其他页面
  // useEffect(() => {
  //   showLoading({ backgroundColor: 'transparent', color: theme.colors.textColor.weak })
  //   if (!symbolListLoading) {
  //     hideLoading()
  //   }
  // }, [symbolListLoading])

  const onViewableItemsChanged = debounce((visibleList) => {
    const newVisibleItems = visibleList?.map((item: Account.TradeSymbolListItem) => item.id) || []
    setVisibleItems(newVisibleItems)
  }, 100)

  const symbolDataList = useMemo(() => {
    // 自选列表
    if (tabKey === 'FAVORITE') {
      return toJS(trade.favoriteList)
    }

    // 10加密货币 20大宗商品 30外汇 40指数 50股票
    // 切换Tab按分类获取品种列表数据，达到使用缓存的目的
    const list = symbolList.filter((item) => (tabValue === '0' ? true : item.classify === tabValue))
    return toJS(list)
  }, [tabValue, trade.favoriteList, symbolList, tabKey])

  const onRefresh = async () => {
    if (refreshing) return

    trade.getSymbolList().finally(() => {
      setRefreshing(false)
    })
  }

  const list = useMemo(() => {
    let list = symbolDataList.map((d) => ({
      ...d,
      // visible: visibleItems.includes(d.id as never)
      visible: true
    }))

    if (!searchValue) return list

    return list.filter((v) => v.symbol.toLowerCase().indexOf(String(searchValue).toLowerCase()) !== -1)
  }, [symbolDataList, trade.favoriteList.length, searchValue, visible])

  const renderItem = (item: Account.TradeSymbolListItem) => {
    return (
      <div className="px-3">
        <QuoteItem item={item} tabKey={tabKey} onItem={onItem} key={item.id} />
      </div>
    )
  }

  return (
    <div className={cn('flex-1')}>
      <FlashList
        data={list}
        renderItem={renderItem}
        showMoreText
        refreshing={symbolListLoading}
        // hasMore
        estimatedItemSize={76} // 估算的 item 高度
        // 页面不使用虚拟滚动，否则safari浏览器不能隐藏底部搜索栏，交互体验不佳
        height={position === 'MODAL' ? height || document.body.clientHeight - 180 : 0}
        onViewableItemsChanged={onViewableItemsChanged}
        ListHeaderComponent={
          <View className={cn('flex flex-row justify-between pb-2 px-3')}>
            <View className={cn('flex-1')}>
              <Text size="xs" color="weak">
                {intl.formatMessage({ id: 'pages.trade.Symbol' })}
              </Text>
            </View>
            <View className="flex items-center justify-end min-w-[180px] gap-x-[100px]">
              <View className={cn('text-center')}>
                <Text size="xs" color="weak">
                  {intl.formatMessage({ id: 'pages.trade.Buy Price' })}
                </Text>
              </View>
              <View className={cn('pr-3 text-end')}>
                <Text size="xs" color="weak">
                  {intl.formatMessage({ id: 'pages.trade.Sell Price' })}
                </Text>
              </View>
            </View>
          </View>
        }
        extraRender={() => <View className="h-[30px]"></View>}
      />
    </div>
  )
}

export default observer(QuoteFlashList)
