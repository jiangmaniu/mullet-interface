import { request } from '@/utils/request'

// 上传文件
export async function fileUpload(body: any) {
  return request<API.Result>('/api/FileUpload/Upload', {
    method: 'POST',
    data: body
  })
}
