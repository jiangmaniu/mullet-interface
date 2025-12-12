import { AccountInfo } from './account-info'
import { DepositAssets } from './deposit-assets'
// import { LanguageChanger } from './language'
import { MainLayoutHeaderNav } from './nav'
import { Notification } from './notification'
// import { GlobalSetting } from './setting'
// import { WalletConnect } from './wallet-connect'

import { Image } from '@/libs/ui/components/images'
import { ThemeSwitcher } from './theme-switcher'

export const MainLayoutHeader = () => {
  return (
    <div className="py-small px-3xl bg-navigation backdrop-blur-base sticky top-[100px] z-1 flex justify-between gap-5">
      <div className="gap-4xl flex items-center justify-between">
        <div>
          <Image src="/icons/logo/mullet-long.svg" alt="logo" className="h-[48px] w-[130px]" width={130} height={48} />
        </div>

        <MainLayoutHeaderNav />
      </div>

      <div className="gap-2xl flex items-center">
        <DepositAssets />
        <Notification />

        {/* <DepositAssets /> */}
        {/* */}
        {/*

        <WalletConnect />

        <GlobalSetting />
        <LanguageChanger />
         */}
        <ThemeSwitcher />
        <AccountInfo />
      </div>
    </div>
  )
}
