import { AxiosResponse, getIntl } from '@umijs/max'
import { message } from 'antd'
import FileSaver from 'file-saver'
import JSZip from 'jszip'

import { request } from './request'

export const onDownloadImg = (files: any[], name: string) => {
  // 单个下载不打包
  if (files.length === 1) {
    let a = document.createElement('a') // 生成一个a元素
    let event = new MouseEvent('click') // 创建一个单击事件
    a.download = name // 设置图片名称
    a.href = files[0] // 将生成的URL设置为a.href属性
    a.dispatchEvent(event) // 触发a的单击事件
    return
  }
  // 打包多张图片下载
  let zip = new JSZip() // 创建压缩包
  let folder = zip.folder(name) as JSZip // 创建文件夹名称
  files.map((url, index: number) => {
    const p = url.split(',')[1] // 去掉base64前缀
    folder.file(`${index + 1}.png`, p, {
      base64: true
    })
  })
  zip.generateAsync({ type: 'blob' }).then(function (content) {
    FileSaver.saveAs(content, `${name}.zip`)
  })
}

/**
 * 下载二进制流文件
 * @param response Axios 响应对象
 */
export function handleDownloadBlobFile(response: AxiosResponse<Blob> | Blob, filename?: string): void {
  // 获取文件名称
  // @ts-ignore
  const disposition = response?.headers?.['content-disposition']
  let fileName = disposition ? decodeURI(disposition?.substring(disposition?.indexOf('filename=') + 9, disposition?.length)) : filename

  // 文件对象
  // @ts-ignore
  const blob = new Blob([response.data || response])

  // 非IE下载
  if ('download' in document.createElement('a')) {
    // 对象地址-创建
    const objectURL = URL.createObjectURL(blob)

    // a元素-创建
    let ele = document.createElement('a')
    // a元素-文件名
    ele.download = fileName as string
    // a元素-地址
    ele.href = objectURL
    document.body.appendChild(ele)
    // a元素-点击
    ele.click()
    document.body.removeChild(ele)
    // 对象地址-移除
    URL.revokeObjectURL(objectURL)
  }
}

/**
 * 下载文件
 */
export function handleDownload(url: string) {
  if (!url) return

  const fileName = url
    .split('/')
    .filter((v) => v)
    .at(-1) as string

  // a元素-创建
  let ele = document.createElement('a')
  // a元素-文件名
  ele.download = fileName
  // a元素-地址
  ele.href = url
  document.body.appendChild(ele)
  // a元素-点击
  ele.click()
  document.body.removeChild(ele)
}

/**
 * 下载报表
 * @param url 下载地址
 */
export function handleDownloadReport(url: string) {
  const fileName = url
    .split('/')
    .filter((v) => v)
    .at(-1) as string

  return request<Blob>(url, {
    method: 'GET',
    responseType: 'blob'
  })
    .then((res) => {
      handleDownloadBlobFile(res, fileName)
      message.success(getIntl().formatMessage({ id: 'common.opSuccess' }))
    })
    .catch((error) => {
      message.success(getIntl().formatMessage({ id: 'common.opFailed' }))
    })
}
