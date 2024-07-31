import { FormattedMessage } from '@umijs/max'
import { useState } from 'react'

import Button from '@/components/Base/Button'
import Empty from '@/components/Base/Empty'
import Iconfont from '@/components/Base/Iconfont'
import { IOrder } from '@/models/takers'
import { colorTextPrimary } from '@/theme/theme.config'

import { defaultTakers } from './mock'
import { TradingItem } from './TradingItem'

export default function CopyTrading() {
  const [state, setState] = useState({})

  // 帶單員
  const [takers, setTakers] = useState<IOrder[]>(defaultTakers)

  return (
    <div className="flex flex-col w-full gap-6">
      {takers.length > 0 ? (
        takers.map((item: IOrder, idx: number) => <TradingItem key={idx} item={item} state={state} />)
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
