import { PageLoading } from '@ant-design/pro-components'
import { ConfigProvider } from 'antd'

import { gray } from './theme/theme.config'
import { STORAGE_GET_THEME } from './utils/storage'

// 全局加载组件
// Umi 4 默认 按页分包 ，从而在页面切换时存在加载过程，通过该文件来配置加载动画
export default () => {
  const isDark = STORAGE_GET_THEME() === 'dark' && location.pathname.indexOf('/trade') !== -1
  return (
    <div
      style={{
        background: isDark ? gray[800] : '#fff',
        width: '100%',
        height: '100%'
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
