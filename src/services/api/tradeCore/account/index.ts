import { formatSymbolConf } from '@/utils/business'
import { request } from '@/utils/request'

// 账号交易品种及配置-集合
export async function getTradeSymbolList(params: Account.TradeSymbolListParams) {
  return request<API.Response<Account.TradeSymbolListItem[]>>('/api/trade-core/coreApi/account/tradeSymbolList', {
    method: 'GET',
    params
  }).then((res) => {
    const records = res.data || []
    if (records.length > 0 && res.data) {
      const list = records.map((item) => {
        const symbolConf = item.symbolConf
        item.symbolConf = formatSymbolConf(symbolConf)
        return item
      })
      res.data = list
    }
    return res
  })
}
