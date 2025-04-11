import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Segmented } from 'antd'
import { observer } from 'mobx-react'
import { useEffect, useMemo, useState } from 'react'

import { ModalLoading } from '@/components/Base/Lottie/Loading'
import { DEFAULT_CURRENCY_DECIMAL, SOURCE_CURRENCY } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { formatNum } from '@/utils'

import { getAccountSynopsisByLng } from '@/utils/business'
import { onBack } from '@/utils/navigator'
import { goHome } from '../../utils/navigator'
import Empty from '../Base/List/Empty'
import ActivityIndicator from '../Base/Loading/ActivityIndicator'
import { Text } from '../Base/Text'
import { View } from '../Base/View'

const Item = ({
  item,
  currentAccountInfo,
  onClick
}: {
  item: User.AccountItem
  currentAccountInfo: User.AccountItem
  onClick: () => void
}) => {
  const { cn, theme } = useTheme()
  const intl = useIntl()

  const synopsis = getAccountSynopsisByLng(item.synopsis)

  return (
    <div
      className={cn('p-4 rounded-xl')}
      onClick={onClick}
      style={{
        borderColor: item.id === currentAccountInfo.id ? theme.colors.backgroundColor.reverse : theme.colors.borderColor.weak,
        borderWidth: 1
      }}
    >
      <View className={cn('flex flex-row justify-between items-center')}>
        <Text color="primary" size="lg" font="pf-bold" className={cn('max-w-[190px] pr-1 truncate')}>
          {item.name}
        </Text>
        <Text color="primary" size="xl" font="dingpro-medium">
          {!Number(item.money) ? '0.00' : formatNum(item.money, { precision: item.currencyDecimal ?? DEFAULT_CURRENCY_DECIMAL })}
        </Text>
      </View>
      <View className={cn('flex flex-row items-center justify-between')}>
        <View className={cn('flex flex-row items-center justify-between gap-2')}>
          <View className={cn('items-center flex-row gap-x-2')}>
            <View
              className={cn(
                'flex h-5 min-w-[42px] items-center justify-center rounded px-1 text-xs font-normal ',
                item.isSimulate ? 'bg-[#AD41FF]' : 'bg-brand'
              )}
            >
              <Text color="white">
                {item.isSimulate
                  ? intl.formatMessage({ id: 'common.enum.accountType.DEMO' })
                  : intl.formatMessage({ id: 'common.enum.accountType.REAL' })}
              </Text>
            </View>
            {synopsis?.abbr && (
              <View className={cn(' flex h-5 min-w-[42px] items-center px-1 justify-center rounded bg-black text-xs font-normal')}>
                <Text color="white">{synopsis?.abbr}</Text>
              </View>
            )}
            <Text color="primary" size="sm" weight="light" className="max-w-[120px] inline-block truncate">
              #{item.id}
            </Text>
          </View>
        </View>
        <Text color="weak" size="xs">
          {SOURCE_CURRENCY}
        </Text>
      </View>
    </div>
  )
}

type IProps = {
  onChange?: (item?: User.AccountItem) => void
  onItem?: (item?: User.AccountItem) => void
  isSimulate?: boolean
  back?: boolean
  /** 切换账户后是否停留在当前页面 */
  isRemainAtCurrentPage?: boolean
  accountTabActiveKey: 'REAL' | 'DEMO'
  setAccountTabActiveKey: (key: 'REAL' | 'DEMO') => void
  /**是否展示账户Tabs */
  showDefaultAccountTabbar?: boolean
}

type IAccountTabbarProps = {
  accountTabActiveKey: 'REAL' | 'DEMO'
  setAccountTabActiveKey: (key: 'REAL' | 'DEMO') => void
}

export const DefaultAccountTabbar = observer(({ accountTabActiveKey, setAccountTabActiveKey }: IAccountTabbarProps) => {
  const intl = useIntl()

  const accountOptions = [
    {
      label: intl.formatMessage({ id: 'app.account.Real Account' }),
      value: 'REAL'
    },
    {
      label: intl.formatMessage({ id: 'app.account.Demo Account' }),
      value: 'DEMO'
    }
  ]

  return (
    <Segmented
      className="account"
      onChange={(value: any) => {
        setAccountTabActiveKey(value)
      }}
      value={accountTabActiveKey}
      options={accountOptions}
      block
    />
  )
})

const _AccoutList = ({
  onChange,
  onItem,
  isRemainAtCurrentPage,
  isSimulate,
  back,
  accountTabActiveKey,
  setAccountTabActiveKey,
  showDefaultAccountTabbar = true
}: IProps) => {
  const intl = useIntl()
  const { theme, cn } = useTheme()
  const { trade } = useStores()
  const { initialState } = useModel('@@initialState')
  const { fetchUserInfo } = useModel('user')
  const currentUser = initialState?.currentUser

  const currentAccountInfo = trade.currentAccountInfo

  const handlePress = (item: User.AccountItem) => {
    if (onItem) {
      onItem(item)
      return
    }

    const disabledTrade = !item?.enableConnect || item.status === 'DISABLED'
    if (disabledTrade) {
      return
    }

    // 切换账户 重新更新查询品种列表
    trade.getSymbolList({ accountId: item.id })

    trade.setSwitchAccountLoading(true)
    // setAccountBoxOpen(false)

    setTimeout(() => {
      trade.setCurrentAccountInfo(item)

      // 切换账户重置
      trade.setCurrentLiquidationSelectBgaId('CROSS_MARGIN')

      // 停止动画播放
      trade.setSwitchAccountLoading(false)

      if (!isRemainAtCurrentPage) {
        if (!back) {
          goHome()
        } else {
          onBack()
        }
      }
    }, 1000)

    onChange?.(item)
  }

  const [currentAccountList, setCurrentAccountList] = useState<User.AccountItem[]>([])

  const showAccountList = useMemo(() => {
    return currentAccountList?.filter((item) => (accountTabActiveKey === 'DEMO' ? item.isSimulate : !item.isSimulate)) || []
  }, [accountTabActiveKey, currentAccountList])

  useEffect(() => {
    if (isSimulate) {
      setAccountTabActiveKey('DEMO')
    }
  }, [isSimulate])

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    fetchUserInfo(false)
      .then(() => {
        const accountList = currentUser?.accountList
        if (!accountList) return // Check if accountList is undefined
        setCurrentAccountList(currentUser?.accountList || [])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <>
      <View>
        {isSimulate === undefined && showDefaultAccountTabbar && (
          <View className={cn('mx-3')}>
            <DefaultAccountTabbar accountTabActiveKey={accountTabActiveKey} setAccountTabActiveKey={setAccountTabActiveKey} />
          </View>
        )}
        <View className={cn('flex-1 mb-2', showDefaultAccountTabbar && 'pt-[18px]')}>
          <View>
            {loading ? (
              <View className={cn('flex-1 items-center justify-center h-[300px]')}>
                <ActivityIndicator />
              </View>
            ) : showAccountList.length > 0 ? (
              <View className={cn('flex flex-col gap-3')}>
                {showAccountList.map((item: User.AccountItem) => (
                  <Item key={item.id} item={item} currentAccountInfo={currentAccountInfo} onClick={() => handlePress(item)} />
                ))}
              </View>
            ) : (
              <div className="h-[376px] flex items-center justify-center">
                <Empty />
              </div>
            )}
          </View>
        </View>
      </View>
      <ModalLoading width={300} open={trade.switchAccountLoading} tips={<FormattedMessage id="mt.qiehuanzhanghuzhong" />} />
    </>
  )
}

export const AccoutList = observer(_AccoutList)
