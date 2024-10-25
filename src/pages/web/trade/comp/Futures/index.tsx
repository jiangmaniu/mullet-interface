import { CloseOutlined } from '@ant-design/icons'
import { FormattedMessage } from '@umijs/max'
import { Button } from 'antd'
import { observer } from 'mobx-react'
import React, { useRef } from 'react'

import ListItem from '@/components/Base/ListItem'
import Popup from '@/components/Base/Popup'
import { transferWeekDay } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { groupBy, toFixed } from '@/utils'
import { formatTimeStr } from '@/utils/business'
import { getCurrentQuote } from '@/utils/wsUtil'

type IProps = {
  style?: React.CSSProperties
  trigger?: JSX.Element
}

// 合约属性
function Futures({ trigger, style }: IProps) {
  const popupRef = useRef<any>()
  const { trade, ws } = useStores()
  const { symbols } = ws as any
  const symbol = trade.activeSymbolName
  const quoteInfo = getCurrentQuote()
  const symbolConf = quoteInfo?.symbolConf
  const prepaymentConf = quoteInfo?.prepaymentConf
  const holdingCostConf = quoteInfo?.holdingCostConf
  const tradeTimeConf = quoteInfo?.tradeTimeConf as any[]
  const showPencent = holdingCostConf?.type !== 'pointMode' // 以百分比模式
  const marginMode = prepaymentConf?.mode // 保证金模式

  const futrues = [
    { label: <FormattedMessage id="mt.heyuedanwei" />, value: symbolConf?.contractSize },
    { label: <FormattedMessage id="mt.huobidanwei" />, value: symbolConf?.baseCurrency },
    { label: <FormattedMessage id="mt.baojiaxiaoshuwei" />, value: quoteInfo?.digits },
    {
      label: <FormattedMessage id="mt.danbijiaoyishoushu" />,
      value: (
        <>
          {toFixed(symbolConf?.minTrade)}
          <FormattedMessage id="mt.lot" />-{toFixed(symbolConf?.maxTrade)}
          <FormattedMessage id="mt.lot" />
        </>
      )
    },
    {
      label: <FormattedMessage id="mt.shoushuchazhi" />,
      value: (
        <>
          {toFixed(symbolConf?.tradeStep)}
          <FormattedMessage id="mt.lot" />
        </>
      )
    },
    {
      label: <FormattedMessage id="mt.geyelixiduodan" />,
      value: holdingCostConf?.isEnable ? `${holdingCostConf?.buyBag}${showPencent ? '%' : ''}` : '--'
    },
    {
      label: <FormattedMessage id="mt.geyelixikongdan" />,
      value: holdingCostConf?.isEnable ? `${holdingCostConf?.sellBag}${showPencent ? '%' : ''}` : '--'
    },
    { label: <FormattedMessage id="mt.xianjiahetingsunjuli" />, value: symbolConf?.limitStopLevel },

    // 保证金-固定保证金模式
    ...(marginMode === 'fixed_margin'
      ? [
          {
            label: <FormattedMessage id="mt.chushibaozhengjin" />,
            value: (
              <>
                {(prepaymentConf?.fixed_margin?.initial_margin || 0).toFixed(2)} {symbolConf?.prepaymentCurrency}/
                <FormattedMessage id="mt.lot" />
              </>
            )
          },
          {
            label: <FormattedMessage id="mt.suocangbaozhengjin" />,
            value: (
              <>
                {!prepaymentConf?.fixed_margin?.locked_position_margin ? (
                  <FormattedMessage id="mt.shouqudanbianzuida" />
                ) : (
                  <>
                    {(prepaymentConf?.fixed_margin?.locked_position_margin || 0).toFixed(2)} {symbolConf?.prepaymentCurrency}/
                    <FormattedMessage id="mt.lot" />
                  </>
                )}
              </>
            )
          }
        ]
      : [])
  ]

  const renderContent = () => {
    return (
      <div style={{ ...style }} className="relative h-full px-[37px] max-xl:rounded-t-[16px] xl:py-[26px]">
        <div className="absolute left-8 flex w-[92%] justify-between">
          <div className="relative top-0 h-[92px] w-[328px] bg-cover bg-no-repeat bg-[url(/img/heyue-logo.png)] dark:opacity-[0.05]" />
          <div className="h-[180px] w-[227px] bg-[url(/img/heyue-mask.png)] dark:bg-[url(/img/mask2-dark.png)] bg-cover bg-no-repeat" />
        </div>
        <div className="relative top-[30px] z-10">
          <div className="pb-12 text-[24px] font-pf-bold">
            <FormattedMessage id="mt.heyueshuxing" />
          </div>
        </div>
        <div className="mt-3 overflow-x-hidden max-xl:max-h-[60vh] max-xl:overflow-y-auto max-xl:pb-8">
          <SwitchPcOrWapLayout
            pcComponent={
              <div className="grid gap-y-4 xl:grid-cols-3 xxl:grid-cols-4">
                {futrues.map((item, idx) => (
                  <div className="flex flex-col items-start justify-center" key={idx}>
                    <div className="!font-dingpro-medium text-lg text-primary">{item.value}</div>
                    <div className="pt-[10px] text-xs text-weak">{item.label}</div>
                  </div>
                ))}
              </div>
            }
            wapComponent={
              <>
                {groupBy(futrues, 2).map((group, idx) => {
                  return (
                    <ListItem
                      key={idx}
                      left={{
                        value: group[0]?.label,
                        label: group[0]?.value,
                        labelStyle: { fontSize: 14, fontWeight: 600 }
                      }}
                      right={
                        group[1]
                          ? {
                              value: group[1]?.label,
                              label: group[1]?.value,
                              labelStyle: { fontSize: 14, fontWeight: 600 }
                            }
                          : undefined
                      }
                      isReverseValueLabelColor
                    />
                  )
                })}
              </>
            }
          />

          {tradeTimeConf?.length > 0 && (
            <div className="pt-5">
              <div className="py-4 text-xl font-pf-bold text-primary">
                <FormattedMessage id="mt.jiaoyishijian" />
                <span className="text-base">（GMT+8）</span>
              </div>
              <div className="grid gap-y-4 grid-cols-3 max-h-[268px] overflow-y-auto">
                {tradeTimeConf.map((item: any, idx: number) => (
                  <div className="text-sm text-weak" key={idx}>
                    {transferWeekDay(item.weekDay)} {`${formatTimeStr(item.trade)}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <SwitchPcOrWapLayout
      pcComponent={<>{renderContent()}</>}
      wapComponent={
        <Popup
          headerStyle={{ padding: 0 }}
          title={<FormattedMessage id="mt.heyueshuxing" />}
          trigger={trigger}
          position="bottom"
          renderHeader={
            <div className="relative">
              <CloseOutlined
                style={{ color: 'var(--color-text-primary)', background: 'rgba(216, 216, 216, .2)' }}
                onClick={() => {
                  popupRef.current.close()
                }}
                className="absolute right-3 top-4 z-30 mr-3 rounded-full p-[6px] text-sm"
              />
            </div>
          }
          ref={popupRef}
        >
          <div>{renderContent()}</div>
          <div className="fixed bottom-4 h-[60px] w-full bg-white">
            <div className="mx-4">
              <Button
                block
                onClick={() => {
                  popupRef.current.close()
                }}
                style={{ height: 44 }}
              >
                <FormattedMessage id="common.queren" />
              </Button>
            </div>
          </div>
        </Popup>
      }
    />
  )
}

export default observer(Futures)
