import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Form, FormInstance, Input } from 'antd'
import { Rule } from 'antd/es/form'
import { NamePath } from 'antd/es/form/interface'

type IProps = {
  onChange?: (value: string) => void
  form?: FormInstance
  name?: NamePath
  disabled?: boolean
  width?: number
  height?: number
  rules?: Rule[]
}

export default function CodeInput({
  onChange,
  form,
  name = 'validateCode',
  disabled = false,
  width = 38,
  height = 38,
  rules = []
}: IProps) {
  const className = useEmotionCss(({ token }) => {
    return {
      '.ant-otp-input': {
        width,
        height,
        fontSize: '22px !important'
      },
      '.ant-input-outlined:hover': {
        borderColor: '#110E23 !important'
      }
    }
  })

  const handleChange = (value: any) => {
    onChange?.(value)
    form?.setFieldValue?.(name, value)
  }

  return (
    <div className={className}>
      <Form.Item noStyle name={name} rules={rules}>
        <Input.OTP onChange={handleChange} disabled={disabled} />
      </Form.Item>
    </div>
  )
}
