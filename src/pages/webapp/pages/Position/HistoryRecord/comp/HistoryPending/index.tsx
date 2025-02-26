import Iconfont from '@/components/Base/Iconfont'
import { SOURCE_CURRENCY } from '@/constants'
import { stores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { IlistItemProps } from '@/pages/webapp/components/Base/List/ListItem'
import { ModalRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import FilterModal, { FilterModalRef } from '@/pages/webapp/components/settings/FilterModal'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { getOrderPage } from '@/services/api/tradeCore/order'
import { formatNum } from '@/utils'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CoinHeader, { ISymbolItem } from '../../../comp/CoinHeader'

import DateRangePickerSheetModal from '@/pages/webapp/components/Base/DatePickerSheetModal/DateRangePickerSheetModal'
import Empty from '@/pages/webapp/components/Base/List/Empty'
import End from '@/pages/webapp/components/Base/List/End'
import GetMore from '@/pages/webapp/components/Base/List/GetMore'
import { PullToRefresh } from '@/pages/webapp/components/Base/List/PullToRefresh'
import VirtualList from 'rc-virtual-list'

/**
 * 历史委托单（历史挂单列表）
 */
function HistoryPending() {
  const i18n = useI18n()
  const { cn, theme } = useTheme()

  const [data, setData] = useState<Order.OrderPageListItem[]>([])
  const [current, setCurrent] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [startTime, setStartTime] = useState<string | undefined>(undefined)
  const [endTime, setEndTime] = useState<string | undefined>(undefined)

  const getDatas = useCallback(() => {
    // 分页加载数据
    getOrderPage({
      current: current,
      size: size,
      status: 'CANCEL,FAIL,FINISH',
      accountId: stores.trade.currentAccountInfo?.id,
      symbol: stores.trade.showActiveSymbol ? stores.trade.activeSymbolName : undefined,
      // @ts-ignore TODO: 类型错误
      startTime,
      endTime
    }).then((res) => {
      if (res.success && res.data.records) {
        setData(data.concat(res.data.records))
        setTotal(Number(res.data.total))
      }
    })
  }, [current, size, stores.trade.currentAccountInfo?.id, stores.trade.showActiveSymbol, stores.trade.activeSymbolName])

  // 加载更多
  const onEndReached = useCallback(() => {
    if (data.length < total) {
      setCurrent(current + 1)
      getDatas()
    }
  }, [data.length, total])

  const onRefresh = async () => {
    setData([])
    setTotal(0)
    setCurrent(1)
    getDatas()
  }

  useEffect(() => {
    if ((startTime && endTime) || (!startTime && !endTime)) {
      onRefresh()
    }
  }, [startTime, endTime])

  const getItemDetails = (item: Order.OrderPageListItem) => [
    {
      label: i18n.t('pages.position.Entrusted Price'),
      value: item.limitPrice,
      format: (val: string | number | undefined) => (
        <Text color="primary" size="sm" weight="medium">
          {formatNum(val, {
            precision: stores.trade.currentAccountInfo.currencyDecimal
          })}
          {/* &nbsp;{SOURCE_CURRENCY} */}
        </Text>
      )
    },
    {
      label: i18n.t('pages.position.Entrusted Count'),
      value: item.orderVolume,
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
      label: i18n.t('pages.position.Trade Price'),
      value: item.tradePrice,
      format: (val: string | number | undefined) => (
        <Text color="primary" size="sm" weight="medium">
          {formatNum(val, {
            precision: stores.trade.currentAccountInfo.currencyDecimal
          })}
          {/* &nbsp;{SOURCE_CURRENCY} */}
        </Text>
      )
    },
    {
      label: i18n.t('pages.position.Order Close Volume'),
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
      )
    },
    { label: i18n.t('History.Order Time'), value: item.createTime },
    {
      label: i18n.t('History.Trade Time'),
      // @ts-ignore TODO: 类型错误
      value: item.finishTime
    }
  ]

  const DetailRow = ({
    label,
    value,
    format
  }: {
    label: string
    value: string | number | undefined
    format?: (val: string | number | undefined) => JSX.Element
  }) => (
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
  )

  const renderItem = ({ item }: { item: Order.OrderPageListItem }) => {
    return (
      <View bgColor="primary" borderColor="weak" className={cn('flex flex-col p-[14px] gap-y-2 border-b')}>
        <View className={cn('flex flex-row items-center justify-between')}>
          <CoinHeader item={item as ISymbolItem} />
          <View
            onPress={() =>
              navigateTo('/app/position/record/detail', {
                id: item.id,
                imgUrl: item.imgUrl
              })
            }
            children={
              <View className={cn('flex flex-row items-center')}>
                <Text size="sm" weight="medium">
                  {/* 状态 */}
                  {item.status}
                  {/* {i18n.t(`${Enums.OrderStatus?.[item.status!]?.key}`) || '-'} */}
                </Text>
                <Iconfont name="hangqing-xiaoanniu-gengduo" size={20} />
              </View>
            }
          />
        </View>

        {getItemDetails(item).map((detail, index) => (
          <DetailRow key={index} {...detail} />
        ))}
      </View>
    )
  }

  // 过滤品种
  const filterModalRef = useRef<FilterModalRef>(null)
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

  // 过滤类型
  const filterModalRef2 = useRef<FilterModalRef>(null)
  const [filterType, setFilterType] = useState<API.OrderStatus | '' | undefined>('') // 当前筛选项
  const typeActive = (title: API.OrderStatus | '' | undefined) => title === filterType
  const typeClick = (title: API.OrderStatus | '' | undefined) => {
    title === filterType ? setFilterType('') : setFilterType(title)
    filterModalRef2.current?.close()
  }
  const typeFilters = useMemo(() => {
    // 可选项列表
    const uniqueTypes = new Set(data.map((item) => item.status))
    return Array.from(uniqueTypes).map((i) => {
      const title = i || ''
      return {
        title: i,
        onPress: () => typeClick(title),
        active: typeActive(title)
      } as IlistItemProps
    })
  }, [data, filterType])

  const datas = useMemo(() => {
    return data
      .filter((item) => {
        const symbolMatch = filterSymbol ? item.symbol === filterSymbol : true
        const typeMatch = filterType ? item.status === filterType : true
        return symbolMatch && typeMatch
      })
      .map((item, index) => ({ item, index }))
  }, [data, filterSymbol, filterType])

  const dateRangePickerRef = useRef<ModalRef>(null)
  const onDateRangeConfirm = (startDate: Date, endDate: Date) => {
    setStartTime(dayjs(startDate).format('YYYY-MM-DD 00:00:00'))
    setEndTime(dayjs(endDate).format('YYYY-MM-DD 23:59:59'))
  }

  return (
    <PullToRefresh onRefresh={onRefresh}>
      <View bgColor="primary" className={cn('flex-1 rounded-t-3xl bg-white min-h-[90vh]')}>
        <View className={cn('flex flex-row justify-between items-center px-3 pt-[14px]')}>
          <View className={cn('flex flex-row items-center gap-2')}>
            <View onPress={() => filterModalRef.current?.show()}>
              <View bgColor="secondary" className={cn('flex flex-row items-center justify-center rounded-md p-[4px]')}>
                <Text size="sm">{i18n.t('pages.position.Filter Symbol')}</Text>
                <Iconfont name="zhanghu-gengduo" size={20} />
              </View>
            </View>
            <View onPress={() => filterModalRef2.current?.show()}>
              <View bgColor="secondary" className={cn('flex flex-row items-center justify-center rounded-md p-[4px]')}>
                <Text size="sm">{i18n.t('pages.position.Filter Type')}</Text>
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
          <VirtualList
            itemKey="index"
            data={datas}
            extraRender={() => <View>{data.length < total ? <GetMore onClick={onEndReached} /> : <End />}</View>}
          >
            {({ item }) => renderItem({ item })}
          </VirtualList>
        ) : (
          <View className={cn('flex flex-col items-center justify-center h-80')}>
            <Empty />
          </View>
        )}

        <FilterModal key="symbol" ref={filterModalRef} data={symbolFilters} />
        <FilterModal key="type" ref={filterModalRef2} data={typeFilters} />
        <DateRangePickerSheetModal ref={dateRangePickerRef} onConfirm={onDateRangeConfirm} />
      </View>
    </PullToRefresh>
  )
}

export default HistoryPending
