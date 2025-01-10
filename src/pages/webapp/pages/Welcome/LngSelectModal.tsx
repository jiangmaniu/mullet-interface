import { LanuageTransformMap } from '@/constants/enum'
import SheetModal, { ModalRef, SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import type { ForwardedRef } from 'react'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { LngList } from '../UserCenter/Language'

type IProps = {
  title?: string
}

/** 选择账户弹窗 */

function LngSelectModal({ title }: IProps, ref: ForwardedRef<ModalRef>) {
  const i18n = useI18n()
  const { t } = i18n

  const bottomSheetModalRef = useRef<SheetRef>(null)

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  const currentList = Object.keys(LanuageTransformMap).map((item) => {
    return {
      title: i18n.t(`common.language.${item}`),
      value: item
    }
  })

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      title={t('app.pageTitle.Language')}
      height={400}
      autoHeight
      // snapPoints={['80%', '100%']} // 增加這個功能後 dismiss 會出現按鈕點擊異常問題
      // onConfirm={onConfirm}
      hiddenFooter
      children={
        <div className="px-[14px] pb-4">
          <LngList list={currentList} />
        </div>
      }
    />
  )
}

export default forwardRef(LngSelectModal)
