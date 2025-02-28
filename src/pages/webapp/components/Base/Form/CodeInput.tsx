import { useEffect, useRef, useState } from 'react'

import { useTheme } from '@/context/themeProvider'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
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
}

const CodeInput = (props: IProps) => {
  const { value, onChange, inputWrapperStyle, height = 48, width = 48, rules, form, name, disabled } = props
  const i18n = useI18n()
  const { cn } = useTheme()
  const [isPhoneFocus, setIsPhoneFocus] = useState(false)
  const [code, setCode] = useState({
    value1: '',
    value2: '',
    value3: '',
    value4: '',
    value5: '',
    value6: ''
  })
  const inputRef1 = useRef<any>(null)
  const inputRef2 = useRef<any>(null)
  const inputRef3 = useRef<any>(null)
  const inputRef4 = useRef<any>(null)
  const inputRef5 = useRef<any>(null)
  const inputRef6 = useRef<any>(null)

  useEffect(() => {
    const codeValue = code.value1 + code.value2 + code.value3 + code.value4 + code.value5 + code.value6
    if (codeValue) {
      onChange?.(codeValue)
      form?.setFieldValue?.(name, codeValue)
    }
  }, [code])

  const handleInput = (e: string, name: string) => {
    setCode({
      ...code,
      [name]: e.trim()
    })
  }
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
            onChange={(e: any) => {
              handleInput(e, 'value1')
              if (e && e.length > 0) {
                if (!inputRef2.current?.value) {
                  inputRef2.current?.focus()
                }
              }
            }}
            value={code.value1}
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
              handleInput(e, 'value2')
              if (e && e.length > 0) {
                inputRef3?.current?.focus()
              }
            }}
            onKeyUp={(e: any) => {
              if (e.key === 'Backspace') {
                inputRef1?.current?.focus()
              }
            }}
            value={code.value2}
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
              handleInput(e, 'value3')
              if (e && e.length > 0) {
                inputRef4?.current?.focus()
              }
            }}
            onKeyUp={(e: any) => {
              if (e.key === 'Backspace') {
                inputRef2?.current?.focus()
              }
            }}
            value={code.value3}
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
              handleInput(e, 'value4')
              if (e && e.length > 0) {
                inputRef5?.current?.focus()
              }
            }}
            onKeyUp={(e: any) => {
              if (e.key === 'Backspace') {
                inputRef3?.current?.focus()
              }
            }}
            value={code.value4}
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
              handleInput(e, 'value5')
              if (e && e.length > 0) {
                inputRef6?.current?.focus()
              }
            }}
            onKeyUp={(e: any) => {
              if (e.key === 'Backspace') {
                inputRef4?.current?.focus()
              }
            }}
            value={code.value5}
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
              handleInput(e, 'value6')
              if (e && e.length > 0) {
                inputRef6?.current?.blur()
              }
            }}
            onKeyUp={(e: any) => {
              if (e.key === 'Backspace') {
                inputRef5?.current?.focus()
              }
            }}
            value={code.value6}
            disabled={disabled}
          />
        </View>
      </View>
    </Form.Item>
  )
}

export default CodeInput
