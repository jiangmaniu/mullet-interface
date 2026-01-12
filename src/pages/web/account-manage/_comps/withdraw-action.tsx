import WithdrawModal from '@/components/Web/DepositWithdrawModal/WithdrawModal'
import { Trans } from '@/libs/lingui/react/macro'
import { Button } from '@/libs/ui/components/button'
import { useRef } from 'react'

export const AccountManageWithdrawAction = ({ accountInfo }: { accountInfo?: User.AccountItem }) => {
  const withdrawModalRef = useRef<any>(null)

  return (
    <div>
      <Button variant={'primary'} size={'sm'} color={'default'} onClick={() => withdrawModalRef.current?.show()}>
        <Trans>取款</Trans>
      </Button>

      <WithdrawModal ref={withdrawModalRef} accountInfo={accountInfo} />
    </div>
  )
}
