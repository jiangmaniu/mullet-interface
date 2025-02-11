import './index.less'

import { FormattedMessage, getIntl, useIntl, useModel, useSearchParams } from '@umijs/max'
import { Segmented } from 'antd'
import { useEffect, useRef, useState } from 'react'

import PageContainer from '@/components/Admin/PageContainer'

import { modifyWithdrawalAddress, removeWithdrawalAddress } from '@/services/api/wallet'
import { message } from '@/utils/message'
import BankCard from './address/BankCard'
import CryptoAddress from './address/CryptoAddress'
import EditModal from './address/EditModal'

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

  const [selectedItem, setSelectedItem] = useState<Wallet.WithdrawalAddress | undefined>(undefined)
  const modalRef = useRef<any>()

  const onSelectItem = (item: Wallet.WithdrawalAddress) => {
    setSelectedItem(item)
    modalRef.current.show()
  }

  const cryptoAddressRef = useRef<any>()

  const onUpdateItem = async (values: any) => {
    if (values.id) {
      const res = await modifyWithdrawalAddress({
        id: values.id,
        remark: values.remark
      })
      if (res.code === 200) {
        message.info(res.message)
        cryptoAddressRef.current?.onQuery()
      }
    }
  }

  const onDeleteItem = (item: Wallet.WithdrawalAddress) => {
    removeWithdrawalAddress({ id: item.id })
      .then((res) => {
        if (res.success) {
          message.info(getIntl().formatMessage({ id: 'mt.caozuochenggong' }))
          cryptoAddressRef.current?.onQuery()
        }
      })
      .catch((err) => {
        message.info(err.message)
      })
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
        {/* <div className={classNames('flex items-center gap-x-3', filterClassName)}>
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
        </div> */}
      </div>
      {tabKey === 'cryptoAddress' && (
        <CryptoAddress ref={cryptoAddressRef} params={params} onSelectItem={onSelectItem} onDeleteItem={onDeleteItem} />
      )}
      {tabKey === 'bankCard' && <BankCard params={params} />}
      {/* 消息弹窗 */}
      <EditModal ref={modalRef} item={selectedItem} onUpdateItem={onUpdateItem} />
    </PageContainer>
  )
}
