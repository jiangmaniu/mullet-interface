import { PRIVY_APP_ID, PRIVY_CLIENT_ID } from '@/constants/config'
import { getAccessToken } from '@privy-io/react-auth'
import Cookies from 'js-cookie'
import pkg from '../../package.json'

/**
 * 退出 Privy 登录（可在任何地方调用））
 */
export async function privyLogout() {
  let refreshToken: any = localStorage.getItem('privy:refresh_token')
  try {
    refreshToken = refreshToken ? JSON.parse(refreshToken) : ''
  } catch (error) {}

  const accessToken = (await getAccessToken()) as string
  const authVersionName = pkg.dependencies['@privy-io/react-auth'].replace('^', '')

  try {
    // 1. 调用 Privy 的退出 API
    const response = await fetch('https://auth.privy.io/api/v1/sessions/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 如果需要，添加 Authorization 头
        Authorization: `Bearer ${accessToken}`,
        'Privy-App-Id': PRIVY_APP_ID,
        'Privy-Client-Id': PRIVY_CLIENT_ID,
        'Privy-Client': `react-auth:${authVersionName}`
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    })

    // 2. 检查响应状态
    if (!response.ok) {
      throw new Error(`退出失败: ${response.statusText}`)
    }

    // 3. 清除本地存储的 Privy 相关数据
    localStorage.removeItem('privy:token')
    localStorage.removeItem('privy:refresh_token')
    localStorage.removeItem('privy:pat')
    Cookies.remove('privy-token')
    Cookies.remove('privy-session')

    console.log('退出成功！')
    return true
  } catch (error) {
    console.error('退出失败:', error)
    return false
  }
}
