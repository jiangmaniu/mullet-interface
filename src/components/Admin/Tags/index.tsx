import { FormattedMessage } from '@umijs/max'
import { observer } from 'mobx-react'
import { useLayoutEffect, useMemo, useState } from 'react'

import { useStores } from '@/context/mobxProvider'
import { getAccountSynopsisByLng } from '@/utils/business'
import { cn } from '@/utils/cn'

export type ITabTypes = {
  format?: Record<string, any>
  size?: 'tiny' | 'small' | 'medium' | 'auto'
  color?: string // 'green' | 'biaozhun' | 'luodian' | 'meifen'
  children?: React.ReactNode
  onClick?: () => void
  selectable?: boolean
  code?: string
  className?: string
}

const Tags = ({ code, format, size = 'medium', color = 'biaozhun', children, onClick, selectable, className }: ITabTypes) => {
  const { trade } = useStores()
  const accountGroupList = trade.accountGroupList

  useLayoutEffect(() => {
    if (!accountGroupList.length) {
      trade.getAccountGroupList()
    }
  }, [accountGroupList])

  const sizeMap = {
    tiny: 'px-1 h-4 leading-4 ',
    small: 'w-[2.25rem] h-[1.125rem] leading-[1.125rem]',
    medium: 'w-[2.625rem] h-[1.25rem] leading-[1.25rem]',
    auto: 'w-auto h-[1.25rem] leading-[1.25rem] whitespace-nowrap'
  }

  const colorMap = {
    gray: 'bg-gray-120',
    darkGray: 'bg-gray-300',
    green: 'text-green bg-green-700 bg-opacity-20',
    red: 'text-red bg-red-600 bg-opacity-20',
    biaozhun: 'bg-yellow-490',
    '【真实+锁仓】': 'bg-yellow-490',
    luodian: 'bg-green-700 text-white',
    '【真实+杠杆】': 'bg-green-700 text-white',
    '【真实+净额】': 'bg-orange-600 text-white',
    meifen: 'bg-black text-white',
    '【真实+锁仓+浮动杠杆】': 'bg-black text-white'
  }

  const [item, setItem] = useState<AccountGroup.AccountGroupItem | null>(null)
  const [index, setIndex] = useState(0)

  useLayoutEffect(() => {
    if (code && accountGroupList.length > 0) {
      accountGroupList.forEach((item, idx) => {
        if (item.groupCode === code) {
          setItem(item)
          setIndex(idx)
        }
      })
    }
  }, [accountGroupList, code])

  const colorList = [
    'bg-red-600 text-white',
    'bg-yellow-560',
    'bg-green-700 text-white',
    'bg-orange-600 text-white',
    'bg-black text-white',
    'bg-purple-500 text-white',
    'bg-blue-400 text-white',
    'bg-red-700',
    'bg-green-600 text-white',
    'bg-orange-800 text-white',
    'bg-blue-700 text-white',
    'bg-purple-600'
  ]

  const [selected, setSelected] = useState(false)

  const innerClassName = useMemo(
    () =>
      cn(
        selected && ' border border-solid',
        selectable && 'cursor-pointer',
        size && sizeMap[size],
        // @ts-ignore
        colorMap?.[color],
        item && colorList?.[index],
        'text-xs font-normal flex-shrink-0 px-1 rounded flex items-center justify-center truncate'
      ),
    [selected, size, color, selectable, item, index]
  )

  const handleClick = () => {
    selectable && setSelected(!selected)

    onClick?.()
  }

  const synopsis = getAccountSynopsisByLng(item?.synopsis)

  return (
    <span onClick={handleClick} className={cn(innerClassName, className)}>
      {format && <FormattedMessage id={format.id} />}
      {children}
      <span className="truncate">{useMemo(() => (item ? synopsis?.abbr || 'unset' : ''), [item])}</span>
    </span>
  )
}

export default observer(Tags)
