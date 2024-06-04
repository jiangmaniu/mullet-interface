import { QuestionCircleOutlined } from '@ant-design/icons'
import { FormattedMessage, history, SelectLang as UmiSelectLang } from '@umijs/max'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import { useState } from 'react'

import Button from '@/components/Base/Button'
import CopyComp from '@/components/Base/Copy'
import Tabs from '@/components/Base/CustomTabs'
import Dropdown from '@/components/Base/Dropdown'
import Iconfont from '@/components/Base/Iconfont'
import SwitchLanguage from '@/components/SwitchLanguage'
import { useEnv } from '@/context/envProvider'
import { goKefu, onLogout } from '@/utils/navigator'

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
    <Tooltip placement="bottomRight" title={<FormattedMessage id="admin.message.myMessage" />}>
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

export const HeaderRightContent = () => {
  const [accountTabActiveKey, setAccountTabActiveKey] = useState('1') // 1 真实账户 2模拟账户
  const renderAccountBoxHover = () => {
    const list = [
      { label: '總資產凈值', value: 100, tips: '立即關閉所有當前未結頭寸的新餘額估值' },
      { label: '浮動盈虧', value: 200, tips: '當上倉位的浮動收益' },
      { label: '可用', value: 300, tips: '可用於開立新頭寸的資金' },
      { label: '占用', value: 400, tips: '我們為維持您當前持倉持有的資金' }
    ]
    return (
      <div className="z-[999] group-hover:block xl:absolute xl:top-[53px] hidden xl:shadow-dropdown xl:border xl:border-[#f3f3f3] min-h-[338px] rounded-b-xl rounded-tr-xl bg-white pb-1 xl:min-w-[380px] xl:pt-[18px]">
        <div
          onClick={() => {
            // push('/trade')
          }}
          className="mb-[26px] cursor-pointer px-[18px]"
        >
          {list.map((item, idx) => (
            <div className="mt-6 flex flex-wrap items-center justify-between text-gray-weak" key={idx}>
              <span className="text-gray">{item.label}</span>
              <Tooltip overlayClassName="max-w-[300px]" placement="top" title={item.tips}>
                <span className="ml-[5px]">
                  <img src="/img/warring_icon.png" className="h-4 w-4 p-0" />
                </span>
              </Tooltip>
              <span className="my-0 ml-[18px] mr-[23px] h-[1px] flex-1 border-t-[1px] border-dashed border-gray-250"></span>
              <span className="max-w-[240px] break-all text-right font-bold text-gray">{item.value} USD</span>
            </div>
          ))}
        </div>
        <div className="mb-[13px] px-[18px]">
          <div className="flex justify-between">
            <Button className="!ml-0 text-sm max-xl:w-[48%] xl:w-[165px]">
              <img src="/img/rujin_icon.png" width={20} height={20} />
              <span>入金</span>
            </Button>
            <Button
              className="!ml-0 text-sm max-xl:w-[48%] xl:w-[165px]"
              onClick={() => {
                // if (isMobileOrIpad) {
                //   push('/user/cashOut')
                // } else {
                //   props.user.navIndex = 3 // 激活侧边栏入金卡片
                //   push('/user')
                // }
              }}
            >
              <img src="/img/chujin_icon.png" width={20} height={20} />
              <span>出金</span>
            </Button>
          </div>
          <div className="mt-[10px]">
            <Button
              className="!ml-0 w-full text-sm"
              onClick={() => {
                //
              }}
            >
              <img src="/img/user_tab_icon4@2x.png" width={20} height={20} />
              <span>出入金记录</span>
            </Button>
          </div>
        </div>
        <div className="px-[18px] py-0 xl:border-t-[2px] xl:border-[rgba(218,218,218,0.2)]">
          <div className="my-3 flex items-center justify-between">
            <Tabs
              items={[
                { label: '真实账户', key: '1' },
                { label: '模拟账户', key: '2' }
              ]}
              onChange={(key) => {
                setAccountTabActiveKey(key)
              }}
              activeKey={accountTabActiveKey}
            />
            <div
              onClick={() => {
                // jumpMyAccount()
              }}
              className="cursor-pointer text-primary max-xl:text-right"
            >
              管理账户
            </div>
          </div>
          {[{}, {}].map((item, ind) => {
            return (
              <div
                onClick={() => {
                  // switchAccount(item)
                  // if (isMobileOrIpad) {
                  //   hoverAccountBoxPopupRef?.current?.close()
                  // }
                }}
                key={ind}
                className="mb-[14px] cursor-pointer rounded-lg border border-gray-250 pb-[6px] pl-[11px] pr-[11px] pt-[11px] hover:bg-[#fbfbfb]"
              >
                <div className="flex justify-between">
                  <div className="flex">
                    <div className="flex-1 text-sm font-bold text-gray">标准账户 / 500002</div>
                    <div className="ml-[10px] flex px-1">
                      <div
                        className={classNames(
                          'flex h-5 min-w-[42px] items-center justify-center rounded bg-yellow-500 px-1 text-xs font-normal text-gray',
                          {
                            // '!bg-green !text-white': item?.accountType === 'Demo'
                            '!bg-green !text-white': true
                          }
                        )}
                      >
                        真实
                      </div>
                      <div className="ml-[6px] flex h-5 min-w-[42px] items-center justify-center rounded bg-black text-xs font-normal text-white">
                        MT
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-1">
                  <div>
                    <span className="font-num text-[24px] font-medium text-gray">4033.58</span>{' '}
                    <span className="ml-1 text-sm font-normal text-gray-secondary">USD</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center">
      <div className="flex items-center gap-x-[26px] mr-[28px]">
        <div className="flex items-center">
          <div className="flex flex-col items-end group">
            <span className="text-xl font-dingpro-medium text-gray">1000.00 USD</span>
            <div className="flex items-center pt-[2px]">
              <span className="text-xs text-blue font-dingpro-medium">真实</span>
              <div className="w-[1px] h-[10px] mx-[6px] bg-gray-200"></div>
              <span className="text-xs text-gray-500">#59528031</span>
            </div>
            {renderAccountBoxHover()}
          </div>
          <div className="w-[1px] h-[26px] ml-3 mr-2 bg-gray-200"></div>
          <div>
            <img src="/img/uc/select.png" width={24} height={24} />
          </div>
        </div>
        <Dropdown
          placement="topRight"
          dropdownRender={(origin) => {
            return (
              <div className="flex p-5 bg-white w-[290px] z-[800] rounded-xl shadow-dropdown">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <img src="/img/user-icon.png" width={40} height={40} />
                    <div className="flex flex-col pl-[14px]">
                      <span className="text-gray font-semibold">
                        <CopyComp style={{ display: 'flex', alignItems: 'center' }}>HI,151…1450</CopyComp>
                      </span>
                      <span className="text-green text-xs pt-[6px]">已認證</span>
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
          <img src="/img/uc/user.png" width={36} height={36} className=" cursor-pointer rounded-lg hover:bg-gray-80" />
        </Dropdown>
        <img src="/img/uc/kefu.png" width={36} height={36} className=" cursor-pointer rounded-lg hover:bg-gray-80" />
        <img src="/img/uc/quan.png" width={36} height={36} className=" cursor-pointer rounded-lg hover:bg-gray-80" />
        <img src="/img/uc/caidan.png" width={36} height={36} className=" cursor-pointer rounded-lg hover:bg-gray-80" />
      </div>
      <SwitchLanguage />
    </div>
  )
}
