import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react'

import { transferWeekDay } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { toFixed } from '@/utils'
import { formatTimeStr } from '@/utils/business'
import { getCurrentQuote } from '@/utils/wsUtil'

import SheetModal, { SheetRef } from '../Base/SheetModal'
import { Text } from '../Base/Text'
import { View } from '../Base/View'

type IProps = {
  trigger?: JSX.Element
}

export type FuturesModalRef = {
  show: () => void
  close: () => void
}

const ListItem = ({ leftText, rightText }: { leftText: React.ReactNode; rightText: React.ReactNode }) => {
  const { cn, theme } = useTheme()
  return (
    <View className={cn('items-center flex-row mb-[14px] justify-between')}>
      <Text color="weak" size="sm" className={cn('max-w-[80%] pr-4')}>
        {leftText}
      </Text>
      <Text color="primary" size="sm" weight="medium" className={cn('flex-1 text-right')}>
        {rightText}
      </Text>
    </View>
  )
}

/** 合约属性弹窗 */
function FuturesModal({ trigger }: IProps, ref: ForwardedRef<FuturesModalRef>) {
  const { cn, theme } = useTheme()
  const intl = useIntl()
  const { trade, ws } = useStores()
  const symbol = trade.activeSymbolName
  const quoteInfo = getCurrentQuote()
  const symbolConf = quoteInfo?.symbolConf
  const prepaymentConf = quoteInfo?.prepaymentConf
  const holdingCostConf = quoteInfo?.holdingCostConf
  const tradeTimeConf = quoteInfo?.tradeTimeConf as any[]
  const showPencent = holdingCostConf?.type !== 'pointMode' // 以百分比模式
  const marginMode = prepaymentConf?.mode // 保证金模式

  const bottomSheetModalRef = useRef<SheetRef>(null)

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      height="100%"
      hiddenFooter
      trigger={trigger}
      dragOnContent={false}
      title={intl.formatMessage({ id: 'pages.trade.Fetures Title' })}
      children={
        <View className={cn('flex-1 px-5 pb-[50px]')}>
          <View className={cn('mt-2 mb-4 flex-row')}>
            <Text size="base" weight="medium" className={cn('w-full')}>
              {intl.formatMessage({ id: 'pages.trade.Fetures Info Title' })}
            </Text>
          </View>
          <ListItem leftText={intl.formatMessage({ id: 'pages.trade.Fetures Unit' })} rightText={symbolConf?.contractSize} />
          <ListItem leftText={intl.formatMessage({ id: 'pages.trade.Fetures Currency Unit' })} rightText={symbolConf?.baseCurrency} />
          <ListItem leftText={intl.formatMessage({ id: 'pages.trade.Fetures Digit' })} rightText={quoteInfo?.digits} />
          <ListItem
            leftText={intl.formatMessage({ id: 'pages.trade.Fetures Single Trade Count' })}
            rightText={
              <>
                {toFixed(symbolConf?.minTrade)}
                {intl.formatMessage({ id: 'pages.trade.Lot' })}~{toFixed(symbolConf?.maxTrade)}
                {intl.formatMessage({ id: 'pages.trade.Lot' })}
              </>
            }
          />
          <ListItem leftText={intl.formatMessage({ id: 'pages.trade.Fetures Count Diff' })} rightText={toFixed(symbolConf?.tradeStep)} />
          <ListItem
            leftText={intl.formatMessage({ id: 'pages.trade.Fetures Intest Mul' })}
            rightText={holdingCostConf?.isEnable ? `${holdingCostConf?.buyBag}${showPencent ? '%' : ''}` : '--'}
          />
          <ListItem
            leftText={intl.formatMessage({ id: 'pages.trade.Fetures Intest Empty' })}
            rightText={holdingCostConf?.isEnable ? `${holdingCostConf?.sellBag}${showPencent ? '%' : ''}` : '--'}
          />
          <ListItem
            leftText={intl.formatMessage({ id: 'pages.trade.Fetures Intest Limit SL Distance' })}
            rightText={symbolConf?.limitStopLevel}
          />
          {/* 保证金-固定保证金模式 */}
          {marginMode === 'fixed_margin' && (
            <>
              <ListItem
                leftText={intl.formatMessage({ id: 'pages.trade.Fetures Init Margin' })}
                rightText={
                  <>
                    {(prepaymentConf?.fixed_margin?.initial_margin || 0).toFixed(2)} {symbolConf?.prepaymentCurrency}/
                    {intl.formatMessage({ id: 'pages.trade.Lot' })}
                  </>
                }
              />
              <ListItem
                leftText={intl.formatMessage({ id: 'pages.trade.Fetures Locked Margin' })}
                rightText={
                  <>
                    {!prepaymentConf?.fixed_margin?.locked_position_margin ? (
                      intl.formatMessage({ id: 'pages.trade.Fetures Get Max Margin' })
                    ) : (
                      <>
                        {(prepaymentConf?.fixed_margin?.locked_position_margin || 0).toFixed(2)} {symbolConf?.prepaymentCurrency}/
                        {intl.formatMessage({ id: 'pages.trade.Lot' })}
                      </>
                    )}
                  </>
                }
              />
            </>
          )}

          <View className={cn('mt-3 mb-4')}>
            <Text size="base" weight="medium">
              {intl.formatMessage({ id: 'pages.trade.Fetures Trade Time' })}(GMT+8)
            </Text>
          </View>
          {tradeTimeConf?.length > 0 &&
            tradeTimeConf.map((item: any, idx: number) => (
              <ListItem key={idx} leftText={transferWeekDay(item.weekDay)} rightText={formatTimeStr(item.trade)} />
            ))}
        </View>
      }
    />
  )
}

export default observer(forwardRef(FuturesModal))
