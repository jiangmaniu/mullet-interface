// import { Sentry } from 'umi'

// 上报错误之前设置用户信息
export const beforeCaptureSetUserInfo = () => {
  // const token = STORAGE_GET_TOKEN()
  // const currentUser = STORAGE_GET_USER_INFO() as User.UserInfo
  // // setTag 设置标签 设置完可以在后台看到对应的分类标签
  // // 保存用户token上报
  // if (token) {
  //   const { access_token, refresh_token, ...userInfo } = currentUser || {}
  //   const username = currentUser?.firstName ? `${currentUser?.lastName}.${currentUser?.firstName}` : currentUser?.userInfo?.name || 'unknow'
  //   // setUser 设置用户 比如在用户登陆授权之后，全程跟踪用户发生的错误
  //   Sentry.setUser({
  //     id: currentUser?.user_id as string,
  //     username,
  //     email: currentUser?.userInfo?.email,
  //     geo: {
  //       country_code: currentUser?.countryInfo?.areaCode,
  //       city: currentUser?.countryInfo?.nameCn,
  //       region: currentUser?.country
  //     }
  //   })
  //   // 设置自定义标签
  //   // https://docs.sentry.io/platforms/javascript/enriching-events/tags/
  //   // 设置git提交信息
  //   Sentry?.setTag?.('COMMITHASH', process.env.COMMITHASH)
  //   Sentry?.setTag?.('BRANCH', process.env.BRANCH)
  //   Sentry?.setTag?.('LASTCOMMITDATETIME', process.env.LASTCOMMITDATETIME)
  //   // 设置用户信息
  //   Sentry?.setTag?.('account', currentUser?.userInfo?.account)
  //   Sentry?.setTag?.('userId', currentUser?.userInfo?.id)
  //   Sentry?.setTag?.('lastLoginAddress', currentUser?.userInfo?.lastLoginAddress)
  //   Sentry?.setTag?.('lastLoginTime', currentUser?.userInfo?.lastLoginTime)
  //   Sentry?.setTag?.('lastLoginIp', currentUser?.userInfo?.lastLoginIp)
  //   Sentry?.setTag?.('phone', `${currentUser?.userInfo?.phoneAreaCode} ${currentUser?.userInfo?.phone}`)
  //   Sentry?.setTag?.('pageLocale', getLocale())
  //   // Sentry?.addBreadcrumb?.({
  //   //   category: 'blade-auth',
  //   //   message: `bearer ${token}`,
  //   //   level: 'info'
  //   // })
  //   Sentry?.addBreadcrumb?.({
  //     category: 'userInfo',
  //     message: JSON.stringify(userInfo),
  //     level: 'info'
  //   })
  // }
}
