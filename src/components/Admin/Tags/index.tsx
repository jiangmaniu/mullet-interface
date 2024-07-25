import { FormattedMessage } from '@umijs/max'
import classNames from 'classnames'
import { useMemo, useState } from 'react'

export type ITabTypes = {
  format?: Record<string, any>
  size?: 'tiny' | 'small' | 'medium'
  color?: string // 'green' | 'biaozhun' | 'luodian' | 'meifen'
  children?: React.ReactNode
  onClick?: () => void
  selectable?: boolean
}

export default ({ format, size = 'medium', color = 'biaozhun', children, onClick, selectable }: ITabTypes) => {
  const sizeMap = {
    tiny: 'px-1 h-4 leading-4 ',
    small: 'w-[2.25rem] h-[1.125rem] leading-[1.125rem]',
    medium: 'w-[2.625rem] h-[1.25rem] leading-[1.25rem]'
  }

  const borderMap = {
    gray: 'border-gray-120',
    green: 'border-green',
    red: 'border-red',
    biaozhun: 'border-yellow-490',
    luodian: 'border-green-700',
    meifen: 'border-black'
  }

  const colorMap = {
    gray: 'bg-gray-120',
    green: 'text-green bg-green bg-opacity-20',
    red: 'text-red bg-red bg-opacity-20',
    biaozhun: 'bg-yellow-490',
    luodian: 'bg-green-700 text-white',
    meifen: 'bg-black text-white'
  }

  const [selected, setSelected] = useState(false)

  const className = useMemo(
    () =>
      classNames(
        selected && ' border border-solid',
        selectable && 'cursor-pointer',
        sizeMap[size],
        // @ts-ignore
        colorMap[color],
        'text-xs font-normal flex-shrink px-1 rounded flex items-center justify-center'
      ),
    [selected, size, color, selectable]
  )

  const handleClick = () => {
    selectable && setSelected(!selected)

    onClick?.()
  }

  return (
    <span onClick={handleClick} className={className}>
      {format && <FormattedMessage id={format.id} />}
      {children}
    </span>
  )
}
