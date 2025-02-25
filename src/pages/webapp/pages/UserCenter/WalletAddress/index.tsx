import ProList from '@/components/Admin/ProList'
import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import Header from '@/pages/webapp/components/Base/Header'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import useHideHeader from '@/pages/webapp/hooks/useHideHeader'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { getWithdrawalAddressList, removeWithdrawalAddress } from '@/services/api/wallet'
import { getSymbolIcon } from '@/utils/business'
import { message } from '@/utils/message'
import { ActionType } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { getIntl } from '@umijs/max'
import { useTitle } from 'ahooks'
import { Dialog, SwipeAction } from 'antd-mobile'
import { useRef, useState } from 'react'
import EditModal from './EditModal'

export default function WalletAddress() {
  const { theme, cn } = useTheme()
  const { t } = useI18n()
  const modalRef = useRef<any>(null)
  const [loading, setLoading] = useState(false)
  const actionRef = useRef<ActionType>(null)
  const { isHideHeader } = useHideHeader()

  // 设置app标题
  useTitle(t('mt.qianbaodizhi'))

  const className = useEmotionCss((token) => {
    return {
      '.adm-swipe-action-action-button.adm-button': {
        padding: '10px !important'
      },
      '.adm-button': {
        backgroundColor: 'rgb(248, 249, 249) !important'
      },
      '.adm-swipe-action-actions > button:nth-child(1)': {
        paddingRight: '5px !important'
      },
      '.adm-swipe-action-actions > button:nth-child(2)': {
        paddingLeft: '5px !important'
      },
      '.adm-swipe-action': {
        overflow: 'visible !important',
        borderRadius: 12
      }
    }
  })

  const onQuery = async (params?: any) => {
    setLoading(true)
    const data = await getWithdrawalAddressList({
      current: 1,
      size: 1000
    })
    setLoading(false)

    const res = data.data

    let total = res?.total
    let list = res?.records || []
    return { data: list, total, success: true }
  }

  // 刷新列表
  const reload = () => actionRef.current?.reload?.()

  const onRemoveItem = async (item: Wallet.WithdrawalAddress) => {
    const res = await removeWithdrawalAddress({ id: item.id })
    if (res.success) {
      message.info(getIntl().formatMessage({ id: 'mt.caozuochenggong' }))
      // 刷新列表
      reload()
    }
  }

  return (
    <Basiclayout bgColor="secondary" headerColor={theme.colors.backgroundColor.secondary}>
      <Header />
      {!isHideHeader && <View className={cn('text-[20px] font-pf-bold font-medium px-[22px] pb-4')}>{t('mt.qianbaodizhi')}</View>}
      <View className={cn('px-[14px] flex flex-col gap-y-3 h-[92vh] overflow-y-auto', className, isHideHeader && 'mt-3')}>
        <ProList
          rowKey="id" // 设置列表唯一key
          action={{
            query: (params) => onQuery(params)
          }}
          actionRef={actionRef}
          pagination={{
            pageSize: 10
          }}
          ghost
          loading={loading}
          split={false}
          renderItem={(item: Wallet.WithdrawalAddress, index: number) => (
            // @ts-ignore
            <SwipeAction
              key={item.id}
              rightActions={[
                {
                  key: 'edit',
                  text: <img className="size-[32px]" src="/img/icons/edit-icon.png" />,
                  onClick: async () => {
                    modalRef.current.show(item)
                  }
                },
                {
                  key: 'del',
                  text: <img className="size-[32px]" src="/img/icons/del-icon.png" />,
                  onClick: async () => {
                    Dialog.show({
                      content: t('mt.querenshanchugaidizhima'),
                      closeOnAction: true,
                      actions: [
                        [
                          {
                            key: 'cancel',
                            text: t('common.cancel')
                          },
                          {
                            key: 'delete',
                            text: t('common.delete'),
                            bold: true,
                            danger: true,
                            onClick: async () => {
                              onRemoveItem(item)
                            }
                          }
                        ]
                      ]
                    })
                  }
                }
              ]}
            >
              <View className="bg-white rounded-xl p-3 mb-3">
                <View className="flex items-center gap-x-3">
                  <View className={cn('bg-gray-50 p-[10px] rounded-[20px] size-10 flex items-center justify-center')}>
                    <Iconfont name="qianbaodizhi" size={18} />
                  </View>
                  <View>
                    <View className="text-sm text-primary font-extrabold pb-1">{item.channelName}</View>
                    <View className="text-xs text-weak">{item.remark}</View>
                  </View>
                </View>
                <View className="flex items-center mt-3 ml-2">
                  <img src={getSymbolIcon(item.channelIcon)} className="size-[14px] rounded-full" />
                  <Text size="xs" className="pl-1">
                    {item.symbol} · {t('mt.dizhi')}: {item.address}
                  </Text>
                </View>
              </View>
            </SwipeAction>
          )}
        />
      </View>
      <EditModal ref={modalRef} reload={reload} />
    </Basiclayout>
  )
}
