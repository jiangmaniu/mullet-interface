import { onLogout } from '@/utils/navigator'

import { STORAGE_GET_TOKEN } from '@/utils/storage'
import { useEffect } from 'react'

/**
 * 自定义403无权限访问页面
 * @returns
 */
export default function Forbid() {
  // 403 暂时全部跳转到登录页面，后续有再进行权限判断 在access.ts中处理
  useEffect(() => {
    if (!STORAGE_GET_TOKEN()) {
      onLogout()
    }
  }, [])

  // return (
  //   <div>
  //     <Result
  //       status="403"
  //       title="403"
  //       subTitle="Sorry, you are not authorized to access this page."
  //       extra={
  //         <Button type="primary" onClick={() => push('/')}>
  //           Back Home
  //         </Button>
  //       }
  //       style={{ marginTop: 200 }}
  //     />
  //   </div>
  // )
  return <></>
}
