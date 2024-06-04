import { CloseOutlined } from '@ant-design/icons'
import { FormattedMessage } from '@umijs/max'
import { Col, Row } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'

import Button from '@/components/Base/Button'
import ListItem from '@/components/Base/ListItem'
import Modal from '@/components/Base/Modal'
import Popup from '@/components/Base/Popup'
import { TRADE_TYPE } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { groupBy, toFixed } from '@/utils'

// 平仓、挂单成功提示
export default observer((props, ref) => {
  const { lng } = useLang()
  const { ws } = useStores()
  const { openData: data, openTips } = ws as any

  const { isPc } = useEnv()
  const userUnit = 'USD'

  const close = () => {
    ws.openTips = false
    // @ts-ignore
    ws.openData = {}
  }

  const isMarket = data.type === TRADE_TYPE.MARKET_BUY || data.type === TRADE_TYPE.MARKET_SELL
  const isBuy = data.type === TRADE_TYPE.MARKET_BUY || data.type === TRADE_TYPE.LIMIT_BUY || data.type === TRADE_TYPE.STOP_LIMIT_BUY
  const isClosed = !!data.closed // 是否是平仓 @TODO

  const symbol = data.sbl
  const d = data.digits
  const vol = {
    label: isClosed ? <FormattedMessage id="mt.pingcangshoushu" /> : <FormattedMessage id="mt.kaicangshoushu" />,
    value: `${data.vol / 10000} ${(<FormattedMessage id="mt.lot" />)}`
  }
  const price = {
    label: isClosed ? (
      <FormattedMessage id="mt.pingcangjiage" />
    ) : isMarket ? (
      <FormattedMessage id="mt.kaicangjiage" />
    ) : (
      <FormattedMessage id="mt.guadanjiage" />
    ),
    value: `${toFixed(data.price, d)} ${userUnit}`
  }
  const tp = { label: <FormattedMessage id="mt.zhiying" />, value: `${data.tp} ${userUnit}` }
  const sl = { label: <FormattedMessage id="mt.zhisun" />, value: `${toFixed(data.sl, d)} ${userUnit}` }
  const commission = { label: <FormattedMessage id="mt.shouxufei" />, value: `${data.fee || '0.00'} ${userUnit}` }
  const storage = { label: <FormattedMessage id="mt.geyelixi" />, value: `${toFixed(data.storage, d)} ${userUnit}` }
  const orderNo = { label: <FormattedMessage id="mt.chicangdanhao" />, value: `#${data.order}` }
  const margin = { label: <FormattedMessage id="mt.baozhengjin" />, value: 1212 }
  const last = isClosed ? storage : margin

  // 挂单成功不用展示手续费、持仓单号
  const commissionField = isClosed ? [commission] : []
  const pcList = [[vol, price], [tp, sl], [...commissionField, last].filter((v) => v)]
  const mobileList = [vol, tp, price, ...commissionField, sl, last]
  const fieldList = isPc ? pcList : mobileList

  const title = isClosed ? (
    <FormattedMessage id="mt.pingcangchenggong" />
  ) : isMarket ? (
    <FormattedMessage id="mt.kaicangchenggong" />
  ) : (
    <FormattedMessage id="mt.guadanchenggong" />
  )

  const renderContent = () => {
    return (
      <>
        <div className="relative -top-9 flex flex-col items-center justify-center px-4">
          <div className="text-lg font-bold text-gray">{title}</div>
          {/* 平仓 */}
          {isClosed && (
            <div className="flex w-full items-center justify-between px-8 pt-3">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <img width={24} height={24} alt="" src={`/img/coin-icon/${data.sbl}.png`} className="rounded-full" />
                  <span className="pl-[6px] text-base font-semibold text-gray">{symbol}</span>
                  <span className={classNames('pl-1 text-sm', isBuy ? 'text-green' : 'text-red')}>
                    · {isBuy ? <FormattedMessage id="mt.mairu" /> : <FormattedMessage id="mt.maichu" />} ·{' '}
                    <FormattedMessage id="mt.zhucang" />
                  </span>
                </div>
                <div className="flex pt-2">
                  <span className="text-xs text-gray-secondary">
                    <FormattedMessage id="mt.chicangdanhao" />
                  </span>
                  <span className="pl-2 text-xs text-gray">#{data.order}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={classNames('font-bol pb-2 text-lg', data.profit > 0 ? 'text-green' : 'text-red')}>
                  {toFixed(data.profit)} {userUnit}
                </span>
                <span className="text-xs text-gray-secondary">
                  <FormattedMessage id="mt.yingkui" />
                </span>
              </div>
            </div>
          )}
          {/* 挂单 */}
          {!isClosed && (
            <div className="flex items-center py-3">
              <img width={24} height={24} alt="" src={`/img/coin-icon/${symbol}.png`} className="rounded-full" />
              <span className="pl-[6px] text-base font-semibold text-gray">{symbol}</span>
              <span className={classNames('pl-1 text-sm', isBuy ? 'text-green' : 'text-red')}>
                · {isBuy ? <FormattedMessage id="mt.mairu" /> : <FormattedMessage id="mt.maichu" />} · <FormattedMessage id="mt.zhucang" />
                20X
              </span>
            </div>
          )}
          <div className="my-4 w-full border border-dashed border-gray-250/70"></div>
          <SwitchPcOrWapLayout
            pcComponent={
              <>
                {fieldList.map((item: any, idx) => (
                  <Row className="w-full px-8 pb-4" key={idx}>
                    <Col span={10}>
                      <div className="flex items-center justify-between">
                        <span className="pr-5 text-sm text-gray-secondary">{item?.[0]?.label}</span>
                        <span className="text-sm text-gray">{item?.[0]?.value}</span>
                      </div>
                    </Col>
                    <Col push={4} span={10}>
                      <div className="flex items-center justify-between">
                        <span className="pr-5 text-sm text-gray-secondary">{item?.[1]?.label}</span>
                        <span className="text-sm text-gray">{item?.[1]?.value}</span>
                      </div>
                    </Col>
                  </Row>
                ))}
              </>
            }
            wapComponent={
              <div className="w-full px-4">
                {groupBy(fieldList, 3).map((item, idx) => {
                  return (
                    <ListItem
                      key={idx}
                      left={{
                        value: item?.[0]?.label,
                        label: item?.[0]?.value
                      }}
                      center={{
                        value: item?.[1]?.label,
                        label: item?.[1]?.value
                      }}
                      right={{
                        value: item?.[2]?.label,
                        label: item?.[2]?.value
                      }}
                      isReverseValueLabelColor
                    />
                  )
                })}
              </div>
            }
          />
        </div>
        <div className="relative -top-4 mx-5">
          <Button block onClick={close} type="primary">
            <FormattedMessage id="common.queren" />
          </Button>
        </div>
      </>
    )
  }

  const titleDom = (
    <div
      className="flex flex-col items-center justify-center bg-no-repeat pt-3"
      style={{ backgroundImage: 'url(/img/header-bg-mask.png)', backgroundSize: '300px auto' }}
    >
      <img src={isClosed ? '/img/pingcang-icon.png' : '/img/penging-success.png'} width={121} height={121} alt="" />
    </div>
  )

  if (!openTips) return null

  return (
    <SwitchPcOrWapLayout
      pcComponent={
        <Modal
          open={openTips}
          styles={{
            header: {
              background: 'var(--card-gradient-header-bg)',
              height: 150
            },
            content: { padding: 0 }
          }}
          title={titleDom}
          footer={null}
          width={lng === 'zh-TW' ? 520 : 580}
          centered
          onClose={close}
        >
          {renderContent()}
        </Modal>
      }
      wapComponent={
        <Popup
          open={openTips}
          renderHeader={
            <div style={{ background: 'var(--card-gradient-header-bg)', height: 150, borderRadius: 16 }}>
              <CloseOutlined
                style={{ color: 'var(--color-text-primary)', background: 'rgba(216, 216, 216, .2)' }}
                onClick={close}
                className="absolute right-3 top-4 mr-3 rounded-full p-[6px] text-sm"
              />
              {titleDom}
            </div>
          }
          contentStyle={{ paddingBottom: 30 }}
          position="bottom"
          onClose={close}
        >
          {renderContent()}
        </Popup>
      }
    />
  )
})
