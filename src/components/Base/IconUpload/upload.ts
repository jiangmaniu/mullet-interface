import { fileUpload } from '@/services/api/common'

export const upload = async ({ file, module, fileType }: any) => {
  return new Promise(async (resolve, reject) => {
    let form = new FormData()
    // form.append('token', '');
    form.append('file', file)

    try {
      // 上传地址
      let res = await fileUpload({ file })
      resolve(res)
    } catch (e) {
      reject(e)
    }
  })
}
