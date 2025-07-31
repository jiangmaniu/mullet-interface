import useHasPrivyWalletConnected from '@/hooks/web3/useHasPrivyWalletConnected'
import { onLogout } from '@/utils/navigator'
import { formatAddress } from '@/utils/web3'
import { useLogin, usePrivy, useSolanaWallets } from '@privy-io/react-auth'
import { FormattedMessage } from '@umijs/max'
import { Dropdown } from 'antd'
import Button from '../Base/Button'

// 钱包地址选择器
export default function WalletButton() {
  const { connectWallet, user, logout, authenticated } = usePrivy()
  const { login } = useLogin()
  const { wallets } = useSolanaWallets()
  const wallet = user?.wallet
  const address = wallet?.address || ('' as string)
  const foundWallet = wallets.find((w) => w.address === address)

  console.log('foundWallet', foundWallet)
  console.log('wallet', wallet)
  console.log('user', user)
  // 排除内嵌钱包登录（邮箱等账号登录）
  const { hasPrivyWalletConnected } = useHasPrivyWalletConnected()

  const handleWalletLogin = async () => {
    if (!hasPrivyWalletConnected) {
      // 如果是邮箱登录 先退出登录在连接
      await logout()
    }
    await login({ loginMethods: ['wallet'] })
  }

  return (
    <div>
      {/* {authenticated && hasPrivyWalletConnected ? <Dropdown */}
      {authenticated ? (
        <Dropdown
          menu={{
            onClick: async (e) => {
              const { key } = e
              if (key === 'logout') {
                // 先退出钱包，不会退出stellux的登录体系，再重新连接钱包
                // await logout()

                await onLogout()
              }
            },
            items: [
              {
                label: <div className="py-2 pl-1">Disconnect</div>,
                key: 'logout'
              }
            ]
          }}
        >
          <Button type="default">
            <div className="flex flex-row gap-1.5 items-center">
              <img src={foundWallet?.meta?.icon} alt="" className="w-4 h-4" />
              <span className="w-[1px] h-[18px] bg-[#ddd] dark:bg-gray-570"></span>
              {formatAddress(address)}
            </div>
          </Button>
        </Dropdown>
      ) : (
        <Button type="primary" onClick={handleWalletLogin}>
          <FormattedMessage id="mt.lianjieqianbao" />
        </Button>
      )}
    </div>
  )
}
