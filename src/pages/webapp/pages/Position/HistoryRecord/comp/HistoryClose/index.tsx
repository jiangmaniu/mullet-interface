import Iconfont from '@/components/Base/Iconfont'
import { SOURCE_CURRENCY } from '@/constants'
import { stores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import DateRangePickerSheetModal from '@/pages/webapp/components/Base/DatePickerSheetModal/DateRangePickerSheetModal'
import { IlistItemProps } from '@/pages/webapp/components/Base/List/ListItem'
import More from '@/pages/webapp/components/Base/List/More'
import { ModalRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import FilterModal, { FilterModalRef } from '@/pages/webapp/components/settings/FilterModal'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { getTradeRecordsPage } from '@/services/api/tradeCore/order'
import { formatNum } from '@/utils'
import { PullToRefresh } from 'antd-mobile'
import dayjs from 'dayjs'
import VirtualList from 'rc-virtual-list'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CoinHeader, { ISymbolItem } from '../../../comp/CoinHeader'

/**
 * 历史成交单
 */
function HistoryClose() {
  const i18n = useI18n()
  const { cn } = useTheme()

  const [data, setData] = useState<Order.TradeRecordsPageListItem[]>([])
  const [current, setCurrent] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [refreshing, setRefreshing] = useState(true)
  const [startTime, setStartTime] = useState<string | undefined>(undefined)
  const [endTime, setEndTime] = useState<string | undefined>(undefined)

  const getDatas = () => {
    // 分页加载数据
    getTradeRecordsPage({
      current: current,
      size: size,
      accountId: stores.trade.currentAccountInfo?.id,
      symbol: stores.trade.showActiveSymbol ? stores.trade.activeSymbolName : undefined,
      // @ts-ignore TODO: 类型错误
      startTime,
      endTime
    })
      .then((res) => {
        if (res.success && res.data.records) {
          setData(data.concat(res.data.records))
          setTotal(Number(res.data.total))
        }
      })
      .finally(() => {
        setRefreshing(false)
      })
  }

  useEffect(getDatas, [current, size, stores.trade.currentAccountInfo?.id, stores.trade.showActiveSymbol, stores.trade.activeSymbolName]) // Adding dependencies to useEffect

  // 加载更多
  const onEndReached = useCallback(() => {
    if (data.length < total) {
      setCurrent(current + 1)
    }
  }, [data.length, total])

  const onRefresh = async () => {
    setData([])
    setTotal(0)
    setCurrent(1)
    setRefreshing(true)
  }

  useEffect(() => {
    if (startTime && endTime) {
      onRefresh()
    }
  }, [startTime, endTime])

  useEffect(() => {
    if (refreshing) {
      getDatas()
    }
  }, [refreshing])

  const getItemDetails = (item: Order.TradeRecordsPageListItem) => [
    {
      label: i18n.t('pages.position.Profit and Loss'),
      value: item.profit,
      format: (val: string | number | undefined) => (
        <Text size="sm" weight="medium" color={Number(val) > 0 ? 'green' : 'red'}>
          {formatNum(Number(val), {
            precision: stores.trade.currentAccountInfo.currencyDecimal
          })}
          &nbsp;{SOURCE_CURRENCY}
        </Text>
      )
    },
    {
      label: i18n.t('pages.position.Hand Count'),
      value: item.tradingVolume,
      format: (val: string | number | undefined) => (
        <Text color="primary" size="sm" weight="medium">
          {formatNum(val, {
            precision: stores.trade.currentAccountInfo.currencyDecimal
          })}
          &nbsp;{i18n.t('common.unit.Hand')}
        </Text>
      )
    },
    {
      label: i18n.t('pages.position.Handling Fees'),
      value: item.handlingFees,
      format: (val: string | number | undefined) => (
        <Text color="primary" size="sm" weight="medium">
          {formatNum(val, {
            precision: stores.trade.currentAccountInfo.currencyDecimal
          })}
          &nbsp;{SOURCE_CURRENCY}
        </Text>
      ),
      visible: item.inOut === 'OUT'
    },
    {
      label: i18n.t('pages.position.Execute Price'),
      value: item.tradePrice,
      format: (val: string | number | undefined) => (
        <Text color="primary" size="sm" weight="medium">
          {formatNum(val, {
            precision: stores.trade.currentAccountInfo.currencyDecimal
          })}
        </Text>
      )
    },
    { label: i18n.t('History.Trade Time'), value: item.createTime },
    { label: i18n.t('pages.position.Order Number'), value: item.id }
  ]

  const DetailRow = ({
    label,
    value,
    format,
    visible = true
  }: {
    label: string
    value: string | number | undefined
    format?: (val: string | number | undefined) => JSX.Element
    visible?: boolean
  }) => (
    <>
      {visible && (
        <View className={cn('flex flex-row justify-between')}>
          <Text color="weak" size="sm">
            {label}
          </Text>

          {format ? (
            format(value)
          ) : (
            <Text color="primary" size="sm" weight="medium">
              {value}
            </Text>
          )}
        </View>
      )}
    </>
  )

  const renderItem = ({ item }: { item: Order.TradeRecordsPageListItem }) => {
    return (
      <View bgColor="primary" borderColor="weak" className={cn('flex flex-col p-[14px] gap-y-2 border-b')}>
        <View className={cn('flex flex-row items-center justify-between')}>
          <CoinHeader item={item as ISymbolItem} />

          <View className={cn('flex flex-row items-center')}>
            <Text size="sm" weight="medium">
              {/* 状态 */}
              {i18n.t(`common.enum.OrderInOut.${item.inOut}`) || '-'}
            </Text>
          </View>
        </View>

        {getItemDetails(item).map((detail, index) => (
          <DetailRow key={index} {...detail} />
        ))}
      </View>
    )
  }

  // 过滤品种
  const filterModalRef = useRef<FilterModalRef>(null)
  const dateRangePickerRef = useRef<ModalRef>(null)
  const [filterSymbol, setFilterSymbol] = useState<string>('') // 当前筛选项
  const symbolActive = (title: string) => title === filterSymbol
  const symbolClick = async (title: string) => {
    title === filterSymbol ? setFilterSymbol('') : setFilterSymbol(title)
    filterModalRef.current?.close()
  }
  const symbolFilters = useMemo(() => {
    // 可选项列表
    const uniqueSymbols = new Set(data.map((item) => item.symbol))
    return Array.from(uniqueSymbols).map((i) => {
      const title = i || ''
      return {
        title,
        onPress: () => symbolClick(title),
        active: symbolActive(title)
      } as IlistItemProps
    })
  }, [data, filterSymbol])

  const datas = useMemo(() => {
    return data
      .filter((item) => {
        const symbolMatch = filterSymbol ? item.symbol === filterSymbol : true
        return symbolMatch
      })
      .map((item, index) => ({ item, index }))
  }, [data, filterSymbol])

  const onDateRangeConfirm = (startDate: Date, endDate: Date) => {
    setStartTime(dayjs(startDate).format('YYYY-MM-DD 00:00:00'))
    setEndTime(dayjs(endDate).format('YYYY-MM-DD 23:59:59'))
  }

  return (
    <PullToRefresh onRefresh={onRefresh}>
      <View bgColor="primary" className={cn(' flex-1 rounded-t-3xl bg-white min-h-[90vh]')}>
        <View className={cn('flex flex-row justify-between items-center px-3 pt-[14px]')}>
          <View className={cn('flex flex-row items-center gap-2')}>
            <View onPress={() => filterModalRef.current?.show()}>
              <View bgColor="secondary" className={cn('flex flex-row items-center justify-center rounded-md p-[4px]')}>
                <Text size="sm">{i18n.t('pages.position.Filter Symbol')}</Text>
                <Iconfont name="zhanghu-gengduo" size={20} />
              </View>
            </View>
          </View>

          <View onPress={() => dateRangePickerRef.current?.show()}>
            {startTime && endTime ? (
              <View
                onPress={() => {
                  // 清空日期
                  setStartTime(undefined)
                  setEndTime(undefined)
                }}
                className={cn('flex flex-col items-center w-[105px]')}
              >
                <Text size="sm" color="weak">
                  {i18n.t('Common.From')}:&nbsp;{startTime ? dayjs(startTime).format('YYYY/MM/DD') : i18n.t('pages.position.Start Date')}
                </Text>
                <Text size="sm" color="weak">
                  {i18n.t('Common.To')}:&nbsp;{endTime ? dayjs(endTime).format('YYYY/MM/DD') : i18n.t('pages.position.End Date')}
                </Text>
              </View>
            ) : (
              <Iconfont name="dingdan-shaixuan" size={28} />
            )}
          </View>
        </View>
        {datas.length > 0 ? (
          <VirtualList itemKey="index" data={datas} extraRender={() => <View>{data.length < total ? <More /> : <></>}</View>}>
            {renderItem}
          </VirtualList>
        ) : (
          <View className={cn('flex flex-col items-center justify-center h-80')}>
            <img src={'/images/icon-zanwucangwei.png'} style={{ width: 120, height: 120 }} />
            <Text size="sm" color="weak">
              {i18n.t('common.NO Data')}
            </Text>
          </View>
        )}
        <FilterModal key="symbol" ref={filterModalRef} data={symbolFilters} />
        <DateRangePickerSheetModal ref={dateRangePickerRef} onConfirm={onDateRangeConfirm} />
      </View>
    </PullToRefresh>
  )
}

export default HistoryClose
