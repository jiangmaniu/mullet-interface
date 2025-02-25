import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, getIntl, useIntl, useModel, useSearchParams } from '@umijs/max'
import { useMemo, useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { copyToClipboard, formatNum } from '@/utils'

import { DEFAULT_CURRENCY_DECIMAL } from '@/constants'
import { getEnv } from '@/env'
import { observer } from 'mobx-react'

const Step2 = ({ loading, paymentInfo }: { loading?: boolean; paymentInfo?: Wallet.GenerateDepositOrderDetailResult }) => {
  const { locale } = useIntl()

  const {
    baseCurrency,
    address,
    chain,
    paymentType,
    name,
    bankName,
    bankCard,
    amount,
    handlingFee,
    symbol,
    actualAmount,
    exchangeRate,
    tradeAccountId,
    channelNo,
    userName,
    channelNoValue
  } = paymentInfo || {}

  const otcType = useMemo(() => {
    const type = channelNoValue?.split('-')?.[0]
    console.log('type', type)
    return type
  }, [channelNoValue])

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号

  const fromAccountInfo = useMemo(() => {
    return accountList.find((item) => item.id === String(tradeAccountId))
  }, [tradeAccountId, accountList])

  const [disabled, setDisabled] = useState(true)

  const options = useMemo(() => {
    return [
      {
        label: getIntl().formatMessage({ id: 'mt.zhifufangshi' }),
        value: channelNo
      },

      ...(paymentType === 'CHAIN'
        ? [
            {
              label: getIntl().formatMessage({ id: 'mt.bizhong' }),
              value: baseCurrency
            },
            {
              label: getIntl().formatMessage({ id: 'mt.lianmingcheng' }),
              value: chain
            },
            {
              label: getIntl().formatMessage({ id: 'mt.tibidizhi' }),
              value: address
            }
          ]
        : []),
      {
        label: getIntl().formatMessage({ id: 'mt.shoukuanxingming' }),
        value: userName,
        render: () => {
          return (
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0">{userName}</span>
              <Iconfont
                name="a-bianzu3beifen2"
                color="gray"
                width={18}
                height={18}
                onClick={() => {
                  copyToClipboard(userName || '')
                }}
              />
            </div>
          )
        }
      },
      ...(paymentType === 'OTC' && otcType === 'bank'
        ? [
            {
              label: getIntl().formatMessage({ id: 'mt.shoukuanyinhang' }),
              value: bankName,
              render: () => {
                return (
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0">{bankName}</span>
                    <Iconfont
                      name="a-bianzu3beifen2"
                      color="gray"
                      width={18}
                      height={18}
                      onClick={() => {
                        copyToClipboard(bankName || '')
                      }}
                    />
                  </div>
                )
              }
            },
            {
              label: getIntl().formatMessage({ id: 'mt.shoukuanzhanghu' }),
              value: bankCard,
              render: () => {
                return (
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0">{bankCard}</span>
                    <Iconfont
                      name="a-bianzu3beifen2"
                      color="gray"
                      width={18}
                      height={18}
                      onClick={() => {
                        copyToClipboard(bankCard || '')
                      }}
                    />
                  </div>
                )
              }
            }
          ]
        : []),
      // {
      //   label: getIntl().formatMessage({ id: 'mt.shouxufei' }),
      //   value: `${formatNum(handlingFee, { precision: fromAccountInfo?.currencyDecimal || DEFAULT_CURRENCY_DECIMAL })} ${baseCurrency}`
      // },
      ...(paymentType === 'CHAIN'
        ? [
            {
              label: getIntl().formatMessage({ id: 'mt.shijidaozhang' }),
              value: `${formatNum(actualAmount, {
                precision: fromAccountInfo?.currencyDecimal || DEFAULT_CURRENCY_DECIMAL
              })} ${baseCurrency}`
            }
          ]
        : [
            // {
            //   label: getIntl().formatMessage({ id: 'mt.pingtaihuilv' }),
            //   value: `${formatNum(exchangeRate, { precision: fromAccountInfo?.currencyDecimal || DEFAULT_CURRENCY_DECIMAL })}`
            // }
          ])
    ]
  }, [baseCurrency, chain, paymentType, name, bankName, amount, handlingFee, actualAmount, exchangeRate])

  // const location = useLocation()
  // const values = (location.state || {}) as Wallet.fundsMethodPageListItem

  const [query] = useSearchParams()

  const backUrl = query.get('backUrl') as string
  const [invalid, setInvalid] = useState(false)

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!values?.methodId) {
  //       setInvalid(true)
  //       confirm({
  //         title: getIntl().formatMessage({ id: 'mt.dingdanshixiao' }),
  //         closable: false,
  //         onOk: () => {
  //           push(backUrl)
  //         }
  //       })
  //     }
  //   }, 600)
  // }, [])
  return (
    <div className="flex items-center justify-center w-full h-full flex-1 ">
      <div className=" pt-4 bg-white w-full rounded-t-3xl flex-1">
        <div className="flex flex-row items-center gap-2 border-b w-full pb-[14px] px-5 border-b-gray-70 ">
          <span className=" text-sm text-secondary">
            <FormattedMessage id="mt.rujinzhanghu" />
          </span>

          <div className="flex flex-row items-center gap-1 text-sm">
            <div className="ml-[6px] flex h-5 min-w-[42px] items-center justify-center rounded bg-black text-xs px-1 font-normal text-white">
              {fromAccountInfo?.synopsis?.abbr}
            </div>
            <span className="flex-shrink-0">{tradeAccountId}</span>
          </div>
        </div>
        <div className="px-[14px] pb-4">
          <ProForm
            onFinish={async (values: Account.TransferAccountParams) => {
              return
            }}
            disabled={loading}
            submitter={false}
            layout="vertical"
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-6 mt-6">
              <div className=" text-primary text-sm font-semibold">
                <FormattedMessage id="mt.fukuanxinxi" />
              </div>
              {options
                .filter((item) => item.value)
                .map((item, index) => (
                  <div key={index} className="text-secondary text-sm flex flex-row items-center justify-between gap-4">
                    <span className="flex-shrink-0">{item.label}</span>
                    <div className="flex-1 overflow-hidden flex-grow w-full h-1 border-dashed border-b border-gray-250"></div>
                    {item.render ? item.render() : <span className="flex-shrink-0">{item.value}</span>}
                  </div>
                ))}

              {paymentType === 'OTC' && otcType !== 'bank' && (
                <div className="flex flex-col items-center  font-normal ">
                  <div className="text-sm text-primary font-medium ">
                    <FormattedMessage id="mt.shoukuanerweima" />
                  </div>
                  <div className="w-[154px] h-[154px] bg-secondary mt-2 ">
                    <img src={`${getEnv().imgDomain}${paymentInfo?.qrCode}`} alt="qrcode" style={{ width: '100%', height: '100%' }} />
                  </div>

                  <div className="flex flex-col-reverse justify-between h-full flex-1 gap-4 mt-3 text-center">
                    <div className="text-xs text-secondary font-normal ">
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
              )}
            </div>
            <div className="-mt-[7px]">
              <span className="  font-normal text-weak  text-xs ">
                <FormattedMessage id="mt.youyuhuilvbodong" />
              </span>
            </div>
          </ProForm>
        </div>
      </div>
    </div>
  )
}

export default observer(Step2)
