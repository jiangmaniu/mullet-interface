import * as React from 'react'
import { cn } from '../lib/utils'
import { InputContainer, InputContainerProps } from './input-container'

export type TextareaProps = Omit<React.ComponentProps<'textarea'>, 'size' | 'placeholder'> &
  Omit<InputContainerProps<React.ComponentProps<'textarea'>['value']>, 'children' | 'value'> & {
    textareaClassName?: string
    onValueChange?: (value: string) => void
  }

function Textarea({
  textareaClassName,
  onChange,
  onValueChange,
  // Textarea specific default for clean might be false? Input has it true. Let's keep it consistent.
  clean = true,
  onClean,
  value,
  variant,
  // InputContainer props
  labelText,
  placeholder,
  labelBgColor,
  hideLabel,
  labelClassName,
  size,
  LeftContent,
  RightContent,
  hintLabel,
  hintValue,
  errorMessage,
  className,
  // textarea element props
  ...textareaProps
}: TextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  const handleClear = () => {
    onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLTextAreaElement>)
    onValueChange?.('')
    onClean?.()
  }

  return (
    <InputContainer<TextareaProps['value']>
      clean={clean}
      value={value}
      variant={variant}
      onClean={handleClear}
      labelText={labelText}
      placeholder={placeholder}
      labelBgColor={labelBgColor}
      labelClassName={labelClassName}
      size={size}
      LeftContent={LeftContent}
      RightContent={RightContent}
      hintLabel={hintLabel}
      hideLabel={hideLabel}
      hintValue={hintValue}
      errorMessage={errorMessage}
      className={className}
    >
      <textarea
        ref={textareaRef}
        data-slot="textarea"
        placeholder=" "
        rows={1}
        className={cn(
          'peer order-2 flex-1 resize-none',
          'text-paragraph-p2 text-content-1 flex w-full min-w-0 border-none bg-transparent shadow-none outline-none transition-colors placeholder:text-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'focus:border-none focus:shadow-none focus:outline-none focus:ring-0',
          textareaClassName
        )}
        value={value}
        onChange={(event) => {
          onChange?.(event)
          onValueChange?.(event.target.value)
        }}
        {...textareaProps}
      />
    </InputContainer>
  )
}

export { Textarea }
