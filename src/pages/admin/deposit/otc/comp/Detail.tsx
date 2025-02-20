import './index.less'

import { FormattedMessage, getIntl, useIntl, useModel } from '@umijs/max'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { CardContainer } from '@/pages/admin/copyTrading/comp/CardContainer'

import Button from '@/components/Base/Button'
import { PAYMENT_ORDER_TIMEOUT } from '@/constants'
import { stores } from '@/context/mobxProvider'
import { getEnv } from '@/env'
import { cancelDepositOrder } from '@/services/api/wallet'
import { cn } from '@/utils/cn'
import { message } from '@/utils/message'
import { push } from '@/utils/navigator'
import { Popconfirm } from 'antd'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { observer } from 'mobx-react'

dayjs.extend(duration)

const Notice = observer(({ methodId }: { methodId: string }) => {
  const methodInfo = stores.wallet.withdrawalMethods.find((item) => item.id === methodId)
  return (
    <div className="text-secondary text-xs w-[276px]">
      {methodInfo?.notice ? (
        <p className="leading-7" dangerouslySetInnerHTML={{ __html: methodInfo?.notice?.replace(/\n/g, '<br>') }} />
      ) : (
        <div className="text-xs text-gray-400">
          <FormattedMessage id="mt.zanwuneirong" />
        </div>
      )}
    </div>
  )
})

const Detail = ({
  paymentInfo,
  loading,
  setStep,
  handleSubmit,
  handleTimeout
}: {
  paymentInfo: Wallet.GenerateDepositOrderDetailResult
  loading?: boolean
  setStep: (step: number) => void
  handleSubmit: () => void
  handleTimeout: () => void
}) => {
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号

  const fromAccountInfo = useMemo(() => {
    return accountList.find((item) => item.id === String(paymentInfo?.tradeAccountId || ''))
  }, [paymentInfo, accountList])

  const methods = stores.wallet.depositMethods
  const intl = useIntl()
  const [prevIntl, setPrevIntl] = useState(intl.locale) // 防止重复请求
  useLayoutEffect(() => {
    if (methods.length === 0 || prevIntl !== intl.locale) {
      const language = intl.locale.replace('-', '').replace('_', '').toUpperCase() as Wallet.Language
      stores.wallet.getWithdrawalMethods({ language })
      setPrevIntl(intl.locale)
      return
    }
  }, [methods, intl])

  const methodInfo = useMemo(() => {
    return methods.find((item) => item.id === paymentInfo?.channelId)
  }, [paymentInfo, methods])

  const {
    channelName,
    baseOrderAmount,
    userName,
    exchangeRate,
    tradeAccountId,
    address,
    bankCard,
    bankName,
    baseCurrency,
    channelAccountAmount,
    channelSettlementCurrency,
    receiptAmount
  } = paymentInfo

  const options = [
    {
      label: getIntl().formatMessage({ id: 'mt.zhifufangshi' }),
      value: channelName
    },
    {
      label: getIntl().formatMessage({ id: 'mt.rujinjine' }),
      value: `${baseOrderAmount} ${baseCurrency}`
    },
    {
      label: getIntl().formatMessage({ id: 'mt.cankaohuilv' }),
      value: exchangeRate
    },
    {
      label: getIntl().formatMessage({ id: 'mt.rujinzhanghu' }),
      value: tradeAccountId,
      render: () => {
        return (
          <div className="flex flex-row items-center gap-2">
            <div className="ml-[6px] flex h-5 min-w-[42px] items-center justify-center rounded bg-black text-xs px-1 font-normal text-white">
              {fromAccountInfo?.synopsis?.abbr}
            </div>
            <span className="flex-shrink-0">{tradeAccountId}</span>
          </div>
        )
      }
    }
  ]

  const otcType = useMemo(() => {
    return 'wechat'
    // return methodInfo?.channelNoValue?.split('-')?.[0]
  }, [methodInfo])

  const options2 = useMemo(() => {
    return [
      {
        label: getIntl().formatMessage({ id: 'mt.shoukuanxingming' }),
        value: userName
      },
      ...(otcType === 'bank'
        ? [
            {
              label: getIntl().formatMessage({ id: 'mt.shoukuanyinghang' }),
              value: bankName
            },
            {
              label: getIntl().formatMessage({ id: 'mt.shoukuanzhanghu' }),
              value: bankCard
            }
          ]
        : [])
    ]
  }, [paymentInfo])

  const [duration, setDuration] = useState(-1)

  const createDate = useMemo(() => {
    try {
      return dayjs(paymentInfo?.createTime)
    } catch (error) {
      return dayjs()
    }
  }, [paymentInfo?.createTime])

  const canncelOrderTime = paymentInfo?.canncelOrderTime

  const getDuration = useCallback(() => {
    if (!canncelOrderTime || !Number.isFinite(Number(canncelOrderTime))) return PAYMENT_ORDER_TIMEOUT - dayjs().diff(createDate)
    return Number(canncelOrderTime) * 60 * 1000 - dayjs().diff(createDate)
  }, [createDate, canncelOrderTime])

  const timer = useRef<NodeJS.Timeout | null>(null)
  const setTimer = () => {
    timer.current = setInterval(() => {
      const duration = getDuration()
      setDuration(duration)
      if (duration <= 0) {
        handleTimeout()
        setDuration(-1)
        clearInterval(timer.current as NodeJS.Timeout)
        timer.current = null
      }
    }, 1000)
  }

  useEffect(() => {
    if (address) {
      setTimer()
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current as NodeJS.Timeout)
        timer.current = null
      }
    }
  }, [address])

  const cancelOrder = () => {
    if (paymentInfo?.id) {
      cancelDepositOrder({ id: String(paymentInfo?.id) }).then((res) => {
        if (res.success) {
          push('/deposit')
        }
      })
    }
  }

  return (
    <div className="flex items-center flex-col justify-center w-full h-full">
      <CardContainer title={<FormattedMessage id="mt.dengdairujin" />} style={['w-[880px] ']} onChange={() => {}} defaultValue={undefined}>
        <div className="flex flex-row gap-[60px]">
          <div className="flex flex-col gap-6  flex-1 deposit-detail-container">
            {options
              .filter((item) => item.value)
              .map((item, index) => (
                <div key={index} className="text-secondary text-sm flex flex-row items-center justify-between gap-4">
                  <span className="flex-shrink-0">{item.label}</span>
                  <div className="flex-1 overflow-hidden flex-grow w-full h-1 border-dashed border-b border-gray-250"></div>
                  <span className="flex-shrink-0">{item.render ? item.render() : item.value}</span>
                </div>
              ))}

            <div className=" font-medium text-sm flex flex-row items-center justify-between gap-4">
              <span className="flex-shrink-0">{getIntl().formatMessage({ id: 'mt.fukuanxinxi' })}</span>
            </div>

            {otcType !== 'bank' && (
              <div className="flex flex-row items-end gap-8 font-normal ">
                {/* <canvas id="canvas" className="w-[135px] h-[135px] bg-gray-150 rounded-lg flex items-center justify-center flex-shrink-0"></canvas> */}
                <div>
                  <div className="text-sm text-primary font-medium mb-3">
                    <FormattedMessage id="mt.shoukuanerweima" />
                  </div>
                  <div className={cn('opacity-10 cursor-not-allowed', paymentInfo?.qrCode && 'opacity-100 cursor-pointer')}>
                    {/* <div ref={qrRef}> */}
                    <div className="w-[135px] h-[135px]">
                      <img src={`${getEnv().imgDomain}${paymentInfo?.qrCode}`} alt="qrcode" style={{ width: '100%', height: '100%' }} />
                    </div>
                    {/* </div> */}
                  </div>
                </div>
                <div className="flex flex-col-reverse justify-between h-full flex-1 gap-4 min-h-[132px]">
                  <div>
                    <img src="/img/saomiao.svg" width={20} height={20} />
                    <div className="text-xs text-secondary font-normal mt-4">
                      {otcType === 'wechat' ? (
                        <FormattedMessage id="mt.weixinsaomazhifu" />
                      ) : (
                        <FormattedMessage id="mt.zhifubaosaomazhifu" />
                      )}
                      <br />
                      <FormattedMessage id="mt.beizhuzijiderujinzhanghu" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {options2
              .filter((item) => item.value)
              .map((item, index) => (
                <div key={index} className="text-secondary text-sm flex flex-row items-center justify-between gap-4">
                  <span className="flex-shrink-0">{item.label}</span>
                  <div className="flex-1 overflow-hidden flex-grow w-full h-1 border-dashed border-b border-gray-250"></div>
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0">{item.value}</span>
                    <Iconfont
                      name="a-bianzu3beifen2"
                      color="gray"
                      width={18}
                      height={18}
                      onClick={() => {
                        navigator.clipboard
                          .writeText(item.value || '')
                          .then(() => {
                            message.info(getIntl().formatMessage({ id: 'mt.fuzhichenggong' }))
                          })
                          .catch(() => {
                            message.info(getIntl().formatMessage({ id: 'mt.caozuoshibai' }))
                          })
                      }}
                    />
                  </div>
                </div>
              ))}

            <div>
              <div className="flex flex-row items-center justify-between px-[18px] py-[22px] bg-secondary rounded-[10px]">
                <span className=" font-medium text-sm">
                  <FormattedMessage id="mt.daizhifujine" />
                </span>

                <span className=" font-bold text-xl">{`${receiptAmount} ${channelSettlementCurrency}`}</span>
              </div>
              <span className=" text-secondary font-normal  text-xs">
                <FormattedMessage id="mt.youyuhuilvbodong" />
              </span>
            </div>

            <div className="flex flex-row gap-2 items-center mt-2 ">
              <Button type="primary" htmlType="submit" size="large" className="flex-1" onClick={handleSubmit} disabled={loading}>
                <div className="flex flex-row items-center gap-2">
                  <FormattedMessage id="mt.yifukuanshagnchuanpingzheng" />
                </div>
              </Button>
              <Popconfirm
                title={<FormattedMessage id="mt.quxiaodingdan" />}
                onConfirm={cancelOrder}
                okText={<FormattedMessage id="common.confirm" />}
                cancelText={<FormattedMessage id="common.back" />}
              >
                <Button type="default" size="large">
                  <FormattedMessage id="mt.quxiaodingdan" />
                </Button>
              </Popconfirm>
            </div>
            <span className="text-secondary text-xs -mt-2.5">
              <FormattedMessage id="mt.qingzaishijianneiwanchengdingdanzhifu" values={{ time: dayjs.duration(duration).format('mm:ss') }} />
            </span>
          </div>
          <div>
            <span className="text-primary text-sm font-semibold">
              <FormattedMessage id="mt.chujinxuzhi" />
            </span>
            <Notice methodId={String(paymentInfo?.id)} />
          </div>
        </div>
      </CardContainer>

      <span className="flex flex-row items-center gap-3 mt-[26px]">
        <Iconfont name="kefu" size={24} />
        <span>
          <FormattedMessage id="mt.rujinshiyudaowenti" />
        </span>
      </span>
    </div>
  )
}

export default observer(Detail)
