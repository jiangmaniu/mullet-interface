import './style.less'

import { ModalForm, ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form, Tabs, TabsProps } from 'antd'
import { useMemo, useState } from 'react'

import { CURRENCY } from '@/constants'
import { postTradeFollowFolloerSave } from '@/services/api/tradeFollow/follower'
import { formatNum } from '@/utils'
import { message } from '@/utils/message'

import AccountSelector from './AccountSelector'
import FixedAmount from './FixedAmount'
import FixedRatio from './FixedRatio'

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

type IProps = {
  leadId: string
  open?: boolean
  onOpenChange?: ((open: boolean) => void) | undefined
  trigger?: JSX.Element
  onConfirm?: (values: any) => void
}

const checkNumber = (e: React.ChangeEvent<HTMLInputElement>, cb: (value: number) => void) => {
  const { value: inputValue } = e.target
  const reg = /^-?\d*(\.\d*)?$/
  if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
    cb(Number(inputValue))
  } else {
    cb(0)
  }
}

export default ({ leadId, trigger, open, onOpenChange, onConfirm }: IProps) => {
  const [form] = Form.useForm<TradeFollowFollower.SaveParams>()
  const intl = useIntl()
  const title = intl.formatMessage({ id: 'mt.gendanpeizhi' })

  const { initialState } = useModel('@@initialState')
  const accountList = initialState?.currentUser?.accountList?.filter((item) => !item.isSimulate) || [] // 真实账号列表

  const accountId = Form.useWatch('accountId', form)

  // 選中賬戶的餘額
  const money = useMemo(() => {
    const item = accountList.find((item) => item.id === accountId)
    return item?.money || 0
  }, [accountId])

  const [tabKey, setTabKey] = useState<string>('10')
  const items: TabsProps['items'] = [
    {
      key: '10',
      label: intl.formatMessage({ id: 'mt.gudingjine' }),
      children: (
        <>
          {tabKey === '10' && (
            <FixedAmount
              onConfirm={(values) => {
                form.submit()
                // onConfirm?.(values)
              }}
              form={form}
              money={money}
            >
              <AccountSelector form={form} money={money} />
            </FixedAmount>
          )}
        </>
      )
    },
    {
      key: '20',
      label: intl.formatMessage({ id: 'mt.gudingbili' }),
      children: (
        <>
          {tabKey === '20' && (
            <FixedRatio
              onConfirm={(values) => {
                form.submit()
                // onConfirm?.(values)
              }}
              form={form}
              money={money}
            >
              <AccountSelector form={form} money={money} />
            </FixedRatio>
          )}
        </>
      )
    }
  ]

  const onFinish = async (values: any) => {
    const params = {
      leadId,
      type: tabKey,
      ...values
    }
    postTradeFollowFolloerSave(params).then((res) => {
      if (res.code === 200) {
        message.info(intl.formatMessage({ id: 'mt.tijiaochenggong' }))
        onConfirm && onConfirm(res.data)
      } else {
        message.info(res.message)
      }
    })
  }

  return (
    <div>
      <ModalForm<TradeFollowFollower.SaveParams>
        title={title}
        trigger={trigger}
        form={form}
        width={430}
        open={open}
        onOpenChange={onOpenChange}
        autoFocusFirstInput
        modalProps={{
          centered: true,
          className: 'custom',
          destroyOnClose: true,
          onCancel: () => console.log('run')
        }}
        submitTimeout={2000}
        submitter={{
          render: (props, defaultDoms) => {
            return []
          }
        }}
      >
        <ProForm onFinish={onFinish} submitter={false} form={form}>
          <div className="flex flex-col items-center">
            <div className=" w-[227px] h-[202px] bg-[url('/img/modal-bg.png')] bg-[length:100%_100%] flex items-center justify-center -mt-2">
              <div className=" flex flex-col items-center gap-1">
                <img src="/img/follow-icon.png" width={188} height={150} className="-mt-14" />
                <div className="flex flex-row justify-between gap-20">
                  <div className="flex flex-col gap-2 w-24 items-center">
                    <span className=" text-lg leading-5 !font-dingpro-medium text-primary">{formatNum('15')}%</span>
                    <span className=" text-xs text-gray-600">
                      <FormattedMessage id="mt.lirunfenchengbili" />
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 w-24 items-center">
                    <span className=" text-lg leading-5 !font-dingpro-medium text-primary">{formatNum('15')}</span>
                    <span className=" text-xs text-gray-600">
                      <FormattedMessage id="mt.zichanyaoqiu" />
                      {CURRENCY}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Tabs items={items} activeKey={tabKey} onChange={setTabKey} className="flex-1  w-full flex-grow !-mt-3.5" />
          </div>
        </ProForm>
      </ModalForm>
    </div>
  )
}
