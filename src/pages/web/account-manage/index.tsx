import { CopyButton } from '@/components/common/copy-button'
import { SecondaryConfirmationGlobalModalProps } from '@/components/providers/nice-modal-provider/global-modal'
import { useNiceModal } from '@/components/providers/nice-modal-provider/hooks'
import { GLOBAL_MODAL_ID } from '@/components/providers/nice-modal-provider/register'
import { GeneralTooltip } from '@/components/tooltip'
import ExplorerLink from '@/components/Wallet/ExplorerLink'
import { useStores } from '@/context/mobxProvider'
import { getEnv } from '@/env'
import { useServerWallet } from '@/hooks/useServerWallet'
import { Trans } from '@/libs/lingui/react/macro'
import { Button, IconButton, LinkButton } from '@/libs/ui/components/button'
import { Chip } from '@/libs/ui/components/chip'
import { Skeleton } from '@/libs/ui/components/skeleton'
import { toast } from '@/libs/ui/components/toast'
import { formatAddress } from '@/libs/utils/format'
import { renderFallback } from '@/libs/utils/format/fallback'
import { BNumber } from '@/libs/utils/number'
import { rechargeSimulate } from '@/services/api/tradeCore/account'
import { getAccountSynopsisByLng } from '@/utils/business'
import { push } from '@/utils/navigator'
import { useModel } from '@umijs/max'
import { useState } from 'react'
import { Iconify } from '@/libs/ui/components/icons'
import { EdiAccountNameAction } from './_comps/edit-name-action'

export const AccountManage = () => {
  const ENV = getEnv()
  return (
    <div className="w-full max-w-[1138px] mx-auto py-6 flex flex-col gap-6">
      <div className="">
        <div className="flex justify-between gap-2">
          <h1 className="text-title-h2 text-content-1">
            <Trans>账户管理</Trans>
          </h1>

          <div>
            {!ENV.HIDE_CREATE_ACCOUNT && (
              <Button
                variant={'primary'}
                size={'md'}
                color={'default'}
                onClick={() => {
                  push(`/account/create`)
                }}
              >
                <Trans>创建新账户</Trans>
              </Button>
            )}
          </div>
        </div>
        <div className="mt-xl text-paragraph-p2 text-content-4">
          <Trans>您最多可以创建10个账户，允许您独立管理每个账户的资产，并灵活分配杠杆率和保证金使用情况。</Trans>
        </div>
        <div className="text-paragraph-p2 text-content-4">
          <Trans>资金可以在帐户之间快速转移，以实现高效的资金配置和方便的交易统计追踪。</Trans>
        </div>
      </div>
      <RealAccountList />
      <SimulatedAccountList />
    </div>
  )
}

const RealAccountList = () => {
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList || []
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo
  const realAccountList = accountList.filter((item) => !item.isSimulate)
  const isKycAuth = currentUser?.isKycAuth
  const ENV = getEnv()

  return (
    <div className="flex flex-col gap-2">
      <h2>
        <Trans>真实账户</Trans>
      </h2>
      <div className="py-xl rounded-large bg-primary px-3xl">
        <div>
          <div>
            <div className="flex flex-col gap-medium">
              <div className={'flex gap-4'}>
                <div className="flex-1 flex gap-2 max-w-[240px]">
                  <div className="text-paragraph-p3 text-content-5 py-medium">
                    <Trans>账户名称</Trans>
                  </div>
                </div>

                <div className="flex-1 max-w-[160px]">
                  <div className="text-paragraph-p3 text-content-5 py-medium">
                    <Trans>账户地址</Trans>
                  </div>
                </div>

                <div className="flex-1 max-w-[160px]">
                  <div className="text-paragraph-p3 text-content-5 py-medium">
                    <Trans>账户ID</Trans>
                  </div>
                </div>
                <div className="flex-1 max-w-[160px]">
                  <div className="text-paragraph-p3 text-content-5 py-medium">
                    <Trans>账户资产</Trans>
                  </div>
                </div>
                <div className="flex-1 max-w-[160px]">
                  <div className="text-paragraph-p3 text-content-5 py-medium">
                    <Trans>账户类别</Trans>
                  </div>
                </div>
                <div className="flex-1  flex justify-end">
                  <div className="text-paragraph-p3 text-content-5 py-medium">
                    <Trans>操作</Trans>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-medium">
                {realAccountList.map((item) => {
                  const accountInfoSynopsis = getAccountSynopsisByLng(item.synopsis)
                  const isCurrent = item.id === currentAccountInfo?.id
                  return (
                    <div key={item.id} className="flex gap-4 ">
                      <div className="flex gap-xs flex-1 max-w-[240px] py-medium items-center">
                        <div className="text-paragraph-p2 text-content-1">{item.name}</div>
                        <EdiAccountNameAction accountInfo={item} />
                        {isCurrent && (
                          <div>
                            <Chip color="rise" variant="solid">
                              <Trans>当前</Trans>
                            </Chip>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-medium flex-1 max-w-[160px]">
                        <div className="text-paragraph-p2 text-content-1 py-medium">
                          <AccountSolAddress accountInfo={item} />
                        </div>
                      </div>

                      <div className="flex flex-col gap-medium flex-1 max-w-[160px]">
                        <div className="text-paragraph-p2 text-content-1 py-medium">{renderFallback(item.id)}</div>
                      </div>

                      <div className="flex flex-col gap-medium flex-1 max-w-[160px]">
                        <div className="text-paragraph-p2 text-content-1 py-medium">
                          {BNumber.toFormatNumber(item.money, { volScale: item.currencyDecimal, unit: item.currencyUnit })}
                        </div>
                      </div>

                      <div className="flex flex-col gap-medium flex-1 max-w-[160px]">
                        <div className="text-paragraph-p2 text-content-1 py-medium">
                          {renderFallback(
                            <Chip color="default" variant="solid">
                              {accountInfoSynopsis?.abbr}
                            </Chip>,
                            {
                              verify: !!accountInfoSynopsis?.abbr
                            }
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-medium flex-1 ">
                        <div className="py-medium flex gap-medium justify-end">
                          <div>
                            <GeneralTooltip content={trade.disabledConect(item) ? <Trans>账户已禁用，无法交易</Trans> : undefined}>
                              <Button
                                variant={'primary'}
                                size={'sm'}
                                color={'default'}
                                onClick={() => {
                                  if (trade.currentAccountInfo?.id === item.id) {
                                    push('/trade')
                                  } else {
                                    trade.setCurrentAccountInfo(item)
                                    trade.jumpTrade()
                                  }
                                }}
                                disabled={trade.disabledConect(item)}
                              >
                                <Trans>交易</Trans>
                              </Button>
                            </GeneralTooltip>
                          </div>

                          {/* <AccountManageDepositAction accountInfo={item} />
                          <AccountManageWithdrawAction accountInfo={item} /> */}

                          {!ENV.HIDE_ACCOUNT_TRANSFER && (
                            <div>
                              <Button
                                variant={'primary'}
                                size={'sm'}
                                color={'primary'}
                                className=""
                                onClick={() => {
                                  // if (!isKycAuth && !notKycAuth) {
                                  //   transferModalRef.current.show()
                                  //   return
                                  // }
                                  push(`/account/transfer?from=${item.id}`)
                                }}
                              >
                                <Trans>转账</Trans>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AccountSolAddress = ({ accountInfo }: { accountInfo: User.AccountItem }) => {
  // 🔥 每个账户卡片使用自己的 tradeAccountId 获取钱包地址
  const { address: serverSolanaAddress, isCreating: serverWalletLoading } = useServerWallet(
    'solana',
    !!accountInfo.id,
    accountInfo.id // 使用当前卡片账户的 ID，而不是 currentAccountInfo
  )

  return (
    <>
      {serverWalletLoading ? (
        <Skeleton className="w-full h-6" />
      ) : (
        <ExplorerLink path={`address/${serverSolanaAddress}`} copyable address={serverSolanaAddress} />
      )}
    </>
  )
}

const SimulatedAccountList = () => {
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList || []
  const simulatedAccountList = accountList.filter((item) => item.isSimulate)
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo
  const ENV = getEnv()

  return (
    <div className="flex flex-col gap-2">
      <h2>
        <Trans>模拟账户</Trans>
      </h2>
      <div className="py-xl rounded-large bg-primary px-3xl">
        <div>
          <div>
            <div className="flex flex-col gap-medium">
              <div className={'flex gap-4'}>
                <div className="flex-1 max-w-[240px]">
                  <div className="text-paragraph-p3 text-content-5 py-medium">
                    <Trans>账户名称</Trans>
                  </div>
                </div>

                <div className="flex-1 max-w-[160px]">
                  <div className="text-paragraph-p3 text-content-5 py-medium">
                    <Trans>账户地址</Trans>
                  </div>
                </div>

                <div className="flex-1 max-w-[160px]">
                  <div className="text-paragraph-p3 text-content-5 py-medium">
                    <Trans>账户ID</Trans>
                  </div>
                </div>
                <div className="flex-1 max-w-[160px]">
                  <div className="text-paragraph-p3 text-content-5 py-medium">
                    <Trans>账户资产</Trans>
                  </div>
                </div>
                <div className="flex-1 max-w-[160px]">
                  <div className="text-paragraph-p3 text-content-5 py-medium">
                    <Trans>账户类别</Trans>
                  </div>
                </div>
                <div className="flex-1  flex justify-end">
                  <div className="text-paragraph-p3 text-content-5 py-medium">
                    <Trans>操作</Trans>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-medium">
                {simulatedAccountList.map((item) => {
                  const accountInfoSynopsis = getAccountSynopsisByLng(item.synopsis)
                  const isCurrent = item.id === currentAccountInfo?.id
                  return (
                    <div key={item.id} className="flex gap-4 ">
                      <div className="flex gap-xs flex-1 max-w-[240px] items-center py-medium">
                        <div className="text-paragraph-p2 text-content-1">{item.name}</div>

                        <EdiAccountNameAction accountInfo={item} />

                        {isCurrent && (
                          <div>
                            <Chip color="rise" variant="solid">
                              <Trans>当前</Trans>
                            </Chip>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-medium flex-1 max-w-[160px]">
                        <div className="text-paragraph-p2 text-content-1 py-medium">
                          <AccountSolAddress accountInfo={item} />
                        </div>
                      </div>

                      <div className="flex flex-col gap-medium flex-1 max-w-[160px]">
                        <div className="text-paragraph-p2 text-content-1 py-medium">{renderFallback(item.id)}</div>
                      </div>

                      <div className="flex flex-col gap-medium flex-1 max-w-[160px]">
                        <div className="text-paragraph-p2 text-content-1 py-medium">
                          {BNumber.toFormatNumber(item.money, { volScale: item.currencyDecimal, unit: item.currencyUnit })}
                        </div>
                      </div>

                      <div className="flex flex-col gap-medium flex-1 max-w-[160px]">
                        <div className="text-paragraph-p2 text-content-1 py-medium">
                          {renderFallback(
                            <Chip color="default" variant="solid">
                              {accountInfoSynopsis?.abbr}
                            </Chip>,
                            {
                              verify: !!accountInfoSynopsis?.abbr
                            }
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-medium flex-1 ">
                        <div className="py-medium flex gap-medium justify-end">
                          <div>
                            <GeneralTooltip content={trade.disabledConect(item) ? <Trans>账户已禁用，无法交易</Trans> : undefined}>
                              <Button
                                variant={'primary'}
                                size={'sm'}
                                color={'default'}
                                onClick={() => {
                                  if (trade.currentAccountInfo?.id === item.id) {
                                    push('/trade')
                                  } else {
                                    trade.setCurrentAccountInfo(item)
                                    trade.jumpTrade()
                                  }
                                }}
                                disabled={trade.disabledConect(item)}
                              >
                                <Trans>交易</Trans>
                              </Button>
                            </GeneralTooltip>
                          </div>
                          {!ENV.HIDE_ACCOUNT_RENAME && <SimulatedAccountDeposit accountInfo={item} />}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SimulatedAccountDeposit = ({ accountInfo }: { accountInfo: User.AccountItem }) => {
  const { fetchUserInfo } = useModel('user')

  const MAX_DEPOSIT_AMOUNT = 10000
  const SINGLE_DEPOSIT_AMOUNT = MAX_DEPOSIT_AMOUNT

  const secondaryConfirmationDialog = useNiceModal<SecondaryConfirmationGlobalModalProps>(GLOBAL_MODAL_ID.SecondaryConfirmation, {
    title: <Trans>模拟账户存款</Trans>,
    message: (
      <div className="flex flex-col gap-2xl">
        <div className="text-paragraph-p3 text-content-4">
          每日可存款
          {BNumber.toFormatNumber(SINGLE_DEPOSIT_AMOUNT, { volScale: accountInfo.currencyDecimal, unit: accountInfo.currencyUnit })}
        </div>

        <div className="flex items-center flex-col gap-medium">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
              <g clipPath="url(#clip0_3316_28213)">
                <path
                  d="M20 40C31.0457 40 40 31.0457 40 20C40 8.95433 31.0457 0 20 0C8.95433 0 0 8.95433 0 20C0 31.0457 8.95433 40 20 40Z"
                  fill="#2775CA"
                />
                <path
                  d="M16.25 33.9058C16.25 34.3746 15.875 34.6402 15.4375 34.4996C9.375 32.5621 5 26.9058 5 20.2027C5 13.5152 9.375 7.8433 15.4375 5.9058C15.8906 5.76518 16.25 6.0308 16.25 6.49955V7.67143C16.25 7.98393 16.0156 8.34333 15.7187 8.45267C10.9218 10.2183 7.5 14.8277 7.5 20.2027C7.5 25.5933 10.9218 30.1871 15.7187 31.9371C16.0156 32.0464 16.25 32.4058 16.25 32.7183V33.9058Z"
                  fill="white"
                />
                <path
                  d="M21.2504 29.5786C21.2504 29.9224 20.9691 30.2036 20.6254 30.2036H19.3754C19.0316 30.2036 18.7504 29.9224 18.7504 29.5786V27.6099C16.0161 27.2349 14.6879 25.7193 14.3286 23.6255C14.2661 23.2661 14.5473 22.9536 14.9066 22.9536H16.3286C16.6254 22.9536 16.8754 23.1724 16.9379 23.4536C17.2036 24.688 17.9223 25.6411 20.1098 25.6411C21.7191 25.6411 22.8754 24.7349 22.8754 23.3911C22.8754 22.0474 22.2036 21.5318 19.8286 21.1411C16.3286 20.6724 14.6723 19.6099 14.6723 16.8755C14.6723 14.7661 16.2816 13.1099 18.7504 12.7661V10.8286C18.7504 10.4849 19.0316 10.2036 19.3754 10.2036H20.6254C20.9691 10.2036 21.2504 10.4849 21.2504 10.8286V12.813C23.2661 13.1724 24.5473 14.313 24.9691 16.2193C25.0473 16.5786 24.7661 16.9068 24.3911 16.9068H23.0786C22.7973 16.9068 22.5629 16.7193 22.4848 16.4536C22.1254 15.2505 21.2661 14.7193 19.7661 14.7193C18.1098 14.7193 17.2504 15.5161 17.2504 16.6411C17.2504 17.8286 17.7348 18.4224 20.2816 18.7818C23.7191 19.2505 25.5004 20.2349 25.5004 23.1568C25.5004 25.3755 23.8441 27.1724 21.2661 27.5786V29.5786H21.2504Z"
                  fill="white"
                />
                <path
                  d="M24.5625 34.5C24.1093 34.6407 23.75 34.375 23.75 33.9063V32.7344C23.75 32.3907 23.9531 32.0625 24.2813 31.9532C29.0625 30.2032 32.5 25.5938 32.5 20.2188C32.5 14.8282 29.0781 10.2344 24.2813 8.48442C23.9843 8.37501 23.75 8.01566 23.75 7.70316V6.53129C23.75 6.06254 24.125 5.79691 24.5625 5.93754C30.625 7.84379 35 13.5157 35 20.2032C35 26.9063 30.625 32.5625 24.5625 34.5Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_3316_28213">
                  <rect width="40" height="40" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="text-paragraph-h3 text-content-1">
            {BNumber.toFormatNumber(MAX_DEPOSIT_AMOUNT, { volScale: accountInfo.currencyDecimal, unit: accountInfo.currencyUnit })}
          </div>
        </div>
      </div>
    ),
    confirm: {
      label: <Trans>确认存款</Trans>,
      cb: async () => {
        const res = await rechargeSimulate({
          accountId: accountInfo.id,
          money: SINGLE_DEPOSIT_AMOUNT,
          type: 'DEPOSIT_SIMULATE'
        })

        const success = res.success

        console.log(res)
        if (success) {
          // 刷新账户列表
          await fetchUserInfo(false)

          toast.message(<Trans>模拟账户存款成功</Trans>)
        }

        return success
      }
    },
    cancel: false
  })

  return (
    <div>
      <Button
        variant={'primary'}
        size={'sm'}
        color={'default'}
        onClick={() => {
          secondaryConfirmationDialog.show()
        }}
      >
        <Trans>存款</Trans>
      </Button>
    </div>
  )
}

export default AccountManage
