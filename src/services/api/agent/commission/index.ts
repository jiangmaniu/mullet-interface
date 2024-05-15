import { requestCrmAgentApi } from '..'

/**佣金管理-电子钱包-查询信息 */
export async function electronicWallet() {
  return requestCrmAgentApi<AgentCommission.ElectronicWalletData>('commissionManage/electronicWallet')({})
}

/**佣金管理-电子钱包-佣金转移提交 */
export async function extractCommission(params: AgentCommission.extractCommissionParams) {
  return requestCrmAgentApi<string>('commissionManage/extractCommission')({ params })
}

export async function getCommissionRecordList(params: AgentCommission.commissionRecordParams) {
  return requestCrmAgentApi<AgentCommission.commissionRecordData>('commissionManage/commissionhandledata')({ params })
}

/**佣金管理-返佣明细-列表 */
export async function tradeInfoDetails(params: AgentCommission.TradeInfoDetailsParams) {
  return requestCrmAgentApi<AgentCommission.TradeInfoDetailsData>('commissionManage/tradeInfoDetails')({ params })
}
/**佣金管理-返佣明细-导出 */
export async function exportTradeInfoDetails(params: Agent.TimeRange) {
  return requestCrmAgentApi<string>('settment/exportTradeInfoDetails')({ params, showErrorMessage: true })
}

/**佣金管理-返点标准信息查询 */
export async function getGroupsAndBackPoint() {
  return requestCrmAgentApi<AgentCommission.GroupsAndBackPointData>('agent/getGroupsAndBackPoint')({})
}
