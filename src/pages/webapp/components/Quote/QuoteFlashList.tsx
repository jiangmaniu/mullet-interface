import { useIntl } from '@umijs/max'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { useEffect, useMemo, useState } from 'react'

import { useLoading } from '@/context/loadingProvider'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'

import FlashList from '../Base/List/FlashList'
import { Text } from '../Base/Text'
import { View } from '../Base/View'
import QuoteItem from './QuoteItem'

type IProps = {
  /** 搜索框输入值 */
  searchValue?: string
  onItem?: (item?: Account.TradeSymbolListItem) => void
  tabKey?: string
  tabValue?: string
}

function QuoteFlashList({ searchValue, onItem, tabKey, tabValue }: IProps) {
  const { cn, theme } = useTheme()
  const { trade, ws } = useStores()
  const intl = useIntl()
  const symbolList = trade.symbolListAll

  const { showLoading, hideLoading } = useLoading()

  const symbolListLoading = trade.symbolListLoading

  useEffect(() => {
    showLoading({ backgroundColor: 'transparent', color: theme.colors.textColor.weak })
    if (!symbolListLoading) {
      hideLoading()
    }
  }, [symbolListLoading])

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

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = async () => {
    if (refreshing) return

    trade.getSymbolList().finally(() => {
      setRefreshing(false)
    })
  }

  const list = useMemo(() => {
    let list = symbolDataList.map((d) => ({
      ...d
    }))

    if (!searchValue) return list

    return list.filter((v) => v.symbol.toLowerCase().indexOf(String(searchValue).toLowerCase()) !== -1)
  }, [symbolDataList, tabKey, trade.favoriteList.length, searchValue])

  const renderItem = (item: Account.TradeSymbolListItem) => {
    return (
      <div className="px-3">
        <QuoteItem item={item} onItem={onItem} key={item.id} />
      </div>
    )
  }

  return (
    <div className={cn('flex-1')}>
      <FlashList
        // @TODO
        // data={list}
        data={symbolList}
        renderItem={renderItem}
        showMoreText
        // hasMore
        estimatedItemSize={76} // 估算的 item 高度
        height={document.body.clientHeight}
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
        extraRender={() => <></>}
      />
    </div>
  )
}

export default observer(QuoteFlashList)
