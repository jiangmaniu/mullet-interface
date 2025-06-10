/* eslint-disable simple-import-sort/imports */
import { QuestionCircleOutlined } from '@ant-design/icons'
import { FormattedMessage, SelectLang as UmiSelectLang, useLocation, useModel } from '@umijs/max'
import { Tooltip } from 'antd'
import { observer } from 'mobx-react'
import { useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import SwitchLanguage from '@/components/SwitchLanguage'
import SwitchTheme from '@/components/SwitchTheme'
import { useEnv } from '@/context/envProvider'
import { goKefu, push } from '@/utils/navigator'

import Button from '@/components/Base/Button'
import { useTheme } from '@/context/themeProvider'
import { getEnv } from '@/env'
import { HeaderTheme } from '../Header/types'
import AccountDropdown from './AccountDropdown'
import Message from './Message'
import TradeAccountDropdown from './TradeAccountDropdown'
import UserCenterAccountDropdown from './UserCenterAccountDropdown'

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
  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList || []
  const { pathname } = useLocation()
  const isTradePage = pathname.indexOf('/trade') !== -1
  const isBaseAuth = currentUser?.isBaseAuth
  const themeConfig = useTheme()
  const env = getEnv()

  const realAccountList = accountList.filter((item) => !item.isSimulate)

  return (
    <div className="flex items-center">
      <div className="flex items-center md:gap-x-[26px] md:mr-[28px] sm:gap-x-3 sm:mr-4 gap-x-2 mr-1">
        {isBaseAuth && (
          <Button
            onClick={() => {
              push(`/deposit`)
            }}
            type="default"
            // icon={<img src="/img/rujin_icon.png" width={20} height={20} />}
          >
            <div className="flex flex-row gap-1.5 items-center">
              <Iconfont name="rujin1" width={20} height={20} color={themeConfig.theme.isDark ? '#fff' : ''} />
              <span className=" w-[1px] h-[18px] bg-[#ddd] dark:bg-gray-570"></span>
              <FormattedMessage id="mt.rujin" />
            </div>
          </Button>
        )}
        {/* 交易页面账户信息下拉dropdown */}
        {isTradePage && <TradeAccountDropdown theme={theme} />}
        {/* 个人中心账户信息下拉dropdown */}
        {!isTradePage && realAccountList.length > 0 && <UserCenterAccountDropdown theme={theme} />}
        {/* 消息管理 */}
        <Message theme={theme} />
        {/* <Iconfont
          name="caidan"
          width={36}
          height={36}
          color={theme}
          className=" cursor-pointer rounded-lg"
          hoverStyle={{
            background: theme === 'black' ? '#fbfbfb' : '#222222'
          }}
        /> */}
        <Tooltip title={<FormattedMessage id="mt.gerenzhongxin" />} placement="bottom">
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
        </Tooltip>
        <Tooltip title={<FormattedMessage id="mt.zaixiankefu" />} placement="bottom">
          <Iconfont
            name="kefu"
            width={36}
            height={36}
            color={theme}
            className=" cursor-pointer rounded-lg"
            hoverStyle={{
              background: theme === 'black' ? '#fbfbfb' : '#222222'
            }}
            onClick={goKefu}
          />
        </Tooltip>
        {/* 账户信息下拉 */}
        <AccountDropdown theme={theme} />
      </div>
      {isTradePage && <SwitchTheme />}
      {!env.HIDE_SWITCH_LANGUAGE && <SwitchLanguage isAdmin={isAdmin} theme={theme} isTrade={isTrade} />}
    </div>
  )
})
