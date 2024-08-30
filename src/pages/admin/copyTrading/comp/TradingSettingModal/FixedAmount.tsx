import { CaretDownOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from '@umijs/max'
import { FormInstance, Radio } from 'antd'
import { useMemo, useState } from 'react'
import { black } from 'tailwindcss/colors'

import ProFormText from '@/components/Admin/Form/ProFormText'
import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { CURRENCY } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'

type IProp = {
  onConfirm?: (values: any) => void
  form: FormInstance
  children: React.ReactNode
  money: number
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

export default ({ onConfirm, form, children, money }: IProp) => {
  const intl = useIntl()
  const { trade } = useStores()
  const { currentAccountInfo } = trade.getAccountBalance()

  const tags = [
    {
      color: 'green',
      format: {
        id: 'mt.dipin'
      }
    },
    {
      color: 'gray',
      format: {
        id: 'mt.dipin'
      }
    },
    {
      color: 'green',
      format: {
        id: 'mt.dipin'
      }
    },
    {
      color: 'green',
      format: {
        id: 'mt.dipin'
      }
    }
  ]

  const [zhanghuyue, setZhanghuyue] = useState<number | undefined>(231.3)
  const [baozhengjin, setBaozhengjin] = useState<number | undefined>()
  const [zhiying, setZhiying] = useState<number | undefined>()
  const [zhisun, setZhisun] = useState<number | undefined>()

  const [read, setRead] = useState<number | undefined>(undefined)

  // 折叠
  const [isCollapse, setIsCollapse] = useState(false)

  const onClickRadio = () => {
    read === 1 ? setRead(undefined) : setRead(1)
    form.setFieldValue('read', read === 1 ? undefined : 1)
  }

  // 止盈/止損输入框聚焦
  const [focusInputKey, setFocusInputKey] = useState<string | undefined>()
  const calcFocusInputValue = useMemo(
    () =>
      focusInputKey === 'mt.yingli'
        ? formatNum((Number(zhanghuyue || 0) * Number(zhiying || 0)) / 100, { precision: 2 })
        : focusInputKey === 'mt.sunshi'
        ? formatNum((Number(zhanghuyue || 0) * Number(zhisun || 0)) / 100, { precision: 2 })
        : 0,
    [zhanghuyue, focusInputKey, zhiying, zhisun]
  )

  return (
    <div className="flex flex-col justify-between gap-4.5 w-full max-w-full">
      {children}
      {/* 每笔跟单保证金 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-primary">
          <FormattedMessage id="mt.meibigendanbaozhengjin" />
        </span>
        <ProFormText
          name="guaranteedAmount"
          rules={[
            {
              required: true,
              // message: intl.formatMessage({ id: 'mt.qingshuru' }),
              validator(rule, value, callback) {
                if (!value) {
                  return Promise.reject(intl.formatMessage({ id: 'mt.qingshuru' }))
                }
                // 只能输入数字，正则匹配 value 是不是数字
                if (!/^\d+$/.test(value)) {
                  return Promise.reject(intl.formatMessage({ id: 'mt.qingshurushuzi' }))
                }

                return Promise.resolve()
              }
            }
          ]}
          fieldProps={{
            size: 'large',
            style: {
              width: '100%',
              height: '2.8125rem',
              lineHeight: '2.8125rem'
            },
            value: baozhengjin,
            onChange: (e) => checkNumber(e, setBaozhengjin),
            placeholder: `${intl.formatMessage({ id: 'mt.qingshuru' })}10~999999999`,
            count: {
              show: false,
              max: 10
            },
            suffix: <span className=" text-sm font-semibold text-primary">USD</span>
          }}
        />
      </div>
      <div className=" flex flex-row justify-between items-center">
        <span
          className=" text-sm font-normal text-primary flex items-center gap-1 cursor-pointer"
          onClick={() => setIsCollapse(!isCollapse)}
        >
          <FormattedMessage id="mt.gaojishezhi" />
          <CaretDownOutlined
            className="transition-all duration-300"
            style={{ color: 'black', transform: isCollapse ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </span>
        <Button
          type="text"
          style={{
            width: 60
          }}
          onClick={() => {
            window.open(`account/transfer?from=${currentAccountInfo?.id}`)
          }}
        >
          <span className=" text-sm font-normal text-primary flex items-center ">
            <Iconfont name="huazhuan" width={18} height={18} color={black['900']} />
            <FormattedMessage id="mt.huazhuan" />
          </span>
        </Button>
      </div>
      {/* 止盈止损 */}
      <div
        className="grid grid-cols-2 gap-x-3.5 gap-y-1 collapsible"
        style={{
          display: isCollapse ? 'none' : 'grid'
        }}
      >
        <div className="flex flex-col gap-2.5 justify-start flex-1">
          <span className=" text-sm font-normal text-primary">
            <FormattedMessage id="mt.zhiying" />
          </span>
          <ProFormText
            name="profitRatio"
            rules={[
              {
                // required: true,
                validator(rule, value, callback) {
                  if (!value) {
                    return Promise.resolve()
                    // return Promise.reject(intl.formatMessage({ id: 'mt.qingshuru' }))
                  }
                  // 只能输入数字，正则匹配 value 是不是数字
                  if (!/^\d+$/.test(value)) {
                    return Promise.reject(intl.formatMessage({ id: 'mt.qingshurushuzi' }))
                  }

                  return Promise.resolve()
                }
              }
            ]}
            fieldProps={{
              size: 'large',
              min: 0,
              style: {
                width: '100%',
                height: '2.8125rem',
                lineHeight: '2.8125rem'
              },
              placeholder: `${intl.formatMessage({ id: 'mt.qingshuru' })}`,
              onFocus: () => setFocusInputKey('mt.yingli'),
              onBlur: () => setFocusInputKey(undefined),
              value: zhiying,
              onChange: (e) => checkNumber(e, setZhiying),
              suffix: <span className=" text-sm font-semibold text-primary">%</span>
            }}
          />
        </div>
        <div className="flex flex-col gap-2.5 justify-start flex-1">
          <span className=" text-sm font-normal text-primary">
            <FormattedMessage id="mt.zhisun" />
          </span>
          <ProFormText
            name="stopLossRatio"
            rules={[
              {
                // required: true,
                // message: intl.formatMessage({ id: 'mt.qingshuru' }),
                validator(rule, value, callback) {
                  if (!value) {
                    return Promise.resolve()
                    // return Promise.reject(intl.formatMessage({ id: 'mt.qingshuru' }))
                  }
                  // 只能输入数字，正则匹配 value 是不是数字
                  if (!/^\d+$/.test(value)) {
                    return Promise.reject(intl.formatMessage({ id: 'mt.qingshurushuzi' }))
                  }

                  return Promise.resolve()
                }
              }
            ]}
            fieldProps={{
              size: 'large',
              min: 0,
              style: {
                width: '100%',
                height: '2.8125rem',
                lineHeight: '2.8125rem'
              },
              placeholder: `${intl.formatMessage({ id: 'mt.qingshuru' })}`,
              value: zhisun,
              onFocus: () => setFocusInputKey('mt.sunshi'),
              onBlur: () => setFocusInputKey(undefined),
              onChange: (e) => checkNumber(e, setZhisun),
              suffix: <span className=" text-sm font-semibold text-primary">%</span>
            }}
          />
        </div>
        {focusInputKey && (
          <div className="col-span-2">
            <span className=" text-xs  text-gray-500 font-normal">
              <FormattedMessage
                id="mt.zidongjiechugendanguanxi"
                values={{
                  type: <FormattedMessage id={focusInputKey} />,
                  value: (
                    <span className=" text-primary">
                      {calcFocusInputValue || '--'} {CURRENCY}
                    </span>
                  )
                }}
              />
            </span>
          </div>
        )}
      </div>
      {/* 确认 */}
      <div className=" justify-self-end flex flex-col items-start justify-between gap-2.5 w-full max-w-full">
        <Radio.Group value={read}>
          <Radio onClick={onClickRadio} value={1}>
            <span className=" text-primary font-normal text-xs">
              <FormattedMessage id="mt.woyiyuedubingtongyi" />
              <span
                className="  cursor-pointer text-blue"
                onClick={(e) => {
                  e.preventDefault()
                  console.log('fuwutiaokuan')
                }}
              >
                <FormattedMessage id="mt.gendanyonghuxieyi" />
              </span>
            </span>
          </Radio>
        </Radio.Group>
        <div className="hide-form-item">
          <ProFormText name="read" rules={[{ required: true, message: intl.formatMessage({ id: 'mt.qinggouxuan' }) }]} />
        </div>
        <Button
          height={48}
          type="primary"
          style={{
            width: '100%',
            borderRadius: 8
          }}
          onClick={onConfirm}
        >
          <div className=" flex items-center gap-1">
            <span className=" font-semibold text-base ">
              <FormattedMessage id="mt.queren" />
            </span>
          </div>
        </Button>
      </div>
    </div>
  )
}
