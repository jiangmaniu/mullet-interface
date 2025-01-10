import { PageLoading } from '@ant-design/pro-components'
import { ConfigProvider } from 'antd'

import { gray } from './theme/theme.config'
import { STORAGE_GET_THEME } from './utils/storage'

// 全局加载组件
// Umi 4 默认 按页分包 ，从而在页面切换时存在加载过程，通过该文件来配置加载动画
export default () => {
  const isTradePage = location.pathname.indexOf('/trade') !== -1
  const isDark = STORAGE_GET_THEME() === 'dark' && isTradePage
  const bgColor = document.body.style.background || '#fff'

  return (
    <div
      style={{
        background: isDark ? gray[675] : bgColor,
        width: isTradePage ? '100vw' : '100%',
        height: isTradePage ? '100vh' : '100%'
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: isDark ? '#f4f4f4' : gray['900']
          }
        }}
      >
        <PageLoading />
      </ConfigProvider>
    </div>
  )
}
