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
import { useStores } from '@/context/mobxProvider'

import BankCard from './address/BankCard'
import CryptoAddress from './address/CryptoAddress'

export type IParams = {
  startTime?: string
  endTime?: string
  tradeAccountId?: any
  accountId?: any
}

type ITabKey = 'bankCard' | 'cryptoAddress'

type IStatusMap = {
  [key in Wallet.IOrderStatus]: {
    text: string
    color: string
    options?: {
      text: string
      fn: () => void
    }
  }
}

export const statusMap: IStatusMap = {
  beginning: {
    text: getIntl().formatMessage({ id: 'mt.daishenghe' }),
    color: '#9C9C9C'
  },
  pending: {
    text: getIntl().formatMessage({ id: 'mt.shenhezhong' }),
    color: '#FF9700'
  },
  finished: {
    text: getIntl().formatMessage({ id: 'mt.tongguo' }),
    color: '#45A48A'
  },
  failed: {
    text: getIntl().formatMessage({ id: 'mt.shenheshibai' }),
    color: '#C54747'
  }
}

export default function Addresss() {
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList || []
  const { ws, trade } = useStores()

  const [tabKey, setTabKey] = useState<ITabKey>('cryptoAddress')
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

  const [selectedItem, setSelectedItem] = useState<Wallet.WithdrawRecord | undefined>(undefined)
  const modalRef = useRef<any>()

  const onSelectItem = (item: Wallet.WithdrawRecord) => {
    setSelectedItem(item)
    modalRef.current.show()
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
            { label: <FormattedMessage id="mt.shuziqianbao" />, value: 'cryptoAddress' },
            { label: <FormattedMessage id="mt.yinhangka" />, value: 'bankCard' }
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
      {tabKey === 'bankCard' && <BankCard params={params} />}
      {tabKey === 'cryptoAddress' && <CryptoAddress params={params} />}
      {/* 消息弹窗 */}
      {/* <InfoModal ref={modalRef} item={selectedItem} /> */}
    </PageContainer>
  )
}
