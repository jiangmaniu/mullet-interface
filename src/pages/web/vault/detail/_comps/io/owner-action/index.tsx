import { useNiceModal } from '@/components/providers/nice-modal-provider/hooks'
import { GLOBAL_MODAL_ID } from '@/components/providers/nice-modal-provider/register'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Icons } from '@/components/ui/icons'
import { useStores } from '@/context/mobxProvider'
import { cn } from '@/utils/cn'
import { useModel } from '@umijs/max'
import { useState } from 'react'
import { useVaultDetail } from '../../../_hooks/useVaultDetail'
import { DistributeModal } from './distribute-modal'

export const VaultOwnerAction = () => {
  const [isDistributeModalOpen, setIsDistributeModalOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={cn('py-[5px] leading-[18px] min-h-max min-w-max px-[10px] gap-2 border-[#3B3D52]')} variant="outline">
            <span>创建者操作</span>
            <Icons.lucide.ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[156px]" sideOffset={8} align="end">
          <VaultTrade />
          <WithdrawAndClosePosition />
          <DropdownMenuItem onClick={() => setIsDistributeModalOpen(true)}>分发</DropdownMenuItem>
          <CloseVault />
        </DropdownMenuContent>
      </DropdownMenu>
      <DistributeModal open={isDistributeModalOpen} onOpenChange={setIsDistributeModalOpen} />
    </>
  )
}

function VaultTrade() {
  const { trade, ws } = useStores()
  const { initialState } = useModel('@@initialState')

  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList || []
  const { vaultDetail } = useVaultDetail()

  const toVaultTradeAccount = () => {
    const vaultAccount = accountList.find(
      (item) => item.pdaTokenAddress.toString() === vaultDetail?.followAccount?.pdaTokenAddress?.toString()
    )
    if (vaultAccount) {
      ws.close()
      trade.setCurrentAccountInfo(vaultAccount)
      trade.jumpTrade()

      // 切换账户重置
      trade.setCurrentLiquidationSelectBgaId('CROSS_MARGIN')
    }
  }

  return <DropdownMenuItem onClick={toVaultTradeAccount}>金库交易</DropdownMenuItem>
}

function WithdrawAndClosePosition() {
  const { vaultDetail } = useVaultDetail()
  const confirmModal = useNiceModal(GLOBAL_MODAL_ID.SecondaryConfirmation)

  const handleSwitchRedeemCloseOrder = () => {
    if (vaultDetail) {
      confirmModal.show({
        title: vaultDetail?.redeemCloseOrder ? '禁用取款平仓' : '启用取款平仓',
        message: vaultDetail?.redeemCloseOrder
          ? `确定要禁用取款平仓吗？禁用后，在取款时不会自动平仓。`
          : `确定要启用取款平仓吗？启用后，在取款时会自动平仓。`,
        confirm: {
          label: '确定',
          cb: () => {
            console.log(1)
          }
        },
        cancel: {
          label: '取消',
          cb: () => {}
        }
      })
    }
  }

  return (
    <DropdownMenuItem onClick={handleSwitchRedeemCloseOrder}>
      {vaultDetail?.redeemCloseOrder ? '禁用取款平仓' : '启用取款平仓'}
    </DropdownMenuItem>
  )
}

const CloseVault = () => {
  const { vaultDetail } = useVaultDetail()
  const isCloseVault = !!vaultDetail && vaultDetail?.status === 'CLOSE'
  const confirmModal = useNiceModal(GLOBAL_MODAL_ID.SecondaryConfirmation)

  const handleCloseVault = () => {
    if (vaultDetail) {
      confirmModal.show({
        title: '关闭仓库',
        message: '您确认要关闭金库？此操作将会结束金库订单并按比例分发所有资金，并且无法再启用此金库。',

        confirm: {
          label: '确定',

          cb: () => {
            console.log(1)
          }
        },
        cancel: {
          label: '取消',
          cb: () => {}
        }
      })
    }
  }

  return (
    <DropdownMenuItem disabled={isCloseVault} onClick={handleCloseVault}>
      关闭仓库
    </DropdownMenuItem>
  )
}
