import { ProForm, ProFormText as RawProFormText } from '@ant-design/pro-components'
import { FormattedMessage, getIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import { FormInstance } from 'antd/lib'
import { useEffect, useState } from 'react'

// import CodeInput from '@/components/Base/CodeInput'
import Iconfont from '@/components/Base/Iconfont'
import { CardContainer } from '@/pages/admin/copyTrading/comp/CardContainer'
import { formatNum, regPassword } from '@/utils'
import { cn } from '@/utils/cn'

import ProFormText from '@/components/Admin/Form/ProFormText'
import Button from '@/components/Base/Button'
import { DEFAULT_CURRENCY_DECIMAL } from '@/constants'
import { useLang } from '@/context/languageProvider'
import CodeInput from '@/pages/webapp/components/Base/Form/CodeInput'
import { sendCustomPhoneCode } from '@/services/api/user'
import { withdrawExchangeRate } from '@/utils/deposit'
import { message } from '@/utils/message'

export const Step2 = ({
  form,
  fromAccountInfo,
  loading,
  setStep,
  handleSubmit,
  methodInfo
}: {
  form: FormInstance<any>
  fromAccountInfo?: User.AccountItem
  loading?: boolean
  setStep: (step: number) => void
  handleSubmit: () => void
  methodInfo?: Wallet.fundsMethodPageListItem
}) => {
  const currency = Form.useWatch('currency', form)
  const chain = Form.useWatch('chain', form)
  const type = Form.useWatch('type', form)
  const toAccountId = Form.useWatch('toAccountId', form)
  const bankName = Form.useWatch('bankName', form)
  const bankCard = Form.useWatch('bankCard', form)
  const amount = Form.useWatch('amount', form)
  const handlingFee = Form.useWatch('handlingFee', form)
  const symbol = Form.useWatch('symbol', form)
  const actualAmount = Form.useWatch('actualAmount', form)
  const exchangeRate = Form.useWatch('exchangeRate', form)

  const [disabled, setDisabled] = useState(true)

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  const lng = useLang()
  const name = lng.isTW ? `${currentUser?.lastName}${currentUser?.firstName}` : `${currentUser?.firstName} ${currentUser?.lastName}`

  const options = [
    {
      label: getIntl().formatMessage({ id: 'mt.bizhong' }),
      value: symbol
    },
    {
      label: getIntl().formatMessage({ id: 'mt.lianmingcheng' }),
      value: chain
    },
    ...(type === 'CHAIN'
      ? [
          {
            label: getIntl().formatMessage({ id: 'mt.tibidizhi' }),
            value: toAccountId
          }
        ]
      : []),
    {
      label: getIntl().formatMessage({ id: 'mt.xingming' }),
      value: name
    },
    {
      label: getIntl().formatMessage({ id: 'mt.yinghangmingcheng' }),
      value: bankName
    },
    ...(type === 'OTC'
      ? [
          {
            label: getIntl().formatMessage({ id: 'mt.yinghangzhanghu' }),
            value: bankCard
          }
        ]
      : []),
    {
      label: getIntl().formatMessage({ id: 'mt.tixianjine' }),
      value: `${formatNum(amount, { precision: fromAccountInfo?.currencyDecimal || DEFAULT_CURRENCY_DECIMAL })} ${currency}`
    },
    {
      label: getIntl().formatMessage({ id: 'mt.shouxufei' }),
      value: `${formatNum(handlingFee, { precision: fromAccountInfo?.currencyDecimal || DEFAULT_CURRENCY_DECIMAL })} ${currency}`
    },
    ...(type === 'CHAIN'
      ? [
          {
            label: getIntl().formatMessage({ id: 'mt.shijidaozhang' }),
            value: `${formatNum(amount - handlingFee, {
              precision: fromAccountInfo?.currencyDecimal || DEFAULT_CURRENCY_DECIMAL
            })} ${symbol}`
          }
        ]
      : [
          {
            label: getIntl().formatMessage({ id: 'mt.pingtaihuilv' }),
            value: `${formatNum(withdrawExchangeRate(methodInfo), {
              precision: fromAccountInfo?.currencyDecimal || DEFAULT_CURRENCY_DECIMAL
            })}`
          },
          {
            label: getIntl().formatMessage({ id: 'mt.daozhangusd' }),
            value: `${formatNum(amount - handlingFee, {
              precision: fromAccountInfo?.currencyDecimal || DEFAULT_CURRENCY_DECIMAL
            })} ${currency}`
          },
          {
            label: getIntl().formatMessage({ id: 'mt.daozhanghuansuan' }, { value: symbol }),
            value: `${actualAmount} ${symbol}`
          }
        ])
  ]

  const [sendTime, setSendTime] = useState(0)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const handleGetVerificationCode = async () => {
    if (sendTime > 0) return

    if (!currentUser?.userInfo?.phone) {
      message.info(getIntl().formatMessage({ id: 'mt.qingxianwanshankycrenzheng' }))
      return
    }

    sendCustomPhoneCode({
      phone: currentUser?.userInfo?.phone,
      phoneAreaCode: currentUser?.userInfo?.phoneAreaCode
    })
      .then((res) => {
        res.success && setSendTime(60)

        setDisabled(false)
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  useEffect(() => {
    if (sendTime === 60) {
      const timer = setInterval(() => {
        setSendTime((prev) => prev - 1)
      }, 1000)

      setTimer(timer)
    }

    if (sendTime === 0) {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [sendTime])

  const [valid, setValid] = useState(false)
  const password = Form.useWatch('password', form)
  const code = Form.useWatch('code', form)

  useEffect(() => {
    password &&
      code &&
      form
        .validateFields(['password', 'code'])
        .then((values) => {
          setValid(true)
        })
        .catch((err) => {
          setValid(false)
        })
  }, [password, code])

  const submitable = valid && !loading

  return (
    <div className="flex items-center justify-center w-full h-full mt-10 ">
      <CardContainer title={<FormattedMessage id="mt.chujin" />} style={'w-[552px]'} onChange={() => {}} defaultValue={undefined}>
        <div className="flex flex-col gap-6 mt-6">
          {options
            .filter((item) => item.value)
            .map((item, index) => (
              <div key={index} className="text-secondary text-sm flex flex-row items-center justify-between gap-4">
                <span className="flex-shrink-0">{item.label}</span>
                <div className="flex-1 overflow-hidden flex-grow w-full h-1 border-dashed border-b border-gray-250"></div>
                <span className="flex-shrink-0 text-primary font-pf-medium">{item.value}</span>
              </div>
            ))}

          <ProForm
            onFinish={async (values: Account.TransferAccountParams) => {
              return
            }}
            submitter={false}
            layout="vertical"
            form={form}
            className="flex flex-col gap-6"
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
            <ProFormText name="methodId" hidden />

            <ProFormText name="fromAccountId" hidden />
            <ProFormText name="bankCard" hidden />
            <ProFormText name="bankName" hidden />
            <ProFormText name="toAccountId" hidden />
            <ProFormText name="amount" hidden />

            <RawProFormText.Password
              name="password"
              initialValue=""
              fieldProps={{ type: 'password', allowClear: false, style: { height: 42 } }}
              label={getIntl().formatMessage({ id: 'mt.zhanghaomima' })}
              placeholder={getIntl().formatMessage({ id: 'mt.qingshuruzhanghaomima' })}
              rules={[
                {
                  required: true,
                  message: getIntl().formatMessage({ id: 'mt.pleaseInputPwdPlaceholder' }),
                  pattern: regPassword
                }
              ]}
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
                <CodeInput
                  form={form}
                  inputWrapperStyle={['!size-[42px]']}
                  height={42}
                  name="code"
                  disabled={disabled}
                  rules={[{ required: true }, { len: 6 }]}
                />
                <span className={cn('text-primary', sendTime === 0 ? 'cursor-pointer' : '')} onClick={handleGetVerificationCode}>
                  {sendTime === 0 && <FormattedMessage id="mt.huodeyanzhengma" />}
                  {sendTime > 0 && `${sendTime}s`}
                </span>
              </div>
            </ProForm.Item>

            <div className="flex flex-row gap-2 items-center mt-2 ">
              {/* <Button
                type="default"
                size="large"
                onClick={() => {
                  setStep(0)
                }}
              >
                <img src="/img/uc/arrow-left.png" width={32} height={32} />
              </Button> */}
              <Button
                height={46}
                type="primary"
                htmlType="submit"
                size="large"
                className="flex-1"
                onClick={handleSubmit}
                disabled={!submitable}
              >
                <div className="flex flex-row items-center gap-2">
                  <FormattedMessage id="mt.tixian" />
                  <Iconfont name="zhixiang" color={disabled ? '#9BA6AD' : 'white'} width={18} height={18} />
                </div>
              </Button>
            </div>
          </ProForm>
        </div>
      </CardContainer>
    </div>
  )
}
