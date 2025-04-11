import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, getIntl, useIntl, useLocation, useModel, useSearchParams } from '@umijs/max'
import { Form } from 'antd'
import { FormInstance } from 'antd/lib'
import { useEffect, useMemo, useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { copyToClipboard, formatNum } from '@/utils'

import ProFormText from '@/components/Admin/Form/ProFormText'
import { DEFAULT_CURRENCY_DECIMAL } from '@/constants'
import { getAccountSynopsisByLng } from '@/utils/business'
import { validateNonEmptyFields } from '@/utils/form'
import { observer } from 'mobx-react'

const Step2 = ({
  form,
  loading,
  methodInfo
}: {
  form: FormInstance<any>
  loading?: boolean
  methodInfo?: Wallet.fundsMethodPageListItem
}) => {
  const { locale } = useIntl()

  const currency = Form.useWatch('currency', form)
  const chain = Form.useWatch('chain', form)
  const type = Form.useWatch('type', form)
  const name = Form.useWatch('name', form)
  const bankName = Form.useWatch('bankName', form)
  const bankCard = Form.useWatch('bankCard', form)
  const amount = Form.useWatch('amount', form)
  const handlingFee = Form.useWatch('handlingFee', form)
  const symbol = Form.useWatch('symbol', form)
  const actualAmount = Form.useWatch('actualAmount', form)
  const exchangeRate = Form.useWatch('exchangeRate', form)
  const fromAccountId = Form.useWatch('fromAccountId', form)

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号

  const fromAccountInfo = useMemo(() => {
    return accountList.find((item) => item.id === fromAccountId)
  }, [fromAccountId, accountList])

  const [disabled, setDisabled] = useState(true)

  const options = useMemo(() => {
    return [
      {
        label: getIntl().formatMessage({ id: 'mt.shoukuanfangshi' }),
        value: methodInfo?.channelNo
      },

      ...(type === 'CHAIN'
        ? [
            {
              label: getIntl().formatMessage({ id: 'mt.bizhong' }),
              value: symbol
            },
            {
              label: getIntl().formatMessage({ id: 'mt.lianmingcheng' }),
              value: chain
            },
            {
              label: getIntl().formatMessage({ id: 'mt.tibidizhi' }),
              value: fromAccountId
            }
          ]
        : []),
      {
        label: getIntl().formatMessage({ id: 'mt.shoukuanxingming' }),
        value: currentUser?.firstName,
        render: () => {
          return (
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0 max-w-[200px]">
                {locale === 'zh-TW'
                  ? `${currentUser?.lastName}${currentUser?.firstName}`
                  : `${currentUser?.firstName} ${currentUser?.lastName}`}
              </span>
              <Iconfont
                name="a-bianzu3beifen2"
                color="black"
                width={18}
                height={18}
                onClick={() => {
                  copyToClipboard(
                    locale === 'zh-TW'
                      ? `${currentUser?.lastName}${currentUser?.firstName}`
                      : `${currentUser?.firstName} ${currentUser?.lastName}`
                  )
                }}
              />
            </div>
          )
        }
      },
      ...(type === 'OTC'
        ? [
            {
              label: getIntl().formatMessage({ id: 'mt.shoukuanyinhang' }),
              value: bankName,
              render: () => {
                return (
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0 max-w-[200px]">{bankName}</span>
                    <Iconfont
                      name="a-bianzu3beifen2"
                      color="black"
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
                    <span className="flex-shrink-0 max-w-[200px]">{bankCard}</span>
                    <Iconfont
                      name="a-bianzu3beifen2"
                      color="black"
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
      {
        label: getIntl().formatMessage({ id: 'mt.shouxufei' }),
        value: `${formatNum(handlingFee, { precision: fromAccountInfo?.currencyDecimal || DEFAULT_CURRENCY_DECIMAL })} ${currency}`
      },
      ...(type === 'CHAIN'
        ? [
            {
              label: getIntl().formatMessage({ id: 'mt.shijidaozhang' }),
              value: `${formatNum(actualAmount, {
                precision: fromAccountInfo?.currencyDecimal || DEFAULT_CURRENCY_DECIMAL
              })} ${symbol}`
            }
          ]
        : [
            // {
            //   label: getIntl().formatMessage({ id: 'mt.pingtaihuilv' }),
            //   value: `${formatNum(exchangeRate, { precision: fromAccountInfo?.currencyDecimal || DEFAULT_CURRENCY_DECIMAL })}`
            // }
          ])
    ]
  }, [currency, chain, type, name, bankName, amount, handlingFee])

  const location = useLocation()
  const values = (location.state || {}) as Wallet.fundsMethodPageListItem

  useEffect(() => {
    console.log('values', values)
  }, [values])

  const [query] = useSearchParams()
  const synopsis = getAccountSynopsisByLng(fromAccountInfo?.synopsis)

  // const backUrl = query.get('backUrl') as string
  // const [invalid, setInvalid] = useState(false)

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!values?.methodId) {
  //       confirm({
  //         title: getIntl().formatMessage({ id: 'mt.dingdanshixiao' }),
  //         closable: false,
  //         onOk: () => {
  //           push(backUrl || '/app/withdraw')
  //         }
  //       })
  //     }
  //   }, 600)
  // }, [])

  const intl = useIntl()
  useEffect(() => {
    validateNonEmptyFields(form)
  }, [intl.locale])

  return (
    <div className="flex items-center justify-center w-full h-full mt-10 flex-1 ">
      <div className=" pt-4 bg-white w-full rounded-t-3xl flex-1">
        <div className="flex flex-row items-center gap-2 border-b w-full pb-[14px] px-5 border-b-gray-70 ">
          <span className=" text-sm text-secondary">
            <FormattedMessage id="mt.chujinzhanghu" />
          </span>

          <div className="flex flex-row items-center gap-1 text-sm">
            <div className="ml-[6px] flex h-5 min-w-[42px] items-center justify-center rounded bg-black text-xs px-1 font-normal text-white">
              {synopsis?.abbr}
            </div>
            <span className="flex-shrink-0">{fromAccountId}</span>
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
            form={form}
            className="flex flex-col gap-6"
            initialValues={{
              ...values
            }}
          >
            <ProFormText name="orderId" hidden />
            <ProFormText name="methodId" hidden />
            <ProFormText name="handlingFee" hidden />
            <ProFormText name="currency" hidden />
            <ProFormText name="type" hidden />
            <ProFormText name="crypto" hidden />
            <ProFormText name="chain" hidden />
            <ProFormText name="name" hidden />
            <ProFormText name="actualAmount" hidden />
            <ProFormText name="symbol" hidden />
            <ProFormText name="exchangeRate" hidden />
            <ProFormText name="amount" hidden />
            <ProFormText name="fromAccountId" hidden />
            <ProFormText name="bankCard" hidden />
            <ProFormText name="bankName" hidden />
            <div className="flex flex-col gap-6 mt-6">
              <span className="text-primary font-medium text-sm">
                <FormattedMessage id="mt.shoukuanxinxi" />
              </span>
              {options
                .filter((item) => item.value)
                .map((item, index) => (
                  <div key={index} className="text-secondary text-sm flex flex-row items-center justify-between gap-4">
                    <span className="flex-shrink-0 ">{item.label}</span>
                    {/* <div className="flex-1 overflow-hidden flex-grow w-full h-1 border-dashed border-b border-gray-250"></div> */}
                    {item.render ? (
                      item.render()
                    ) : (
                      <span className="flex-shrink-0 max-w-[200px] font-medium text-primary">{item.value}</span>
                    )}
                  </div>
                ))}

              {/* <RawProFormText.Password
              name="password"
              initialValue=""
              fieldProps={{ type: 'password', allowClear: false }}
              label={getIntl().formatMessage({ id: 'mt.zhanghaomima' })}
              placeholder={getIntl().formatMessage({ id: 'mt.qingshuruzhanghaomima' })}
            />
            <ProForm.Item
              label={getIntl().formatMessage(
                {
                  id: 'mt.qingshurushoudaodeyanzhengma'
                },
                { value: `${currentUser?.userInfo?.phoneAreaCode}${currentUser?.userInfo?.phone}` }
              )}
            >
              <div className="flex items-center flex-wrap gap-6">
                <CodeInput form={form} name="code" disabled={disabled} />
                <span
                  className={cn('text-primary ', sendTime > 0 ? 'cursor-pointer hover:underline' : '')}
                  onClick={handleGetVerificationCode}
                >
                  <FormattedMessage id="mt.huodeyanzhengma" />
                  {sendTime > 0 && ` (${sendTime}s)`}
                </span>
              </div>
            </ProForm.Item> */}

              {/* <div className="flex flex-row gap-2 items-center mt-2 ">
              <Button
                type="default"
                size="large"
                onClick={() => {
                  setStep(0)
                }}
              >
                <img src="/img/uc/arrow-left.png" width={32} height={32} />
              </Button>
              <Button type="primary" htmlType="submit" size="large" className="flex-1" onClick={handleSubmit} disabled={loading}>
                <div className="flex flex-row items-center gap-2">
                  <FormattedMessage id="mt.tixian" />
                  <Iconfont name="zhixiang" color="white" width={18} height={18} />
                </div>
              </Button>
            </div> */}
            </div>
            {/* <div className="-mt-[7px]">
              <span className="  font-normal text-weak  text-xs ">
                <FormattedMessage id="mt.youyuhuilvbodong" />
              </span>
            </div> */}
          </ProForm>
        </div>
      </div>
    </div>
  )
}

export default observer(Step2)
