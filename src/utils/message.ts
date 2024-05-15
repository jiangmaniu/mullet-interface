import { message as antdMessage } from 'antd'
import { ArgsProps } from 'antd/lib/message'

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
    showMessage({
      content,
      duration: duration || 2
    })
  }
}
