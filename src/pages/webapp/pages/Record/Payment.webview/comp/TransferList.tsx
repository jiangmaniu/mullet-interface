import Iconfont from '@/components/Base/Iconfont'
import { SOURCE_CURRENCY } from '@/constants'
import { stores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import DateRangePickerSheetModal from '@/pages/webapp/components/Base/DatePickerSheetModal/DateRangePickerSheetModal'
import Empty from '@/pages/webapp/components/Base/List/Empty'
import More from '@/pages/webapp/components/Base/List/More'
import { ModalRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { getMoneyRecordsPageList } from '@/services/api/tradeCore/account'
import { formatNum } from '@/utils'
import { useModel } from '@umijs/max'
import { PullToRefresh } from 'antd-mobile'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import VirtualList from 'rc-virtual-list'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Tooltip from '../../../Account/AccountDetail/Tooltip'
import DepositDetailModal from './DepositDetailModal'

/**
 * 资金流水
 */
function DepositList() {
  const i18n = useI18n()
  const { cn } = useTheme()

  const [data, setData] = useState<Wallet.depositOrderListItem[]>([])
  const [current, setCurrent] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [startTime, setStartTime] = useState<string | undefined>(undefined)
  const [endTime, setEndTime] = useState<string | undefined>(undefined)

  const getDatas = useCallback(() => {
    getMoneyRecordsPageList({
      current,
      size,
      type: 'TRANSFER',
      accountId: stores.trade.currentAccountInfo?.id,
      startTime: startTime ? dayjs(startTime).format('YYYY-MM-DD 00:00:00') : undefined,
      endTime: endTime ? dayjs(endTime).format('YYYY-MM-DD 23:59:59') : undefined
    }).then((res) => {
      if (res.success && res.data?.records) {
        const uniqueRecords = res.data.records.filter((record) => !data.some((existingRecord) => existingRecord.id === record.id))
        setData((prevData) => prevData.concat(uniqueRecords))
        setTotal(Number(res.data.total))
      }
    })
  }, [current, size, stores.trade.currentAccountInfo?.id, startTime, endTime])

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

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号

  const getTag = (accountId: any) => {
    return accountList.find((item) => item.id === accountId)?.synopsis?.abbr
  }

  const getName = (accountId: any) => {
    return accountList.find((item) => item.id === accountId)?.name
  }

  const getId = (accountId: any) => {
    return accountList.find((item) => item.id === accountId)?.id
  }

  const { theme } = useTheme()

  const renderItem = ({ item }: any) => {
    console.log('item', item)
    const from = item.remark?.fromAccountId
    const to = item.remark?.toAccountId
    return (
      <div className="flex flex-col gap-[6px] mb-5">
        <div className=" text-xs font-medium text-gray-900 flex flex-row items-center gap-1">
          <Iconfont name="shijian" size={14} color={theme.colors.textColor.primary} />
          <span className="text-gray-900">{item.createTime}</span>
        </div>
        <View bgColor="primary" borderColor="weak" className={cn(' rounded-xl flex flex-col w-full py-[14px] px-3 gap-4')}>
          <View className={cn('flex flex-row justify-between items-start')}>
            <View className={cn('flex flex-row justify-start items-center gap-3')}>
              <View className={cn(' rounded-full w-10 h-10 flex items-center justify-center border border-gray-130')} bgColor="secondary">
                <Iconfont name="huazhuanjilu-huazhuan" size={18} color={theme.colors.textColor.primary} />
              </View>
              <View className={cn('flex flex-col items-start')}>
                <Text size="sm" weight="medium" color="primary">
                  {i18n.t('pages.position.Transfer2')}
                </Text>
                <Text size="xs" color="weak" weight="light">
                  {i18n.t('mt.danhao')}:{item.id}
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
                  {/* {formatStringWithEllipsis(getName(from) || '', 12)} */}
                  &nbsp;#{getId(from)}
                </Text>
              </View>
            </Tooltip>
            <Iconfont name="tongzhi-jinru" size={16} className={cn('mx-3')} />
            <Tooltip content={getName(to)} trigger="onPress" placement="top-end">
              <View className={cn('w-[150px] flex flex-row items-center overflow-hidden')}>
                <View className={cn(' flex h-4 min-w-[20px] items-center px-1 justify-center rounded bg-black text-xs font-normal mr-1')}>
                  <Text color="white" size="xs">
                    {getTag(to)}
                  </Text>
                </View>
                <Text size="xs" color="primary" weight="medium">
                  {/* {formatStringWithEllipsis(getName(to) || '', 12)} */}
                  &nbsp;#{getId(to)}
                </Text>
              </View>
            </Tooltip>
          </View>
        </View>
      </div>
    )
  }

  const onSelectItem = (item: Wallet.depositOrderListItem) => {
    setItem(item)
    depositDetailModalRef.current?.show()
  }

  const datas = useMemo(() => {
    return data.map((item, index) => ({ item, index }))
  }, [data])

  const dateRangePickerRef = useRef<ModalRef>(null)
  const onDateRangeConfirm = (startDate: Date, endDate: Date) => {
    setStartTime(dayjs(startDate).format('YYYY-MM-DD 00:00:00'))
    setEndTime(dayjs(endDate).format('YYYY-MM-DD 23:59:59'))
  }

  const [item, setItem] = useState<Wallet.depositOrderListItem | undefined>(undefined)
  const depositDetailModalRef = useRef<ModalRef>(null)

  return (
    <PullToRefresh onRefresh={onRefresh}>
      <View bgColor="secondary" className={cn('flex-1 min-h-[90vh]')}>
        <View className={cn('flex flex-row justify-between items-center pt-[14px] px-[14px] pb-2 border-b border-gray-70')}>
          <View onPress={() => dateRangePickerRef.current?.show()}>
            {startTime && endTime ? (
              <div
                className="flex flex-row items-center gap-[5px]"
                onClick={() => {
                  // 清空日期
                  setStartTime(undefined)
                  setEndTime(undefined)
                }}
              >
                <Iconfont name="riqi" size={28} />
                <Text size="sm" color="primary">
                  {startTime ? dayjs(startTime).format('YYYY.MM.DD') : i18n.t('pages.position.Start Date')}
                </Text>
                -
                <Text size="sm" color="primary">
                  {endTime ? dayjs(endTime).format('YYYY.MM.DD') : i18n.t('pages.position.End Date')}
                </Text>
                <Iconfont name="down" size={28} />
              </div>
            ) : (
              <div className="flex flex-row items-center gap-[5px]">
                <Iconfont name="riqi" size={28} />
                <Text size="sm" color="primary">
                  {i18n.t('mt.xuanzeshijianfanwei')}
                </Text>
                <Iconfont name="down" size={28} />
              </div>
            )}
          </View>
        </View>
        <div className="px-[14px] pt-5">
          {datas.length > 0 ? (
            <View className={cn('pt-2')}>
              <VirtualList itemKey="index" data={datas} extraRender={() => <View>{data.length < total ? <More /> : <></>}</View>}>
                {renderItem}
              </VirtualList>
            </View>
          ) : (
            <View className={cn('flex flex-col items-center justify-center h-80')}>
              <Empty />
            </View>
          )}
        </div>
        <DateRangePickerSheetModal ref={dateRangePickerRef} onConfirm={onDateRangeConfirm} />
        <DepositDetailModal ref={depositDetailModalRef} item={item} />
      </View>
    </PullToRefresh>
  )
}

export default observer(DepositList)
