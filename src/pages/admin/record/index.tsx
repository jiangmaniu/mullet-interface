import './index.less'

import { ProFormDateRangePicker } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, getIntl, useIntl, useModel, useSearchParams } from '@umijs/max'
import { Segmented } from 'antd'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'

import ProFormSelect from '@/components/Admin/Form/ProFormSelect'
import PageContainer from '@/components/Admin/PageContainer'

import Deposit from './comp/Deposit'
import DepositModal from './comp/DepositModal'
import InfoModal from './comp/InfoModal'
import Transfer from './comp/Transfer'
import Withdrawal from './comp/Withdrawal'

export type IParams = {
  startTime?: string
  endTime?: string
  tradeAccountId?: any
  accountId?: any
}

type ITabKey = 'deposit' | 'withdrawal' | 'transfer'

type IStatusMap = {
  [key in Wallet.IWithdrawalOrderStatus]: {
    text: string
    color: string
    options?: {
      text: string
      fn: () => void
    }
  }
}

export const statusMap: IStatusMap = {
  WAIT: {
    text: getIntl().formatMessage({ id: 'mt.daishenghe' }),
    color: '#9C9C9C'
  },
  SUCCESS: {
    text: getIntl().formatMessage({ id: 'mt.tongguo' }),
    color: '#45A48A'
  },
  RECEIPT: {
    text: getIntl().formatMessage({ id: 'mt.yidaozhang' }),
    color: '#45A48A'
  },
  REJECT: {
    text: getIntl().formatMessage({ id: 'mt.shenheshibai' }),
    color: '#C54747'
  },
  FAIL: {
    text: getIntl().formatMessage({ id: 'mt.shibai' }),
    color: '#C54747'
  }
}

export default function Record() {
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList || []

  const [tabKey, setTabKey] = useState<ITabKey>('deposit')
  const intl = useIntl()
  const [params, setParams] = useState({} as IParams)
  const [searchParams] = useSearchParams()
  const searchKey = searchParams.get('key') as ITabKey

  useEffect(() => {
    setParams({ ...params, tradeAccountId: accountList?.[0]?.id })
  }, [accountList])

  useEffect(() => {
    if (searchKey) {
      setTabKey(searchKey)
    }
  }, [searchKey])

  const filterClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-select-selector,.ant-picker-range': {
        borderRadius: '16px !important'
      }
    }
  })

  const [selectedItem, setSelectedItem] = useState<Wallet.depositOrderListItem | Wallet.withdrawalOrderListItem | undefined>(undefined)
  const modalRef = useRef<any>()
  const modalRefD = useRef<any>()

  const onSelectItem = (item: Wallet.withdrawalOrderListItem) => {
    setSelectedItem(item)
    modalRef.current.show()
  }

  const onSelectItemD = (item: Wallet.depositOrderListItem) => {
    setSelectedItem(item)
    modalRefD.current.show()
  }
  return (
    <PageContainer pageBgColorMode="white" fluidWidth>
      <div className="text-[24px] font-bold text-primary mb-7">
        <FormattedMessage id="mt.churujinjilu" />
      </div>

      <div className="flex items-center justify-between my-4 flex-wrap gap-y-4">
        <Segmented
          className="account"
          onChange={(key: any) => {
            setTabKey(key)
          }}
          value={tabKey}
          options={[
            { label: <FormattedMessage id="mt.rujin" />, value: 'deposit' },
            { label: <FormattedMessage id="mt.chujin" />, value: 'withdrawal' },
            { label: <FormattedMessage id="mt.huazhuan" />, value: 'transfer' }
          ]}
          style={{ width: 300 }}
          block
        />
        <div className={classNames('flex items-center gap-x-3', filterClassName)}>
          <ProFormSelect
            options={accountList.filter((item) => !item.isSimulate).map((item) => ({ ...item, value: item.id, label: item.name }))}
            placeholder={intl.formatMessage({ id: 'mt.xuanzezhanghu' })}
            fieldProps={{
              value: params.tradeAccountId,
              allowClear: false,
              size: 'middle',
              onChange: (value: any) => {
                setParams({
                  ...params,
                  tradeAccountId: value
                })
              }
            }}
            width={150}
          />
          <ProFormDateRangePicker
            fieldProps={{
              onChange: (value) => {
                const startTime = value ? dayjs(value[0]).format('YYYY-MM-DD') + ' 00:00:00' : undefined
                const endTime = value ? dayjs(value[1]).format('YYYY-MM-DD') + ' 23:59:59' : undefined
                setParams({
                  ...params,
                  startTime,
                  endTime
                })
              }
            }}
          />
        </div>
      </div>
      {tabKey === 'deposit' && <Deposit params={params} onSelectItem={onSelectItemD} />}
      {tabKey === 'withdrawal' && <Withdrawal params={params} onSelectItem={onSelectItem} />}
      {tabKey === 'transfer' && <Transfer params={params} />}

      {/* 消息弹窗 */}
      <InfoModal ref={modalRef} item={selectedItem as Wallet.withdrawalOrderListItem | undefined} />
      <DepositModal ref={modalRefD} item={selectedItem as Wallet.depositOrderListItem | undefined} />
    </PageContainer>
  )
}
