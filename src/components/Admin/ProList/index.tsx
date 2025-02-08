import { ProList, ProListProps } from '@ant-design/pro-components'
import type { ParamsType } from '@ant-design/pro-provider'
import { useModel } from '@umijs/max'

import Empty from '@/components/Base/Empty'

interface IProps<T, U> extends ProListProps<T, U> {
  /**列表增删改接口 */
  action?: {
    query: (params: U) => Promise<any>
    create?: (params: U) => Promise<any>
    update?: (params: U & { id: string | number }) => Promise<any>
    del?: (params: any) => Promise<any>
    info?: (params: any) => Promise<any>
  }
}

export default <T extends Record<string, any>, U extends ParamsType = ParamsType>({ pagination, action, ...res }: IProps<T, U>) => {
  const { setHasProList } = useModel('global')
  return (
    <ProList<T, U>
      pagination={
        pagination === false
          ? false
          : {
              pageSize: 10,
              showLessItems: true,
              showSizeChanger: false, // 不显示分页大小切换
              showTotal: undefined,
              // @ts-ignore TODO： ts check 待驗證
              align: 'center',
              hideOnSinglePage: true, // 在没有数据或只有一页数据时隐藏分页栏
              ...(pagination || {})
            }
      }
      locale={{ emptyText: <Empty /> }}
      postData={(data: T[]) => {
        // 在全局设置列表数据状态，方便统一设置
        setHasProList(data?.length > 0)
        return data
      }}
      request={async (params: U, sort, filter) => {
        const queryParams: any = {
          ...params
        }
        // if (Object.keys(sort).length) {
        //   let sortField
        //   Object.keys(sort).forEach((key) => {
        //     sortField = sort[key] === 'ascend' ? key : `${key} desc`
        //   })
        //   queryParams.sort = sortField
        // }
        console.log(sort, filter)

        // 这里需要返回一个 Promise,在返回之前你可以进行数据转化、如果需要转化参数可以在这里进行修改
        const res = await action?.query(queryParams)

        const records = res?.data?.records || []
        const isArray = Array.isArray(res?.data)
        const dataList = isArray ? res.data : records
        const total = isArray ? dataList.length : res?.data?.total

        const result = {
          data: dataList,
          success: res?.success,
          total
        }

        setHasProList(dataList?.length > 0)

        return result
      }}
      {...res}
    />
  )
}
