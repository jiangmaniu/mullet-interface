import { FormattedMessage } from '@umijs/max'
import { useState } from 'react'

import Button from '@/components/Base/Button'
import Empty from '@/components/Base/Empty'
import Iconfont from '@/components/Base/Iconfont'
import { IOrder } from '@/models/takers'
import { colorTextPrimary } from '@/theme/theme.config'
import { push } from '@/utils/navigator'

import { defaultTakers } from '../mock'
import { TradingItem } from '../TradingItem'
import useColumns from './useColumns'

export default () => {
  const [takers, setTakers] = useState<IOrder[]>(defaultTakers)
  const [state, setState] = useState({})

  const columns = useColumns()

  return (
    <div className="flex flex-col gap-5 w-full">
      {takers.length > 0 ? (
        takers.map((item: IOrder, idx: number) => (
          <TradingItem
            key={idx}
            item={item}
            state={state}
            columns={columns}
            onClick={() => {
              push(`/copy-trading/detail/1`)
            }}
          />
        ))
      ) : (
        <div className="flex items-center justify-center flex-col h-[36rem] gap-[3rem]">
          <Empty src="/img/empty-gendanguanli.png" description={<FormattedMessage id="mt.zanwujilu" />} />
          <Button
            height={44}
            type="primary"
            style={{
              width: 197,
              borderRadius: 8
            }}
            onClick={() => {
              // todo 跳转
            }}
          >
            <div className="flex items-center text-base font-semibold">
              <Iconfont name="gendanguanli" width={22} color="white" height={22} hoverColor={colorTextPrimary} />
              <FormattedMessage id="mt.qugendan" />
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}
