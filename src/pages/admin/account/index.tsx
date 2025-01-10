import { PlusCircleOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl, useModel, useSearchParams } from '@umijs/max'
import { useCountDown } from 'ahooks'
import { Segmented, Tooltip } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { MenuInfo } from 'rc-menu/lib/interface'
import { useEffect, useRef, useState } from 'react'

import Modal from '@/components/Admin/Modal'
import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'
import Dropdown from '@/components/Base/Dropdown'
import Empty from '@/components/Base/Empty'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { formatNum } from '@/utils'
import { push } from '@/utils/navigator'
import { STORAGE_GET_TRADE_THEME } from '@/utils/storage'

import Header from './comp/Header'
import RechargeSimulateModal from './comp/RechargeSimulateModal'
import RenameAccountModal from './comp/RenameAccountModal'

type IAccountItem = User.AccountItem & {
  isEyeOpen?: boolean
  isRefresh?: boolean
}

function Account() {
  const { isPc } = useEnv()
  const { initialState } = useModel('@@initialState')
  const { fetchUserInfo } = useModel('user')
  const intl = useIntl()
  const { trade } = useStores()
  const [accountTabActiveKey, setAccountTabActiveKey] = useState<'REAL' | 'DEMO'>('REAL')
  const [leftTime, setLeftTime] = useState<any>(0)
  const modalRef = useRef<any>()
  const [modalInfo, setModalInfo] = useState({} as User.AccountItem)
  const { setMode } = useTheme()

  const [searchParams] = useSearchParams()
  const searchKey = searchParams.get('key') as any

  const [currentAccountList, setCurrentAccountList] = useState<IAccountItem[]>([])
  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList || []
  const isKycAuth = currentUser?.isKycAuth
  const precision = trade.currentAccountInfo.currencyDecimal

  const [countDown] = useCountDown({
    leftTime,
    onEnd: () => {
      // 倒计时结束重置
      setLeftTime(undefined)
    }
  })
  const countDownSeconds = Math.round(countDown / 1000)

  const getCurrentAccountList = (accountList: IAccountItem[]) => {
    const list = accountList
      .filter((item) => (accountTabActiveKey === 'DEMO' ? item.isSimulate : !item.isSimulate))
      .map((item) => ({
        ...item,
        isRefresh: false
      }))

    return list
  }

  useEffect(() => {
    trade.getAccountGroupList()

    // 刷新用户信息
    fetchUserInfo(false)
  }, [])

  useEffect(() => {
    if (accountList?.length) {
      setLeftTime(5 * 1000)
    }
  }, [accountList])

  useEffect(() => {
    // 切换真实模拟账户列表
    const list = getCurrentAccountList(accountList)
    setCurrentAccountList(list)
  }, [accountTabActiveKey, currentUser])

  useEffect(() => {
    if (searchKey) {
      setAccountTabActiveKey(searchKey.toUpperCase())
    }
  }, [searchKey])

  return (
    <PageContainer pageBgColorMode="white" renderHeader={() => <Header />}>
      <img src="/img/rujin-banner.png" className="w-full h-[108px] bg-gray-60" />
      <div className="flex items-center justify-between mt-10">
        {/* <Tabs
          items={[
            { label: <FormattedMessage id="mt.zhenshizhanghao" />, key: 'REAL' },
            { label: <FormattedMessage id="mt.monizhanghu" />, key: 'DEMO' }
          ]}
          onChange={(key: any) => {
            setAccountTabActiveKey(key)
          }}
          activeKey={accountTabActiveKey}
          itemStyle={{ paddingBlock: 6 }}
        /> */}
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
        <Button
          icon={<PlusCircleOutlined style={{ fontSize: 16 }} />}
          onClick={() => {
            push(`/account/type`)
          }}
        >
          <FormattedMessage id="mt.chuangjianxinzhanghu" />
        </Button>
      </div>
      <div className="pt-6">
        {currentAccountList.map((item, idx) => {
          const isSimulate = item.isSimulate
          return (
            <div className="flex items-center justify-between py-4 px-[20px] rounded-lg border-[0.5px] border-gray-200 mb-5" key={idx}>
              <div className="flex flex-col">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="text-sm font-bold text-primary">
                      {item.name} / {item.id}
                    </div>
                    <div className="ml-[10px] flex px-1 items-center">
                      <div
                        className={classNames(
                          'flex h-5 min-w-[42px] items-center justify-center rounded px-1 text-xs font-normal text-white',
                          isSimulate ? 'bg-green' : 'bg-brand'
                        )}
                      >
                        {isSimulate ? <FormattedMessage id="mt.moni" /> : <FormattedMessage id="mt.zhenshi" />}
                      </div>
                      {item.synopsis?.abbr && (
                        <div className="ml-[6px] flex h-5 min-w-[42px] items-center justify-center rounded bg-black text-xs px-1 font-normal text-white">
                          {item.synopsis?.abbr}
                        </div>
                      )}
                      <div className="pl-[6px] flex items-center">
                        <div
                          className="py-[2px] px-[3px] hover:bg-gray-80 rounded-[10px]"
                          onClick={() => {
                            setCurrentAccountList(
                              currentAccountList.map((v) => ({ ...v, isEyeOpen: v.id === item.id ? !v.isEyeOpen : v.isEyeOpen }))
                            )
                          }}
                        >
                          <img
                            src={`/img/${!item.isEyeOpen ? 'eye_open' : 'eye_close'}.png`}
                            width={20}
                            height={20}
                            className="align-middle cursor-pointer"
                          />
                        </div>
                        <div
                          className="py-[2px] px-[3px] hover:bg-gray-80 rounded-[10px]"
                          onClick={() => {
                            setCurrentAccountList(currentAccountList.map((v) => ({ ...v, isRefresh: v.id === item.id })))
                            fetchUserInfo(false).then((res) => {
                              setTimeout(() => {
                                // @ts-ignore
                                setCurrentAccountList(getCurrentAccountList(res?.accountList || []))
                              }, 2000)
                            })
                          }}
                        >
                          <img
                            src="/img/shuaxin.png"
                            width={20}
                            height={20}
                            className={classNames('align-middle cursor-pointer', {
                              rotate: item.isRefresh
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <span className="text-[30px] !font-dingpro-medium text-primary">
                    {!item.isEyeOpen ? (!Number(item.money) ? '0.00' : formatNum(item.money, { precision: item.currencyDecimal })) : '∗∗∗∗'}
                  </span>
                  <span className="pl-[6px] text-sm text-secondary">USD</span>
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <Tooltip
                  overlayClassName="tooltipBoxDeposit"
                  zIndex={100}
                  open={Number(item.money) <= 0 && countDownSeconds > 0}
                  placement={isPc ? 'left' : 'bottomRight'}
                  title={
                    <div className="contentBox">
                      <FormattedMessage id="mt.cunruzijinkaishijiaoyi" />
                      <img src="/img/tips_icon.png" />
                    </div>
                  }
                >
                  {isSimulate ? (
                    <RechargeSimulateModal
                      trigger={
                        <Button style={{ height: 46, width: 108 }} icon={<img src="/img/rujin_icon.png" width={20} height={20} />}>
                          <span className="font-pf-bold">
                            <FormattedMessage id="mt.rujin" />
                          </span>
                        </Button>
                      }
                      info={item}
                    />
                  ) : (
                    <>
                      {/* @TODO 真实账户暂时不支持入金 */}
                      {/* <Button style={{ height: 46, width: 108 }} icon={<img src="/img/rujin_icon.png" width={20} height={20} />}>
                        <FormattedMessage id="mt.rujin" />
                      </Button> */}
                    </>
                  )}
                </Tooltip>
                {/* @TODO 真实账户暂时不支持出金 */}
                {/* {!isSimulate && (
                  <Button style={{ height: 46, width: 108 }} icon={<img src="/img/chujin_icon.png" width={20} height={20} />}>
                    <FormattedMessage id="mt.chujin" />
                  </Button>
                )} */}
                <Button
                  type="primary"
                  style={{ height: 46, width: 108 }}
                  onClick={() => {
                    setMode(STORAGE_GET_TRADE_THEME() || 'light')
                    trade.setCurrentAccountInfo(item)
                    trade.jumpTrade()
                  }}
                  disabled={trade.disabledConect(item)}
                >
                  <span className="font-pf-bold">
                    <FormattedMessage id="common.jiaoyi" />
                  </span>
                </Button>
                <Dropdown
                  menu={{
                    onClick: (event: MenuInfo) => {
                      const { key } = event
                      console.log('key', key)
                      if (key === 'transfer' && isKycAuth) {
                        push(`/account/transfer?from=${item.id}`)
                      } else if (key === 'rename') {
                        setModalInfo(item)
                        modalRef.current.setOpen(true)
                      }
                    },
                    items: [
                      // @ts-ignore
                      !isSimulate && {
                        key: 'transfer',
                        label: (
                          <Modal
                            trigger={
                              <span className="text-sm text-secondary hover:text-primary">
                                <FormattedMessage id="common.zhuanzhang" />
                              </span>
                            }
                            title={<FormattedMessage id="common.wenxintishi" />}
                            width={380}
                            okText={<FormattedMessage id="mt.qurenzheng" />}
                            onFinish={() => {
                              push('/setting/kyc')
                            }}
                          >
                            <div className="text-base text-primary">
                              <FormattedMessage id="mt.qingxianwanshankycrenzheng" />
                            </div>
                          </Modal>
                        )
                      },
                      {
                        key: 'rename',
                        label: (
                          <span className="text-sm text-secondary hover:text-primary">
                            <FormattedMessage id="mt.zhanghuchongmingming" />
                          </span>
                        )
                      }
                      // {
                      //   key: 'editPwd',
                      //   label: (
                      //     <span className="text-sm text-secondary hover:text-primary">
                      //       <FormattedMessage id="mt.genggaijiaoyimima" />
                      //     </span>
                      //   )
                      // }
                    ]
                  }}
                >
                  <div className="hover:bg-gray-50 flex items-center justify-center p-3 rounded-full w-[46px] h-[46px] cursor-pointer">
                    <img src="/img/dian.png" width={4} height={22} />
                  </div>
                </Dropdown>
              </div>
            </div>
          )
        })}
        {currentAccountList.length === 0 && <Empty />}
      </div>
      <RenameAccountModal ref={modalRef} info={modalInfo} />
    </PageContainer>
  )
}

export default observer(Account)
