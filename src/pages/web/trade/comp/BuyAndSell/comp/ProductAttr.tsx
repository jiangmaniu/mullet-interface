import { useIntl } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react'

import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'

type IProps = {
  count?: any
  sp?: any
  sl?: any
  typeClassName?: string
  openPrice?: any
  typeText?: any
}

function ProductAttr({ count, sp, sl, typeText, typeClassName, openPrice }: IProps) {
  const { lng } = useLang()
  const { ws, global } = useStores()
  const intl = useIntl()

  const fieldList = [
    {
      label: intl.formatMessage({ id: 'mt.chicangchanpin' }),
      value: global.activeSymbolName
    },
    {
      label: intl.formatMessage({ id: 'mt.chicangfangxiang' }),
      value: typeText,
      className: typeClassName
    },
    {
      label: intl.formatMessage({ id: 'mt.kaicangshoushu' }),
      value: `${count} ${intl.formatMessage({ id: 'mt.lot' })}`
    },
    {
      label: intl.formatMessage({ id: 'mt.kaicangjiage' }),
      value: <span className="font-num">{formatNum(openPrice)} USD</span>
    },
    {
      label: intl.formatMessage({ id: 'mt.zhisun' }),
      value: <span className="font-num">{formatNum(sl)} USD</span>
    },
    {
      label: intl.formatMessage({ id: 'mt.zhiying' }),
      value: <span className="font-num">{formatNum(sp)} USD</span>
    }
  ]
  return (
    <div className="mt-3 px-3 pb-2">
      {fieldList.map((item, idx) => (
        <div className={classNames('flex items-center justify-between last:py-1', lng === 'zh-TW' ? 'py-[10px]' : 'py-2')} key={idx}>
          <div className="pr-4 text-xs text-gray-secondary">{item.label}</div>
          <div className="flex-1 border-t border-dashed border-primary"></div>
          <div className={classNames('pl-4 text-xs font-bold text-gray', item.className)}>{item.value}</div>
        </div>
      ))}
    </div>
  )
}

export default observer(ProductAttr)
