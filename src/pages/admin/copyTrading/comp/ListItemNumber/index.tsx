import classNames from 'classnames'
import currency from 'currency.js'

import { formatNum, getColorClass } from '@/utils'

export type IListItemNumber = {
  color?: boolean
  prefix?: boolean
  showPrefix?: (...args: any) => string
  field?: string
  suffix?: boolean
  showSuffix?: (...args: any) => string
  fontSize?: 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl' | 'text-4xl' | 'text-5xl'
  fontWeight?:
    | 'font-dingpro-regular'
    | 'font-dingpro-medium'
    | 'font-dingpro-medium font-semibold'
    | 'font-normal'
    | 'font-semibold'
    | 'font-bold'
  opt?: currency.Options
}

/**
 * @description 通過配置，列表项展示數字通用組件
 */
export default ({
  item,
  field,
  prefix,
  showPrefix,
  color,
  suffix,
  showSuffix = () => '(USDT)',
  fontSize = 'text-base',
  fontWeight = 'font-dingpro-medium',
  opt
}: IListItemNumber & {
  item: Record<string, any>
}) => {
  const value = field ? item[field] : undefined

  return (
    <span className={classNames(fontSize, `!${fontWeight}`, color && getColorClass(Number(value)))}>
      {prefix ? (showPrefix ? showPrefix(item) : Number(value) > 0 ? `+` : '') : ''}
      {value && formatNum(value, opt)}
      {suffix && showSuffix(item)}
    </span>
  )
}
