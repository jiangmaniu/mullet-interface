import usePrivyInfo from '@/hooks/web3/usePrivyInfo'
import { onLogout } from '@/utils/navigator'
import { formatAddress } from '@/utils/web3'
import { LogoutOutlined } from '@ant-design/icons'
import { useLogin } from '@privy-io/react-auth'
import { FormattedMessage } from '@umijs/max'
import { Dropdown } from 'antd'
import Button from '../Base/Button'

// 钱包地址选择器
export default function WalletButton() {
  const { user, connected, foundWallet, address, hasExternalWallet, reconnectWallet, connectWallet } = usePrivyInfo()
  const { login } = useLogin()
  // 排除内嵌钱包登录（邮箱等账号登录）

  const handleWalletLogin = async () => {
    // if (!hasPrivyWalletConnected) {
    // 如果是邮箱登录 先退出登录在连接
    //   await logout()
    // }
    // await login({ loginMethods: ['wallet'] })
  }

  const handleReconnectWallet = async () => {
    await connectWallet()
  }

  if (reconnectWallet) {
    return (
      <Button type="default" onClick={handleReconnectWallet}>
        <FormattedMessage id="mt.lianjieqianbao" />
      </Button>
    )
  }

  return (
    <div>
      {/* {authenticated && hasPrivyWalletConnected ? <Dropdown */}
      {connected && hasExternalWallet ? (
        <Dropdown
          menu={{
            onClick: async (e) => {
              const { key } = e
              if (key === 'logout') {
                // 先退出钱包，不会退出stellux的登录体系，再重新连接钱包
                // await logout()

                // 暂时先退出登录页面，后期再优化
                await onLogout()
              }
            },
            items: [
              {
                label: (
                  <div className="py-2 pl-1">
                    <FormattedMessage id="mt.tuichu" />
                  </div>
                ),
                key: 'logout',
                icon: <LogoutOutlined />
              }
            ]
          }}
        >
          <Button type="default">
            <div className="flex flex-row gap-1.5 items-center">
              {foundWallet?.meta?.icon && (
                <>
                  <img src={foundWallet?.meta?.icon} alt="" className="w-4 h-4" />
                  <span className="w-[1px] h-[18px] bg-[#ddd] dark:bg-gray-570"></span>
                </>
              )}
              {formatAddress(address)}
            </div>
          </Button>
        </Dropdown>
      ) : (
        <>
          {/* <Button type="primary" onClick={handleWalletLogin}>
            <FormattedMessage id="mt.lianjieqianbao" />
          </Button> */}
        </>
      )}
    </div>
  )
}
