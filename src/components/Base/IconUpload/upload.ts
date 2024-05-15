import axios from 'axios'

export const upload = async ({ file, module, fileType }: any) => {
  return new Promise(async (resolve, reject) => {
    let form = new FormData()
    // form.append('token', '');
    form.append('file', file)

    try {
      // 上传地址 @TODO
      let res = await axios.post('/api/upload', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      resolve(res.data)
    } catch (e) {
      reject(e)
    }
  })
}
