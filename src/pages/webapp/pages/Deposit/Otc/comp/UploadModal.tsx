import Button from '@/pages/webapp/components/Base/Button'
import SheetModal, { ModalRef, SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { submitDepositCertificate } from '@/services/api/wallet'
import { push } from '@/utils/navigator'
import { getIntl } from '@umijs/max'
import { message } from 'antd'
import type { ForwardedRef } from 'react'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Uploadcard from './UploadCard'
type IProps = {
  id: string
  certificateUrl: string
}
/** 选择账户弹窗 */
function UploadModal(props: IProps, ref: ForwardedRef<ModalRef>) {
  const { t } = useI18n()

  const [imgs, setImgs] = useState<string[]>([])

  useEffect(() => {
    setImgs(props.certificateUrl?.split(',') || [])
  }, [props.certificateUrl])

  const handleSubmit = () => {
    if (imgs.length === 0) {
      message.info(getIntl().formatMessage({ id: 'mt.qingshangchuangpingzheng' }))
      return
    }

    submitDepositCertificate({
      id: props.id,
      certificateUrl: imgs.join(',')
    }).then((res) => {
      if (res.success) {
        message.info(getIntl().formatMessage({ id: 'common.submitSuccess' }))
        bottomSheetModalRef.current?.sheet?.dismiss()
        push(`/app/deposit/wait/${props.id}`)
      }
    })
  }

  const bottomSheetModalRef = useRef<SheetRef>(null)

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      title={t('mt.shangchuanpinzheng')}
      autoHeight
      footer={
        <Button type="primary" size="large" className="mt-2 mb-2.5" onClick={handleSubmit}>
          {getIntl().formatMessage({ id: 'common.tijiao' })}
        </Button>
      }
      children={
        <div className="px-[14px]">
          <Uploadcard setImgs={setImgs} imgs={imgs} />
        </div>
      }
    />
  )
}

export default forwardRef(UploadModal)
