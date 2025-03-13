import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { useTheme } from '@/context/themeProvider'
import { readClipboard } from '@/utils'
import { Form } from 'antd'
import { Rule } from 'antd/es/form'
import { NamePath } from 'antd/es/form/interface'
import { FormInstance } from 'antd/lib'
import { ClassValue } from 'clsx'
import { View } from '../View'
import InputNumber from './InputNumber'

interface IProps {
  value?: any
  onChange?: (value: any) => void
  inputWrapperStyle?: ClassValue
  height?: number
  width?: number
  rules?: Rule[]
  form?: FormInstance
  name?: NamePath
  disabled?: boolean
  onFocus?: () => void
}

const CodeInput = forwardRef((props: IProps, ref: ForwardedRef<any>) => {
  const { onChange, inputWrapperStyle, height = 48, width = 48, rules, form, name, disabled, onFocus } = props

  const { cn } = useTheme()

  const [code1, setCode1] = useState('')
  const [code2, setCode2] = useState('')
  const [code3, setCode3] = useState('')
  const [code4, setCode4] = useState('')
  const [code5, setCode5] = useState('')
  const [code6, setCode6] = useState('')

  const inputRef1 = useRef<any>(null)
  const inputRef2 = useRef<any>(null)
  const inputRef3 = useRef<any>(null)
  const inputRef4 = useRef<any>(null)
  const inputRef5 = useRef<any>(null)
  const inputRef6 = useRef<any>(null)

  useEffect(() => {
    const codeValue = code1 + code2 + code3 + code4 + code5 + code6
    if (codeValue) {
      onChange?.(codeValue)
      form?.setFieldValue?.(name, codeValue)
    }
  }, [code1, code2, code3, code4, code5, code6])

  const handlePaste = () => {
    readClipboard((text) => {
      if (text.length === 6) {
        setCode6(text[5])
        setCode5(text[4])
        setCode4(text[3])
        setCode3(text[2])
        setCode2(text[1])
        setCode1(text[0])
      }
    })
  }

  useImperativeHandle(ref, () => ({
    focus: () => {
      // inputRef1.current?.select()
    }
  }))

  return (
    <Form.Item noStyle name={name} rules={rules}>
      <View>
        <View className={cn('flex flex-row items-start justify-start gap-1.5')}>
          <InputNumber
            ref={inputRef1}
            className={cn(' text-[22px] leading-[28px] p-0 size-[48px]', inputWrapperStyle)}
            height={height}
            maxLength={1}
            controls={false}
            autoSelectAll={true}
            placeholder=""
            fixedTrigger="onChange"
            fontSize={20}
            onFocus={(e) => {
              handlePaste()
              e.target.select()
              onFocus?.()
            }}
            onChange={(e: any) => {
              setCode1(e)
              if (e && e.length > 0) {
                if (!code2) {
                  inputRef2.current?.focus()
                }
              }
            }}
            value={code1}
            disabled={disabled}
          />
          <InputNumber
            ref={inputRef2}
            className={cn(' text-[22px] leading-[28px] p-0 size-[48px]', inputWrapperStyle)}
            height={height}
            maxLength={1}
            controls={false}
            autoSelectAll={true}
            placeholder=""
            fixedTrigger="onChange"
            fontSize={20}
            onChange={(e: any) => {
              setCode2(e)
              if (e && e.length > 0) {
                if (!code3) {
                  inputRef3?.current?.focus()
                }
              }
            }}
            onKeyUp={(e: any) => {
              if (e.key === 'Backspace') {
                inputRef1?.current?.focus()
              }
            }}
            value={code2}
            disabled={disabled}
          />
          <InputNumber
            ref={inputRef3}
            className={cn(' text-[22px] leading-[28px] p-0 size-[48px]', inputWrapperStyle)}
            height={height}
            maxLength={1}
            controls={false}
            autoSelectAll={true}
            placeholder=""
            fixedTrigger="onChange"
            fontSize={20}
            onChange={(e: any) => {
              setCode3(e)
              if (e && e.length > 0) {
                if (!code4) {
                  inputRef4?.current?.focus()
                }
              }
            }}
            onKeyUp={(e: any) => {
              if (e.key === 'Backspace') {
                inputRef2?.current?.focus()
              }
            }}
            value={code3}
            disabled={disabled}
          />
          <InputNumber
            ref={inputRef4}
            className={cn(' text-[22px] leading-[28px] p-0 size-[48px]', inputWrapperStyle)}
            height={height}
            maxLength={1}
            controls={false}
            autoSelectAll={true}
            placeholder=""
            fixedTrigger="onChange"
            fontSize={20}
            onChange={(e: any) => {
              setCode4(e)
              if (e && e.length > 0) {
                if (!code5) {
                  inputRef5?.current?.focus()
                }
              }
            }}
            onKeyUp={(e: any) => {
              if (e.key === 'Backspace') {
                inputRef3?.current?.focus()
              }
            }}
            value={code4}
            disabled={disabled}
          />
          <InputNumber
            ref={inputRef5}
            className={cn(' text-[22px] leading-[28px] p-0 size-[48px]', inputWrapperStyle)}
            height={height}
            maxLength={1}
            controls={false}
            autoSelectAll={true}
            placeholder=""
            fixedTrigger="onChange"
            fontSize={20}
            onChange={(e: any) => {
              setCode5(e)
              if (e && e.length > 0) {
                if (!code6) {
                  inputRef6?.current?.focus()
                }
              }
            }}
            onKeyUp={(e: any) => {
              if (e.key === 'Backspace') {
                inputRef4?.current?.focus()
              }
            }}
            value={code5}
            disabled={disabled}
          />
          <InputNumber
            ref={inputRef6}
            className={cn(' text-[22px] leading-[28px] p-0 size-[48px]', inputWrapperStyle)}
            height={height}
            maxLength={1}
            controls={false}
            autoSelectAll={true}
            placeholder=""
            fixedTrigger="onChange"
            fontSize={20}
            onChange={(e: any) => {
              setCode6(e)
            }}
            onKeyUp={(e: any) => {
              if (e.key === 'Backspace') {
                inputRef5?.current?.focus()
              }
            }}
            value={code6}
            disabled={disabled}
          />
        </View>
      </View>
    </Form.Item>
  )
})

export default CodeInput
