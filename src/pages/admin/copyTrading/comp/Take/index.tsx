import { FormattedMessage } from '@umijs/max'
import { useState } from 'react'

import Button from '@/components/Base/Button'
import Empty from '@/components/Base/Empty'
import Iconfont from '@/components/Base/Iconfont'
import { IOrderTaker } from '@/models/takers'
import { colorTextPrimary } from '@/theme/theme.config'

import TakeSettingModal from '../TakeSettingModal'
import { defaultTakers } from './mock'
import { TakeItem } from './TakeItem'

export default function Take() {
  const [state, setState] = useState({})

  // 帶單員
  const [takers, setTakers] = useState<IOrderTaker[]>(defaultTakers)

  // 跟单设置弹窗
  const [openSetting, setOpenSetting] = useState(false)
  const onOpenChangeSetting = (val: boolean) => setOpenSetting(val)

  const onClick = (id: string) => {
    console.log(id)
    setOpenSetting(true)
  }
  return (
    <div className="flex flex-col w-full gap-6">
      {takers.length > 0 ? (
        takers.map((item: IOrderTaker, idx: number) => <TakeItem key={idx} item={item} state={state} onClick={onClick} />)
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
            <div className="flex items-center text-base font-semibold">
              <Iconfont name="daidan" width={22} color="white" height={22} hoverColor={colorTextPrimary} />
              <FormattedMessage id="mt.shenqingchengweidaidanyuan" />
            </div>
          </Button>
        </div>
      )}
      <TakeSettingModal
        open={openSetting}
        onOpenChange={onOpenChangeSetting}
        onConfirm={() => {
          onOpenChangeSetting(false)
        }}
      />
    </div>
  )
}
