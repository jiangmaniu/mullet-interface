declare namespace User {
  // 用户基本信息 @TODO 后面提供接口在修改
  export type UserInfo = {
    name?: any
    imgUrl?: string
  } & LoginResult
  // 登录参数
  type LoginParams = {
    username?: string
    password?: string
    /**刷新token */
    refresh_token?: string
    /**租户ID：默认值 000000 */
    tenanId?: string
    /**登录传的类型，账户密码登录传account */
    type?: 'account'
    grant_type?: 'captcha' | 'password' | 'refresh_token'
    /**验证码 */
    captchaCode?: string
    scope?: 'all'
  }
  // 登录返回结果
  type LoginResult = Partial<{
    /**token */
    access_token: string
    /**token类型 headers['Authentication'] = 'Bearer ' + token */
    token_type: string
    refresh_token: string
    expires_in: number
    scope: string
    tenant_id: string
    user_name: string
    real_name: string
    avatar: string
    client_id: string
    role_name: string
    license: string
    post_id: string
    user_id: string
    role_id: string
    nick_name: string
    oauth_id: string
    detail: { type: string }
    dept_id: string
    account: string
    jti: string
  }>
  // 区域列表
  type AreaCodeItem = {
    areaCode: string
    areaGroup: string
    areaId: number
    areaName: string
    areaNameZh: string
  }
  // 图形验证码响应
  type Captcha = { key: string; image: string }
  /**菜单列表 */
  type MenuItem = {
    /**
     * 操作按钮类型
     */
    action?: number
    actionName?: string
    /**
     * 菜单别名
     */
    alias?: string
    /**
     * 菜单类型
     */
    category?: number
    categoryName?: string
    children?: MenuItem[]
    /**
     * 菜单编号
     */
    code?: string
    /**
     * 组件资源
     */
    component?: string
    hasChildren?: boolean
    id?: number
    /**
     * 是否已删除
     */
    isDeleted?: number
    /**
     * 是否打开新页面
     */
    isOpen?: number
    isOpenName?: string
    /**
     * 菜单名称
     */
    name?: string
    parentId?: number
    parentName?: string
    /**
     * 请求地址
     */
    path?: string
    /**
     * 备注
     */
    remark?: string
    /**
     * 排序
     */
    sort?: number
    /**
     * 菜单资源
     */
    source?: string
  }
}
