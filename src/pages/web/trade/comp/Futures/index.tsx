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
import { AllSymbols, formatQuotes, formatSessionTime } from '@/utils/wsUtil'

const timef = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']

const coinList = formatQuotes().quoteList1 // 数字货币
const exchangeList = formatQuotes().quoteList2 // 外汇

type IProps = {
  style?: React.CSSProperties
  trigger?: JSX.Element
}

// 合约属性
function Futures({ trigger, style }: IProps) {
  const popupRef = useRef<any>()
  const { global, ws } = useStores()
  const { symbols } = ws as any
  const symbol = global.activeSymbolName

  // 外汇
  const isWaiHui = AllSymbols.some((item) => item.type === 2)
  const data = symbols[symbol] || { data: { sessions: [] } }

  const sessions: any = []

  const futrues = [
    { label: <FormattedMessage id="mt.heyuedanwei" />, value: data?.consize },
    { label: <FormattedMessage id="mt.huobidanwei" />, value: 'USD' },
    { label: <FormattedMessage id="mt.baojiaxiaoshuwei" />, value: data?.digits },
    {
      label: <FormattedMessage id="mt.danbijiaoyishoushu" />,
      value: (
        <>
          {(data?.vmin / 10000).toFixed(2)}
          <FormattedMessage id="mt.lot" />-{(data?.vmax / 10000).toFixed(2)}
          <FormattedMessage id="mt.lot" />
        </>
      )
    },
    {
      label: <FormattedMessage id="mt.shoushuchazhi" />,
      value: (
        <>
          {(data?.vstep / 10000).toFixed(2)}
          <FormattedMessage id="mt.lot" />
        </>
      )
    },
    { label: <FormattedMessage id="mt.geyelixiduodan" />, value: `${toFixed(data?.swap_long)}%` },
    { label: <FormattedMessage id="mt.geyelixikongdan" />, value: `${toFixed(data?.swap_short)}%` },
    { label: <FormattedMessage id="mt.xianjiahetingsunjuli" />, value: data?.stopl },

    // 保证金相关
    ...(data?.margin_init
      ? [
          {
            label: <FormattedMessage id="mt.chushibaozhengjin" />,
            value: (
              <>
                {(isWaiHui ? data.margin_init / 100 : data.margin_init).toFixed(2)} USTD/
                <FormattedMessage id="mt.lot" />
              </>
            )
          },
          {
            label: <FormattedMessage id="mt.jiaqibaozhengjin" />,
            value: (
              <>
                {(isWaiHui ? (data.margin_init * 2) / 100 : data.margin_init * 2).toFixed(2)} USTD/
                <FormattedMessage id="mt.lot" />
              </>
            )
          },
          {
            label: <FormattedMessage id="mt.suocangbaozhengjin" />,
            value: (
              <>
                {(isWaiHui ? (data.margin_init * 0.5) / 100 : data.margin_init * 0.5).toFixed(2)} USTD/
                <FormattedMessage id="mt.lot" />
              </>
            )
          }
        ]
      : [])
  ]

  const renderContent = () => {
    return (
      <div
        style={{ background: 'var(--card-gradient-bg)', ...style }}
        className="relative h-full px-[37px] max-xl:rounded-t-[16px] xl:py-[26px]"
      >
        <div className="absolute left-8 flex w-[92%] justify-between">
          <div
            style={{ backgroundImage: 'url(/img/heyue-logo.png)' }}
            className="relative top-8 h-[92px] w-[328px] bg-cover bg-no-repeat"
          />
          <div style={{ backgroundImage: 'url(/img/future-bg.png)' }} className="h-[180px] w-[227px] bg-cover bg-no-repeat" />
        </div>
        <div className="relative top-[47px] z-10">
          <div className="pb-12 text-[24px] font-bold">
            <FormattedMessage id="mt.heyueshuxing" />
          </div>
        </div>
        <div className="mt-7 overflow-x-hidden max-xl:max-h-[60vh] max-xl:overflow-y-auto max-xl:pb-8">
          <SwitchPcOrWapLayout
            pcComponent={
              <div className="grid gap-y-4 xl:grid-cols-3 xxl:grid-cols-4">
                {futrues.map((item, idx) => (
                  <div className="flex flex-col items-start justify-center" key={idx}>
                    <div className="font-dingpro-medium text-lg text-gray">{item.value}</div>
                    <div className="pt-[10px] text-xs text-gray-weak">{item.label}</div>
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

          {sessions?.length > 0 && (
            <div className="pt-14">
              <div className="py-4 text-xl font-medium">
                <FormattedMessage id="mt.jiaoyishijian" />
                <span className="text-base">（GMT+8）</span>
              </div>
              <div className="grid gap-y-4 xl:grid-cols-3 xxl:grid-cols-5">
                {sessions.map((item: any, idx: number) => (
                  <div className="text-sm text-gray-weak" key={idx}>
                    {/* @ts-ignore */}
                    {transferWeekDay(timef[item.day])} {`(${formatSessionTime(item.open)} ~ ${formatSessionTime(item.close)})`}
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
