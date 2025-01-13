import Iconfont from '@/components/Base/Iconfont'
import { DEFAULT_CURRENCY_DECIMAL, SOURCE_CURRENCY } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import SelectAccountModal, { SelectAccountModalRef } from '@/pages/webapp/components/Account/SelectAccountModal'
import { ModalRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { formatNum, formatStringWithEllipsis } from '@/utils'
import { observer } from 'mobx-react'
import { useMemo, useRef } from 'react'
import MockDepositModal from './MockDepositModal'

function AccountHeader() {
  const { cn, theme } = useTheme()
  const { t } = useI18n()
  const { trade, global } = useStores()
  const currentAccountInfo = trade.currentAccountInfo
  const selectAccountModalRef = useRef<SelectAccountModalRef>(null)
  const mockDepositModalRef = useRef<ModalRef>(null)

  const { balance, availableMargin, totalProfit, occupyMargin } = trade.accountBalanceInfo

  const precision = currentAccountInfo.currencyDecimal ?? DEFAULT_CURRENCY_DECIMAL

  const advancePaymentRatio = useMemo(() => (availableMargin ? (occupyMargin / availableMargin) * 100 : 0), [occupyMargin, availableMargin])

  return (
    <View
      onClick={(e) => {
        // 避免点击弹窗穿透
        if (global.sheetModalOpen) return
        navigateTo('/app/account/info')
      }}
    >
      <View bgColor="primary" className={cn('px-4 py-[18px] mx-[14px] rounded-xl flex flex-col gap-[18px] border')} borderColor="weak">
        <View className={cn('flex flex-row items-start justify-between')}>
          {/* 切換賬號 */}
          <View
            onClick={(e) => {
              e.stopPropagation()
              selectAccountModalRef.current?.show()
            }}
          >
            <View className={cn('flex flex-col overflow-hidden')}>
              <View className={cn('flex flex-row items-center gap-1 ')}>
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
                <Text size="lg" font="pf-bold" color="primary">
                  {formatStringWithEllipsis(currentAccountInfo?.name || '', 20)}
                </Text>
                <Iconfont name="qiehuanzhanghu-xiala" size={24} />
              </View>
              <View className={cn('flex flex-row items-center gap-2 pt-[2px]')}>
                <Text size="sm" weight="normal" color="primary">
                  #{currentAccountInfo.id}
                </Text>
                {/* 分割線 */}
                <View
                  className={cn('w-[1px] h-[10px] rounded-full')}
                  style={{
                    backgroundColor: theme.colors.Divider.heavy
                  }}
                />
                <Text size="sm" weight="normal" color="primary">
                  {t('pages.position.Balance')}&nbsp;
                  {Number(currentAccountInfo.money)
                    ? formatNum(currentAccountInfo.money, {
                        precision
                      })
                    : '0.00'}
                </Text>
              </View>
            </View>
          </View>
          {currentAccountInfo.isSimulate ? (
            <View
              onClick={(e) => {
                e.stopPropagation()
                mockDepositModalRef.current?.show()
              }}
            >
              <Iconfont name="cangwei-monirujin" size={26} />
            </View>
          ) : (
            <View
              onClick={(e) => {
                e.stopPropagation()
                navigateTo('/app/account/transfer')
              }}
              className="size-[35px] flex items-center justify-center"
              style={{ backgroundColor: theme.colors.gray[50], borderRadius: 200 }}
            >
              <Iconfont name="zhanghu-huazhuan" size={26} />
            </View>
          )}
        </View>
        <View className={cn('flex flex-row justify-between items-end')}>
          <View className={cn('flex flex-col')}>
            <Text size="sm" weight="normal" color="weak">
              {t('pages.position.Net Asset Value')}
              &nbsp;
              {SOURCE_CURRENCY}
            </Text>
            <Text size="22" weight="medium" color="primary" font="dingpro-medium">
              {Number(balance)
                ? formatNum(balance, {
                    precision
                  })
                : '0.00'}
            </Text>
          </View>
          <View className={cn('flex flex-col items-end')}>
            <Text size="xs" weight="normal" color="weak">
              {t('pages.position.Floating P&L')}
            </Text>
            {useMemo(
              () =>
                totalProfit ? (
                  <Text size="sm" font="dingpro-regular" color={totalProfit > 0 ? 'green' : 'red'}>
                    {totalProfit > 0 ? '+' : ''}
                    {formatNum(totalProfit, {
                      precision
                    })}
                  </Text>
                ) : (
                  '0.00'
                ),
              [totalProfit]
            )}
          </View>
        </View>
        <View className={cn('flex flex-row justify-between ')}>
          <View className={cn('flex flex-col max-w-[32%] justify-between')}>
            <Text size="xs" font="dingpro-regular" color="weak">
              {t('pages.position.Advance Payment')}
            </Text>
            <Text size="sm" color="primary">
              {Number(occupyMargin)
                ? formatNum(occupyMargin, {
                    precision
                  })
                : '0.00'}
            </Text>
          </View>
          <View className={cn('flex flex-col max-w-[33%] justify-between')}>
            <Text size="xs" font="dingpro-regular" color="weak">
              {t('pages.position.Available Advance Payment')}
            </Text>
            <Text size="sm" color="primary">
              {Number(availableMargin)
                ? formatNum(availableMargin, {
                    precision
                  })
                : '0.00'}
            </Text>
          </View>
          <View className={cn('flex flex-col items-end max-w-[34%] justify-between')}>
            <Text size="xs" font="dingpro-regular" color="weak">
              {t('pages.position.Advance Payment Ratio (%)')}
            </Text>
            <Text size="sm" color="primary">
              {advancePaymentRatio
                ? formatNum(advancePaymentRatio, {
                    precision: 2
                  })
                : '0.00'}
            </Text>
          </View>
        </View>
      </View>
      <SelectAccountModal ref={selectAccountModalRef} isRemainAtCurrentPage />
      <MockDepositModal ref={mockDepositModalRef} />
    </View>
  )
}

export default observer(AccountHeader)
