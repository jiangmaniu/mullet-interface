declare namespace Fund {
  type MTFundsInfo = {
    /**账户余额 */
    balance: number
    /**净值 */
    equity: number
    /**保证金 */
    margin: number
    /**可用保证金 */
    marginfree: number
  }
  // 新增或修改提币地址
  type AddOrUpdateCoinsAddressParams = {
    id?: number
    chainName: string
    coinsAddress: string
    remark: string
    isDefault: boolean
  }
  // 提币地址
  type MyCoinsListItem = {
    id: number
    account: number
    chainName: string
    coinsAddress: string
    remark: string
    isDefault: boolean
    type: number
    modifyTime: string
  }
  // 申请提币参数
  type ApplyOutMarginParams = {
    /**@name 提币金额 */
    amount: number
    /**@name 申请方式 1=USDT数字钱包 2=银行卡 */
    channel: number
    /**@name 付款方式 5=USDT数字钱包 2=银行卡 */
    paymentType: number
    /**@name 链名称/银行名称 */
    chainName: string
    /**@name 链币地址/银行卡号 */
    chainCoinAddress: string
    /**@name 密码 */
    password: string
    /**1手机 2邮箱 */
    validateType: 1 | 2
    /**@name 手机或邮箱验证码 */
    validateCode: string
    /**@name 手机或邮箱 */
    validateAccount: string
    /**@name 登录的真实账户id */
    account: number
    /**@name 到账金额类型 1=印尼盾 2=卢比 */
    arrivedAmountType?: number
  }
  type PaymentInfo = {
    weight: number
    isEnable: boolean
    paymentName: string
    icon: string | null
    platform: number
    platformMsg: string
    paymentMethod: number
    paymentMethodMsg: string
    paymentParameter: string
    paymentParameterDic: { [key: string]: number[] }
    showMoneys: string
    wapShowMoney: string
    subheading: string
    message: string
    isEnableCustomMoney: boolean
    limitMoney: number
    customerTypes: string
    showMoneyParameter: string
    showMoneyParameterDic: { [key: string]: ShowMoneyParameter }
    currencyType: number
    currencyTypeMsg: string
    createTime: string
    createUserName: string
    modifiedUserName: string
    modifiedTime: string
    sicAccount: string
    isMarkerBank: boolean
    id: number
  }
  type ShowMoneyParameter = {
    subheading: string
    message: string
    isEnableCustomMoney: boolean
    limitMoney: number
    showMoney: string
  }
  type PaymentResponse = {
    result: {
      dataType: number
      result: {
        unPayOrder: any
        paymentList: PaymentInfo[]
      }
      payOrderCode: any
      businessOrderNumber: any
      payMentod: number
      paymentType: number
      qucikPaymentChannel: number
      qucikPaymentChannelName: any
    }
    targetUrl: any
    success: boolean
    error: any
    unAuthorizedRequest: boolean
    __abp: boolean
  }
  // 币种、网络地址
  type AntPlatCoinAddress = {
    address: string
    assetCoin: string
    assetType: string
    id: string
  }
}
