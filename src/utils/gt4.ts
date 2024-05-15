interface IProps {
  onSuccess?: (result: API.GeeTestParam, captcha?: any) => void
  onReady?: () => void
  onClose?: () => void
  onError?: (error?: any, captcha?: any) => void
}
export const callGT4 = ({ onSuccess, onReady, onError, onClose }: IProps = {}) => {
  return new Promise<API.GeeTestParam>((resolve, reject) => {
    window.initGeetest4(
      {
        captchaId: '3a61dd369310fb302858122e9b1895ac',
        product: 'bind',
        language: 'eng'
      },
      function (captcha: any) {
        // captcha为验证码实例
        captcha
          .onReady(function () {
            //验证码ready之后才能调用showCaptcha方法显示验证码
            captcha.showCaptcha() //显示验证码
            onReady?.()
          })
          .onSuccess(function () {
            //your code,结合您的业务逻辑重置验证码
            const result = captcha.getValidate()
            if (!result) {
              // return alert(lang['请滑动验证码'])
              return
            }
            result.captcha_id = '3a61dd369310fb302858122e9b1895ac'
            //your code
            onSuccess?.(result, captcha)
            resolve(result)
            captcha.reset()
          })
          .onError(function (error: any) {
            console.log('onError')
            //your code
            onError?.(error, captcha)
            reject(error)
          })

        captcha.onClose(function () {
          console.log('取消了')
          // 用户把验证关闭了
          onClose?.()
        })
      }
    )
  })
}
