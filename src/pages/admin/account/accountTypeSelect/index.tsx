import { ArrowRightOutlined } from '@ant-design/icons'
import { PageLoading } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useModel } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'

import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'
import Tabs from '@/components/Base/CustomTabs'
import Empty from '@/components/Base/Empty'
import { useStores } from '@/context/mobxProvider'
import { push } from '@/utils/navigator'

import Header from '../comp/Header'

function AccountList() {
  const { trade } = useStores()
  const { initialState } = useModel('@@initialState')
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState({} as AccountGroup.AccountGroupItem)
  const [accountTabActiveKey, setAccountTabActiveKey] = useState<'REAL' | 'DEMO'>('REAL')

  const [currentAccountList, setCurrentAccountList] = useState<AccountGroup.AccountGroupItem[]>([])

  const accountList = trade.accountGroupList

  useEffect(() => {
    if (!accountList.length) {
      setLoading(true)
      trade.getAccountGroupList().finally(() => {
        setLoading(false)
      })
    }
  }, [])

  useEffect(() => {
    // 切换真实模拟账户列表
    const list = accountList.filter((item) => (accountTabActiveKey === 'DEMO' ? item.isSimulate : !item.isSimulate))

    setCurrentAccountList(list)
  }, [accountTabActiveKey, accountList.length])

  useEffect(() => {
    if (currentAccountList?.length) {
      setCurrent(currentAccountList[0])
    }
  }, [currentAccountList])

  // @ts-ignore
  const className = useEmotionCss(({ token }) => {
    return {
      '&::-webkit-scrollbar': {
        height: '4px !important',
        width: 0,
        overflowY: 'auto'
      },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: 5,
        backgroundColor: 'rgba(89, 89, 89, 0.15)'
      },
      '&::-webkit-scrollbar-track': {
        boxShadow: 0,
        borderRadius: 0,
        background: '#EFEFEF'
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(89, 89, 89, 1)',
        borderRadius: 5,
        boxShadow: 'inset 0 0 5px rgba(239, 239, 239, 1)'
      }
    }
  })

  const renderCardList = () => {
    return (
      <div className={classNames('flex items-center overflow-x-auto overflow-y-hidden flex-nowrap pb-10', className)}>
        <div className="flex items-center gap-x-5">
          {(currentAccountList || []).map((item, idx) => {
            const isActive = item.id === current?.id
            return (
              <div
                className={classNames(
                  'w-[360px] h-[344px] border-[2px] rounded-lg px-[26px] relative cursor-pointer',
                  isActive ? 'border-blue' : 'border-gray-150'
                )}
                style={{
                  background: isActive ? `linear-gradient(180deg, #DCECFF 0%, #FFFFFF 40%)` : '#fff'
                }}
                key={idx}
                onClick={() => {
                  setCurrent(item)
                }}
              >
                <img
                  src={`/img/account-${isActive ? 'select' : 'unselect'}.png`}
                  width={64}
                  height={58}
                  className="absolute left-[-2px] top-0"
                />
                <div className="h-[60px] flex items-center justify-end">
                  {/* 标签 */}
                  {item.synopsis?.tag && (
                    <div className="flex items-center justify-end">
                      <div className="text-white text-sm bg-brand rounded px-3 py-[3px]">{item.synopsis?.tag}</div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="pb-[14px] text-primary text-[24px] font-bold truncate">{item.synopsis?.name || item?.groupName}</div>
                  <div className="text-secondary text-sm line-clamp-2">{item.synopsis?.remark}</div>
                </div>
                <div className="border-b border-gray-250/25 my-5"></div>
                <div>
                  {(item.synopsis?.list || []).slice(0, 3).map((v, index) => (
                    <div className="flex items-center justify-between pb-7" key={index}>
                      <div className="text-base text-secondary">{v.title}</div>
                      <div className="text-base text-primary font-semibold">{v.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  return (
    <PageContainer
      pageBgColorMode="gray"
      renderHeader={() => <Header />}
      backTitle={
        <div className="flex items-center justify-between w-full">
          <div className="text-[24px] font-bold">
            <FormattedMessage id="mt.chuangjianzhanghu" />
          </div>
          <div className="">
            <Tabs
              items={[
                { label: <FormattedMessage id="mt.zhenshizhanghao" />, key: 'REAL' },
                { label: <FormattedMessage id="mt.monizhanghu" />, key: 'DEMO' }
              ]}
              onChange={(key: any) => {
                setAccountTabActiveKey(key)
              }}
              activeKey={accountTabActiveKey}
              itemStyle={{ paddingBlock: 6 }}
              activeBg="#E9F3FF"
            />
          </div>
        </div>
      }
    >
      <div>
        {!loading && renderCardList()}
        {loading && <PageLoading />}
        {!loading && !currentAccountList?.length && <Empty />}
      </div>
      {currentAccountList.length > 0 && !loading && (
        <Button
          type="primary"
          style={{ width: 340, height: 46, marginTop: 38 }}
          disabled={!current?.id}
          onClick={() => {
            push(`/account/type/add/${current.id}?key=${accountTabActiveKey.toLowerCase()}`)
          }}
        >
          <FormattedMessage id="mt.jixu" />
          <ArrowRightOutlined />
        </Button>
      )}
    </PageContainer>
  )
}

export default observer(AccountList)
