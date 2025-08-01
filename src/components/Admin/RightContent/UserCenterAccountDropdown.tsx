import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useModel } from '@umijs/max'
import { Dropdown } from 'antd'
import { observer } from 'mobx-react'
import { useMemo, useRef, useState } from 'react'

import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { formatNum, toFixed } from '@/utils'
import { cn } from '@/utils/cn'
import { push } from '@/utils/navigator'

import { getAccountSynopsisByLng } from '@/utils/business'
import { HeaderTheme } from '../Header/types'

type IProps = {
  theme: HeaderTheme
}

// 用户中心账户信息下拉
function UserCenterAccountDropdown({ theme }: IProps) {
  const { trade } = useStores()
  const { currentAccountInfo } = trade
  const { initialState } = useModel('@@initialState')
  const themeConfig = useTheme()
  const isDark = themeConfig.theme.isDark
  const [accountBoxOpen, setAccountBoxOpen] = useState(false)
  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList || []
  const realAccountList = accountList.filter((item) => !item.isSimulate)
  const isKycAuth = currentUser?.isKycAuth
  const authModalRef = useRef<any>(null)
  const currencyDecimal = currentAccountInfo.currencyDecimal || 2 // 账户组小数位
  const showUserCenterAccountDropdown = realAccountList.length !== 1

  const totalAccountMoney = accountList
    .filter((item) => !item.isSimulate)
    .reduce((total, next) => Number(total || 0) + toFixed(Number(next.money || 0), next.currencyDecimal), 0) // 所有账户余额

  const renderTransferDom = (item: User.AccountItem) => (
    <Button
      className="!ml-0 text-sm !h-[32px] !px-[10px]"
      icon={<img src="/img/huazhuan.png" width={20} height={20} />}
      onClick={() => {
        // 关闭弹窗
        setAccountBoxOpen(false)
        // if (isKycAuth) {
        // authModalRef.current?.close?.()
        push(`/account/transfer?from=${item.id}`)
        // }
      }}
    >
      <FormattedMessage id="common.zhuanzhang" />
    </Button>
  )

  const iconDownColor = useMemo(() => (theme === 'white' ? (accountBoxOpen ? 'black' : 'white') : 'black'), [accountBoxOpen, theme])

  const groupClassName = useEmotionCss(({ token }) => {
    return showUserCenterAccountDropdown
      ? {
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
      : {}
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
      dropdownRender={() => {
        return (
          <div className="dark:!shadow-none shadow-sm xl:border dark:border-[--border-primary-color] xl:border-[#f3f3f3] rounded-b-xl rounded-tr-xl bg-primary xl:w-[360px] pt-3">
            <div className="max-h-[500px] overflow-y-auto px-3">
              {realAccountList.map((item, idx: number) => {
                const synopsis = getAccountSynopsisByLng(item.synopsis)
                return (
                  <div
                    key={item.id}
                    className={cn('border-b border-gray-150 pl-[11px] py-[11px]', {
                      'border-none': idx === realAccountList.length - 1
                    })}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div>
                          <span className="text-[20px] text-primary font-pf-bold">
                            {Number(item.money) ? formatNum(item.money, { precision: item.currencyDecimal }) : '0.00'}
                          </span>{' '}
                          <span className="ml-1 text-sm font-normal text-secondary">USD</span>
                        </div>
                      </div>
                      <div className="ml-[10px] flex px-1">
                        <div
                          className={cn(
                            'flex h-[22px] min-w-[42px] items-center bg-blue-700/10 justify-center rounded px-1 text-xs font-normal text-brand'
                          )}
                        >
                          <FormattedMessage id="mt.zhenshi" />
                        </div>
                        {synopsis?.abbr && (
                          <div className="ml-[6px] max-w-[84px] flex h-[22px] min-w-[42px] items-center px-1 justify-center rounded bg-black text-xs font-normal text-white">
                            <span className="truncate">{synopsis?.abbr}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 text-sm text-secondary leading-3">
                      {item.name} #{item?.id}
                    </div>
                    <div className="flex items-center gap-x-3 mt-3">
                      {/* {!isKycAuth && (
                        <Modal
                          trigger={renderTransferDom(item)}
                          title={<FormattedMessage id="common.wenxintishi" />}
                          width={380}
                          okText={<FormattedMessage id="mt.qurenzheng" />}
                          onFinish={() => {
                            // 关闭弹窗
                            setAccountBoxOpen(false)
                            push('/setting')

                            return true
                          }}
                          ref={authModalRef}
                        >
                          <div className="text-base text-primary">
                            <FormattedMessage id="mt.qingxianwanshankycrenzheng" />
                          </div>
                        </Modal>
                      )} */}
                      {/* {isKycAuth && renderTransferDom(item)} */}
                      {renderTransferDom(item)}

                      {/* <Button
                    className="!ml-0 text-sm !h-[32px] !px-[10px]"
                    onClick={() => {}}
                    icon={<img src="/img/chujin_icon.png" width={20} height={20} style={{}} />}
                  >
                    <FormattedMessage id="mt.rujin" />
                  </Button> */}
                    </div>
                  </div>
                )
              })}
              {/* <div className="my-3">{accountArr.length === 0 && <Empty />}</div> */}
            </div>
          </div>
        )
      }}
      onOpenChange={(open) => {
        setAccountBoxOpen(open)
      }}
      open={showUserCenterAccountDropdown ? accountBoxOpen : false}
      align={{ offset: [0, 0] }}
    >
      <div
        className={cn('flex items-center px-2 h-[57px]', groupClassName, themeClass, {
          active: accountBoxOpen
        })}
      >
        <div className="flex items-center group relative">
          <Iconfont name="zhanghu" width={24} height={24} style={{ marginTop: 2 }} />
          <span className="text-sm md:text-lg font-pf-bold ml-1 text-left">
            {totalAccountMoney ? formatNum(totalAccountMoney, { precision: currencyDecimal }) : '0.00'} USD
          </span>
        </div>

        {showUserCenterAccountDropdown && (
          <>
            <div className="w-[1px] h-[26px] ml-3 mr-2 bg-gray-200 dark:bg-gray-570"></div>
            <div className="h-[58px]">
              <Iconfont
                name="down"
                width={24}
                height={24}
                color={iconDownColor}
                className="cursor-pointer rounded-lg transition-all duration-300"
                style={{ transform: `rotate(${accountBoxOpen ? 180 : 0}deg)` }}
              />
            </div>
          </>
        )}
      </div>
    </Dropdown>
  )
}

export default observer(UserCenterAccountDropdown)
