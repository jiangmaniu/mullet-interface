import { FormattedMessage, useIntl } from '@umijs/max'
import { message } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import Button from '@/components/Base/Button'
import InputNumber from '@/components/Base/InputNumber'
import Modal from '@/components/Base/Modal'
import Popup from '@/components/Base/Popup'
import Slider from '@/components/Web/Slider'
import { TRADE_TYPE } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'

type IProps = {
  tradeList?: any[]
}

// 平仓操作弹窗
export default observer(
  forwardRef(({ tradeList = [] }: IProps, ref) => {
    const intl = useIntl()
    const [tempItem, setTempItem] = useState<any>({})
    const { ws, global } = useStores()
    const [count, setCount] = useState<any>('')
    const [open, setOpen] = useState(false)
    const unit = 'USD'

    // 获取实时的数据
    const item = tradeList?.find((v: any) => v.position === tempItem.position) || {}

    const symbol = item.symbol
    const number = item.number // 手数

    useEffect(() => {
      setCount(number)
    }, [number])

    const close = () => {
      setOpen(false)
    }

    const show = (item: any) => {
      setOpen(true)
      setTempItem(item)
    }

    // 对外暴露接口
    useImperativeHandle(ref, () => {
      return {
        show,
        close
      }
    })

    const onFinish = () => {
      const reg = /^\d+(\.\d{0,2})?$/
      if (!count) return message.error(intl.formatMessage({ id: 'common.pleaseInput2' }))
      if (!reg.test(count)) {
        message.error(intl.formatMessage({ id: 'mt.shoushushuruyouwu' }))
        return
      }
      if (count > item.number) {
        message.error(intl.formatMessage({ id: 'mt.shoushushuruyouwu' }))
        return
      }
      if (count < 0.01) {
        message.error(intl.formatMessage({ id: 'mt.zuixiaopingcangshoushuwei0.01shou' }))
        return
      }
      const res = {
        cmd: 'MSG_TYPE.PLACE_ORDER',
        sbl: symbol,
        act: 200,
        type: item.action === TRADE_TYPE.MARKET_BUY ? TRADE_TYPE.MARKET_SELL : TRADE_TYPE.MARKET_BUY,
        vol: count * 10000,
        position: item.position
      }

      // ws.socket.send(JSON.stringify(res))
      // ws.setNewOrderFn(res)

      // 关闭弹窗
      close()
    }

    const renderContent = () => {
      return (
        <>
          <div className="flex flex-col items-center justify-center">
            <div className="flex w-full items-center justify-between pt-3">
              <div className="flex items-center">
                <img width={24} height={24} alt="" src={`/img/coin-icon/${symbol}.png`} className="rounded-full" />
                <span className="pl-[6px] text-base font-semibold text-gray">{symbol}</span>
                <span className={classNames('pl-1 text-sm', item.action === 0 ? 'text-green' : 'text-red')}>
                  · {item.action === 0 ? <FormattedMessage id="mt.mairu" /> : <FormattedMessage id="mt.maichu" />} ·{' '}
                  <FormattedMessage id="mt.zhucang" />
                  20X
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className={classNames('pb-2 text-lg font-bold', item?.profit > 0 ? 'text-green' : 'text-red')}>
                  {item.profitFormat} {unit}
                </span>
                <span className="text-xs text-gray-secondary">
                  <FormattedMessage id="mt.fudongyingkui" />
                </span>
              </div>
            </div>
            <div className="absolute left-0 top-[130px] w-full border border-dashed border-gray-250/70"></div>
            <div className="my-4"></div>
            <div className="flex w-full items-center">
              <div className="flex items-center justify-between">
                <span className="pr-3 text-sm text-gray-secondary">
                  <FormattedMessage id="mt.kaicangjiage" />
                </span>
                <span className="text-sm text-gray">
                  {item.price} {unit}
                </span>
              </div>
              <div className="flex items-center justify-between pl-5">
                <span className="pr-3 text-sm text-gray-secondary">
                  <FormattedMessage id="mt.pingcangjiage" />
                </span>
                <span className="text-sm text-gray">
                  {item.currentPrice}&nbsp;{unit}
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col items-center pt-5">
              <InputNumber
                placeholder={intl.formatMessage({ id: 'mt.pingcangshoushu' })}
                className="h-[38px]"
                classNames={{ input: 'text-center' }}
                value={count}
                onChange={(value) => {
                  if (value > item.number) return
                  setCount(value)
                }}
                onAdd={() => {
                  if (count >= item.number) return
                  const c = (Number(count) + 0.01).toFixed(2)
                  setCount(c)
                }}
                onMinus={() => {
                  if (count <= 0.01) return
                  const c = (Number(count) - 0.01).toFixed(2)
                  setCount(c)
                }}
                max={item.number}
                min={0.01}
              />
              <div className="my-2 w-full">
                <Slider
                  onChange={(value: any) => {
                    console.log('value', value)
                  }}
                />
              </div>
              <div className="flex items-center pt-2">
                <span className="text-xs text-gray-secondary">
                  <FormattedMessage id="mt.kepingcangshoushu" />
                </span>
                <span className="pl-3 text-xs text-gray">
                  {item.number}
                  <FormattedMessage id="mt.lot" />
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 pt-4 max-xl:pt-8">
            <Button className="!w-[45%]" onClick={close}>
              <FormattedMessage id="common.cancel" />
            </Button>
            <Button className={classNames('flex-1', { 'pointer-events-none !bg-gray-250': !count })} onClick={onFinish} type="primary">
              <FormattedMessage id="mt.quedingpingcang" />
            </Button>
          </div>
        </>
      )
    }

    const titleDom = <FormattedMessage id="mt.pingcang" />

    // 避免重复渲染
    if (!open) return

    return (
      <>
        <SwitchPcOrWapLayout
          pcComponent={
            <Modal title={titleDom} open={open} onClose={close} footer={null} width={460} centered>
              {renderContent()}
            </Modal>
          }
          wapComponent={
            <Popup title={titleDom} open={open} onClose={close} contentStyle={{ paddingBottom: 30 }} position="bottom">
              <div className="px-5">{renderContent()}</div>
            </Popup>
          }
        />
      </>
    )
  })
)
