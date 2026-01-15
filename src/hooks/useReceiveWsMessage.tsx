import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { toast } from '@/libs/ui/components/toast'
import { MessagePopupInfo } from '@/mobx/ws.types'
import MessageStore from '@/pages/webapp/pages/UserCenter/Message/MessageStore'
import { isPCByWidth } from '@/utils'
import { parseOrderMessage, removeOrderMessageFieldNames } from '@/utils/business'
import mitt from '@/utils/mitt'
import { getPathname } from '@/utils/navigator'
import { Toast } from 'antd-mobile'
import { useCallback, useEffect } from 'react'

// 监听ws消息
export default function useReceiveWsMessage() {
  const { ws, trade } = useStores()

  const handleWsMessagePopup = useCallback((info: any) => {
    const messagePopupInfo = info as MessagePopupInfo
    if (!messagePopupInfo?.title) return
    // 刷新消息未读数量
    MessageStore.getUnreadMessageCount()
    const content = removeOrderMessageFieldNames(messagePopupInfo?.content || '')
    console.log('更新消息通知', messagePopupInfo)

    // 公告消息不弹窗
    // if (info?.type === 'GROUP') return

    if (isPCByWidth()) {
      if (location.pathname.indexOf('/trade') === -1) return
      toast.success(messagePopupInfo?.title, {
        description: content
      })
    }
  }, [])

  useEffect(() => {
    mitt.on('ws-message-popup', handleWsMessagePopup)
    return () => {
      mitt.off('ws-message-popup', handleWsMessagePopup)
    }
  }, [])
}
