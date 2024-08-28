import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useImperativeHandle, useState } from 'react'

import ProFormText from '@/components/Admin/Form/ProFormText'
import ModalForm from '@/components/Admin/ModalForm'
import Button from '@/components/Base/Button'
import { useStores } from '@/context/mobxProvider'
import { UpdateAccount } from '@/services/api/tradeCore/account'
import { hiddenCenterPartStr } from '@/utils'
import { message } from '@/utils/message'

type IProps = {
  trigger?: JSX.Element
  info: User.AccountItem
}

// 重命名账户
function RenameAccountModal({ info }: IProps, ref: any) {
  const intl = useIntl()
  const { global, trade } = useStores()
  const { fetchUserInfo } = useModel('user')
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => {
    return {
      setOpen
    }
  })

  return (
    <ModalForm
      title={intl.formatMessage({ id: 'mt.zhanghuchongmingming' })}
      open={open}
      width={420}
      hiddenSubmitter
      onFinish={async (values: any) => {
        // console.log('values', values)
        const params = {
          ...values,
          id: info.id
        }
        console.log('params', params)
        const res = await UpdateAccount(params)
        const success = res.success

        if (success) {
          message.info(intl.formatMessage({ id: 'common.opSuccess' }))

          // 刷新账户列表
          fetchUserInfo(false)

          setOpen(false)
        }

        return success
      }}
      onCancel={() => setOpen(false)}
    >
      <div className="mb-4 flex">
        <div className="text-brand bg-brand/10 px-2 rounded flex items-center justify-center h-7">
          <FormattedMessage id="mt.zhanghu" />
          {hiddenCenterPartStr(info.id, 4)}
        </div>
      </div>
      <div className="text-sm text-secondary mb-5">
        <FormattedMessage id="mt.zhanghuchongmingmingtips" />
      </div>
      <ProFormText required name="name" label={intl.formatMessage({ id: 'mt.xinmingcheng' })} initialValue={info?.name} />
      <Button type="primary" style={{ height: 42 }} block className="!mt-7" htmlType="submit">
        <FormattedMessage id="mt.zhanghuchongmingming" />
      </Button>
    </ModalForm>
  )
}

export default observer(forwardRef(RenameAccountModal))
