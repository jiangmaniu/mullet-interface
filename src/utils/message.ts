import { message as antdMessage } from 'antd'
import { Toast } from 'antd-mobile'
import { ArgsProps } from 'antd/lib/message'
import { isPCByWidth } from '.'

/**
 * 封装消息提示，修改样式
 * @param content 消息内容
 * @param res 其他参数
 */
export const showMessage = (config: ArgsProps) => {
  antdMessage.open({
    className: 'custom-message-wrapper',
    ...config
  })
}

export const message = {
  info: (content: string, duration?: number) => {
    if (isPCByWidth()) {
      showMessage({
        content,
        duration: duration || 2
      })
    } else {
      Toast.show({
        position: 'center',
        content,
        duration: duration || 2000
      })
    }
  }
}
