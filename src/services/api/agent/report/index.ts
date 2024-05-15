import { requestCrmAgentApi } from '..'

type DateParams = {
  startDate?: string
  endDate?: string
}

/**报表预览-名下客户持仓报表-列表 */
export async function userPositionsCount(params: AgentReport.UserPositionReportParams) {
  return requestCrmAgentApi<AgentReport.UserPositionReportData>('agent/reports/userPositionsCount')({ params })
}

/**报表预览-名下客户持仓报表-导出 */
export async function exportUserPositionsCount(params: AgentReport.UserPositionReportParams) {
  return requestCrmAgentApi<string>('agent/reports/exportUserPositionsCount')({ params, showErrorMessage: true })
}

/**报表预览-名下客户平仓报表-列表 */
export async function userClosePositionsCount(params: AgentReport.UserCloseReportParams) {
  return requestCrmAgentApi<AgentReport.UserCloseReportData>('agent/reports/userClosePositionsCount')({ params })
}

/**报表预览-名下客户平仓报表-导出 */
export async function exportUserClosePositionsCount(params: AgentReport.UserCloseReportParams) {
  return requestCrmAgentApi<string>('agent/reports/exportUserClosePositionsCount')({ params, showErrorMessage: true })
}

/**报表预览-名下客户资金报表-列表 */
export async function bankrollCountnew(params: AgentReport.UserBankrollReportParams) {
  return requestCrmAgentApi<AgentReport.UserBankrollReportData>('agent/reports/bankrollCountnew')({ params })
}

/**报表预览-名下客户资金报表-导出 */
export async function exportBankrollCountNew(params: AgentReport.UserBankrollReportParams) {
  return requestCrmAgentApi<string>('agent/reports/exportBankrollCountnew')({ params, showErrorMessage: true })
}

/**报表预览-名下客户盈亏报表-列表 */
export async function tradeCount(params: AgentReport.UserProfitLossReportParams) {
  return requestCrmAgentApi<AgentReport.UserProfitLossReportData>('agent/reports/tradeCount')({ params })
}
/**报表预览-名下客户盈亏报表-导出 */
export async function exportTradeCount(params: AgentReport.UserProfitLossReportParams) {
  return requestCrmAgentApi<string>('agent/reports/exportmcptradeCount')({ params, showErrorMessage: true })
}
