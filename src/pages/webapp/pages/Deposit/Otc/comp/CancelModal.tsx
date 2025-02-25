import Button from '@/pages/webapp/components/Base/Button'
import SheetModal, { ModalRef, SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { cancelDepositOrder } from '@/services/api/wallet'
import { push } from '@/utils/navigator'
import { FormattedMessage, getIntl } from '@umijs/max'
import type { ForwardedRef } from 'react'
import { forwardRef, useImperativeHandle, useRef } from 'react'
type IProps = {
  id: string
  backUrl: string
}
/** 选择账户弹窗 */
function CancelModal({ id, backUrl }: IProps, ref: ForwardedRef<ModalRef>) {
  const { t } = useI18n()

  const handleSubmit = () => {}

  const bottomSheetModalRef = useRef<SheetRef>(null)

  const close = () => {
    bottomSheetModalRef.current?.sheet?.dismiss()
  }

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close
  }))

  const cancelOrder = () => {
    if (id) {
      cancelDepositOrder({ id }).then((res) => {
        if (res.success) {
          push(backUrl || '/deposit')
        }
      })
    }
  }

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      title={t('mt.quxiaodingdan')}
      autoHeight
      emotionClassName={{
        'div[data-rsbs-header]': {
          boxShadow: 'none !important',
          paddingInline: '0 !important',
          backgroundColor: '#f7f7f7',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px'
        }
      }}
      footer={
        <div className="flex flex-row  justify-between gap-2.5 mt-2 mb-2.5 w-full ">
          <div className="flex-1 ">
            <Button type="danger" size="large" className="w-full" onClick={cancelOrder}>
              {getIntl().formatMessage({ id: 'common.confirm' })}
            </Button>
          </div>
          <div className="flex-1 ">
            <Button size="large" className=" w-full" onClick={close}>
              {getIntl().formatMessage({ id: 'common.zhanbu' })}
            </Button>
          </div>
        </div>
      }
      children={
        <div className="bg-[#f7f7f7] flex flex-col items-center">
          <img
            src="/img/quxiaodingdan.png"
            alt="quxiaodingdan"
            style={{ width: 136, height: 136, margin: '0 auto', marginBottom: 30, marginTop: 26 }}
          />
          <div className="text-sm text-secondary pt-6 pb-9 text-center bg-white w-full">
            <FormattedMessage id="mt.qingquebaoninbinweijinxingzhuanzhang" />
            <br />
            <FormattedMessage id="mt.duociquxiao" />
          </div>
        </div>
      }
    />
  )
}

export default forwardRef(CancelModal)
