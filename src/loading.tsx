import { PageLoading } from '@ant-design/pro-components'
import { ConfigProvider } from 'antd'

import { gray } from './theme/theme.config'

// 全局加载组件
// Umi 4 默认 按页分包 ，从而在页面切换时存在加载过程，通过该文件来配置加载动画
export default () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: gray['900']
        }
      }}
    >
      <PageLoading />
    </ConfigProvider>
  )
}
