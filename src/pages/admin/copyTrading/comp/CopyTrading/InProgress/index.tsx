import { FormattedMessage, useIntl } from '@umijs/max'
import { useRef, useState } from 'react'

import Button from '@/components/Base/Button'
import Empty from '@/components/Base/Empty'
import Iconfont from '@/components/Base/Iconfont'
import { ModalLoading } from '@/components/Base/Lottie/Loading'
import { IOrder } from '@/models/takers'
import { colorTextPrimary } from '@/theme/theme.config'
import { message } from '@/utils/message'
import { push } from '@/utils/navigator'

import EndModal from '../../../copyTradingDetail/EndModal'
import TradingSettingModal from '../../TradingSettingModal'
import { defaultTakers } from '../mock'
import { TradingItem } from '../TradingItem'
import useColumns from './useColumns'

export default () => {
  const [takers, setTakers] = useState<IOrder[]>(defaultTakers)
  const [state, setState] = useState({})
  const intl = useIntl()

  const [openEnd, setOpenEnd] = useState(false)
  const onOpenChangeEnd = (val: boolean) => setOpenEnd(val)

  // 跟单配置弹窗
  const [openSetting, setOpenSetting] = useState(false)
  const onOpenChangeSetting = (val: boolean) => setOpenSetting(val)

  const columns = useColumns()

  const loadingRef = useRef<any>()
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
          >
            <div className=" flex items-center justify-end gap-2.5">
              <Button
                height={44}
                type="default"
                style={{
                  width: 80,
                  borderRadius: 8
                }}
                onClick={(e) => {
                  // push(`/copy-trading/management`)
                  e.stopPropagation()
                  setOpenSetting(true)
                }}
              >
                <div className="flex items-center text-sm font-semibold gap-1">
                  <Iconfont name="shezhi" width={18} color="black" height={18} />
                  <FormattedMessage id="mt.shezhi" />
                </div>
              </Button>
              <Button
                height={44}
                type="primary"
                danger
                style={{
                  width: 106,
                  borderRadius: 8
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  // push(`/copy-trading/management`)
                  setOpenEnd(true)
                }}
              >
                <div className="flex items-center text-sm font-semibold gap-1">
                  <Iconfont name="jieshudaidan" width={18} color="white" height={18} />
                  <FormattedMessage id="mt.jieshugendan" />
                </div>
              </Button>
            </div>
          </TradingItem>
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

      <EndModal
        open={openEnd}
        onOpenChange={onOpenChangeEnd}
        onConfirm={() => {
          onOpenChangeEnd(false)
          loadingRef.current?.show()
          setTimeout(() => {
            loadingRef.current?.close()
            message.info(intl.formatMessage({ id: 'mt.caozuochenggong' }))
          }, 3000)
        }}
      />

      <TradingSettingModal
        open={openSetting}
        onOpenChange={onOpenChangeSetting}
        onConfirm={() => {
          onOpenChangeSetting(false)
        }}
      />

      <ModalLoading
        ref={loadingRef}
        title={intl.formatMessage({ id: 'mt.jieshugendan' })}
        tips={intl.formatMessage({ id: 'mt.jieshugendanzhong' })}
      />
    </div>
  )
}
