import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import { Badge, Dropdown } from 'antd'
import { observer } from 'mobx-react'
import VirtualList from 'rc-virtual-list'

import Empty from '@/components/Base/Empty'
import Iconfont from '@/components/Base/Iconfont'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { getMyMessageInfo, readAllMessage } from '@/services/api/message'
import { gray } from '@/theme/theme.config'
import { cn } from '@/utils/cn'

import MessageStore from '@/pages/webapp/pages/UserCenter/Message/MessageStore'
import { HeaderTheme } from '../Header/types'

type IProps = {
  /**主题 */
  theme?: HeaderTheme
}

function Message({ theme }: IProps) {
  const { global } = useStores()
  const { isMobileOrIpad } = useEnv()
  const themeConfig = useTheme()
  const isDark = themeConfig.theme.isDark
  const { unReadCount, messageList } = global

  const className = useEmotionCss(({ token }) => {
    return {
      '&:hover': {
        svg: {
          fill: `${isDark ? gray[50] : gray[900]} !important`
        },
        span: {
          color: isDark ? gray[50] : gray[900]
        }
      }
    }
  })

  const handleReadAll = async () => {
    await readAllMessage()
    global.getMessageList(true)
    MessageStore.getUnreadMessageCount()
  }

  const handleClickItem = async (id: any) => {
    const res = await getMyMessageInfo({ id })
    if (res.success) {
      MessageStore.getUnreadMessageCount()
      global.messageList = global.messageList.map((item) => {
        if (item.id === id) {
          item.isRead = 'READ'
        }
        return item
      })
    }
  }

  const ContainerHeight = messageList.length > 5 ? 300 : 200

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
    if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 1) {
      global.getMessageList()
    }
  }

  return (
    <Dropdown
      dropdownRender={(originNode) => {
        return (
          <div className="bg-white w-[320px] rounded-xl dark:!shadow-none border shadow-sm dark:border-[--dropdown-border-color] border-[#f3f3f3] dark:bg-[--dropdown-bg]">
            {messageList.length > 0 ? (
              <>
                <div className="flex items-center justify-between p-5">
                  <span className="text-lg text-primary font-semibold">
                    <FormattedMessage id="mt.zhanneixin" />
                  </span>
                  {/* <span
                className="text-sm text-gray-550 cursor-pointer hover:text-gray"
                onClick={() => {
                  push('/msg/station-msg')
                }}
              >
                <FormattedMessage id="common.more" />
              </span> */}
                </div>
                <div>
                  <VirtualList
                    data={messageList}
                    height={ContainerHeight}
                    styles={{
                      verticalScrollBarThumb: {
                        width: 6,
                        borderRadius: 4,
                        background: isDark ? gray[578] : 'rgba(0, 0, 0, 0.05)'
                      },
                      verticalScrollBar: {
                        background: `${isDark ? 'var(--dropdown-bg)' : '#fff'}`
                      }
                    }}
                    itemHeight={41}
                    itemKey="id"
                    onScroll={onScroll}
                  >
                    {(item) => {
                      const isUnRead = item.isRead === 'UNREAD'
                      return (
                        <div
                          className={cn('cursor-pointer py-2 hover:bg-[var(--list-hover-light-bg)] rounded-md mx-3 px-2 group', {
                            'pointer-events-none': !isUnRead
                          })}
                          onClick={() => {
                            if (item.isRead === 'READ') return
                            handleClickItem(item.id)
                          }}
                        >
                          <div className="flex items-center">
                            <img src={isUnRead ? '/img/email-active.png' : '/img/email.png'} width={18} height={18} />
                            <span className={cn('font-semibold text-sm pl-2 text-primary', isUnRead ? 'text-gray' : 'text-gray-500')}>
                              {item.title}
                            </span>
                          </div>
                          <div className="pt-2 text-sm text-secondary line-clamp-3">{item.content}</div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-450 pt-2">{item.createTime}</div>
                            {/* <div className="border rounded-lg w-[46px] h-[22px] text-center border-gray-180 group-hover:border-gray-300 hover:bg-gray-150 cursor-pointer">
                          <SwapRightOutlined />
                        </div> */}
                          </div>
                        </div>
                      )
                    }}
                  </VirtualList>
                </div>
                {unReadCount > 0 && (
                  <div className={cn('flex items-center justify-center cursor-pointer py-3', className)} onClick={handleReadAll}>
                    <Iconfont name="qingli" width={28} height={28} color={isDark ? '#fff' : gray['450']} />
                    <span className="text-sm text-gray-450">
                      <FormattedMessage id="mt.quanbuyidu" />
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8">
                <Empty />
              </div>
            )}
          </div>
        )
      }}
      onOpenChange={(open) => {
        if (open) {
          global.getMessageList(true)
        }
      }}
      // align={{ offset: [0, -15] }}
    >
      <div className="mr-2 cursor-pointer relative">
        <Badge count={unReadCount} color="var(--color-red)">
          <Iconfont
            name="xiaoxi"
            width={26}
            color={theme}
            className="cursor-pointer rounded-lg"
            hoverStyle={{
              background: theme === 'black' ? '#fbfbfb' : '#222222'
            }}
            height={26}
            style={{ position: 'relative', top: 4 }}
          />
        </Badge>
      </div>
    </Dropdown>
  )
}

export default observer(Message)
