import { requestCrmAgentApi } from '..'

/**名下用户数据统计-列表 */
export async function getSubordinateUserDataList(params: AgentUserStatic.UserDataStatisticsParams) {
  return requestCrmAgentApi<AgentUserStatic.SubordinateUserListItem[]>('agent/getSubordinateUserData')({ params })
}
/**名下用户数据统计-指标卡信息 */
export async function getDailiSubordinateUserData(params: AgentUserStatic.UserDataStatisticsParams) {
  return requestCrmAgentApi<AgentUserStatic.UserDataStatisticsData>('agent/getDailiSubordinateUserData')({ params })
}
/**名下用户数据统计-导出 */
export async function exportSubordinateUserData(params: any) {
  return requestCrmAgentApi<string>('agent/exportSubordinateUserData')({ params, showErrorMessage: true })
}
