import { useTheme } from '@/context/themeProvider'
import { useEffect, useState } from 'react'
// import Clipboard from '@react-native-clipboard/clipboard'
import Iconfont from '@/components/Base/Iconfont'
import { SOURCE_CURRENCY } from '@/constants'
import { Enums } from '@/constants/enum'
import { stores } from '@/context/mobxProvider'
import Header from '@/pages/webapp/components/Base/Header'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import SymbolIcon from '@/pages/webapp/components/Quote/SymbolIcon'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { getOrderDetail, getTradeRecordsPage } from '@/services/api/tradeCore/order'
import { formatNum } from '@/utils'
import { message } from '@/utils/message'
import { useLocation } from '@umijs/max'

/**
 * 历史委托订单详情
 */
function HistoryOrderDetail() {
  const i18n = useI18n()
  const { cn, theme } = useTheme()

  // const route = useRoute<RouteProp<RootStackScreen, 'HistoryOrderDetail'>>()

  const location = useLocation()
  const params = new URLSearchParams(location.search)

  const id = params.get('id')
  const imgUrl = params.get('imgUrl')

  const [info, setInfo] = useState<Order.OrderDetailListItem[]>([])
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  // 获取委托单详情
  const getInfo = () => {
    getOrderDetail({
      id
    }).then((res) => {
      if (res.success && res.data) {
        setInfo([{ imgUrl: imgUrl ?? '', ...res.data }])
      }
    })
  }

  // 获取交易记录
  const getRecords = () => {
    if (!id) return

    getTradeRecordsPage({
      accountId: stores.trade.currentAccountInfo?.id,
      orderId: id,
      size: 999,
      current: 1
    }).then((res) => {
      if (res.success && res.data.records) {
        setData(res.data.records)
        setTotal(res.data.total)
      }
    })
  }

  const getDatas = () => {
    getInfo()
    getRecords()
  }

  useEffect(getDatas, [id])

  const copyToClipboard = (text: string | number | undefined) => {
    if (text) {
      // Clipboard.setString(text)
      // 创建一个临时的文本区域 (textarea) 元素
      const textArea = document.createElement('textarea')
      textArea.value = text.toString() // 设置文本区域的内容为要复制的文本
      document.body.appendChild(textArea) // 将文本区域添加到文档中
      textArea.select() // 选中文本
      document.execCommand('copy') // 执行复制命令
      document.body.removeChild(textArea) // 移除临时文本区域
      message.info(i18n.t('Position.Copy Success'))
    }
  }

  const getItemDetails = (item: Order.OrderDetailListItem) => [
    {
      label: i18n.t('pages.position.Order ID'),
      value: item?.id,
      format: (val: string | number | undefined) => (
        <View onPress={() => copyToClipboard(val)} className={cn('flex flex-row items-center gap-1')}>
          <Text color="primary" size="sm" weight="medium">
            {val}
          </Text>
          <Iconfont name="fuzhi" size={20} color={theme.colors.textColor.weak} />
        </View>
      )
    },
    {
      label: i18n.t('pages.position.Entrusted Price'),
      // @ts-ignore
      value: item?.limitPrice,
      format: (val: string | number | undefined) => (
        <Text color="primary" size="sm" weight="medium">
          {formatNum(val, {
            precision: stores.trade.currentAccountInfo.currencyDecimal
          })}
        </Text>
      )
    },
    {
      label: i18n.t('pages.position.Entrusted Count'),
      value: item?.orderVolume,
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
      label: i18n.t('pages.position.Order Close Volume'),
      // @ts-ignore
      value: item?.tradingVolume,
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
      // @ts-ignore
      value: item?.tradePrice,
      format: (val: string | number | undefined) => (
        <Text color="primary" size="sm" weight="medium">
          {formatNum(val, {
            precision: stores.trade.currentAccountInfo.currencyDecimal
          })}
        </Text>
      )
    },
    {
      label: i18n.t('pages.position.Take Profit Price'),
      value: item?.takeProfit,
      format: (val: string | number | undefined) => (
        <Text color="primary" size="sm" weight="medium">
          {formatNum(val, {
            precision: stores.trade.currentAccountInfo.currencyDecimal
          })}
        </Text>
      )
    },
    {
      label: i18n.t('pages.position.Stop Loss Price'),
      value: item?.stopLoss,
      format: (val: string | number | undefined) => (
        <Text color="primary" size="sm" weight="medium">
          {formatNum(val, {
            precision: stores.trade.currentAccountInfo.currencyDecimal
          })}
        </Text>
      )
    },
    {
      label: i18n.t('pages.position.Handling Fees'),
      value: item?.handlingFees,
      format: (val: string | number | undefined) => (
        <Text color="primary" size="sm" weight="medium">
          {formatNum(val, {
            precision: stores.trade.currentAccountInfo.currencyDecimal
          })}
          &nbsp;{SOURCE_CURRENCY}
        </Text>
      )
    },
    { label: i18n.t('pages.position.Order Time'), value: item?.createTime },
    // @ts-ignore
    { label: i18n.t('pages.position.Trade Time'), value: item?.finishTime }
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

  const Item = ({ item }: any) => {
    return (
      <View bgColor="primary" borderColor="weak" className={cn('flex flex-col justify-start px-4')}>
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
          <View className={cn('flex flex-1 flex-col gap-[6px] pl-2')}>
            <Text color="primary" size="sm" weight="medium">
              {item?.createTime}
            </Text>

            <View className={cn('flex-1 flex flex-row justify-between')}>
              <Text color="weak" size="sm">
                {i18n.t('pages.position.Buy Sell Direction')}
              </Text>
              <Text color={item?.buySell === 'BUY' ? 'green' : 'red'} size="sm" weight="medium">
                {item?.buySell === 'BUY' ? i18n.t('common.enum.TradeBuySell.BUY') : i18n.t('common.enum.TradeBuySell.SELL')}
              </Text>
            </View>

            <View className={cn('flex-1 flex flex-row justify-between')}>
              <Text color="weak" size="sm">
                {i18n.t('pages.position.Trade Price')}
              </Text>
              <Text color="primary" size="sm" weight="medium">
                {formatNum(item?.tradePrice, {
                  precision: stores.trade.currentAccountInfo.currencyDecimal
                })}
                &nbsp;{SOURCE_CURRENCY}
              </Text>
            </View>
            <View className={cn('flex-1 flex flex-row justify-between')}>
              <Text color="weak" size="sm">
                {i18n.t('pages.position.Order Volume')}
              </Text>
              <Text color="primary" size="sm" weight="medium">
                {formatNum(item?.tradingVolume, {
                  precision: stores.trade.currentAccountInfo.currencyDecimal
                })}
                &nbsp;{i18n.t('common.unit.Hand')}
              </Text>
            </View>
            <View className={cn('flex-1 flex flex-row justify-between')}>
              <Text color="weak" size="sm">
                {i18n.t('pages.position.Handling Fees')}
              </Text>
              <Text color="primary" size="sm" weight="medium">
                {formatNum(item?.handlingFees, {
                  precision: stores.trade.currentAccountInfo.currencyDecimal
                })}
                &nbsp;{SOURCE_CURRENCY}
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  // @ts-ignore
  const orderType = Enums.OrderType[info[0]?.type as keyof typeof Enums.OrderType]?.key
  const tradeBuySell = Enums.TradeBuySell[info[0]?.buySell as keyof typeof Enums.TradeBuySell]?.key
  const orderStatus = Enums.OrderStatus[info[0]?.status as keyof typeof Enums.OrderStatus]?.key

  return (
    <Basiclayout bgColor="secondary" headerColor={theme.colors.backgroundColor.secondary}>
      <Header style={{ paddingLeft: 14, paddingRight: 14 }} title={i18n.t('app.pageTitle.HistoryPendingDetail')} back={true} />

      <View style={{ flex: 1, overflowY: 'auto' }}>
        {/* header */}
        <View className={cn('items-center flex-col flex justify-center gap-2 pt-6 h-40')}>
          <SymbolIcon width={42} height={42} src={info[0]?.imgUrl} />
          <Text size="base" color="primary" weight="semibold" className={cn('mt-1')}>
            {info[0]?.symbol}
            &nbsp;&nbsp;
            {info[0]?.leverageMultiple ? `${info[0].leverageMultiple}X ` : ''}
          </Text>
          {orderType && tradeBuySell && (
            <View
              className={cn(
                'flex h-5 min-w-[42px] items-center justify-center rounded px-1 text-xs font-normal',
                info[0]?.buySell === 'BUY' ? 'bg-green' : 'bg-red'
              )}
            >
              <Text color="white">
                {info[0]?.marginType === 'CROSS_MARGIN'
                  ? i18n.t('common.enum.MarginType.CROSS_MARGIN')
                  : i18n.t('common.enum.MarginType.ISOLATED_MARGIN')}
                / {/* @ts-ignore */}
                {i18n.t(orderType)} /{i18n.t(tradeBuySell)}
              </Text>
            </View>
          )}
          {orderStatus && (
            <Text size="sm" color="weak" className={cn('-top-1')}>
              {i18n.t(orderStatus)}
            </Text>
          )}
        </View>
        {/* body */}

        <View bgColor="primary" className={cn(' flex-1 rounded-t-3xl mt-[14px] ')}>
          <View className={cn('flex-1 pt-[22px]')}>
            <View className={cn('flex flex-col gap-3 border-b px-5 pb-[22px] ')} borderColor="weak">
              {getItemDetails(info[0]).map((detail, index) => (
                <DetailRow key={index} {...detail} />
              ))}
            </View>
            <View className={cn('py-5 px-5')}>
              <Text size="base" color="primary" weight="medium">
                {i18n.t('pages.position.Transaction Details')}
              </Text>
            </View>
            {data.map((item) => (
              <Item item={item} key={item.id} />
            ))}
            <View className={cn('h-10')} />
            {/* <End /> */}
          </View>
        </View>
      </View>
    </Basiclayout>
  )
}

export default HistoryOrderDetail
