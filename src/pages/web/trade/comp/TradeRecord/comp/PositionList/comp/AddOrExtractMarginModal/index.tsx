import { FormattedMessage, useIntl } from '@umijs/max'
import { Button } from 'antd'
import { observer } from 'mobx-react'
import { useRef, useState } from 'react'

import Modal from '@/components/Base/Modal'
import Tabs from '@/components/Base/Tabs'
import { useStores } from '@/context/mobxProvider'
import { addMargin, extractMargin } from '@/services/api/tradeCore/order'
import { formatNum } from '@/utils'
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
  const { trade } = useStores()
  const { availableMargin } = trade.getAccountBalance()
  const [inputValue, setInputValue] = useState(0)
  const modalRef = useRef<any>()
  const [activeKey, setActiveKey] = useState<'ADD' | 'MINUS'>('ADD')
  const isAdd = activeKey === 'ADD'

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
      onClose={close}
      onCancel={() => {
        onClose?.()
      }}
      afterClose={() => {
        onClose?.()
      }}
      ref={modalRef}
      maskClosable={false}
    >
      <img src="/img/mask2.png" className="absolute right-[67px] top-[22px] h-[252px] w-[294px] z-[3]" />
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
            }}
            tabBarGutter={90}
            tabBarStyle={{ paddingLeft: 90 }}
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
            />
            <div className="pt-5">
              <div className="pb-1">
                <img src="/img/lingxing-2.png" width={8} height={8} />
                <span className="text-xs text-gray pl-[5px] !font-dingpro-medium">
                  <FormattedMessage id="mt.zuiduokezengjia" /> {formatNum(availableMargin)} USD
                </span>
              </div>
              <div>
                <img src="/img/lingxing-2.png" width={8} height={8} />
                <span className="text-xs text-gray pl-[5px] !font-dingpro-medium">
                  <FormattedMessage id="mt.zengjiahoudeyuguqiangpingjiagewei" /> {formatNum(forceClosePrice)} USD
                </span>
              </div>
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
