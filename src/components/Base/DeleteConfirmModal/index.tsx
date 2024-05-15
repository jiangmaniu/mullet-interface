import { FormattedMessage } from '@umijs/max'

import Modal from '@/components/Admin/Modal'

type IProps = {
  /**触发打开弹窗的按钮 */
  trigger: JSX.Element
  /**提示文本 */
  text?: () => React.ReactNode
  /**删除确认 */
  onConfirm: () => void
  children?: React.ReactNode
}

export default function DeleteConfirmModal({ trigger, text, onConfirm, children }: IProps) {
  return (
    <Modal trigger={trigger} title={<FormattedMessage id="mt.shanchuqueren" />} onFinish={onConfirm} width={500}>
      {children || <div className="text-gray text-base">{text?.() || <FormattedMessage id="mt.querenshanchugaixiang" />}</div>}
    </Modal>
  )
}
