import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import SheetModal, { ModalRef, SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { submitDepositCertificate } from '@/services/api/wallet'
import { replace } from '@/utils/navigator'
import { appendHideParamIfNeeded } from '@/utils/request'
import { FormattedMessage, getIntl } from '@umijs/max'
import { Image, message } from 'antd'
import type { ForwardedRef } from 'react'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Uploadcard from './UploadCard'
type IProps = {
  id: string
  certificateUrl: string
}
const TransparentBackdrop = ({ onClick }: { onClick: () => void }) => (
  <div
    onClick={onClick}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 3
    }}
  >
    {/* 占位 */}
  </div>
)

/** 选择账户弹窗 */
function UploadModal(props: IProps, ref: ForwardedRef<ModalRef>) {
  const { t } = useI18n()

  const [imgs, setImgs] = useState<string[]>([])

  useEffect(() => {
    props.certificateUrl && setImgs(props.certificateUrl?.split(',') || [])
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
        replace(appendHideParamIfNeeded(`/app/deposit/wait/${props.id}`))
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

  const [visible, setVisible] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const { cn } = useTheme()
  return (
    <>
      {isSheetOpen && (
        <TransparentBackdrop
          onClick={() => {
            console.log('onClick')
            bottomSheetModalRef.current?.sheet?.dismiss()
          }}
        />
      )}
      <SheetModal
        ref={bottomSheetModalRef}
        onOpenChange={(open) => {
          setIsSheetOpen(open)
        }}
        blocking={false}
        header={
          <div className="w-full relative">
            <div className={cn('leading-7 text-center font-pf-bold text-lg text-primary')}>{t('mt.shangchuanpinzheng')}</div>

            <span
              className="text-blue text-sm font-normal underline cursor-pointer absolute right-4 top-1"
              onClick={() => setVisible(true)}
            >
              <FormattedMessage id="mt.chukanshili" />
            </span>
          </div>
        }
        autoHeight
        footer={
          <Button type="primary" size="large" className="mt-2 mb-2.5" onClick={handleSubmit}>
            {getIntl().formatMessage({ id: 'common.tijiao' })}
          </Button>
        }
        children={
          <div className="px-[14px]">
            <Uploadcard setImgs={setImgs} imgs={imgs} />

            <div className="hidden">
              <Image.PreviewGroup
                preview={{
                  visible,
                  scaleStep: 1,
                  onVisibleChange: (value) => {
                    setVisible(value)
                  }
                }}
              >
                <Image width={200} style={{ display: 'none' }} src={'/img/shili-01.jpeg'} />
                <Image width={200} style={{ display: 'none' }} src={'/img/shili-02.png'} />
                <Image width={200} style={{ display: 'none' }} src={'/img/shili-03.jpeg'} />
              </Image.PreviewGroup>
            </div>
          </div>
        }
      />
    </>
  )
}

export default forwardRef(UploadModal)
