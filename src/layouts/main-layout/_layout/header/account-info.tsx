'use client'

// import { useWalletAuthState } from '@/hooks/wallet/use-wallet-auth-state'
// import { useWalletLogout } from '@/hooks/wallet/use-wallet-login'
import { logout } from '@/services/api/user'
import { Button } from '@/libs/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuPrimitive,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/libs/ui/components/dropdown-menu'
import { IconChevronDown, IconDisconnect, IconWallet } from '@/libs/ui/components/icons'
import { cn } from '@/libs/ui/lib/utils'
import usePrivyInfo from '@/hooks/web3/usePrivyInfo'
import { formatAddress } from '@/libs/utils/web3'
import { Trans } from '@/libs/lingui/react/macro'
import { useStores } from '@/context/mobxProvider'
import { Dropdown, Segmented, Tooltip } from 'antd'
import { FormattedMessage, useModel } from '@umijs/max'
import { useEffect, useState } from 'react'
import { push } from '@/utils/navigator'
import { getAccountSynopsisByLng } from '@/utils/business'
import { formatNum } from '@/utils'
import { EmptyNoData } from '@/components/empty/no-data'
import { observer } from 'mobx-react'

export const TradeAccountInfo = observer(() => {
  // const { isAuthenticated } = useWalletAuthState()
  // const walletLogout = useWalletLogout()
  // if (!isAuthenticated) {
  //   return null
  // }

  const { trade, ws } = useStores()
  const { currentAccountInfo } = trade

  const { address } = usePrivyInfo()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn('min-h-max min-w-max gap-2.5 px-2.5 py-2 ')} size="md" variant="outline">
          <div className="flex text-paragraph-p3 flex-col gap-1">
            <div className="flex items-center gap-1">
              <IconWallet className="size-4" />
              <span>{formatAddress(address)}</span>
            </div>
            {/* <div className="flex items-center justify-center gap-1">
              <div>{currentAccountInfo?.isSimulate ? <Trans>模拟</Trans> : <Trans>真实</Trans>}</div>
              <div className="w-px h-4 bg-brand-secondary-2"></div>
              <div className="text-content-4">{currentAccountInfo.name}</div>
            </div> */}
          </div>
          <IconChevronDown className="action-icon size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[330px]" sideOffset={8} align="end">
        <div>
          <AccountSelector />
        </div>
        <DropdownMenuItem

        // onClick={() => walletLogout()}
        >
          <IconDisconnect className="size-4" /> 断开连接
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

const AccountSelector = observer(() => {
  const { trade, ws } = useStores()

  const [currentAccountList, setCurrentAccountList] = useState<User.AccountItem[]>([])
  const [accountTabActiveKey, setAccountTabActiveKey] = useState<'REAL' | 'DEMO'>('REAL') //  真实账户、模拟账户
  const { currentAccountInfo } = trade
  const [accountBoxOpen, setAccountBoxOpen] = useState(false)
  const accountArr = currentAccountList.filter((item) => item.id !== currentAccountInfo.id)
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  useEffect(() => {
    const accountList = currentUser?.accountList || []
    // 切换真实模拟账户列表
    const list = accountList.filter((item) => (accountTabActiveKey === 'DEMO' ? item.isSimulate : !item.isSimulate))
    setCurrentAccountList(list)
  }, [accountTabActiveKey, currentUser?.accountList])

  const currentAccountInfoSynopsis = getAccountSynopsisByLng(currentAccountInfo.synopsis)
  return (
    <div className="py-0 flex flex-col">
      <div>
        <div className="">
          <div className="my-3 flex items-center justify-between flex-shrink-0 flex-grow-0">
            <div className=" text-primary max-xl:text-right">
              <Trans>当前账户</Trans>
            </div>
          </div>
          <div className={cn('scrollbar rounded-lg dark:border-gray-610 border border-gray-250 pb-[6px] pl-[11px] pr-[11px] pt-[11px]')}>
            <div className="flex justify-between">
              <div className="flex">
                <div className="flex-1 text-sm font-bold text-primary">
                  {currentAccountInfo.name}
                  {/* / {hiddenCenterPartStr(item?.id, 4)} */}
                </div>
                <div className="ml-[10px] flex px-1">
                  <div
                    className={cn(
                      'flex h-5 min-w-[42px] items-center justify-center rounded px-1 text-xs font-normal text-white',
                      currentAccountInfo.isSimulate ? 'bg-green' : 'bg-brand'
                    )}
                  >
                    {currentAccountInfo.isSimulate ? <FormattedMessage id="mt.moni" /> : <FormattedMessage id="mt.zhenshi" />}
                  </div>
                  {currentAccountInfoSynopsis?.abbr && (
                    <div className="ml-[6px] flex h-5 min-w-[42px] items-center px-1 justify-center rounded bg-black text-xs font-normal text-white">
                      {currentAccountInfoSynopsis?.abbr}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div>
                <span className="text-[20px] text-primary !font-dingpro-regular">
                  {Number(currentAccountInfo.money)
                    ? formatNum(currentAccountInfo.money, { precision: currentAccountInfo.currencyDecimal || 2 })
                    : '0.00'}
                </span>{' '}
                <span className="ml-1 text-sm font-normal text-secondary">USD</span>
              </div>
              {/* <span>{formatAddress(item.pdaTokenAddress)}</span> */}
            </div>
          </div>
        </div>
      </div>
      <div className="my-3 flex items-center justify-between flex-shrink-0 flex-grow-0">
        <Segmented
          className="account"
          // rootClassName="border-gray-700 border-[0.5px] rounded-[26px]"
          onChange={(value: any) => {
            setAccountTabActiveKey(value)
          }}
          value={accountTabActiveKey}
          options={[
            { label: <FormattedMessage id="mt.zhenshizhanghao" />, value: 'REAL' },
            { label: <FormattedMessage id="mt.monizhanghu" />, value: 'DEMO' }
          ]}
        />
        <DropdownMenuPrimitive.Item
          onClick={() => {
            push('/account')
          }}
          className="cursor-pointer p-2 text-primary max-xl:text-right"
        >
          <FormattedMessage id="mt.guanlizhanghu" />
        </DropdownMenuPrimitive.Item>
      </div>
      <div
        className="flex flex-col gap-3 max-h-[380px] overflow-y-auto"
        // style={
        //   true
        //     ? {
        //         scrollbarColor: `${gray[578]} ${gray[680]}`,
        //         scrollbarWidth: 'thin'
        //       }
        //     : {}
        // }
      >
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
                    if (disabledTrade || isCurrentAccount) {
                      return
                    }

                    setAccountBoxOpen(false)

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
                  className={cn(
                    'scrollbar cursor-pointer rounded-lg dark:border-gray-610 border border-gray-250 pb-[6px] pl-[11px] pr-[11px] pt-[11px]',
                    {
                      'hover:bg-[var(--list-hover-light-bg)]': !isCurrentAccount,
                      'cursor-no-drop !bg-[var(--list-item-disabled)] opacity-70': disabledTrade
                    }
                  )}
                >
                  <div className="flex justify-between">
                    <div className="flex">
                      <div className="flex-1 text-sm font-bold text-primary">
                        {item.name}
                        {/* / {hiddenCenterPartStr(item?.id, 4)} */}
                      </div>
                      <div className="ml-[10px] flex px-1">
                        <div
                          className={cn(
                            'flex h-5 min-w-[42px] items-center justify-center rounded px-1 text-xs font-normal text-white',
                            isSimulate ? 'bg-green' : 'bg-brand'
                          )}
                        >
                          {isSimulate ? <FormattedMessage id="mt.moni" /> : <FormattedMessage id="mt.zhenshi" />}
                        </div>
                        {synopsis?.abbr && (
                          <div className="ml-[6px] flex h-5 min-w-[42px] items-center px-1 justify-center rounded bg-black text-xs font-normal text-white">
                            {synopsis?.abbr}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <div>
                      <span className="text-[20px] text-primary !font-dingpro-regular">
                        {Number(item.money) ? formatNum(item.money, { precision: item.currencyDecimal || 2 }) : '0.00'}
                      </span>{' '}
                      <span className="ml-1 text-sm font-normal text-secondary">USD</span>
                    </div>
                    {/* <span>{formatAddress(item.pdaTokenAddress)}</span> */}
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
