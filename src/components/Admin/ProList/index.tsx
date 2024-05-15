import { ProList, ProListProps } from '@ant-design/pro-components'
import type { ParamsType } from '@ant-design/pro-provider'
import { useModel } from '@umijs/max'
import { PaginationProps } from 'antd/es/pagination'

import Empty from '@/components/Base/Empty'

interface IProps<T, U> extends ProListProps<T, U> {
  /**@name 分页配置 */
  pagination?: false | PaginationProps
}

export default <T extends Record<string, any>, U extends ParamsType = ParamsType>({ pagination = {}, ...res }: IProps<T, U>) => {
  const { setHasProList } = useModel('global')
  return (
    <ProList<T, U>
      pagination={
        pagination === false
          ? false
          : {
              pageSize: 5,
              showLessItems: true,
              showSizeChanger: false, // 不显示分页大小切换
              showTotal: undefined,
              align: 'center',
              hideOnSinglePage: true, // 在没有数据或只有一页数据时隐藏分页栏
              ...pagination
            }
      }
      locale={{ emptyText: <Empty /> }}
      postData={(data: T[]) => {
        // 在全局设置列表数据状态，方便统一设置列表没有数据不显示导出按钮
        setHasProList(data?.length > 0)
        return data
      }}
      {...res}
    />
  )
}
