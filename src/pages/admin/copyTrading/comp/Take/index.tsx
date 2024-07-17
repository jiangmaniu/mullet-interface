import { FormattedMessage } from '@umijs/max'
import { useState } from 'react'

import Button from '@/components/Base/Button'
import Empty from '@/components/Base/Empty'
import Iconfont from '@/components/Base/Iconfont'
import { IOrderTaker } from '@/models/takers'
import { colorTextPrimary } from '@/theme/theme.config'

import { defaultTakers } from './mock'
import { TakeItem } from './TakeItem'

export default function Take() {
  const [state, setState] = useState({})

  // 帶單員
  const [takers, setTakers] = useState<IOrderTaker[]>(defaultTakers)

  return (
    <div className="flex flex-col w-full gap-6">
      {takers.length > 0 ? (
        takers.map((item: IOrderTaker, idx: number) => <TakeItem key={idx} taker={item} state={state} />)
      ) : (
        <div className="flex items-center justify-center flex-col h-[36rem] gap-[3rem]">
          <Empty src="/img/empty-daidan.png" description={<FormattedMessage id="mt.zanwujilu" />} />
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
            <div className="flex items-center text-base">
              <Iconfont name="daidan" width={22} color="white" height={22} hoverColor={colorTextPrimary} />
              <FormattedMessage id="mt.shenqingchengweidaidanyuan" />
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}
