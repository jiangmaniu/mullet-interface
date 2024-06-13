import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'

import ProFormDigit from '@/components/Admin/Form/ProFormDigit'
import ModalForm from '@/components/Admin/ModalForm'
import { useStores } from '@/context/mobxProvider'
import { addMargin, extractMargin } from '@/services/api/tradeCore/order'
import { message } from '@/utils/message'

import { IPositionItem } from '../../Position'

type IProps = {
  trigger: JSX.Element
  info: IPositionItem
  onClose?: () => void
  /**追加保证金、提取保证金 */
  type: 'AddMargin' | 'ExtractMargin'
}

// 追加保证金
function AddMarginModal({ trigger, info, onClose, type }: IProps) {
  const intl = useIntl()
  const { trade } = useStores()
  const isAddMargin = type === 'AddMargin'

  return (
    <ModalForm
      title={isAddMargin ? intl.formatMessage({ id: 'mt.zhuijiabaozhengjin' }) : intl.formatMessage({ id: 'mt.tiqubaozhengjin' })}
      trigger={trigger}
      width={500}
      onFinish={async (values: any) => {
        // console.log('values', values)
        const params = {
          ...values,
          bagOrderId: info.id // 持仓订单号
        }
        console.log('params', params)
        const reqFn = isAddMargin ? addMargin : extractMargin
        const res = await reqFn(params)
        const success = res.success

        if (success) {
          trade.getPositionList()
          message.info(intl.formatMessage({ id: 'common.opSuccess' }))
        }

        return success
      }}
      onCancel={() => {
        onClose?.()
      }}
      afterClose={() => {
        onClose?.()
      }}
    >
      <ProFormDigit required name={isAddMargin ? 'addMargin' : 'extractMargin'} label={intl.formatMessage({ id: 'mt.baozhengjin' })} />
    </ModalForm>
  )
}

export default observer(AddMarginModal)
