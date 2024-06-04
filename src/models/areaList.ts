export default function AreaList() {
  // 使用ahooks
  // const { data, loading } = useRequest(async () => {
  //   const res = await getAreaDataList()
  //   if (res.success) {
  //     // @ts-ignore
  //     const data = res.result
  //     return data
  //   }
  //   return []
  // })
  // return {
  //   data,
  //   loading
  // }
  return {
    data: []
  }
}
