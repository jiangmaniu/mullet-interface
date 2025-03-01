import { STORAGE_GET_TOKEN } from './utils/storage'

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: User.UserInfo } | undefined) {
  const { currentUser } = initialState ?? {}

  return {
    // 登录可见
    // canAdmin: currentUser && currentUser.appId
    canAdmin: !!STORAGE_GET_TOKEN()
    // canUpdateFoo: role === 'admin',
    // canDeleteFoo: (foo) => {
    //   return foo.ownerId === userId;
    // },
  }
}
