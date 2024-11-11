import { request } from '@/utils/request'

// 获取我接收的消息列表
export async function getMyMessageList(params?: API.PageParam) {
  return request<API.Response<API.PageResult<Message.MessageItem>>>('/api/blade-message/message/my/list', {
    method: 'GET',
    params
  })
}

// 获取我接收详情
export async function getMyMessageInfo(params: API.IdParam) {
  return request<API.Response<Message.MessageItem>>('/api/blade-message/message/detail', {
    method: 'GET',
    params
  })
}

// 全部标记为已读
export async function readAllMessage() {
  return request<API.Response<number>>(`/api/blade-message/message/readAll`, {
    method: 'POST',
    skipErrorHandler: true
  })
}

// 获取未读消息数量
export async function getUnReadMessageCount() {
  return request<API.Response>(`/api/blade-message/message/unReadSize`, {
    method: 'POST'
  })
}
