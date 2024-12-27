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
import { getMoneyRecordsPageList } from '@/services/api/tradeCore/account'
import { formatNum } from '@/utils'
import { PullToRefresh } from 'antd-mobile'
import dayjs from 'dayjs'
import VirtualList from 'rc-virtual-list'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * 资金流水
 */
function FundRecord() {
  const i18n = useI18n()
  const { cn } = useTheme()

  const [data, setData] = useState<Account.MoneyRecordsPageListItem[]>([])
  const [current, setCurrent] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [refreshing, setRefreshing] = useState(true)
  const [startTime, setStartTime] = useState<string | undefined>(undefined)
  const [endTime, setEndTime] = useState<string | undefined>(undefined)

  const getDatas = () => {
    // 分页加载数据
    getMoneyRecordsPageList({
      current: current,
      size: size,
      accountId: stores.trade.currentAccountInfo?.id,
      startTime,
      endTime
    })
      .then((res) => {
        if (res.success && res.data?.records) {
          setData(data.concat(res.data.records))
          setTotal(Number(res.data.total))
        }
      })
      .finally(() => {
        setRefreshing(false)
      })
  }

  useEffect(getDatas, [current, size, stores.trade.currentAccountInfo?.id]) // Adding dependencies to useEffect

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

  const renderItem = ({ item }: { item: Account.MoneyRecordsPageListItem }) => {
    return (
      <View bgColor="primary" borderColor="weak" className={cn('flex flex-col justify-start ')}>
        <View className={cn('flex flex-row ')} borderColor="weak">
          <View className={cn('flex flex-col items-center gap-2 ')}>
            <Iconfont name="fangdian" size={20} />
            <View className={cn('flex flex-col gap-1')}>
              <View style={{ width: 0.5, height: 8, borderRadius: 2, backgroundColor: 'black', marginRight: 2, marginTop: 4 }} />
              <View style={{ width: 0.5, height: 8, borderRadius: 2, backgroundColor: 'black', marginRight: 2 }} />
              <View style={{ width: 0.5, height: 8, borderRadius: 2, backgroundColor: 'black', marginRight: 2 }} />
              <View style={{ width: 0.5, height: 8, borderRadius: 2, backgroundColor: 'black', marginRight: 2 }} />
              <View style={{ width: 0.5, height: 8, borderRadius: 2, backgroundColor: 'black', marginRight: 2 }} />
              <View style={{ width: 0.5, height: 8, borderRadius: 2, backgroundColor: 'black', marginRight: 2 }} />
              <View style={{ width: 0.5, height: 8, borderRadius: 2, backgroundColor: 'black', marginRight: 2 }} />
              <View style={{ width: 0.5, height: 8, borderRadius: 2, backgroundColor: 'black', marginRight: 2 }} />
            </View>
          </View>
          <View className={cn('flex flex-1 flex-col gap-[6px]')}>
            <Text color="primary" size="sm" weight="medium">
              {item.createTime}
            </Text>
            <View className={cn('flex-1 flex flex-row justify-between')}>
              <Text color="weak" size="sm">
                {i18n.t('pages.position.Type')}
              </Text>
              <Text color="primary" size="sm" weight="medium">
                {i18n.t(`common.enum.BalanceType.${item.type}`)}
              </Text>
            </View>
            <View className={cn('flex-1 flex flex-row justify-between')}>
              <Text color="weak" size="sm">
                {i18n.t('pages.position.Previous Balance')}
              </Text>
              <Text size="sm" weight="medium">
                {formatNum(item.oldBalance, {
                  precision: stores.trade.currentAccountInfo.currencyDecimal
                })}
                &nbsp;{SOURCE_CURRENCY}
              </Text>
            </View>
            <View className={cn('flex-1 flex flex-row justify-between')}>
              <Text color="weak" size="sm">
                {i18n.t('pages.position.Amount')}
              </Text>
              <Text size="sm" weight="medium" color={Number(item.money) > 0 ? 'green' : 'red'}>
                {formatNum(item.money, {
                  precision: stores.trade.currentAccountInfo.currencyDecimal
                })}
                &nbsp;{SOURCE_CURRENCY}
              </Text>
            </View>
            <View className={cn('flex-1 flex flex-row justify-between')}>
              <Text color="weak" size="sm">
                {i18n.t('pages.position.Balance')}
              </Text>
              <Text color="primary" size="sm" weight="medium">
                {
                  // @ts-ignore TODO: 类型错误
                  formatNum(item.newBalance, {
                    precision: stores.trade.currentAccountInfo.currencyDecimal
                  })
                }
                &nbsp;{SOURCE_CURRENCY}
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  // 过滤类型
  const filterModalRef2 = useRef<FilterModalRef>(null)
  const [filterType, setFilterType] = useState<API.MoneyType | '' | undefined>('') // 当前筛选项
  const typeActive = (title: string) => title === filterType
  const typeClick = (title: string) => {
    title === filterType ? setFilterType('') : setFilterType(title as API.MoneyType)
    filterModalRef2.current?.close()
  }
  const typeFilters = useMemo(() => {
    // 可选项列表
    const uniqueTypes = new Set(data.map((item) => item.type))
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
        const typeMatch = filterType ? item.type === filterType : true
        return typeMatch
      })
      .map((item) => ({ item }))
  }, [data, filterType])

  const dateRangePickerRef = useRef<ModalRef>(null)
  const onDateRangeConfirm = (startDate: Date, endDate: Date) => {
    setStartTime(dayjs(startDate).format('YYYY-MM-DD 00:00:00'))
    setEndTime(dayjs(endDate).format('YYYY-MM-DD 23:59:59'))
  }

  return (
    <View bgColor="primary" className={cn(' flex-1 rounded-t-3xl px-3')}>
      <View className={cn('flex flex-row justify-between items-center pt-[14px] pb-2')}>
        <View className={cn('flex flex-row items-center gap-2')}>
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
      <PullToRefresh onRefresh={onRefresh}>
        <VirtualList itemKey="item" data={datas} extraRender={() => <View>{data.length < total ? <More /> : <></>}</View>}>
          {renderItem}
        </VirtualList>
      </PullToRefresh>
      <FilterModal key="type" ref={filterModalRef2} data={typeFilters} />
      <DateRangePickerSheetModal ref={dateRangePickerRef} onConfirm={onDateRangeConfirm} />
    </View>
  )
}

export default FundRecord
