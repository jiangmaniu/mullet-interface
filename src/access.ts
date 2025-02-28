/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: User.UserInfo } | undefined) {
  const { currentUser } = initialState ?? {}
  return {
    // 登录可见
    // canAdmin: currentUser && currentUser.appId
    // canAdmin: !!STORAGE_GET_TOKEN()
    // 不在拦截跳转403页面，没有token触发接口请求401直接跳转登录页面
    canAdmin: true
    // canUpdateFoo: role === 'admin',
    // canDeleteFoo: (foo) => {
    //   return foo.ownerId === userId;
    // },
  }
}
