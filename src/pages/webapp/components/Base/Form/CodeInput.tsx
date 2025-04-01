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

  const [codes, setCodes] = useState<string[]>(['', '', '', '', '', ''])

  const inputRef1 = useRef<any>(null)
  const inputRef2 = useRef<any>(null)
  const inputRef3 = useRef<any>(null)
  const inputRef4 = useRef<any>(null)
  const inputRef5 = useRef<any>(null)
  const inputRef6 = useRef<any>(null)

  useEffect(() => {
    const codeValue = codes.join('')
    if (codeValue) {
      onChange?.(codeValue)
      console.log('codeValue', codeValue)
      form?.setFieldValue?.(name, codeValue)
    }
  }, [codes])

  const handlePaste = () => {
    readClipboard((text) => {
      if (text.length === 6) {
        setCodes(text.split(''))
      }
    })
  }

  useImperativeHandle(ref, () => ({
    focus: () => {
      // inputRef1.current?.select()
    }
  }))

  const handleCodeChange = (index: number, value: string) => {
    const newCodes = [...codes]
    newCodes[index] = value
    setCodes(newCodes)

    if (value && value.length > 0) {
      switch (index) {
        case 0:
          if (!codes[1]) inputRef2.current?.focus()
          break
        case 1:
          if (!codes[2]) inputRef3.current?.focus()
          break
        case 2:
          if (!codes[3]) inputRef4.current?.focus()
          break
        case 3:
          if (!codes[4]) inputRef5.current?.focus()
          break
        case 4:
          if (!codes[5]) inputRef6.current?.focus()
          break
      }
    }
  }

  const handleKeyUp = (index: number, e: any) => {
    if (e.key === 'Backspace') {
      switch (index) {
        case 1:
          inputRef1.current?.focus()
          break
        case 2:
          inputRef2.current?.focus()
          break
        case 3:
          inputRef3.current?.focus()
          break
        case 4:
          inputRef4.current?.focus()
          break
        case 5:
          inputRef5.current?.focus()
          break
      }
    }
  }

  return (
    <Form.Item noStyle name={name} rules={rules}>
      <View>
        <View className={cn('flex flex-row items-start justify-start gap-1.5')}>
          <InputNumber
            ref={inputRef1}
            className={cn(`text-[22px] leading-[28px] p-0 size-[${height}px]`, inputWrapperStyle)}
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
            onChange={(e: any) => handleCodeChange(0, e)}
            onKeyUp={(e: any) => handleKeyUp(0, e)}
            value={codes[0]}
            disabled={disabled}
          />
          <InputNumber
            ref={inputRef2}
            className={cn(`text-[22px] leading-[28px] p-0 size-[${height}px]`, inputWrapperStyle)}
            height={height}
            maxLength={1}
            controls={false}
            autoSelectAll={true}
            placeholder=""
            fixedTrigger="onChange"
            fontSize={20}
            onChange={(e: any) => handleCodeChange(1, e)}
            onKeyUp={(e: any) => handleKeyUp(1, e)}
            value={codes[1]}
            disabled={disabled}
          />
          <InputNumber
            ref={inputRef3}
            className={cn(`text-[22px] leading-[28px] p-0 size-[${height}px]`, inputWrapperStyle)}
            height={height}
            maxLength={1}
            controls={false}
            autoSelectAll={true}
            placeholder=""
            fixedTrigger="onChange"
            fontSize={20}
            onChange={(e: any) => handleCodeChange(2, e)}
            onKeyUp={(e: any) => handleKeyUp(2, e)}
            value={codes[2]}
            disabled={disabled}
          />
          <InputNumber
            ref={inputRef4}
            className={cn(`text-[22px] leading-[28px] p-0 size-[${height}px]`, inputWrapperStyle)}
            height={height}
            maxLength={1}
            controls={false}
            autoSelectAll={true}
            placeholder=""
            fixedTrigger="onChange"
            fontSize={20}
            onChange={(e: any) => handleCodeChange(3, e)}
            onKeyUp={(e: any) => handleKeyUp(3, e)}
            value={codes[3]}
            disabled={disabled}
          />
          <InputNumber
            ref={inputRef5}
            className={cn(`text-[22px] leading-[28px] p-0 size-[${height}px]`, inputWrapperStyle)}
            height={height}
            maxLength={1}
            controls={false}
            autoSelectAll={true}
            placeholder=""
            fixedTrigger="onChange"
            fontSize={20}
            onChange={(e: any) => handleCodeChange(4, e)}
            onKeyUp={(e: any) => handleKeyUp(4, e)}
            value={codes[4]}
            disabled={disabled}
          />
          <InputNumber
            ref={inputRef6}
            className={cn(`text-[22px] leading-[28px] p-0 size-[${height}px]`, inputWrapperStyle)}
            height={height}
            maxLength={1}
            controls={false}
            autoSelectAll={true}
            placeholder=""
            fixedTrigger="onChange"
            fontSize={20}
            onChange={(e: any) => handleCodeChange(5, e)}
            onKeyUp={(e: any) => handleKeyUp(5, e)}
            value={codes[5]}
            disabled={disabled}
          />
        </View>
      </View>
    </Form.Item>
  )
})

export default CodeInput
