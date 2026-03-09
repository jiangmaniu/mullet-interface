'use client'

import { Trans } from '@/libs/lingui/react/macro'
import { useState, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react'
import { useModel } from '@umijs/max'

import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@/libs/ui/components/modal'
import { useDepositState, useDepositActions } from './_hooks/use-deposit-state'

import {
  IconArbitrum,
  IconBitcoin,
  Iconify,
  IconMetamask,
  IconOkxWallet,
  IconpEthereumEth,
  IconUSDC,
  IconVisa
} from '@/libs/ui/components/icons'
import { Separator } from '@/libs/ui/components/separator'
import { IconMasterCord } from '@/libs/ui/components/icons/set/master-cord'
import { WalletAssets } from './wallet-assets'
import { SwapDeposit } from './swap-deposit'
import { Cryptocurrency } from './cryptocurrency'
import { CreditCardBuy } from './credit-card-buy'
import { BNumber } from '@/utils/b-number'

export const MOCK_DEPOSIT_ADDRESSES: Record<string, string> = {
  Tron: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
  Ethereum: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  Solana: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  Arbitrum: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  BSC: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  Bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
}

export type DepositModalProps = {
  isOpen?: boolean
  onClose?: () => void
  children?: React.ReactNode
  initialAccountId?: string // 初始账户ID
}

export const DepositModal = observer(({ isOpen, onClose, children, initialAccountId }: DepositModalProps) => {
  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      {children && <ModalTrigger asChild>{children}</ModalTrigger>}

      <ModalContent onInteractOutside={(event) => event.preventDefault()} className="flex w-full max-w-[360px] min-w-[360px] gap-2xl p-2xl">
        <DepositContent isOpen={isOpen} initialAccountId={initialAccountId} />
      </ModalContent>
    </Modal>
  )
})

const DepositContent = observer(({ isOpen, initialAccountId }: { isOpen?: boolean; initialAccountId?: string }) => {
  type DepositView = 'menu' | 'wallet' | 'swap' | 'crypto' | 'buy'
  const [activeView, setActiveView] = useState<DepositView>('menu')
  const { reset } = useDepositActions()

  // Reset to menu when modal closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setActiveView('menu')
        reset() // 重置 deposit store 状态
      }, 300)
      return () => clearTimeout(t)
    }
  }, [isOpen, reset])

  const content = useMemo(() => {
    switch (activeView) {
      case 'menu':
        return <DepositMenuContent onSelect={setActiveView} initialAccountId={initialAccountId} />
      case 'wallet':
        return <WalletAssets onBack={() => setActiveView('menu')} />
      case 'swap':
        return <SwapDeposit onBack={() => setActiveView('menu')} />
      case 'crypto':
        return <Cryptocurrency onBack={() => setActiveView('menu')} />
      case 'buy':
        return <CreditCardBuy onBack={() => setActiveView('menu')} />
      default:
        return <DepositMenuContent onSelect={setActiveView} initialAccountId={initialAccountId} />
    }
  }, [activeView, initialAccountId])

  return content
})

type DepositView = 'menu' | 'wallet' | 'swap' | 'crypto' | 'buy'

const DepositMenuContent = observer(
  ({ onSelect, initialAccountId }: { onSelect: (view: DepositView) => void; initialAccountId?: string }) => {
    const { initialState } = useModel('@@initialState')
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false)

    // 获取真实账户列表
    const currentUser = initialState?.currentUser
    const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号

    // 使用 store 管理选中的账户ID
    const { selectedAccountId } = useDepositState()
    const { setSelectedAccountId } = useDepositActions()

    // 初始化选中的账户ID：优先使用传入的 initialAccountId，否则使用第一个账户
    useEffect(() => {
      if (initialAccountId && accountList.some((acc) => String(acc.id) === String(initialAccountId))) {
        setSelectedAccountId(String(initialAccountId))
      } else if (accountList.length > 0 && !selectedAccountId && accountList[0].id) {
        setSelectedAccountId(String(accountList[0].id))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialAccountId])

    // 获取当前选中的账户信息
    const selectedAccount = accountList.find((acc) => String(acc.id) === String(selectedAccountId))

    return (
      <>
        <ModalHeader className="w-full">
          <ModalTitle>
            <div className="">
              <Trans>存款</Trans>
            </div>
          </ModalTitle>
        </ModalHeader>

        <div className="flex flex-col gap-2xl relative">
          {/* Account Selector */}
          <div
            className="flex flex-col gap-2 px-xl py-xl rounded-small border border-default bg-button cursor-pointer"
            onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-xs">
                  <Iconify icon="iconoir:user-circle" className="w-5 h-5" />
                  <span className="text-paragraph-p2 text-content-1">{selectedAccount?.id || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedAccount && !selectedAccount.isSimulate && (
                    <div className="px-xs rounded-xs bg-market-rise">
                      <span className="text-paragraph-p3 text-content-foreground">
                        <Trans>真实</Trans>
                      </span>
                    </div>
                  )}
                  {selectedAccount?.synopsis?.[0] && (
                    <div className="px-xs rounded-xs bg-button">
                      <span className="text-paragraph-p3 text-content-1">{selectedAccount.synopsis[0].abbr}</span>
                    </div>
                  )}
                </div>
              </div>
              <Iconify icon="iconoir:nav-arrow-down" className="w-4 h-4" />
            </div>
            <div className="flex items-center">
              <span className="text-paragraph-p3 text-content-1">
                <Trans>
                  余额：
                  {BNumber.toFormatNumber(selectedAccount?.money, {
                    unit: selectedAccount?.currencyUnit,
                    volScale: selectedAccount?.currencyDecimal
                  })}
                </Trans>
              </span>
            </div>
          </div>

          {/* Account Dropdown */}
          {isAccountDropdownOpen && (
            <div className="absolute top-[76px] left-0 right-0 z-50 backdrop-blur-[6px] bg-pop-up-mask border border-default rounded-large p-xl flex flex-col gap-3 overflow-y-auto max-h-[260px]">
              {accountList.map((account) => (
                <div
                  key={account.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (account.id) {
                      setSelectedAccountId(String(account.id))
                    }
                    setIsAccountDropdownOpen(false)
                  }}
                  className="border border-default rounded-small px-5 py-[14px] flex items-center justify-between cursor-pointer hover:border-zinc-base transition-colors"
                >
                  <div className="flex flex-col gap-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-paragraph-p2 text-content-1">{account.id}</span>
                      {!account.isSimulate && (
                        <div className="px-xs rounded-xs bg-market-rise">
                          <span className="text-paragraph-p3 text-content-foreground">
                            <Trans>真实</Trans>
                          </span>
                        </div>
                      )}
                      {account?.synopsis?.[0] && (
                        <div className="px-xs rounded-xs bg-button">
                          <span className="text-paragraph-p3 text-content-1">{account.synopsis[0].abbr}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-paragraph-p3 text-content-4">
                      {BNumber.toFormatNumber(account.money, {
                        unit: account.currencyUnit,
                        volScale: account.currencyDecimal
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {String(selectedAccountId) === String(account.id) ? (
                      <div className="w-4 h-4 bg-white rounded-xs flex items-center justify-center">
                        <Iconify icon="iconoir:check" className="w-[14px] h-[14px] text-black" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 border border-special rounded-xs" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Divider with text */}
          <div className="relative flex items-center justify-center">
            <Separator className="absolute w-full border-brand-divider-line" />
            <div className="relative px-[6px] bg-special">
              <span className="text-paragraph-p3 text-content-4">
                <Trans>选择适合您的入金方式</Trans>
              </span>
            </div>
          </div>

          {/* Wallet Deposit */}
          <div
            onClick={() => onSelect('wallet')}
            className="group relative flex items-center gap-2 px-xl py-medium rounded-small border border-default transition-all cursor-pointer hover:border-zinc-base hover:shadow-base active:shadow-inset-base active:border-white"
          >
            <Iconify icon="iconoir:wallet-solid" className="w-6 h-6" />

            <div className="flex flex-col gap-xs flex-1">
              <div className="text-paragraph-p2 text-content-1">
                <Trans>直连钱包转入</Trans>
              </div>
              <div className="text-paragraph-p3 text-content-4">
                <Trans>最低$5 · 即时</Trans>
              </div>
            </div>

            <div className="flex -space-x-xs items-center pr-xs">
              <IconMetamask />
              <IconOkxWallet />
              <IconArbitrum />
            </div>
          </div>

          {/* Crypto Deposit */}
          <div
            onClick={() => onSelect('crypto')}
            className="group relative flex items-center gap-2 px-xl py-medium rounded-small border border-default transition-all cursor-pointer hover:border-zinc-base hover:shadow-base active:shadow-inset-base active:border-white"
          >
            <Iconify icon="iconoir:flash-solid" className="w-6 h-6" />

            <div className="flex flex-col gap-xs flex-1">
              <div className="text-paragraph-p2 text-content-1">
                <Trans>加密货币入金</Trans>
              </div>
              <div className="text-paragraph-p3 text-content-4">
                <Trans>无限制 · 即时</Trans>
              </div>
            </div>
            <div className="flex -space-x-xs items-center pr-xs">
              <IconBitcoin />
              <IconpEthereumEth />
              <IconUSDC />
            </div>
          </div>

          {/* Credit Card Buy - Disabled */}
          <div className="group relative flex items-center gap-2 px-xl py-medium rounded-small border border-default opacity-50 cursor-not-allowed">
            <Iconify icon="iconoir:credit-card-solid" className="w-6 h-6" />

            <div className="flex flex-col gap-xs flex-1">
              <div className="flex items-center gap-xs">
                <span className="text-paragraph-p2 text-content-1">
                  <Trans>银行卡</Trans>
                </span>
                <div className="px-xs rounded-xs bg-button">
                  <span className="text-paragraph-p3 text-content-1">
                    <Trans>暂未开放</Trans>
                  </span>
                </div>
              </div>
              <div className="text-paragraph-p3 text-content-4">
                <Trans>最低$1000 · 5分钟</Trans>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <IconVisa />
              <IconMasterCord />
            </div>
          </div>
        </div>
      </>
    )
  }
)
