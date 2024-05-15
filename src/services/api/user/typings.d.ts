declare namespace User {
  export interface CustomerAccountInfo {
    /**
     * 交易账号
     */
    account: number
    /**
     * 账号组别 真实-标准账户 Standard 真实-微账户Mini 模拟账户Demo
     */
    accountGroup: string
    /**
     * 账号类型 真实Real 模拟Demo
     */
    accountType: string
    /**
     * 激活时间
     */
    activationTime: string
    /**
     * 渠道号
     */
    appId: string
    /**
     * 邀请人交易账号
     */
    inviterAccount: string
    /**
     * 邀请时间
     */
    inviteTime: string
    /**
     * 是否启用
     */
    isEnabled: boolean
  }
  // 用户基本信息
  export type UserInfo = {
    /**
     * 交易账号相关信息
     */
    accountInfos: CustomerAccountInfo[]
    /**真实-标准账户 */
    realStandardAccount: number
    /**真实-微账户 */
    realMiniAccount: number
    /**模拟-账户 */
    demoAccount: number
    /**
     * 区号
     */
    areaCode: string
    /**
     * 证件国家Id
     */
    cardCountry: number
    /**
     * 证件国家名称
     */
    cardCountryName: string
    /**
     * 证件号码
     */
    cardNumber: string
    /**
     * 证件类型 1=身份证 2=护照 3=驾照 4=居民许可证
     */
    cardType?: number
    /**
     * 国家Id
     */
    country: number
    /**
     * 国家名称
     */
    countryName: string
    /**
     * 邮箱
     */
    email: string
    /**
     * 名
     */
    firstName: string
    /**
     * 实名认证审核失败原因
     */
    idCardFailedReason: string
    /**
     * 是否实名认证通过
     */
    isCardChecked: boolean
    /**
     * 姓
     */
    lastName: string
    /**
     * 姓名
     */
    name: string
    /**
     * 实名认证状态 1=待审核 2=审核通过 3=未通过
     */
    passportCheckStatus?: number
    /**
     * 手机号
     */
    phone: string
    /**
     * 用户Id
     */
    userId?: number
  }
  // 登录参数
  type LoginParams = {
    username: string
    password: string
  }
  // 登录返回结果
  type LoginResult = Partial<{ expireInSeconds?: number; token: string }>
  // 注册参数
  type RegisterParams = {
    lastName: string
    firstName: string
    email: string
    country: string
    countryName: string
    areaCode: string | number
    phone: string | number
    whatsApp?: string | number
    suggestion?: string
    agreement?: boolean
    agreement1?: boolean
    agreement2?: boolean
  }
  // type RegisterParams = {
  //   phoneOrEmail: string
  //   /**  1手机 2邮箱 */
  //   registerType: 1 | 2
  //   checkCode: string
  //   password: string
  //   areaCode?: string
  //   inviterAccount?: string | number
  //   country?: number
  //   appId?: string | number
  //   clientType?: number
  //   clientId?: string
  //   version?: string
  //   ip?: string
  // }
  // 获取发送短信、邮箱验证码参数
  type CaptchaParams = {
    geeTestParam: API.GeeTestParam
    reciveAccount: string | undefined
    /**
     * @title 注册账号（开户）：
     * @name 1发送手机验证码
     * @name 4发送邮箱验证码
     * @title 修改或绑定手机/邮箱：
     * @name 2发送新手机/邮箱验证码
     * @name 7发送原手机/邮箱验证码
     *
     * @name 6 提币的时候用来发送手机或邮箱验证码
     */
    sendType: 1 | 2 | 4 | 6 | 7
    /** 手机区号 */
    areaCode?: string
  }
  // 区域列表
  type AreaCodeItem = {
    areaCode: string
    areaGroup: string
    areaId: number
    areaName: string
    areaNameZh: string
  }
  // 重置手机、邮箱登录密码
  type ResetPwdParams = {
    /**账号 */
    phoneOrEmail: string
    /**手机区号 */
    areaCode?: string
    password: string
    /**验证码 */
    valideCode: string
    /**1 手机 2 邮箱 */
    valideType: 1 | 2
  }
  // 绑定手机或邮箱
  type BindPhoneOrEmailParams = {
    /**1 绑定手机 2绑定邮箱 */
    bindType: 1 | 2
    emailOrPhone: string
    emailCheckCode: string
    phoneCheckCode: string
    areaCode?: string
    country?: string
    countryName?: string
  }
  // 修改绑定手机或邮箱
  type ModifyBindPhoneOrEmailParams = {
    /**1 修改手机 2修改邮箱 */
    bindType: 1 | 2
    emailOrPhone: string
    newCheckCode: string
    oldCheckCode: string
    /**手机区号 */
    areaCode?: string
    /**国家 */
    country?: number
    /**国家名称 */
    countryName?: string
  }
  // 修改密码
  type ModifyPwdParams = {
    /**确认密码 */
    confirmNewPassword: string
    /**新密码 */
    newPassword: string
    /**验证类型： 1手机 2邮箱 */
    validateType: number
    checkCode: string | number
  }
  // 实名认证
  type VerifiedParams = {
    /**国家名称 */
    cardCountryName: string
    /**国家areaId */
    cardCountry: number
    firstName: string
    lastName: string
    /**
     * 证件类型 1=身份证 2=护照 3=驾照 4=居民许可证
     */
    idType: 1 | 2 | 3 | 4
    /**证件号 */
    idNumber: string
    /**证件图片 */
    idImageName: string
    /**证件手持图片名称 */
    idScImageName: string
  }
}
