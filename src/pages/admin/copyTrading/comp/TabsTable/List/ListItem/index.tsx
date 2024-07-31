import { RightOutlined } from '@ant-design/icons'
import { FormattedMessage } from '@umijs/max'
import classNames from 'classnames'

import { IFollower } from '@/models/takers'
import { formatNum, getColorClass } from '@/utils'

export type IListItemTypes = {
  format: Record<string, any>
  currency?: boolean
  showCurrency?: (...args: any) => string
  color?: boolean
  prefix?: boolean
  showPrefix?: (...args: any) => string
  field?: keyof IFollower
  suffix?: boolean
  showSuffix?: (...args: any) => string
  fontWeight?: 'font-dingpro-regular' | 'font-dingpro-medium'
}

const ListItemValue = ({
  item,
  format,
  currency,
  showCurrency = () => '(USD)',
  field,
  prefix,
  showPrefix,
  color,
  suffix,
  showSuffix = () => '(USDT)',
  fontWeight = 'font-dingpro-medium'
}: {
  item: IFollower
} & IListItemTypes) => {
  const value = field ? item[field] : undefined

  return (
    <div className=" flex flex-col items-start gap-0.5">
      <span className=" text-xs text-gray-500 ">
        <FormattedMessage id={format.id} values={format.values} />
        {currency && showCurrency()}
      </span>
      <span className={classNames(' text-base ', `!${fontWeight}`, color && getColorClass(Number(value)))}>
        {prefix ? (showPrefix ? showPrefix(item) : Number(value) > 0 ? `+` : '') : ''}
        {value && formatNum(value)}
        {suffix && showSuffix(item)}
      </span>
    </div>
  )
}

export const ListItem = ({
  item,
  columns,
  onClick
}: {
  columns: IListItemTypes[]
  item: IFollower
  onClick?: (item: IFollower) => void
}) => {
  return (
    <div className=" border rounded-lg border-gray-150 flex flex-col flex-1 w-full">
      {/* header */}
      <div className="flex gap-3 py-2.5 px-3.5 cursor-pointer" onClick={() => onClick?.(item)}>
        <img src={item.avatar} width={24} height={24} className=" rounded-full border border-solid border-gray-340" />

        <div className=" flex flex-row gap-1 items-center">
          <span className=" text-base font-bold">{item.name}</span>
          <RightOutlined />
        </div>
      </div>
      {/* footer */}
      <div className="border-t border-gray-150 p-4 flex items-center justify-between md:gap-4 gap-2">
        <div
          className={classNames(
            `xl:grid-cols-${columns.length}`,
            'grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 xl:gap-15 md:gap-10 gap-5 flex-1'
          )}
        >
          {columns.map((col, idx) => (
            <ListItemValue item={item} {...col} key={idx} />
          ))}
        </div>
      </div>
    </div>
  )
}
