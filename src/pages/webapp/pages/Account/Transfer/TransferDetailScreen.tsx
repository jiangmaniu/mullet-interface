import Iconfont from '@/components/Base/Iconfont'
import { SOURCE_CURRENCY } from '@/constants'
import { stores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import DateRangePickerSheetModal from '@/pages/webapp/components/Base/DatePickerSheetModal/DateRangePickerSheetModal'
import Header from '@/pages/webapp/components/Base/Header'
import { ModalRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { getMoneyRecordsPageList } from '@/services/api/tradeCore/account'
import { formatNum, formatStringWithEllipsis } from '@/utils'
import { useModel } from '@umijs/max'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Tooltip from '../AccountDetail/Tooltip'

import VirtualList from 'rc-virtual-list'

const TransferDetailScreen = () => {
  const { theme, cn } = useTheme()
  const { t } = useI18n()

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  const user = useModel('user')
  const [data, setData] = useState<Account.MoneyRecordsPageListItem[]>([])
  const [current, setCurrent] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [refreshing, setRefreshing] = useState(true)
  const [startTime, setStartTime] = useState<Date | undefined>(undefined)
  const [endTime, setEndTime] = useState<Date | undefined>(undefined)

  const datePickerRef = useRef<ModalRef>(null)
  const onDateRangeConfirm = (startDate: Date, endDate: Date) => {
    setStartTime(startDate)
    setEndTime(endDate)
  }

  const accountList = currentUser?.accountList || []

  const getTag = (accountId: any) => {
    return accountList.find((item) => item.id === accountId)?.synopsis?.abbr
  }

  const getName = (accountId: any) => {
    return accountList.find((item) => item.id === accountId)?.name
  }

  const getDatas = () => {
    // 分页加载数据async
    getMoneyRecordsPageList({
      current,
      size,
      type: 'TRANSFER',
      accountId: stores.trade.currentAccountInfo?.id,
      startTime: startTime ? dayjs(startTime).format('YYYY-MM-DD 00:00:00') : undefined,
      endTime: endTime ? dayjs(endTime).format('YYYY-MM-DD 23:59:59') : undefined
    })
      .then((res) => {
        if (res.success && res.data?.records) {
          const uniqueRecords = res.data.records.filter((record) => !data.some((existingRecord) => existingRecord.id === record.id))
          setData((prevData) => prevData.concat(uniqueRecords))
          setTotal(Number(res.data.total))
        }
      })
      .finally(() => {
        setRefreshing(false)
      })
  }

  useEffect(getDatas, [current, size, refreshing, stores.trade.currentAccountInfo]) // Adding dependencies to useEffect

  useEffect(() => {
    if (startTime && endTime && startTime > endTime) {
      setStartTime(endTime)
      return
    }

    if (startTime && endTime) {
      setData([])
      setTotal(0)
      setTimeout(() => {
        if (current === 1) {
          getDatas()
        } else {
          setCurrent(1)
        }
      }, 10)
    }
  }, [startTime, endTime])

  // 加载更多
  const onEndReached = useCallback(() => {
    if (data.length < total) {
      setCurrent(current + 1)
    }
  }, [data.length, total])

  const onRefresh = async () => {
    setRefreshing(true)
    setData([])
    setTotal(0)
    setCurrent(1)
  }

  const renderItem = ({ item }: any) => {
    const from = item.remark?.fromAccountId
    const to = item.remark?.toAccountId
    return (
      <View bgColor="primary" borderColor="weak" className={cn(' rounded-xl flex flex-col w-full py-[14px] px-3 gap-4 mt-3')}>
        <View className={cn('flex flex-row justify-between items-start')}>
          <View className={cn('flex flex-row justify-start items-center gap-3')}>
            <View className={cn(' rounded-full w-10 h-10 flex items-center justify-center')} bgColor="secondary">
              <Iconfont name="huazhuanjilu-huazhuan" size={18} color={theme.colors.textColor.primary} />
            </View>
            <View className={cn('flex flex-col items-start')}>
              <Text size="sm" weight="medium" color="primary">
                {t('pages.position.Transfer2')}
              </Text>
              <Text size="xs" color="weak" weight="light">
                {item.createTime}
              </Text>
            </View>
          </View>
          <Text size="base" color="primary" weight="medium">
            {formatNum(item.money)}&nbsp;{SOURCE_CURRENCY}
          </Text>
        </View>
        <View className={cn('flex flex-row justify-start items-center')}>
          <Tooltip content={getName(from)} trigger="onPress" placement="top-start">
            <View className={cn('w-[150px] flex flex-row items-center overflow-hidden')}>
              <View className={cn(' flex h-4 min-w-[20px] items-center px-1 justify-center rounded bg-black text-xs font-normal mr-1')}>
                <Text color="white" size="xs">
                  {getTag(from)}
                </Text>
              </View>
              <Text size="xs" color="primary" weight="medium">
                {formatStringWithEllipsis(getName(from) || '', 12)}
              </Text>
            </View>
          </Tooltip>
          <Iconfont name="tongzhi-jinru" size={16} className={cn('mx-3')} />
          <Tooltip content={getName(to)} trigger="onPress" placement="top-end">
            <View className={cn('w-[150px] flex flex-row items-center overflow-hidden')}>
              <View className={cn(' flex h-4 min-w-[20px] items-center px-1 justify-center rounded bg-black text-xs font-normal mr-1')}>
                <Text color="white" size="xs">
                  {getTag(from)}
                </Text>
              </View>
              <Text size="xs" color="primary" weight="medium">
                {formatStringWithEllipsis(getName(to) || '', 12)}
              </Text>
            </View>
          </Tooltip>
        </View>
      </View>
    )
  }

  const datas = useMemo(() => {
    return data
      .filter((item) => {
        const symbolMatch = item
        return symbolMatch
      })
      .map((item) => ({
        item
      }))
  }, [data])

  return (
    <Basiclayout style={{ paddingLeft: 14, paddingRight: 14 }} bgColor="secondary" headerColor={theme.colors.backgroundColor.secondary}>
      <Header title={t('app.pageTitle.Transfer Records')} back />

      <View className={cn('flex flex-row justify-between items-center pt-3 ')}>
        <View className={cn('flex flex-row items-center gap-2')}>
          <View onPress={() => datePickerRef.current?.show()}>
            <View bgColor="secondary" className={cn('flex flex-row items-center justify-center rounded-md p-[4px]')}>
              <img src={'/img/webapp/rili.png'} style={{ width: 16, height: 16 }} />
              <Text size="sm" color="weak" className={cn('ml-2')}>
                {startTime ? dayjs(startTime).format('YYYY-MM-DD') : t('pages.position.Start Date')}&nbsp;-&nbsp;
                {endTime ? dayjs(endTime).format('YYYY-MM-DD') : t('pages.position.End Date')}
              </Text>
              <Iconfont name="zhanghu-gengduo" size={20} className={cn('ml-2')} color={theme.colors.textColor.weak} />
            </View>
          </View>
        </View>
      </View>

      {/* {datas && (
        <div className="pt-2">
          {datas.map((item) => {
            return renderItem(item)
          })}
        </div>
      )} */}
      {/* <FlashListShopify
        data={datas}
        renderItem={renderItem}
        ListHeaderComponent={

        }
        ItemSeparatorComponent={() => <View style={{ marginBottom: 12 }} />}
        contentContainerStyle={{ padding: 0, paddingTop: 8 }}
        showMoreText={true}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        refreshing={refreshing}
        hasMore={data.length < total}
      /> */}

      <VirtualList itemKey="item" data={datas}>
        {renderItem}
      </VirtualList>
      <DateRangePickerSheetModal ref={datePickerRef} onConfirm={onDateRangeConfirm} />
    </Basiclayout>
  )
}

export default TransferDetailScreen
