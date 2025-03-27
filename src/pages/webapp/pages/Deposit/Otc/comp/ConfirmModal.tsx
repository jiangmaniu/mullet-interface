import { useIntl } from '@umijs/max'
import { forwardRef, useImperativeHandle, useRef } from 'react'

import SheetModal, { SheetRef } from '@/pages/webapp/components/Base/SheetModal'

type IProps = {
  trigger?: JSX.Element
  handleReset: () => void
}

function ConfirmModal(props: IProps, ref: any) {
  const modalRef = useRef<any>()
  const bottomSheetModalRef = useRef<SheetRef>(null)
  const intl = useIntl()

  const close = () => {
    bottomSheetModalRef.current?.sheet?.dismiss()
  }

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close
  }))

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      autoHeight
      header={
        <div className="w-full flex flex-col items-center justify-center bg-gray-50 pt-5 pb-[70px] rounded-t-[20px]">
          <div className="leading-7 text-center font-pf-bold text-lg text-primary">{intl.formatMessage({ id: 'common.wenxintishi' })}</div>
          <div className="h-[100px] w-60 relative flex justify-center py-4">
            <img src="/img/quxiaodingdan.png" style={{ width: 136, height: 136 }} />
          </div>
        </div>
      }
      headerStyle={{
        paddingTop: 0
      }}
      children={
        <div className="px-3">
          <div className="text-sm text-primary text-center pt-4 pb-2">{intl.formatMessage({ id: 'mt.dingdanyichaoshi' })}</div>
        </div>
      }
    />
  )
}

export default forwardRef(ConfirmModal)
