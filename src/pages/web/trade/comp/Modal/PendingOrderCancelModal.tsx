import { FormattedMessage } from '@umijs/max'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import Button from '@/components/Base/Button'
import Modal from '@/components/Base/Modal'
import Popup from '@/components/Base/Popup'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'

// 撤销挂单弹窗确认提示
export default forwardRef((props, ref) => {
  const [item, setItem] = useState<any>({})
  const { ws, trade } = useStores()

  const popupRef = useRef<any>()

  const close = () => {
    popupRef.current.close()
  }

  // 对外暴露接口
  useImperativeHandle(ref, () => {
    return {
      ...popupRef.current,
      show: (item: any) => {
        popupRef.current.show()
        setItem(item)
      }
    }
  })

  // 确认撤销挂单
  const handleOk = async () => {
    trade.cancelOrder({ id: item.id })
    close()
  }

  const renderContent = () => {
    return (
      <div className="max-xl:px-4">
        <div className="flex items-center justify-center pb-4">
          <img src="/img/yuebuzu.png" width={75} height={75} alt="" />
        </div>
        <div className="flex items-center justify-center pt-2 text-sm font-medium text-primary">
          <FormattedMessage id="mt.shifoucexiaogaibidingdan" />?
        </div>
        <div className="flex items-center justify-between pt-6">
          <Button className="!w-[45%]" onClick={close}>
            <FormattedMessage id="common.cancel" />
          </Button>
          <Button className="!w-[45%]" onClick={handleOk} type="primary">
            <FormattedMessage id="common.queren" />
          </Button>
        </div>
      </div>
    )
  }

  const titleDom = <FormattedMessage id="mt.cexiaoguadan" />

  return (
    <SwitchPcOrWapLayout
      pcComponent={
        <Modal title={titleDom} ref={popupRef} footer={null} width={400} centered>
          {renderContent()}
        </Modal>
      }
      wapComponent={
        <Popup title={titleDom} ref={popupRef} contentStyle={{ paddingBottom: 30 }} position="bottom">
          {renderContent()}
        </Popup>
      }
    />
  )
})
