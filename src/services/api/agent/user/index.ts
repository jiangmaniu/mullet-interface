import { requestCrmAgentApi } from '..'

/**获取账户类型 0 普通客户 1 机构客户 */
export async function getAgentType(params: { account: number }) {
  return await requestCrmAgentApi<'0' | '1'>('agent/getAgentType')({ params })
}

/**名下用户-列表 */
export async function getSubordinateUserList(params: Agent.PageParams) {
  return await requestCrmAgentApi<AgentUser.SubordinateUserItem>('agent/getSubordinateUserList')({ params })
}

/**名下用户-修改下级返佣-查看 */
export async function agentUpdateInfo(params: { account: number | string }) {
  return requestCrmAgentApi<AgentUser.AgentUpdateInfo>('agent/agentUpdateInfo')({ params })
}

/**名下用户-修改下级返佣/客户升级--修改/升级 */
export async function agentUpdate(params: AgentUser.AgentUpdateParams) {
  return requestCrmAgentApi<AgentUser.AgentUpdateInfo>('agent/agentUpdate')({ params, showErrorMessage: true })
}

/**名下用户-导出 */
export async function exportSubordinateUserList() {
  return requestCrmAgentApi<string>('agent/exportSubordinateUserList')({ showErrorMessage: true })
}

/** 名下用户-交易信息-持仓-列表 */
export async function positionDetail(params: AgentUser.PositionParams) {
  return requestCrmAgentApi<AgentUser.PositionData>('agent/reports/positionDetail')({ params })
}

/**名下用户-交易信息-平仓-列表 */
export async function closeOrderDetail(params: AgentUser.CloseOrderParams) {
  return requestCrmAgentApi<AgentUser.CloseOrderData>('agent/reports/closeOrderDetail')({ params })
}

/** 名下用户-交易信息-返佣明细-列表 */
export async function tradeInfoDetails(params: AgentCommission.TradeInfoDetailsParams) {
  return requestCrmAgentApi<AgentCommission.TradeInfoDetailsData>('agent/tradeInfoDetails')({ params })
}

/** 名下用户-交易信息-返佣明细-导出 */
export async function exportTradeInfoDetails(params: AgentCommission.TradeInfoDetailsParams) {
  return requestCrmAgentApi<string>('agent/exportTradeInfoDetails')({ params, showErrorMessage: true })
}

/**名下用户-交易信息-资金明细-列表 */
export async function bankrollInfo(params: AgentUser.UserBankrollInfoParams) {
  return requestCrmAgentApi<AgentUser.UserBankrollData>('agent/reports/bankrollInfo')({ params })
}
