import type { TextFieldProps } from '../Form/TextField'
import { TextField } from '../Form/TextField'

export const DateField = ({
  value,
  onChange,
  onEndEditing,
  minDate,
  maxDate,
  ...props
}: TextFieldProps & { minDate?: string | null; maxDate?: string | null; onEndEditing?: (text: string) => void }) => {
  // const [value, setValue] = useState(defaultValue)

  const handler = () => {
    if (!value) return

    // 移除所有非数字字符
    let cleanedText = value.replace(/[^0-9]/g, '')

    // 根据输入长度自动添加分隔符
    if (cleanedText.length > 4) {
      cleanedText = cleanedText.slice(0, 4) + '-' + cleanedText.slice(4)
    }
    if (cleanedText.length > 7) {
      cleanedText = cleanedText.slice(0, 7) + '-' + cleanedText.slice(7, 9)
    }

    // 验证日期格式
    const parts = cleanedText.split('-')
    if (parts.length > 1) {
      const year = parseInt(parts[0])
      const month = parseInt(parts[1])
      const day = parseInt(parts[2] || '0')
      const currentYear = new Date().getFullYear()

      // 验证年份
      if (year > currentYear) {
        cleanedText = currentYear.toString() + cleanedText.slice(4)
      }

      // 验证月份
      if (month > 12) {
        cleanedText = cleanedText.slice(0, 5) + '12' + cleanedText.slice(7)
      }

      // 验证日期
      if (day > 31) {
        cleanedText = cleanedText.slice(0, 8) + '31'
      }

      if (parts.length === 3) {
        // 如果日期是个位数，补充前导零
        if (parts.length === 3 && parts[2].length === 1) {
          if (parts[2] === '0') {
            cleanedText = cleanedText.slice(0, 8) + '01'
          } else {
            cleanedText = cleanedText.slice(0, 8) + '0' + parts[2]
          }
        }
      }
    }

    if (minDate) {
      const minDateParts = minDate.split('-')
      const minYear = parseInt(minDateParts[0])
      const minMonth = parseInt(minDateParts[1])
      const minDay = parseInt(minDateParts[2] || '0')

      const parts = cleanedText.split('-')
      const year = parseInt(parts[0])
      const month = parseInt(parts[1])
      const day = parseInt(parts[2] || '0')

      if (year < minYear) {
        cleanedText = minDate
      }

      if (year === minYear && month < minMonth) {
        cleanedText = minDate
      }

      if (year === minYear && month === minMonth && day < minDay) {
        cleanedText = minDate
      }

      if (cleanedText !== value) {
        onEndEditing?.(cleanedText)
      }
    }

    if (maxDate) {
      const maxDateParts = maxDate.split('-')
      const maxYear = parseInt(maxDateParts[0])
      const maxMonth = parseInt(maxDateParts[1])
      const maxDay = parseInt(maxDateParts[2] || '0')

      const parts = cleanedText.split('-')
      const year = parseInt(parts[0])
      const month = parseInt(parts[1])
      const day = parseInt(parts[2] || '0')

      if (year > maxYear) {
        cleanedText = maxDate
      }

      if (year === maxYear && month > maxMonth) {
        cleanedText = maxDate
      }

      if (year === maxYear && month === maxMonth && day > maxDay) {
        cleanedText = maxDate
      }

      if (cleanedText !== value) {
        onEndEditing?.(cleanedText)
      }
    }

    // 限制总长度
    if (cleanedText.length <= 10) {
      onEndEditing?.(cleanedText)
    }
  }

  return (
    <TextField
      value={value}
      onChange={onChange}
      onBlur={handler}
      onEnterPress={handler}
      {...props}
      inputWrapperStyle={{
        borderColor: '#f8f9fa'
      }}
      textAlign="center"
      style={{ backgroundColor: '#f8f9fa' }}
      containerClassName="mb-0"
    />
  )
}
