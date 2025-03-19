import { makeAutoObservable, observable, runInAction } from 'mobx'

import { getFundsMethodPageList, getWithdrawalAddressList } from '@/services/api/wallet'

export class WalletStore {
  constructor() {
    makeAutoObservable(this)
  }
  @observable depositMethods = [] as Wallet.fundsMethodPageListItem[] // 付款方式
  @observable depositMethodInitialized = 0 // 付款方式是否初始化
  @observable withdrawalMethods = [] as Wallet.fundsMethodPageListItem[] // 提现方式
  @observable withdrawalMethodInitialized = 0 // 提现方式是否初始化
  @observable withdrawalAddress = [] as Wallet.WithdrawalAddress[] // 提现地址

  // 从后端同步支付方式
  getDepositMethods = async ({ language = 'ZHTW' }: { language?: Wallet.Language }) => {
    const res = await getFundsMethodPageList({ fundsType: 'DEPOSIT', current: 1, size: 1000, language })
    runInAction(() => {
      if (res.data) {
        this.depositMethods = res.data.records
        this.depositMethodInitialized = Date.now().valueOf()
      }
    })
  }

  // 从后端同步提现方式
  getWithdrawalMethods = async ({ language = 'ZHTW' }: { language?: Wallet.Language }) => {
    const res = await getFundsMethodPageList({ fundsType: 'WITHDRAWAL', current: 1, size: 1000, language })
    runInAction(() => {
      if (res.data) {
        this.withdrawalMethods = res.data.records
        this.withdrawalMethodInitialized = Date.now().valueOf()
      }
    })
  }

  // 从后端同步提现地址
  getWithdrawalAddressList = async () => {
    const res = await getWithdrawalAddressList()
    runInAction(() => {
      if (res.data) {
        this.withdrawalAddress = res.data.records
      }
    })
  }

  // ========== 全局页面初始化执行 ================
}

const wallet = new WalletStore()

export default wallet
