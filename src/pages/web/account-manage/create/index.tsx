import { Trans } from '@/libs/lingui/react/macro'
import { Button } from '@/libs/ui/components/button'
import { Chip } from '@/libs/ui/components/chip'
import { Iconify } from '@/libs/ui/components/icons'
import { BNumber } from '@/libs/utils/number'
import { useSelectedRoutes } from '@umijs/max'
import { AccountBackButton } from '../_comps/back-button'
import { Tabs, TabsList, TabsTrigger } from '@/libs/ui/components/tabs'
import TabList from '@/pages/admin/copyTrading/comp/TabsTable/List'
import { useLayoutEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStores } from '@/context/mobxProvider'
import { Empty } from '@/libs/ui/components/empty'
import { PageLoading } from '@/components/loading/page-loading'
import { EmptyNoData } from '@/components/empty/no-data'
import { getAccountSynopsisByLng } from '@/utils/business'
import { cn } from '@/libs/ui/lib/utils'
import { push } from '@/utils/navigator'
import { parseAsJson, parseAsString, parseAsStringEnum, useQueryState } from 'nuqs'

enum AccountTypeEnum {
  REAL = '1',
  SIMULATED = '2'
}

export const CreateAccount = observer(() => {
  const [activeTab, setActiveTab] = useQueryState(
    'tab',
    parseAsStringEnum<AccountTypeEnum>(Object.values(AccountTypeEnum)).withDefault(AccountTypeEnum.REAL)
  )
  const handleTabChange = (value: AccountTypeEnum) => {
    setActiveTab(value)
  }

  const [selectedAccountId, setSelectedAccountId] = useQueryState('selected-account-id', parseAsString)

  const [loading, setLoading] = useState(false)
  const { trade } = useStores()
  const accountList = trade.accountGroupList
  const currentAccountList = accountList.filter((item) => (activeTab === AccountTypeEnum.SIMULATED ? item.isSimulate : !item.isSimulate))

  const selectedAccount = currentAccountList.find((item) => item.id === selectedAccountId)

  useLayoutEffect(() => {
    if (!accountList.length) {
      setLoading(true)
      trade.getAccountGroupList().finally(() => {
        setLoading(false)
      })
    }
  }, [])

  return (
    <div className="w-full max-w-[1138px] mx-auto py-6 flex flex-col gap-6">
      <div className="">
        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-small ">
            <AccountBackButton />

            <h1 className="text-title-h2 text-content-1">
              <Trans>创建账户</Trans>
            </h1>
          </div>
        </div>
        <div className="mt-xl text-paragraph-p2 text-content-4">
          <Trans>您最多可以创建10个账户，允许您独立管理每个账户的资产，并灵活分配杠杆率和保证金使用情况。</Trans>
        </div>
        <div className="text-paragraph-p2 text-content-4">
          <Trans>资金可以在帐户之间快速转移，以实现高效的资金配置和方便的交易统计追踪。</Trans>
        </div>
      </div>

      <div>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value={AccountTypeEnum.REAL}>
              <Trans>真实账户</Trans>
            </TabsTrigger>
            <TabsTrigger value={AccountTypeEnum.SIMULATED}>
              <Trans>模拟账户</Trans>
            </TabsTrigger>
          </TabsList>
          <div className="mt-6">
            {loading ? (
              <div className="py-10">
                <PageLoading />
              </div>
            ) : !currentAccountList?.length ? (
              <div className="py-10">
                <EmptyNoData />
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {currentAccountList.map((item) => {
                  const synopsis = getAccountSynopsisByLng(item.synopsis)
                  const isSelected = selectedAccount?.id === item.id

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'opacity-50  transition-all   flex flex-col gap-3 py-3xl px-4 rounded-large border border-transparent bg-primary ',
                        isSelected ? 'opacity-100 border-brand-support' : 'hover:opacity-100 hover:border-brand-support cursor-pointer'
                      )}
                      onClick={() => {
                        if (!!item.id && item.id !== selectedAccountId) {
                          setSelectedAccountId(item.id)
                        }
                      }}
                    >
                      <div className="flex gap-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <div className="text-title-h4 text-content-1">{synopsis?.name || item?.groupName}</div>

                          {synopsis?.tag && (
                            <Chip color="secondary" variant="solid">
                              {synopsis?.tag}
                            </Chip>
                          )}
                        </div>
                        <div className={cn('text-paragraph-p3 text-content-4')}>{synopsis?.remark} </div>
                      </div>

                      <div className="h-px border-b border-brand-default"></div>

                      {(synopsis?.list || []).slice(0, 3).map((v, index) => {
                        return (
                          <div className="flex gap-2 justify-between text-paragraph-p2" key={index}>
                            <div className="text-content-4">{v.title}</div>
                            <div className="text-content-1">{v.content}</div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </Tabs>
      </div>
      {currentAccountList.length > 0 && !loading && !!selectedAccount && (
        <div>
          <Button
            variant={'primary'}
            size={'lg'}
            color={'primary'}
            onClick={() => {
              push(`/account/type/add/${selectedAccount?.id}`)
            }}
          >
            <Trans>继续</Trans>
          </Button>
        </div>
      )}
    </div>
  )
})

export default CreateAccount
