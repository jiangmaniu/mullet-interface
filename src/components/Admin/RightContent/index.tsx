/* eslint-disable simple-import-sort/imports */
import { QuestionCircleOutlined } from '@ant-design/icons'
import { FormattedMessage, SelectLang as UmiSelectLang, useLocation, useModel } from '@umijs/max'
import { Tooltip } from 'antd'
import { observer } from 'mobx-react'
import { useRef, useState } from 'react'
import { useFundWallet as useEvmFundWallet } from '@privy-io/react-auth'
import { useFundWallet as useSolanaFundWallet } from '@privy-io/react-auth/solana'

import Iconfont from '@/components/Base/Iconfont'
import SwitchLanguage from '@/components/SwitchLanguage'
import SwitchTheme from '@/components/SwitchTheme'
import { useEnv } from '@/context/envProvider'
import { goKefu, push } from '@/utils/navigator'

import Button from '@/components/Base/Button'
import DepositModal from '@/components/Web/DepositWithdrawModal/DepositModal'
import WithdrawModal from '@/components/Web/DepositWithdrawModal/WithdrawModal'
import TransferCryptoDialog from '@/components/Web/TransferCryptoDialog'
import AddFundsMenu from '@/components/Web/AddFundsMenu'
import SwapDialog from '@/components/Web/SwapDialog'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { getEnv } from '@/env'
import usePrivyInfo from '@/hooks/web3/usePrivyInfo'
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
  const { hasWallet, wallets } = usePrivyInfo()
  const realAccountList = accountList.filter((item) => !item.isSimulate)
  const { fundWallet: fundEvmWallet } = useEvmFundWallet()
  const { fundWallet: fundSolanaWallet } = useSolanaFundWallet()

  const withdrawModalRef = useRef<any>(null)
  const depositModalRef = useRef<any>(null)
  const [showAddFundsMenu, setShowAddFundsMenu] = useState(false)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [showSwapDialog, setShowSwapDialog] = useState(false)
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo

  const handleCardClick = async () => {
    setShowAddFundsMenu(false)

    // 获取当前钱包地址
    const wallet = wallets?.[0]
    if (!wallet) {
      console.error('[Buy Crypto] No wallet found')
      return
    }

    const walletAddress = wallet.address
    console.log('[Buy Crypto] Wallet address:', walletAddress)

    // 检测是 Solana 还是 EVM 钱包
    const isSolanaAddress = walletAddress.length === 44 && !walletAddress.startsWith('0x')

    try {
      if (isSolanaAddress) {
        // Solana wallet - use Solana fundWallet
        console.log('[Buy Crypto] Opening Solana fundWallet for:', walletAddress)
        fundSolanaWallet({
          address: walletAddress,
          options: {
            amount: '10' // 默认 $10
          }
        })
      } else {
        // EVM wallet - use EVM fundWallet with mainnet chain
        console.log('[Buy Crypto] Opening EVM fundWallet for:', walletAddress)

        // 动态导入 viem/chains 以获取 mainnet 配置
        const { mainnet } = await import('viem/chains')

        fundEvmWallet({
          address: walletAddress,
          options: {
            chain: mainnet,
            asset: 'USDC', // 默认购买 USDC
            amount: '10' // 默认 $10
          }
        })
      }
    } catch (error) {
      console.error('[Buy Crypto] Failed to open fundWallet:', error)
    }
  }

  return (
    <div className="flex items-center">
      <div className="flex items-center md:gap-x-[26px] md:mr-[28px] sm:gap-x-3 sm:mr-4 gap-x-2 mr-1">
        {/* 入金 - 打开 Add Funds 菜单 */}
        <Button
          onClick={() => {
            setShowAddFundsMenu(true)
          }}
          type="default"
          disabled={!hasWallet}
        >
          <div className="flex flex-row gap-1.5 items-center">
            <Iconfont name="rujin1" width={20} height={20} color={themeConfig.theme.isDark ? '#fff' : ''} />
            <span className=" w-[1px] h-[18px] bg-[#ddd] dark:bg-gray-570"></span>
            <FormattedMessage id="mt.rujin" />
          </div>
        </Button>
        <Button
          onClick={() => {
            withdrawModalRef?.current.show()
          }}
          type="default"
        >
          <div className="flex flex-row gap-1.5 items-center">
            <Iconfont name="chujin" width={20} height={20} color={themeConfig.theme.isDark ? '#fff' : ''} />
            <span className=" w-[1px] h-[18px] bg-[#ddd] dark:bg-gray-570"></span>
            <FormattedMessage id="mt.chujin" />
          </div>
        </Button>
        {/* 钱包地址选择 */}
        {/* <WalletButton /> */}

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

      {/* 出入金弹窗 */}
      <WithdrawModal ref={withdrawModalRef} />
      <DepositModal ref={depositModalRef} />
      {/* Add Funds 菜单 */}
      <AddFundsMenu
        open={showAddFundsMenu}
        onClose={() => setShowAddFundsMenu(false)}
        onTransferClick={() => setShowTransferDialog(true)}
        onSwapClick={() => setShowSwapDialog(true)}
        onCardClick={handleCardClick}
      />
      {/* 跨链充值弹窗 */}
      <TransferCryptoDialog open={showTransferDialog} onClose={() => setShowTransferDialog(false)} />
      {/* 资产兑换弹窗 */}
      <SwapDialog
        open={showSwapDialog}
        onClose={() => setShowSwapDialog(false)}
        walletAddress={wallets?.[0]?.address || ''}
        network={
          wallets?.[0]?.address?.length === 44 && !wallets?.[0]?.address?.startsWith('0x')
            ? 'solana'
            : wallets?.[0]?.chainId?.includes('tron') || wallets?.[0]?.chainId?.startsWith('0x')
            ? 'ethereum'
            : 'ethereum'
        }
        walletSource={wallets?.[0]?.walletClientType || 'privy'}
      />
    </div>
  )
})
