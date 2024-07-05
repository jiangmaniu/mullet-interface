import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl } from '@umijs/max'
import { useCountDown } from 'ahooks'
import { Form, FormInstance, Input } from 'antd'
import { useEffect, useState } from 'react'

import AreaCodeSelect from '@/components/Form/AreaCodeSelect'
import { regMobile } from '@/utils'

type IProps = {
  names: string[]
  form: FormInstance
  label?: React.ReactNode
  required?: boolean
  height?: number
  addonAfter?: React.ReactNode
  /**发送验证码 */
  onSend?: () => Promise<boolean>
  dropdownWidth?: number
}

export default function PhoneSelectFormItem({
  form,
  label,
  required,
  names = [],
  height = 49,
  addonAfter,
  onSend,
  dropdownWidth = 410
}: IProps) {
  const intl = useIntl()
  const [leftTime, setLeftTime] = useState<any>(0)

  const [countDown] = useCountDown({
    leftTime,
    onEnd: () => {
      // 倒计时结束重置
      setLeftTime(undefined)
    }
  })
  const seconds = Math.round(countDown / 1000)

  const className = useEmotionCss(({ token }) => {
    return {
      '.ant-input-wrapper': {
        height,
        border: '1px solid #d9d9d9',
        borderRadius: 8,
        '&:hover': {
          borderColor: '#9C9C9C'
        },
        '.ant-input': {
          height,
          border: 'none !important',
          '&:focus-within': {
            boxShadow: 'none !important'
          }
        }
      },
      '.ant-input-group .ant-input-group-addon': {
        backgroundColor: '#fff !important',
        border: 'none !important'
      }
    }
  })

  useEffect(() => {
    // 默认显示香港区号
    form.setFieldValue(names[1], '+852')
  }, [])

  const handleSendCode = async () => {
    if (onSend) {
      const success = await onSend()
      if (success) {
        // 开始倒计时
        setLeftTime(60 * 1000)
      }
    }
  }

  return (
    <Form.Item
      name={names[0]}
      rootClassName={className}
      required={required}
      rules={
        required
          ? [
              {
                required: true,
                validateTrigger: 'onBlur',
                validator(rule, value, callback) {
                  if (!value) {
                    callback(intl.formatMessage({ id: 'mt.shurushoujihaoma' }))
                  } else if (!regMobile.test(value)) {
                    callback(intl.formatMessage({ id: 'mt.shoujihaobuzhengque' }))
                  } else if (!form.getFieldValue('areaCode')) {
                    callback(intl.formatMessage({ id: 'mt.xuanzequhao' }))
                  } else {
                    callback()
                  }
                }
              }
            ]
          : []
      }
      className="phoneSelect"
      label={label}
    >
      <Input
        size="large"
        addonBefore={
          <AreaCodeSelect
            name={names[1]}
            form={form}
            // valueKey="areaCode"
            onChange={(value, option = {}) => {
              // 重新验证input表单错误提示
              form.validateFields([names[0]])
            }}
            selectProps={{
              fieldProps: {
                allowClear: false,
                bordered: false,
                style: { height: 30, width: 'auto', textAlign: 'left', paddingRight: 10, backgroundColor: '#fff', borderRadius: 12 },
                dropdownStyle: { width: dropdownWidth }
              },
              showSearch: true,
              filedConfig: { style: { marginBottom: 0 }, noStyle: true }
            }}
            pickerProps={{
              wrapperStyle: { padding: 0, margin: 0, border: 'none', width: 80 }
            }}
          />
        }
        placeholder={intl.formatMessage({ id: 'mt.shurudianhua' })}
        style={{ width: '100%' }}
        autoComplete="off"
        addonAfter={
          addonAfter || onSend ? (
            <>
              {seconds ? (
                <span className="text-gray text-sm cursor-pointer">
                  <FormattedMessage id="mt.codeDownload" values={{ count: seconds }} />
                </span>
              ) : (
                <span className="text-gray text-sm cursor-pointer" onClick={handleSendCode}>
                  <FormattedMessage id="mt.fasongyanzhengma" />
                </span>
              )}
            </>
          ) : undefined
        }
      />
    </Form.Item>
  )
}
