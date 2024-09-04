import './style.less'

import { ModalForm, PageLoading, ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form, Tabs, TabsProps } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'

import { ModalLoading } from '@/components/Base/Lottie/Loading'
import { CURRENCY } from '@/constants'
import { getTradeFollowFollowerDetail, postTradeFollowFolloerSave } from '@/services/api/tradeFollow/follower'
import { getTradeFollowLeadDetail } from '@/services/api/tradeFollow/lead'
import { useUpdateFollowStatus } from '@/services/hook/useUpdateFollowStatus'
import { formatNum } from '@/utils'

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
  followerId?: string
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

export default ({ leadId, trigger, open, onOpenChange, onConfirm, followerId }: IProps) => {
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const ableList = useMemo(() => currentUser?.accountList?.filter((item) => item.status === 'ENABLE') || [], [currentUser])

  const [form] = Form.useForm<TradeFollowFollower.SaveParams>()
  const intl = useIntl()
  const title = intl.formatMessage({ id: 'mt.gendanpeizhi' })

  const [tabKey, setTabKey] = useState<string>('10')

  const [lead, setLead] = useState<TradeFollowLead.LeadDetailItem | null>(null)
  const [trader, setTrader] = useState<TradeFollowFollower.FollowDetailItem | null>(null)

  const loadingRef = useRef<any>()

  useEffect(() => {
    setLead(null)
    if (open && leadId) {
      setLoading(true)
      getTradeFollowLeadDetail({
        leadId
      })
        .then((res) => {
          if (res.code === 200) {
            setLead(res.data as TradeFollowLead.LeadDetailItem)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [leadId, open])

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setTrader(null)
    if (open && followerId) {
      setLoading(true)
      getTradeFollowFollowerDetail({
        followerId
      })
        .then((res) => {
          if (res.success) {
            setTrader(res.data as TradeFollowFollower.FollowDetailItem)
            setTabKey(res.data?.type as string)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [followerId, open])

  const items: TabsProps['items'] = useMemo(
    () =>
      [
        {
          key: '10',
          label: intl.formatMessage({ id: 'mt.gudingjine' }),
          children: (
            <>
              {tabKey === '10' && (
                <FixedAmount
                  trader={trader}
                  onConfirm={(values) => {
                    form.submit()
                    // onConfirm?.(values)
                  }}
                  form={form}
                >
                  <AccountSelector form={form} lead={lead} trader={trader} />
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
                  trader={trader}
                  onConfirm={(values) => {
                    form.submit()
                    // onConfirm?.(values)
                  }}
                  form={form}
                >
                  <AccountSelector form={form} lead={lead} trader={trader} />
                </FixedRatio>
              )}
            </>
          )
        }
      ].filter((item) => !trader || item.key === trader.type),
    [trader, intl, lead, tabKey]
  )

  const onFinish = async (values: any) => {
    loadingRef.current?.show()
    const params = {
      leadId,
      type: tabKey,
      ...values,
      guaranteedAmountRatio: values.guaranteedAmountRatio / 100
    }
    postTradeFollowFolloerSave(params)
      .then((res) => {
        if (res.success) {
          onConfirm?.(res.data)

          // 更新跟单状态
          useUpdateFollowStatus()
        }
      })
      .finally(() => {
        loadingRef.current?.close()
        onOpenChange?.(false)
      })
  }

  useEffect(() => {
    if (trader) {
      if (trader.guaranteedAmount) {
        form.setFieldValue('guaranteedAmount', trader.guaranteedAmount)
      }

      if (trader.stopLossRatio) {
        form.setFieldValue('stopLossRatio', trader.stopLossRatio)
      }

      if (trader.profitRatio) {
        form.setFieldValue('profitRatio', trader.profitRatio)
      }
    }
  }, [form, trader])

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
          <div className="flex flex-col items-center relative">
            {loading && (
              <div className=" flex justify-center items-center h-full w-full absolute top-0 left-0">
                <PageLoading />
              </div>
            )}
            <div className=" w-[227px] h-[202px] bg-[url('/img/modal-bg.png')] bg-[length:100%_100%] flex items-center justify-center -mt-2">
              <div className=" flex flex-col items-center gap-1">
                <img src="/img/follow-icon.png" width={188} height={150} className="-mt-14" />
                <div className="flex flex-row justify-between gap-20">
                  <div className="flex flex-col gap-2 w-24 items-center">
                    <span className=" text-lg leading-5 !font-dingpro-medium text-primary">{formatNum(lead?.profitSharingRatio)}%</span>
                    <span className=" text-xs text-gray-600">
                      <FormattedMessage id="mt.lirunfenchengbili" />
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 w-24 items-center">
                    <span className=" text-lg leading-5 !font-dingpro-medium text-primary">{formatNum(lead?.assetRequirement)}</span>
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
      <ModalLoading
        ref={loadingRef}
        title={intl.formatMessage({ id: 'mt.jieshugendan' })}
        tips={intl.formatMessage({ id: 'mt.jieshugendanzhong' })}
      />
    </div>
  )
}
