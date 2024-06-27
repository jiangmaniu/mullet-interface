declare namespace Customer {
  // 客户分页
  type ListItem = {
    /**
     * 账号
     */
    account?: string
    /**
     * 地址
     */
    address?: string
    /**
     * 头像
     */
    avatar?: string
    /**
     * 生日
     */
    birthday?: string
    /**
     * 客户组ID
     */
    clientGroupId?: number
    /**
     * 用户编号
     */
    code?: string
    /**
     * 创建部门
     */
    createDept?: number
    /**
     * 创建时间
     */
    createTime?: string
    /**
     * 创建人
     */
    createUser?: number
    /**
     * 部门id
     */
    deptId?: string
    /**
     * 邮箱
     */
    email?: string
    /**
     * 主键
     */
    id?: number
    /**
     * 是否绑定银行卡
     */
    isBankcardBind?: boolean
    /**
     * 是否已删除
     */
    isDeleted?: number
    /**
     * 是否KYC认证
     */
    isKycAuth?: boolean
    /**
     * KYC身份认证ID
     */
    kycAuthId?: number
    /**
     * 昵称
     */
    name?: string
    /**
     * 手机
     */
    phone?: string
    /**
     * 岗位id
     */
    postId?: string
    /**
     * 真名
     */
    realName?: string
    /**
     * 备注
     */
    remark?: string
    /**
     * 角色id
     */
    roleId?: string
    /**
     * 性别
     */
    sex?: number
    /**
     * 业务状态
     */
    status?: number
    /**
     * 租户ID
     */
    tenantId?: string
    /**
     * 更新时间
     */
    updateTime?: string
    /**
     * 更新人
     */
    updateUser?: number
    /**
     * 用户平台
     */
    userType?: number
    userInfo?: {
      id: string
      createUser: string
      createDept: number
      createTime: string
      updateUser: string
      updateTime: string
      status: number
      isDeleted: number
      tenantId: string
      code: string
      userType: number
      account: string
      password: string
      name: string
      realName: string
      avatar: string
      email: string
      phone: string
      birthday: string
      sex: number
      roleId: string
      deptId: string
      postId: string
    }
    children?: User.AccountItem[]
    accountList?: User.AccountItem[]
  }
  // 修改或新增
  type AddOrUpdateParams = {
    /**
     * 主健ID
     */
    id?: number
    /**
     * 账号
     */
    account: string
    /**
     * 地址
     */
    address?: string
    /**
     * 头像
     */
    avatar?: string
    /**
     * 生日
     */
    birthday?: string
    /**
     * 客户组ID
     */
    clientGroupId?: number
    /**
     * 邮箱
     */
    email?: string
    /**
     * 昵称
     */
    name?: string
    /**
     * 密码【加密】
     */
    password?: string
    /**
     * 手机
     */
    phone?: string
    /**
     * 真名
     */
    realName?: string
    /**
     * 备注
     */
    remark?: string
    /**
     * 性别
     */
    sex?: number
  }
}
