import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useModel } from '@umijs/max'
import { Dropdown, Segmented } from 'antd'
import { observer } from 'mobx-react'
import { useEffect, useMemo, useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import AccountBalance from '@/components/Web/Trade/AccountBalance'
import AvailableMargin from '@/components/Web/Trade/AvailableMargin'
import TotalProfit from '@/components/Web/Trade/TotalProfit'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { colorWhite, gray } from '@/theme/theme.config'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'
import { push } from '@/utils/navigator'

import { HeaderTheme } from '../Header/types'
import AccountListItem from './AccountListItem'

type IProps = {
  /**主题 */
  theme: HeaderTheme
}

// 交易页面账户信息下拉
function TradeAccountDropdown({ theme }: IProps) {
  const { trade, ws } = useStores()
  const { currentAccountInfo } = trade
  const { occupyMargin } = trade.getAccountBalance()
  const [accountTabActiveKey, setAccountTabActiveKey] = useState<'REAL' | 'DEMO'>('REAL') //  真实账户、模拟账户
  const [currentAccountList, setCurrentAccountList] = useState<User.AccountItem[]>([])
  const { initialState } = useModel('@@initialState')
  const { isDark } = useTheme()
  const [accountBoxOpen, setAccountBoxOpen] = useState(false)
  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList || []

  useEffect(() => {
    // 切换真实模拟账户列表
    const list = accountList.filter((item) => (accountTabActiveKey === 'DEMO' ? item.isSimulate : !item.isSimulate))
    setCurrentAccountList(list)
  }, [accountTabActiveKey, accountList])

  // 排除当前选择的账户
  const accountArr = currentAccountList.filter((item) => item.id !== currentAccountInfo.id)

  const iconDownColor = useMemo(() => (theme === 'white' ? (accountBoxOpen ? 'black' : 'white') : 'black'), [accountBoxOpen, theme])

  const groupClassName = useEmotionCss(({ token }) => {
    return {
      '&:hover': {
        border: `1px solid ${isDark ? 'var(--dropdown-border-color)' : '#f3f3f3'}`,
        borderBottomColor: isDark ? 'var(--dropdown-border-color)' : '#fff',
        borderBottomWidth: isDark ? 0 : 1,
        background: 'var(--dropdown-bg)',
        color: 'var(--color-text-primary)',
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        boxShadow: isDark ? 'none' : '0 2px 10px 10px hsla(0, 0%, 89%, .1)'
      },
      '&.active': {
        border: `1px solid ${isDark ? 'var(--dropdown-border-color)' : '#f3f3f3'}`,
        borderBottomColor: isDark ? 'var(--dropdown-border-color)' : '#fff',
        borderBottomWidth: isDark ? 0 : 1,
        background: 'var(--dropdown-bg)',
        color: 'var(--color-text-primary)',
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        boxShadow: isDark ? 'none' : '0 2px 10px 10px hsla(0, 0%, 89%, .1)'
      }
    }
  })

  const themeClass = useEmotionCss(({ token }) => {
    return {
      color: theme === 'white' ? 'white' : 'black',
      '&:hover': {
        color: 'black'
      },
      '&.active': {
        color: 'black'
      }
    }
  })

  return (
    <Dropdown
      placement="topLeft"
      dropdownRender={() => (
        <div
          style={{
            boxShadow: !isDark ? '0px 2px 10px 10px rgba(227,227,227,0.1)' : 'none'
          }}
          className="dark:!shadow-none xl:border dark:border-[--dropdown-border-color] xl:border-[#f3f3f3] min-h-[338px] rounded-b-xl rounded-tr-xl bg-white dark:bg-[--dropdown-bg] pb-1 xl:w-[360px] xl:pt-[18px]"
        >
          <div className="mb-[26px] px-[18px]">
            <AccountListItem
              value={currentAccountInfo?.money}
              label={<FormattedMessage id="mt.zhanghuyue" />}
              tips={<FormattedMessage id="mt.zhanghuyueTips" />}
            />
            {/* 浮动盈亏 */}
            <TotalProfit />
            {/* 可用保证金 */}
            <AvailableMargin />
            <AccountListItem
              value={occupyMargin}
              label={<FormattedMessage id="mt.zhanyong" />}
              tips={<FormattedMessage id="mt.zhanyongtips" />}
            />
          </div>
          {/* @TODO 暂时不做 */}
          {/* <div className="mb-[13px] px-[18px]">
      <div className="flex justify-between gap-x-3">
        <Button className="!ml-0 text-sm" type="primary" block icon={<img src="/img/rujin-white.png" width={20} height={20} />}>
          <FormattedMessage id="mt.rujin" />
        </Button>
        <Button
          className="!ml-0 text-sm"
          block
          onClick={() => {
            // if (isMobileOrIpad) {
            //   push('/user/cashOut')
            // } else {
            //   props.user.navIndex = 3 // 激活侧边栏入金卡片
            //   push('/user')
            // }
          }}
          icon={<img src="/img/chujin_icon.png" width={20} height={20} style={{}} />}
        >
          <FormattedMessage id="mt.chujin" />
        </Button>
      </div>
      <div className="mt-[10px]">
        <Button
          className="!ml-0 w-full text-sm"
          onClick={() => {
            //
          }}
          icon={<img src="/img/user_tab_icon4@2x.png" width={20} height={20} />}
        >
          <FormattedMessage id="mt.churujinjilu" />
        </Button>
      </div>
    </div> */}
          <div className="py-0 border-t-[2px] dark:border-t-[1px] border-[rgba(218,218,218,0.2)] dark:border-gray-620/20 flex flex-col">
            <div className="my-3 px-[18px] flex items-center justify-between flex-shrink-0 flex-grow-0">
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
              <div
                onClick={() => {
                  push('/account')
                }}
                className="cursor-pointer text-primary max-xl:text-right"
              >
                <FormattedMessage id="mt.guanlizhanghu" />
              </div>
            </div>
            <div
              className="max-h-[380px] overflow-y-auto"
              style={
                isDark
                  ? {
                      scrollbarColor: `${gray[578]} ${gray[680]}`,
                      scrollbarWidth: 'thin'
                    }
                  : {}
              }
            >
              {accountArr.map((item, idx: number) => {
                const isSimulate = item.isSimulate
                const disabledTrade = !item?.enableConnect || item.status === 'DISABLED'
                return (
                  <div
                    onClick={() => {
                      // if (isMobileOrIpad) {
                      //   hoverAccountBoxPopupRef?.current?.close()
                      // }
                      if (disabledTrade) {
                        return
                      }

                      setAccountBoxOpen(false)

                      // 取消之前账户组品种行情订阅
                      ws.batchSubscribeSymbol({
                        cancel: true
                      })

                      setTimeout(() => {
                        trade.setCurrentAccountInfo(item)
                        trade.jumpTrade()

                        // 切换账户重置
                        trade.setCurrentLiquidationSelectBgaId('CROSS_MARGIN')
                      }, 200)
                    }}
                    key={item.id}
                    className={cn(
                      'mb-[14px] mx-[18px] scrollba cursor-pointer rounded-lg dark:border-gray-610 border border-gray-250 pb-[6px] pl-[11px] pr-[11px] pt-[11px] hover:bg-[var(--list-hover-light-bg)]',
                      {
                        'bg-[var(--list-hover-light-bg)]': item.id === currentAccountInfo.id,
                        'cursor-no-drop !bg-[var(--list-item-disabled)]': disabledTrade
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
                          {item.synopsis?.abbr && (
                            <div className="ml-[6px] flex h-5 min-w-[42px] items-center px-1 justify-center rounded bg-black text-xs font-normal text-white">
                              {item.synopsis?.abbr}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-1">
                      <div>
                        <span className="text-[20px] text-primary !font-dingpro-regular">
                          {Number(item.money) ? formatNum(item.money, { precision: item.currencyDecimal || 2 }) : '0.00'}
                        </span>{' '}
                        <span className="ml-1 text-sm font-normal text-secondary">USD</span>
                      </div>
                    </div>
                  </div>
                )
              })}
              {/* <div className="my-3">{accountArr.length === 0 && <Empty />}</div> */}
            </div>
          </div>
        </div>
      )}
      onOpenChange={(open) => {
        setAccountBoxOpen(open)
      }}
      open={accountBoxOpen}
      align={{ offset: [-0.2, 0] }}
    >
      <div
        className={cn('flex items-center px-2 h-[57px]', groupClassName, themeClass, {
          active: accountBoxOpen
        })}
      >
        <div className="flex flex-col items-end group relative">
          {/* 账户净值 */}
          <AccountBalance />
          <div className="flex items-center">
            <span className={cn('text-xs dark:text-primary', iconDownColor === 'white' ? 'text-zinc-100' : 'text-blue')}>
              {currentAccountInfo?.isSimulate ? <FormattedMessage id="mt.moni" /> : <FormattedMessage id="mt.zhenshi" />}
            </span>
            <div className="w-[1px] h-[10px] mx-[6px] bg-gray-200 dark:bg-gray-570"></div>
            <span
              className={cn(
                'text-xs dark:text-gray-570 truncate max-w-[155px]',
                iconDownColor === 'white' ? 'text-zinc-100' : 'text-gray-500'
              )}
            >
              {currentAccountInfo?.name}
            </span>
          </div>
        </div>
        <div className="w-[1px] h-[26px] ml-3 mr-2 bg-gray-200 dark:bg-gray-570"></div>
        <div>
          <Iconfont
            name="down"
            width={24}
            height={24}
            color={isDark ? colorWhite : iconDownColor}
            className="cursor-pointer rounded-lg transition-all duration-300"
            style={{ transform: `rotate(${accountBoxOpen ? 180 : 0}deg)` }}
          />
        </div>
      </div>
    </Dropdown>
  )
}

export default observer(TradeAccountDropdown)
