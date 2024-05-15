import { requestCrmAgentApi } from '..'

// 获取首页佣金统计信息
export async function getHomeInfo() {
  return requestCrmAgentApi<AgentHome.AgentHomeInfo>('index/data')({})
}

// 获取首页佣金统计信息-New
export async function getHomeCommissionList(params: Agent.PageParams) {
  return requestCrmAgentApi<{ total: number; commissions: AgentHome.CommissionItem[] }>('index/commissions')({ params })
}
