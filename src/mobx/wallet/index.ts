import { makeAutoObservable, observable, runInAction } from 'mobx'

import { getFundsMethodPageList, getWithdrawalAddressList } from '@/services/api/wallet'

export class WalletStore {
  constructor() {
    makeAutoObservable(this)
  }
  @observable depositMethods = [] as Wallet.fundsMethodPageListItem[] // 付款方式
  @observable depositMethodInitialized = false // 付款方式是否初始化
  @observable withdrawalMethods = [] as Wallet.fundsMethodPageListItem[] // 提现方式
  @observable withdrawalMethodInitialized = false // 提现方式是否初始化
  @observable withdrawalAddress = [] as Wallet.WithdrawalAddress[] // 提现地址
  @observable withdrawalAddressInitialized = false // 提现地址是否初始化

  // 从后端同步支付方式
  getDepositMethods = async ({ language = 'ZHTW' }: { language?: Wallet.Language }) => {
    if (this.depositMethodInitialized) {
      return
    }
    const res = await getFundsMethodPageList({ fundsType: 'DEPOSIT', current: 1, size: 1000, language })
    runInAction(() => {
      if (res.data) {
        this.depositMethods = res.data.records
        this.depositMethodInitialized = true
      }
    })
  }

  // 从后端同步提现方式
  getWithdrawalMethods = async ({ language = 'ZHTW' }: { language?: Wallet.Language }) => {
    if (this.withdrawalMethodInitialized) {
      return
    }

    const res = await getFundsMethodPageList({ fundsType: 'WITHDRAWAL', current: 1, size: 1000, language })
    runInAction(() => {
      if (res.data) {
        this.withdrawalMethods = res.data.records
        this.withdrawalMethodInitialized = true
      }
    })
  }

  // 从后端同步提现地址
  getWithdrawalAddressList = async () => {
    if (this.withdrawalAddressInitialized) {
      return
    }

    const res = await getWithdrawalAddressList()
    runInAction(() => {
      if (res.data) {
        this.withdrawalAddress = res.data.records
        this.withdrawalAddressInitialized = true
      }
    })
  }

  // ========== 全局页面初始化执行 ================
}

const wallet = new WalletStore()

export default wallet
