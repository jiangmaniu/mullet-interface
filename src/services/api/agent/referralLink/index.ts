import { requestCrmAgentApi } from '..'

// 获取推广链接信息
export async function getPromotionNumber() {
  return requestCrmAgentApi<Record<string, any>>('agent/getPromotionNumber')({})
}

/**根据推广码，获取邀请人信息 */
export async function getAgentByPromotionNumber(params: { promotionnumber: string }) {
  return await requestCrmAgentApi<AgentLink.AgentByPromotionNumberData>('agent/getAgentByPromotionNumber')({ params, isNeedAccount: false })
}

/**绑定代理人推广码 */
export async function saveAgentByPromotionNumber(params: { promotionnumber: string }) {
  return await requestCrmAgentApi<string>('agent/saveAgentByPromotionNumber')({ params, showErrorMessage: true })
}
