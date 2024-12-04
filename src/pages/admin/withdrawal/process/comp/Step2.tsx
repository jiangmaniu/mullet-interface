import { ProForm, ProFormText as RawProFormText } from '@ant-design/pro-components'
import { FormattedMessage, getIntl } from '@umijs/max'
import { Button } from 'antd'
import { FormInstance } from 'antd/lib'
import { useEffect, useMemo, useState } from 'react'

import CodeInput from '@/components/Base/CodeInput'
import Iconfont from '@/components/Base/Iconfont'
import { CardContainer } from '@/pages/admin/copyTrading/comp/CardContainer'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'

import { transferCurr } from '..'

export const Step2 = ({
  form,
  values,
  fromAccountInfo,
  loading,
  setStep,
  handleSubmit
}: {
  form: FormInstance<any>
  values?: Record<string, any>
  fromAccountInfo?: User.AccountItem
  loading?: boolean
  setStep: (step: number) => void
  handleSubmit: () => void
}) => {
  const options = useMemo(() => {
    return [
      {
        label: getIntl().formatMessage({ id: 'mt.bizhong' }),
        value: values?.currency
      },
      {
        label: getIntl().formatMessage({ id: 'mt.lianmingcheng' }),
        value: values?.chain
      },
      ...(values?.type === 'crypto'
        ? [
            {
              label: getIntl().formatMessage({ id: 'mt.tibidizhi' }),
              value: values?.toAccountId
            }
          ]
        : []),
      {
        label: getIntl().formatMessage({ id: 'mt.xingming' }),
        value: values?.name
      },
      {
        label: getIntl().formatMessage({ id: 'mt.yinghangmingcheng' }),
        value: values?.bankName
      },
      ...(values?.type === 'bank'
        ? [
            {
              label: getIntl().formatMessage({ id: 'mt.yinghangzhanghu' }),
              value: values?.toAccountId
            }
          ]
        : []),
      {
        label: getIntl().formatMessage({ id: 'mt.tixianjine' }),
        value: `${formatNum(values?.amount, { precision: fromAccountInfo?.currencyDecimal })} ${values?.currency}`
      },
      {
        label: getIntl().formatMessage({ id: 'mt.shouxufei' }),
        value: `${formatNum(values?.handlingFee, { precision: fromAccountInfo?.currencyDecimal })} ${values?.currency}`
      },
      ...(values?.type === 'crypto'
        ? [
            {
              label: getIntl().formatMessage({ id: 'mt.shijidaozhang' }),
              value: `${formatNum(transferCurr(values?.amount - values?.handlingFee), { precision: fromAccountInfo?.currencyDecimal })} ${
                values?.currency
              }`
            }
          ]
        : [
            {
              label: getIntl().formatMessage({ id: 'mt.daozhangusd' }),
              value: `${formatNum(values?.amount - values?.handlingFee, { precision: fromAccountInfo?.currencyDecimal })} ${
                values?.currency
              }`
            },
            {
              label: getIntl().formatMessage({ id: 'mt.daozhanghuansuan' }, { value: values?.currency }),
              value: `${formatNum(transferCurr(values?.amount - values?.handlingFee), { precision: fromAccountInfo?.currencyDecimal })} ${
                values?.currency
              }`
            }
          ])
    ]
  }, [values])

  const [sendTime, setSendTime] = useState(0)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const handleGetVerificationCode = async () => {
    if (sendTime > 0) return
    setSendTime(60)
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

  return (
    <div className="flex items-center justify-center w-full h-full mt-10 ">
      <CardContainer title={<FormattedMessage id="mt.chujin" />} onChange={() => {}} defaultValue={undefined}>
        <div className="flex flex-col gap-6 mt-6">
          {options
            .filter((item) => item.value)
            .map((item, index) => (
              <div key={index} className="text-secondary text-sm flex flex-row items-center justify-between gap-4">
                <span className="flex-shrink-0">{item.label}</span>
                <div className="flex-1 overflow-hidden flex-grow w-full h-1 border-dashed border-b border-gray-250"></div>
                <span className="flex-shrink-0">{item.value}</span>
              </div>
            ))}

          <ProForm
            onFinish={async (values: Account.TransferAccountParams) => {
              return
            }}
            disabled={loading}
            submitter={false}
            layout="vertical"
            form={form}
            className="flex flex-col gap-6"
          >
            <RawProFormText.Password
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
                { value: 12345678910 }
              )}
            >
              <div className="flex items-center flex-wrap gap-6">
                <CodeInput form={form} name="code" />
                <span
                  className={cn('text-primary ', sendTime > 0 ? 'cursor-pointer hover:underline' : '')}
                  onClick={handleGetVerificationCode}
                >
                  <FormattedMessage id="mt.huodeyanzhengma" />
                  {sendTime > 0 && ` (${sendTime}s)`}
                </span>
              </div>
            </ProForm.Item>

            <div className="flex flex-row gap-2 items-center mt-2 ">
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
            </div>
          </ProForm>
        </div>
      </CardContainer>
    </div>
  )
}
