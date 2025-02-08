import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { useState } from 'react'

import ModalForm from '@/components/Admin/ModalForm'
import Button from '@/components/Base/Button'
import { useStores } from '@/context/mobxProvider'
import { rechargeSimulate } from '@/services/api/tradeCore/account'
import { message } from '@/utils/message'

type IProps = {
  trigger: JSX.Element
  info: User.AccountItem
}

// 模拟入金弹窗
function RechargeSimulateModal({ trigger, info }: IProps) {
  const intl = useIntl()
  const { global, trade } = useStores()
  const { fetchUserInfo } = useModel('user')
  const { initialState } = useModel('@@initialState')
  const [loading, setLoading] = useState(false)
  const currentUser = initialState?.currentUser
  const accountId = info.id as string

  return (
    <ModalForm
      title={intl.formatMessage({ id: 'mt.monizhanghurujin' })}
      trigger={trigger}
      width={420}
      hiddenSubmitter
      onFinish={async (values: any) => {
        setLoading(true)
        const res = await rechargeSimulate({
          accountId,
          money: 10000,
          type: 'DEPOSIT_SIMULATE'
        })
        setLoading(false)
        const success = res.success

        if (success) {
          message.info(intl.formatMessage({ id: 'mt.monizhanghurujinchenggong' }))

          // 刷新账户列表
          fetchUserInfo(false)
        }

        return success
      }}
    >
      <div className="mb-4 flex justify-center">
        <div className="text-brand bg-brand/10 px-2 rounded flex items-center justify-center h-7">
          <FormattedMessage id="mt.zhanghu" />
          {info?.id}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-secondary text-sm pb-1">
          <FormattedMessage id="mt.meirikerujin" />
        </div>
        <div className="flex items-baseline">
          <span className="text-[30px] !font-dingpro-medium">10,000.00</span>
          <span className="text-sm text-secondary pl-2">USD</span>
        </div>
      </div>
      <Button type="primary" style={{ height: 42 }} block className="!mt-7" htmlType="submit" loading={loading}>
        <FormattedMessage id="common.confirm" />
      </Button>
    </ModalForm>
  )
}

export default observer(RechargeSimulateModal)
