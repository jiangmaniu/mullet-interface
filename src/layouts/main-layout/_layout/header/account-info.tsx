'use client'

// import { useWalletAuthState } from '@/hooks/wallet/use-wallet-auth-state'
// import { useWalletLogout } from '@/hooks/wallet/use-wallet-login'
import { logout } from '@/services/api/user'
import { Button, IconButton } from '@/libs/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuPrimitive,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/libs/ui/components/dropdown-menu'
import { IconChevronDown, IconDisconnect, Iconify, IconWallet } from '@/libs/ui/components/icons'
import { cn } from '@/libs/ui/lib/utils'
import usePrivyInfo from '@/hooks/web3/usePrivyInfo'
import { formatAddress } from '@/libs/utils/web3'
import { copyContent } from '@/utils'
import { t, Trans } from '@/libs/lingui/react/macro'
import { useStores } from '@/context/mobxProvider'
import { Dropdown, Segmented, Tooltip } from 'antd'
import { FormattedMessage, useModel } from '@umijs/max'
import { useEffect, useState } from 'react'
import { onLogout, push } from '@/utils/navigator'
import { getAccountSynopsisByLng } from '@/utils/business'
import { formatNum } from '@/utils'
import { EmptyNoData } from '@/components/empty/no-data'
import { observer } from 'mobx-react'
import { usePrivy } from '@privy-io/react-auth'
import { useServerWallet } from '@/hooks/useServerWallet'
import { BNumber } from '@/libs/utils/number'
import { Chip } from '@/libs/ui/components/chip'
import { GeneralTooltip } from '@/components/tooltip'
import { Tabs, TabsList, TabsTrigger } from '@/libs/ui/components/tabs'
import { toast } from '@/libs/ui/components/toast'
import { CopyButton } from '@/components/common/copy-button'
import { Separator } from '@/libs/ui/components/separator'

export const TradeAccountInfo = observer(() => {
  const { trade, ws } = useStores()
  const { currentAccountInfo } = trade

  // 🔥 使用 Privy Server Solana 钱包地址
  const { address: serverSolanaAddress, isCreating: isWalletLoading } = useServerWallet(
    'solana',
    !!currentAccountInfo?.id,
    currentAccountInfo?.id
  )

  // 🔥 只显示 Solana Server Wallet 地址，加载中显示 loading
  const displayAddress = serverSolanaAddress || (isWalletLoading ? '' : serverSolanaAddress)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn('min-h-max min-w-max gap-2.5 px-2.5 py-2 ')} size="md" variant="outline">
          <div className="flex text-paragraph-p3 flex-col gap-1">
            <div className="flex items-center gap-1">
              <IconWallet className="size-4" />
              <span>{isWalletLoading ? 'Loading...' : formatAddress(displayAddress)}</span>
            </div>
          </div>
          <IconChevronDown className="action-icon size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[330px]" sideOffset={8} align="end">
        <CurrentAccountInfo />
        <AccountSelector />

        <AccountManagementButton />
        <Separator />
        <DisconnectButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

const CurrentAccountInfo = observer(() => {
  const { trade } = useStores()

  const { currentAccountInfo } = trade

  // 🔥 使用 Privy Server Solana 钱包地址
  const { address: serverSolanaAddress } = useServerWallet('solana', !!currentAccountInfo?.id, currentAccountInfo?.id)

  const currentAccountInfoSynopsis = getAccountSynopsisByLng(currentAccountInfo.synopsis)

  return (
    <div className="flex flex-col gap-small">
      <div className=" flex items-center justify-between flex-shrink-0 flex-grow-0">
        <div className="text-paragraph-p2 text-content-4">
          <Trans>当前账户</Trans>
        </div>
      </div>
      <div className={cn('border border-brand-default rounded-small p-xl flex flex-col gap-1')}>
        <div className="flex gap-2 justify-between">
          <div className="flex-1 text-paragraph-p2 text-content-1">
            {currentAccountInfo.name}
            {/* / {hiddenCenterPartStr(item?.id, 4)} */}
          </div>
          <div className="flex gap-2">
            <Chip color={currentAccountInfo.isSimulate ? 'secondary' : 'rise'} variant="solid">
              {currentAccountInfo.isSimulate ? <Trans>模拟</Trans> : <Trans>真实</Trans>}
            </Chip>
            {currentAccountInfoSynopsis?.abbr && (
              <Chip color="default" variant="solid">
                {currentAccountInfoSynopsis?.abbr}
              </Chip>
            )}
          </div>
        </div>

        <div className="flex gap-2 items-end">
          <span className="text-title-h4 text-content-1">
            {BNumber.toFormatNumber(currentAccountInfo.money, { volScale: currentAccountInfo.currencyDecimal || 2 })}
          </span>
          <span className="text-content-4 text-paragraph-p2">USDC</span>
        </div>

        {/* 显示 Privy Server Solana 地址和复制按钮 */}
        {serverSolanaAddress && (
          <div className="flex items-center gap-2">
            <a
              href={`https://explorer.solana.com/address/${serverSolanaAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-content-4 text-paragraph-p2 hover:underline"
            >
              {formatAddress(serverSolanaAddress)}
            </a>

            <CopyButton text={serverSolanaAddress} />
          </div>
        )}
      </div>
    </div>
  )
})

const AccountSelector = observer(() => {
  const { trade, ws } = useStores()

  const [currentAccountList, setCurrentAccountList] = useState<User.AccountItem[]>([])
  const enum AccountTabActiveKey {
    REAL = 'REAL',
    DEMO = 'DEMO'
  }
  const [accountTabActiveKey, setAccountTabActiveKey] = useState<AccountTabActiveKey>(AccountTabActiveKey.REAL) //  真实账户、模拟账户
  const { currentAccountInfo } = trade
  const accountArr = currentAccountList.filter((item) => item.id !== currentAccountInfo.id)
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  useEffect(() => {
    const accountList = currentUser?.accountList || []
    // 切换真实模拟账户列表
    const list = accountList.filter((item) => (accountTabActiveKey === AccountTabActiveKey.DEMO ? item.isSimulate : !item.isSimulate))
    setCurrentAccountList(list)
  }, [accountTabActiveKey, currentUser?.accountList])

  return (
    <div className="py-0 flex gap-3 flex-col">
      <div className="">
        <Tabs value={accountTabActiveKey} onValueChange={(value) => setAccountTabActiveKey(value)}>
          <TabsList>
            <TabsTrigger className="flex-1" value={AccountTabActiveKey.REAL}>
              <Trans>真实账户</Trans>
            </TabsTrigger>
            <TabsTrigger className="flex-1" value={AccountTabActiveKey.DEMO}>
              <Trans>模拟账户</Trans>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto">
        {!accountArr.length ? (
          <EmptyNoData />
        ) : (
          accountArr.map((item, idx: number) => {
            const isSimulate = item.isSimulate
            const disabledTrade = !item?.enableConnect || item.status === 'DISABLED'
            const synopsis = getAccountSynopsisByLng(item.synopsis)
            const isCurrentAccount = item.id === currentAccountInfo.id
            return (
              <div className="pr-1" key={idx}>
                <DropdownMenuPrimitive.Item
                  disabled={disabledTrade}
                  onClick={() => {
                    // if (isMobileOrIpad) {
                    //   hoverAccountBoxPopupRef?.current?.close()
                    // }

                    if (disabledTrade) {
                      toast.error(t`账户已禁用`)
                      return
                    }

                    if (disabledTrade || isCurrentAccount) {
                      return
                    }

                    // 取消之前账户组品种行情订阅
                    console.log('取消之前账户组品种行情订阅')
                    /**
                     * 尽量避免在 stores 之外直接调用 batchSubscribeSymbol 方法
                     * 关闭 ws 连接时，统一使用 debounceBatchCloseSymbol 方法
                     */
                    // ws.debounceBatchCloseSymbol()
                    // 直接关闭行情，重新连接新的
                    ws.close()

                    setTimeout(() => {
                      trade.setCurrentAccountInfo(item)
                      trade.jumpTrade()

                      // 切换账户重置
                      trade.setCurrentLiquidationSelectBgaId('CROSS_MARGIN')
                    }, 200)
                  }}
                  key={item.id}
                  className={cn('cursor-pointer rounded-small border border-brand-default p-xl flex flex-col gap-1', {
                    'hover:bg-button': !isCurrentAccount && !disabledTrade,
                    'cursor-no-drop opacity-50': disabledTrade
                  })}
                >
                  <div className="flex gap-2 justify-between">
                    <div className="flex-1 text-paragraph-p2 text-content-1">
                      {item.name}
                      {/* / {hiddenCenterPartStr(item?.id, 4)} */}
                    </div>
                    <div className="flex gap-2">
                      <Chip color={isSimulate ? 'secondary' : 'rise'} variant="solid">
                        {isSimulate ? <Trans>模拟</Trans> : <Trans>真实</Trans>}
                      </Chip>
                      {synopsis?.abbr && (
                        <Chip color="default" variant="solid">
                          {synopsis?.abbr}
                        </Chip>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 items-end">
                    <span className="text-title-h4 text-content-1">
                      {BNumber.toFormatNumber(item.money, { volScale: item.currencyDecimal || 2 })}
                    </span>
                    <span className="text-content-4 text-paragraph-p2">USDC</span>
                  </div>
                </DropdownMenuPrimitive.Item>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
})

const AccountManagementButton = observer(() => {
  return (
    <DropdownMenuItem
      onClick={async () => {
        push('/account')
      }}
    >
      <Iconify icon="iconoir:user" className="size-6" />
      <Trans>账户管理</Trans>
    </DropdownMenuItem>
  )
})

const DisconnectButton = observer(() => {
  const { logout } = usePrivy()

  return (
    <DropdownMenuItem
      onClick={async () => {
        await logout()
        onLogout(true)
      }}
    >
      <Iconify icon="iconoir:link-slash" className="size-6" /> <Trans>断开连接</Trans>
    </DropdownMenuItem>
  )
})
