import { DEFAULT_CURRENCY_DECIMAL, SOURCE_CURRENCY } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import usePageVisibility from '@/hooks/usePageVisibility'
import Header from '@/pages/webapp/components/Base/Header'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { formatNum, formatStringWithEllipsis } from '@/utils'
import { useNetwork } from 'ahooks'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'
import SimpleTooltip from './Tooltip'

function AccountDetail() {
  const { cn, theme } = useTheme()
  const { t } = useI18n()
  const networkState = useNetwork()
  const isOnline = networkState.online

  const { trade, ws } = useStores()
  const currentAccountInfo = trade.currentAccountInfo

  const precision = currentAccountInfo.currencyDecimal ?? DEFAULT_CURRENCY_DECIMAL
  const { balance, availableMargin, totalProfit, occupyMargin } = trade.accountBalanceInfo

  const positionList = toJS(trade.positionList)
  const symbolList = positionList.map((item) => item.symbol) as string[]

  const handleSubscribe = () => {
    setTimeout(() => {
      //  检查socket是否连接，如果未连接，则重新连接
      ws.checkSocketReady(() => {
        // 打开行情订阅
        ws.openPosition(
          // 构建参数
          ws.makeWsSymbol(symbolList)
        )
      })
    })
  }

  useEffect(() => {
    // 如果网络断开，在连接需要重新重新建立新的连接
    if (!isOnline) {
      ws.close()
    }

    if (isOnline) {
      setTimeout(() => {
        handleSubscribe()
      }, 200)
    }

    return () => {
      // 离开当前 tab 的时候，取消行情订阅
      ws.closePosition(ws.makeWsSymbol(symbolList))
    }
  }, [symbolList.length, isOnline])

  usePageVisibility(
    () => {
      // 用户从后台切换回前台时执行的操作
      handleSubscribe()
    },
    () => {
      // 用户从前台切换到后台时执行的操作
    }
  )

  const items = [
    {
      label: t('pages.account.Account Balance'),
      tips: t('pages.account.Funds Excluding Current Open Positions'),
      value: (
        <Text size="base" weight="medium" color="primary">
          {formatNum(currentAccountInfo.money, {
            precision
          })}
          &nbsp;{SOURCE_CURRENCY}
        </Text>
      )
    },
    {
      label: t('pages.position.Floating P&L'),
      tips: t('pages.account.Current Position Floating Profit and Loss'),
      value: (
        <Text size="base" weight="medium" color={totalProfit > 0 ? 'green' : 'red'}>
          {totalProfit > 0 ? '+' : ''}
          {formatNum(totalProfit, {
            precision
          })}
          &nbsp;{SOURCE_CURRENCY}
        </Text>
      )
    },
    {
      label: t('pages.position.Available Advance Payment'),
      tips: t('pages.account.Funds Available for New Positions'),
      value: (
        <Text size="base" weight="medium" color="primary">
          {formatNum(availableMargin, {
            precision
          })}
          &nbsp;{SOURCE_CURRENCY}
        </Text>
      )
    },
    {
      label: t('pages.position.Advance Payment'),
      tips: t('pages.account.Funds to Maintain Current Positions'),
      value: (
        <Text size="base" weight="medium" color="primary">
          {formatNum(occupyMargin, {
            precision
          })}
          &nbsp;{SOURCE_CURRENCY}
        </Text>
      )
    },
    {
      label: t('pages.position.Net Asset Value'),
      tips: t('pages.position.Net Asset Value'),
      value: (
        <Text size="base" weight="medium" color="primary">
          {formatNum(balance, {
            precision
          })}
          &nbsp;{SOURCE_CURRENCY}
        </Text>
      )
    }
  ]

  const [visible, _setVisible] = useState(-1)

  const setVisible = (index: number) => {
    _setVisible(index === visible ? -1 : index)
  }

  return (
    <Basiclayout bgColor="secondary" className="px-[14px]" headerColor={theme.colors.backgroundColor.secondary}>
      <Header
        title={t('app.pageTitle.Account Detail')}
        onBack={() => {
          navigateTo('/app/position')
        }}
      />

      <View bgColor="primary" className={cn('px-3 py-4 mt-5 rounded-xl flex flex-col gap-2')}>
        <View className={cn('flex flex-row items-center gap-1 ')}>
          <Text size="lg" weight="bold" color="primary">
            {/*  */}
            {formatStringWithEllipsis(currentAccountInfo?.name || '', 20)}
          </Text>
        </View>
        <View className={cn('flex flex-row items-center justify-start gap-2')}>
          <View
            className={cn(
              'flex h-5 min-w-[42px] items-center justify-center rounded px-1 text-xs font-normal ',
              currentAccountInfo.isSimulate ? 'bg-[#AD41FF]' : 'bg-brand'
            )}
          >
            <Text color="white">
              {currentAccountInfo.isSimulate ? t('common.enum.accountType.DEMO') : t('common.enum.accountType.REAL')}
            </Text>
          </View>
          <Text size="sm" weight="normal" color="primary">
            #{currentAccountInfo.id}
          </Text>
        </View>
      </View>
      <View bgColor="primary" className={cn('px-3 py-4 mt-4 rounded-xl flex flex-col gap-6')}>
        {items.map((i, idx) => (
          <View key={idx} className={cn('flex flex-row justify-between items-center w-full gap-2 h-5')}>
            <SimpleTooltip content={i.tips} setVisible={setVisible} index={idx} visible={visible === idx}>
              <View style={cn('flex flex-row items-center gap-1 h-full flex-shrink-0 flex-grow')}>
                <Text color="primary" size="sm" weight="light">
                  {i.label}
                </Text>
                <img
                  src={'/images/icons/tips.png'}
                  width={16}
                  height={16}
                  style={{
                    width: 16,
                    height: 16
                  }}
                />
              </View>
            </SimpleTooltip>
            <View className={cn('flex flex-row gap-1 flex-1 overflow-hidden')}>
              <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
              <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
              <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
              <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
              <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
              <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
              <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
              <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
              <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
              <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
              <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
              <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
              <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
              <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
              <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
            </View>

            {i.value}
          </View>
        ))}
      </View>

      {!!trade.currentAccountInfo.synopsis?.list?.length && (
        <>
          <Text className={cn('mt-[18px] ml-[6px]')} size="sm" color="weak" weight="light">
            {t('pages.account.Account Attributes')}
          </Text>
          <View bgColor="primary" className={cn('px-3 py-4 mt-[10px] rounded-xl flex flex-col gap-2')}>
            <View className={cn('w-full flex flex-wrap flex-row')}>
              {trade.currentAccountInfo.synopsis?.list?.map((i, index) => (
                <View
                  className={cn(
                    'flex flex-col gap-1',
                    index % 3 === 2 ? 'items-end flex-1' : index % 3 === 1 ? 'items-center ml-2' : 'items-start w-1/3',
                    'p-2'
                  )}
                  key={i.title}
                >
                  <Text color="primary" size="sm" weight="light">
                    {i.content}
                  </Text>
                  <Text color="weak" size="xs" weight="light">
                    {i.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </Basiclayout>
  )
}

export default observer(AccountDetail)
