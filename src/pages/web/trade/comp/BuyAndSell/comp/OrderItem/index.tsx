// eslint-disable-next-line simple-import-sort/imports
import { Button, Form } from 'antd'
import { observer } from 'mobx-react'
import { forwardRef, useMemo } from 'react'

import InputNumber from '@/components/Base/InputNumber'
import { useStores } from '@/context/mobxProvider'

import Checkbox from '@/components/Base/Checkbox'
import useTrade from '@/hooks/useTrade'
import { MinusCircleOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from '@umijs/max'
import BuyAndSellBtnGroup from '../../../BuyAndSellBtnGroup'
import SelectMarginTypeOrLevelAge from '../comp/SelectMarginTypeOrLevelAge'
import AccountAvailableMargin from './AccountAvailableMargin'
import ExpectedMargin from './ExpectedMargin'
import MaxOpenVolume from './MaxOpenVolume'
import OrderPrice from './OrderPrice'
import OrderVolume from './OrderVolume'
import SetSpSl from './SetSpSl'

type IProps = {
  popupRef?: any
}

const SubmitButton = observer(() => {
  const { trade } = useStores()
  const { orderVolume, isBuy, loading, onSubmitOrder, hasQuote, disabledBtn, disabledTrade } = useTrade()
  const recordModalItem = trade.recordModalItem

  // 禁用交易
  const disabledSubmitBtn = recordModalItem.id ? false : disabledBtn
  const isMarketOpen = trade.isMarketOpen()

  const renderButton = useMemo(() => {
    return (
      <Button
        type="primary"
        style={{ background: isBuy ? 'var(--color-green-700)' : 'var(--color-red-600)' }}
        className="!h-[44px] !rounded-lg !text-[13px]"
        block
        onClick={onSubmitOrder}
        loading={loading}
        disabled={disabledSubmitBtn}
      >
        {hasQuote && (
          <>
            {!disabledTrade && isMarketOpen && (
              <>
                {isBuy ? <FormattedMessage id="mt.querenmairu" /> : <FormattedMessage id="mt.querenmaichu" />} {orderVolume}{' '}
                <FormattedMessage id="mt.lot" />
              </>
            )}
            {disabledTrade && <FormattedMessage id="mt.zhanghubeijinyong" />}
            {!isMarketOpen && (
              <div className="flex items-center">
                <MinusCircleOutlined style={{ fontSize: 14, paddingRight: 6 }} />
                <FormattedMessage id="mt.xiushizhong" />
              </div>
            )}
          </>
        )}
      </Button>
    )
  }, [isMarketOpen, disabledSubmitBtn, isBuy, disabledTrade, loading, orderVolume, hasQuote, onSubmitOrder])

  return <>{renderButton}</>
})

// 订单Item
export default observer(
  forwardRef(({ popupRef }: IProps, ref) => {
    const { trade, ws } = useStores()
    const [form] = Form.useForm()
    const intl = useIntl()
    const { setOrderSpslChecked, orderSpslChecked, orderType } = trade

    const renderSpslCheckBox = useMemo(() => {
      return (
        <Checkbox
          onChange={(e: any) => {
            setOrderSpslChecked(e.target.checked)
            // 重置值
            trade.resetSpSl()
          }}
          className="max-xl:hidden !mb-3 mt-1"
          checked={orderSpslChecked}
        >
          <span className="text-primary text-xs">
            <FormattedMessage id="mt.zhiyingzhisun" />
          </span>
        </Checkbox>
      )
    }, [orderSpslChecked])

    const renderBuySell = useMemo(() => {
      return (
        <div className="relative flex items-center justify-center rounded-xl border border-primary p-[2px]">
          <BuyAndSellBtnGroup type="popup" />
        </div>
      )
    }, [])

    const renderSelectMarginTypeOrLevelAge = useMemo(() => {
      return <SelectMarginTypeOrLevelAge />
    }, [])

    const renderSpsl = useMemo(() => {
      return orderSpslChecked && <SetSpSl />
    }, [orderSpslChecked])

    const renderVolume = useMemo(() => {
      return <OrderVolume />
    }, [])

    return (
      <Form form={form}>
        <div className="mx-[10px] mt-3 flex flex-col justify-between h-[630px]">
          <div>
            {/* 全仓、逐仓、杠杆选择 */}
            {renderSelectMarginTypeOrLevelAge}
            {/* 买入、卖出按钮组 */}
            {renderBuySell}
            {orderType === 'MARKET_ORDER' ? (
              <InputNumber
                placeholder={intl.formatMessage({ id: 'mt.yidangqianzuixinjia' })}
                rootClassName="!z-50 mb-3 mt-[14px]"
                classNames={{ input: 'text-center' }}
                disabled
              />
            ) : (
              <OrderPrice />
            )}
            {renderSpslCheckBox}
            {/* 止盈止损 */}
            {renderSpsl}
            {/* 下单手数 */}
            {renderVolume}
          </div>
          <div>
            <SubmitButton />
            <div className="mt-4">
              <div className="flex items-center justify-between pb-[6px] w-full">
                <span className="text-xs text-secondary">
                  <FormattedMessage id="mt.keyong" />
                </span>
                <span className="pl-2 text-xs text-primary !font-dingpro-medium">
                  <AccountAvailableMargin /> USD
                </span>
              </div>
              {/* <div className="flex items-center justify-between pb-[6px] w-full">
                <span className="text-xs text-secondary">
                  <FormattedMessage id="mt.yuguqiangpingjia" />
                </span>
                <span className="text-xs text-primary !font-dingpro-medium">{expectedForceClosePrice || '-'}</span>
              </div> */}
              <div className="flex items-center justify-between pb-[6px] w-full">
                <span className="text-xs text-secondary">
                  <FormattedMessage id="mt.yugubaozhengjin" />
                </span>
                <span className="text-xs text-primary !font-dingpro-medium">
                  <ExpectedMargin />
                </span>
              </div>
              <div className="flex items-center justify-between pb-[6px] w-full">
                <span className="text-xs text-secondary">
                  <FormattedMessage id="mt.kekai" />
                </span>
                <span className="text-xs text-primary !font-dingpro-medium">
                  <MaxOpenVolume /> <FormattedMessage id="mt.lot" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Form>
    )
  })
)
