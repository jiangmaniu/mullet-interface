import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { useRef, useState } from 'react'

import Button from '@/components/Base/Button'
import Modal from '@/components/Base/Modal'
import Tabs from '@/components/Base/Tabs'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { addMargin, extractMargin } from '@/services/api/tradeCore/order'
import { formatNum, getPrecisionByNumber, toFixed } from '@/utils'
import { message } from '@/utils/message'
import { calcForceClosePrice } from '@/utils/wsUtil'

import { IPositionItem } from '../..'
import MarginInput from './MarginInput'

type IProps = {
  trigger: JSX.Element
  info: IPositionItem
  onClose?: () => void
}

// 追加、提取保证金
function AddOrExtractMarginModal({ trigger, info, onClose }: IProps) {
  const intl = useIntl()
  const { isDark } = useTheme()
  const { trade } = useStores()
  const { availableMargin } = trade.getAccountBalance()
  const [inputValue, setInputValue] = useState(0)
  const modalRef = useRef<any>()
  const marginInputRef = useRef<any>()
  const { fetchUserInfo } = useModel('user')

  const [activeKey, setActiveKey] = useState<'ADD' | 'MINUS'>('ADD')
  const isAdd = activeKey === 'ADD'

  const orderMargin = info?.orderMargin || 0 // 订单追加的保证金
  const orderBaseMargin = info?.orderBaseMargin || 0 // 订单基础保证金，减少的保证金不能低于基础保证金
  const avaMargin = Number(isAdd ? availableMargin : toFixed(orderMargin - orderBaseMargin, getPrecisionByNumber(orderMargin))) // 增加、减少保证金的可用额度

  const forceClosePrice = inputValue
    ? calcForceClosePrice({
        ...info,
        orderMargin: inputValue
      })
    : ''

  const handleSubmit = async () => {
    if (!inputValue) return message.info(intl.formatMessage({ id: 'mt.qingshurubaozhengjin' }))
    const params = {
      [isAdd ? 'addMargin' : 'extractMargin']: inputValue,
      bagOrderId: info?.id // 持仓订单号
    }
    console.log('params', params)
    const reqFn = isAdd ? addMargin : extractMargin
    // @ts-ignore
    const res = await reqFn(params)
    const success = res.success

    if (success) {
      modalRef?.current?.close()
      trade.getPositionList()
      // 刷新账户信息
      await fetchUserInfo(true)
      message.info(intl.formatMessage({ id: 'common.opSuccess' }))
    }
  }

  return (
    <Modal
      trigger={trigger}
      styles={{
        content: { padding: 0 }
      }}
      footer={null}
      width={410}
      centered
      onCancel={() => {
        modalRef?.current?.close?.()
        onClose?.()
      }}
      afterClose={() => {
        onClose?.()
      }}
      ref={modalRef}
      maskClosable={false}
    >
      <img src={isDark ? '/img/mask2-dark.png' : '/img/mask2.png'} className="absolute right-[67px] top-[22px] h-[252px] w-[294px] z-[3]" />
      <div className="absolute w-full top-0 z-[2] h-[242px] rounded-[10px]" style={{ background: 'var(--card-gradient-header-bg)' }}></div>
      <div className="pb-4 relative z-10">
        <div className="flex items-center justify-center px-[18px]">
          <img src={'/img/margintype.png'} width={121} height={121} alt="" />
        </div>
        <div className="w-full">
          <Tabs
            items={[
              { key: 'ADD', label: <FormattedMessage id="mt.zengjiazhengjin" /> },
              { key: 'MINUS', label: <FormattedMessage id="mt.jianshaobaozhengjin" /> }
            ]}
            onChange={(key: any) => {
              setActiveKey(key)
              marginInputRef?.current?.reset?.()
            }}
            tabBarGutter={40}
            tabBarStyle={{ paddingLeft: 20 }}
            size="small"
            activeKey={activeKey}
            marginBottom={0}
            indicator={{ size: 40 }}
          />
        </div>

        <div className="relative px-[18px]">
          <div className="py-4">
            <MarginInput
              onChange={(value) => {
                setInputValue(value)
              }}
              isAdd={isAdd}
              availableMargin={avaMargin}
              ref={marginInputRef}
            />
            <div className="pt-5">
              <div className="pb-1">
                <img src="/img/lingxing-2.png" width={8} height={8} />
                <span className="text-xs text-primary pl-[5px] !font-dingpro-medium">
                  {isAdd ? <FormattedMessage id="mt.zuiduokezengjiayue" /> : <FormattedMessage id="mt.zuiduokejianshaoyue" />}{' '}
                  {formatNum(avaMargin)} USD
                </span>
              </div>
              {/* <div>
                <img src="/img/lingxing-2.png" width={8} height={8} />
                <span className="text-xs text-primary pl-[5px] !font-dingpro-medium">
                  {isAdd ? (
                    <FormattedMessage id="mt.zengjiahoudeyuguqiangpingjiagewei" />
                  ) : (
                    <FormattedMessage id="mt.jianshaohoudeyuguqiangpingjiagewei" />
                  )}{' '}
                  {forceClosePrice ? formatNum(forceClosePrice) + 'USD' : '-'}
                </span>
              </div> */}
            </div>
          </div>
          <Button type="primary" block onClick={handleSubmit}>
            <FormattedMessage id="common.queren" />
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default observer(AddOrExtractMarginModal)
