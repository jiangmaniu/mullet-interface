import { QuestionCircleOutlined } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, history, SelectLang as UmiSelectLang, useLocation, useModel } from '@umijs/max'
import { Segmented, Tooltip } from 'antd'
import { observer } from 'mobx-react'
import { useEffect, useMemo, useState } from 'react'

import CopyComp from '@/components/Base/Copy'
import Dropdown from '@/components/Base/Dropdown'
import Empty from '@/components/Base/Empty'
import Iconfont from '@/components/Base/Iconfont'
import SwitchLanguage from '@/components/SwitchLanguage'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import { formatNum, hiddenCenterPartStr } from '@/utils'
import { cn } from '@/utils/cn'
import { goKefu, onLogout, push } from '@/utils/navigator'
import { getCurrentQuote } from '@/utils/wsUtil'

import { HeaderTheme } from '../Header/types'

export type SiderTheme = 'light' | 'dark'

export const SelectLang = () => {
  return (
    <UmiSelectLang
      style={{
        padding: 4
      }}
      reload={false}
    />
  )
}

export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26
      }}
      onClick={() => {
        window.open('https://pro.ant.design/docs/getting-started')
      }}
    >
      <QuestionCircleOutlined />
    </div>
  )
}

export const Message = () => {
  const { isMobileOrIpad } = useEnv()
  const messageDom = (
    <div
      style={{
        display: 'flex',
        marginRight: 12
      }}
      onClick={() => {
        history.push('/message')
      }}
    >
      {/* <Badge dot>
        <img src="/img/icons/message.png" className="w-[20px] h-[20px]" />
      </Badge> */}
      <Iconfont name="xiaoxi" />
    </div>
  )
  if (isMobileOrIpad) {
    return messageDom
  }
  return (
    <Tooltip placement="bottomRight" title={<FormattedMessage id="mt.myMessage" />}>
      {messageDom}
    </Tooltip>
  )
}

export const Concat = () => {
  const { isMobileOrIpad } = useEnv()
  const concatDom = (
    <div
      style={{
        display: 'flex',
        border: isMobileOrIpad ? 'none' : '1px solid #eee',
        marginLeft: isMobileOrIpad ? 20 : 10
      }}
      onClick={() => {
        goKefu()
      }}
    >
      <img src="/img/icons/message2.png" className="w-[20px] h-[20px]" />
    </div>
  )
  if (isMobileOrIpad) {
    return concatDom
  }
  return (
    <Tooltip placement="bottomRight" title={<FormattedMessage id="common.kefu" />}>
      {concatDom}
    </Tooltip>
  )
}

type IHeaderRightProps = {
  /**管理端 */
  isAdmin?: boolean
  /**是否是交易页面 */
  isTrade?: boolean
  /**主题 */
  theme?: HeaderTheme
}
export const HeaderRightContent = observer(({ isAdmin, isTrade, theme = 'black' }: IHeaderRightProps) => {
  const [accountTabActiveKey, setAccountTabActiveKey] = useState<'REAL' | 'DEMO'>('REAL') //  真实账户、模拟账户
  const { initialState } = useModel('@@initialState')
  const { trade } = useStores()
  const [currentAccountList, setCurrentAccountList] = useState<User.AccountItem[]>([])
  const { fetchUserInfo } = useModel('user')
  const [accountBoxOpen, setAccountBoxOpen] = useState(false)
  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList || []
  const currentAccountInfo = trade.currentAccountInfo
  const quoteInfo = getCurrentQuote() // 这里保留，取值过程，触发mobx实时更新
  const { balance, availableMargin, totalProfit, occupyMargin } = trade.getAccountBalance()
  const { pathname } = useLocation()
  const isTradePage = pathname.indexOf('/trade') !== -1

  // 排除当前选择的账户
  const accountArr = currentAccountList.filter((item) => item.id !== currentAccountInfo.id)

  useEffect(() => {
    // 切换真实模拟账户列表
    const list = accountList.filter((item) => (accountTabActiveKey === 'DEMO' ? item.isSimulate : !item.isSimulate))
    setCurrentAccountList(list)
  }, [accountTabActiveKey, accountList.length])

  const renderAccountBoxHover = () => {
    const list = [
      {
        label: <FormattedMessage id="mt.zongzichanjingzhi" />,
        value: balance,
        tips: <FormattedMessage id="mt.zichanjingzhitips" />
      },
      { label: <FormattedMessage id="mt.fudongyingkui" />, value: totalProfit, tips: <FormattedMessage id="mt.fudongyingkuitips" /> },
      { label: <FormattedMessage id="mt.keyong" />, value: availableMargin, tips: <FormattedMessage id="mt.keyongtips" /> },
      { label: <FormattedMessage id="mt.zhanyong" />, value: occupyMargin, tips: <FormattedMessage id="mt.zhanyongtips" /> }
    ]
    return (
      <div className="xl:shadow-dropdown dark:!shadow-none xl:border dark:border-[--border-primary-color] xl:border-[#f3f3f3] min-h-[338px] rounded-b-xl rounded-tr-xl bg-primary pb-1 xl:w-[360px] xl:pt-[18px]">
        <div className="mb-[26px] px-[18px]">
          {list.map((item, idx) => (
            <div className="mb-6 flex flex-wrap items-center justify-between text-weak" key={idx}>
              <span className="text-primary">{item.label}</span>
              <Tooltip overlayClassName="max-w-[300px]" placement="top" title={item.tips}>
                <span className="ml-[5px]">
                  <img src="/img/warring_icon.png" className="h-4 w-4 p-0" />
                </span>
              </Tooltip>
              <span className="my-0 ml-[18px] mr-[23px] h-[1px] flex-1 border-t-[1px] border-dashed border-gray-250"></span>
              <span className="max-w-[240px] break-all text-right text-primary !font-dingpro-medium">
                {formatNum(item.value, { precision: 2 })} USD
              </span>
            </div>
          ))}
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
        <div className="px-[18px] py-0 xl:border-t-[2px] xl:border-[rgba(218,218,218,0.2)] flex flex-col">
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
            <div
              onClick={() => {
                push('/account')
              }}
              className="cursor-pointer text-primary max-xl:text-right"
            >
              <FormattedMessage id="mt.guanlizhanghu" />
            </div>
          </div>
          <div className="max-h-[380px] overflow-y-auto">
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

                    setTimeout(() => {
                      trade.setCurrentAccountInfo(item)
                      trade.jumpTrade()

                      // 切换账户重置
                      trade.setCurrentLiquidationSelectBgaId('CROSS_MARGIN')
                    }, 200)
                  }}
                  key={item.id}
                  className={cn(
                    'mb-[14px] cursor-pointer rounded-lg border border-gray-250 pb-[6px] pl-[11px] pr-[11px] pt-[11px] hover:bg-[var(--list-hover-light-bg)]',
                    {
                      'bg-[var(--list-hover-light-bg)]': item.id === currentAccountInfo.id,
                      'cursor-no-drop !bg-[var(--list-item-disabled)]': disabledTrade
                    }
                  )}
                >
                  <div className="flex justify-between">
                    <div className="flex">
                      <div className="flex-1 text-sm font-bold text-primary">
                        {item.name} / {hiddenCenterPartStr(item?.id, 4)}
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
                          <div className="ml-[6px] flex h-5 min-w-[42px] items-center justify-center rounded bg-black text-xs font-normal text-white">
                            {item.synopsis?.abbr}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-1">
                    <div>
                      <span className="text-[20px] text-primary !font-dingpro-regular">
                        {!Number(item.money) ? '0.00' : formatNum(item.money, { precision: trade.currentAccountInfo.currencyDecimal })}
                      </span>{' '}
                      <span className="ml-1 text-sm font-normal text-secondary">USD</span>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="my-3">{accountArr.length === 0 && <Empty />}</div>
          </div>
        </div>
      </div>
    )
  }

  const groupClassName = useEmotionCss(({ token }) => {
    return {
      '&:hover': {
        border: '1px solid #f3f3f3',
        borderBottomColor: '#fff',
        background: '#fff',
        color: theme === 'white' ? 'black' : 'white',
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        boxShadow: '0 2px 10px 10px hsla(0, 0%, 89%, .1)'
      },
      '&.active': {
        border: '1px solid #f3f3f3',
        borderBottomColor: '#fff',
        background: '#fff',
        color: theme === 'white' ? 'black' : 'white',
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        boxShadow: '0 2px 10px 10px hsla(0, 0%, 89%, .1)'
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

  const iconDownColor = useMemo(() => (theme === 'white' ? (accountBoxOpen ? 'black' : 'white') : 'black'), [accountBoxOpen, theme])

  return (
    <div className="flex items-center">
      <div className="flex items-center md:gap-x-[26px] md:mr-[28px] sm:gap-x-3 sm:mr-4 gap-x-2 mr-1">
        <Dropdown
          placement="topLeft"
          dropdownRender={renderAccountBoxHover}
          onOpenChange={(open) => {
            setAccountBoxOpen(open)
          }}
          open={accountBoxOpen}
          align={{ offset: [0, 0] }}
        >
          <div
            className={cn('flex items-center px-2 h-[57px]', groupClassName, themeClass, { active: accountBoxOpen })}
            onMouseEnter={() => {
              // 刷新账户余额信息,使用ws最新的
              // setTimeout(() => {
              //   fetchUserInfo(false)
              // }, 300)
            }}
          >
            <div className="flex flex-col items-end group relative">
              <span className="text-lg !font-dingpro-regular">{formatNum(balance, { precision: 2 })} USD</span>
              <div className="flex items-center">
                <span className={cn('text-xs dark:text-blue', iconDownColor === 'white' ? 'text-zinc-100' : 'text-blue')}>
                  {currentAccountInfo?.isSimulate ? <FormattedMessage id="mt.moni" /> : <FormattedMessage id="mt.zhenshi" />}
                </span>
                <div className="w-[1px] h-[10px] mx-[6px] bg-gray-200 dark:bg-gray-570"></div>
                <span
                  className={cn(
                    'text-xs dark:text-gray-570 truncate max-w-[110px]',
                    iconDownColor === 'white' ? 'text-zinc-100' : 'text-gray-500'
                  )}
                >
                  {currentAccountInfo?.name}
                </span>
              </div>
            </div>
            <div className="w-[1px] h-[26px] ml-3 mr-2 bg-gray-200 dark:bg-gray-570"></div>
            <div>
              {/* <img
                src="/img/uc/select.png"
                width={24}
                height={24}
                style={{ transform: `rotate(${accountBoxOpen ? 180 : 0}deg)` }}
                className="transition-all duration-300"
              /> */}
              <Iconfont
                name="down"
                width={24}
                height={24}
                color={iconDownColor}
                className="cursor-pointer rounded-lg transition-all duration-300"
                style={{ transform: `rotate(${accountBoxOpen ? 180 : 0}deg)` }}
              />
            </div>
          </div>
        </Dropdown>

        <Iconfont
          name="caidan"
          width={36}
          height={36}
          color={theme}
          className=" cursor-pointer rounded-lg"
          hoverStyle={{
            background: theme === 'black' ? '#fbfbfb' : '#222222'
          }}
        />
        <Iconfont
          name="quan"
          width={36}
          height={36}
          color={theme}
          className=" cursor-pointer rounded-lg"
          hoverStyle={{
            background: theme === 'black' ? '#fbfbfb' : '#222222'
          }}
          onClick={() => {
            push('/account')
          }}
        />

        <Iconfont
          name="kefu"
          width={36}
          height={36}
          color={theme}
          className=" cursor-pointer rounded-lg"
          hoverStyle={{
            background: theme === 'black' ? '#fbfbfb' : '#222222'
          }}
        />
        <Dropdown
          placement="topRight"
          dropdownRender={(origin) => {
            return (
              <div className="flex p-5 bg-white w-[290px] z-[800] rounded-xl shadow-dropdown">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <img src="/img/user-icon.png" width={40} height={40} />
                    <div className="flex flex-col pl-[14px]">
                      <span className="text-primary font-semibold">
                        <CopyComp style={{ display: 'flex', alignItems: 'center' }}>
                          HI,{hiddenCenterPartStr(currentUser?.userInfo?.account, 6)}
                        </CopyComp>
                      </span>
                      {currentUser?.isKycAuth && (
                        <span className="text-green text-xs pt-[6px]">
                          <FormattedMessage id="mt.yirenzheng" />
                        </span>
                      )}
                      {!currentUser?.isKycAuth && (
                        <span className="text-red text-xs pt-[6px]">
                          <FormattedMessage id="mt.weirenzheng" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      onLogout()
                    }}
                  >
                    <img width={22} height={22} src="/img/logout-icon.png" />
                  </div>
                </div>
              </div>
            )
          }}
        >
          {/* <img src="/img/uc/user.png" width={36} height={36} className=" cursor-pointer rounded-lg hover:bg-gray-80" /> */}
          <Iconfont
            name="user"
            width={36}
            height={36}
            color={theme}
            className=" cursor-pointer rounded-lg"
            hoverStyle={{
              background: theme === 'black' ? '#fbfbfb' : '#222222'
            }}
          />
        </Dropdown>
      </div>
      {/* {isTradePage && <SwitchTheme />} */}
      <SwitchLanguage isAdmin={isAdmin} theme={theme} isTrade={isTrade} />
    </div>
  )
})
