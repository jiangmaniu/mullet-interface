import WithdrawModal from '@/components/Web/DepositWithdrawModal/WithdrawModal'
import { Trans } from '@/libs/lingui/react/macro'
import { Button } from '@/libs/ui/components/button'
import { useRef } from 'react'
import DepositModal from '@/components/Web/DepositWithdrawModal/DepositModal'

export const AccountManageDepositAction = ({ accountInfo }: { accountInfo?: User.AccountItem }) => {
  const depositModalRef = useRef<any>(null)

  return (
    <div>
      <Button variant={'primary'} size={'sm'} color={'default'} onClick={() => depositModalRef.current?.show()}>
        <Trans>取款</Trans>
      </Button>

      <DepositModal ref={depositModalRef} accountInfo={accountInfo} />
    </div>
  )
}
