import { useTheme } from '@/context/themeProvider'
import Tabs from '@/pages/webapp/components/Base/Tabs'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { RenderTabRef } from '../TabItems'
import RenderMarginTab from '../TabItems/RenderMarginTab'
import RenderPositionTab from '../TabItems/RenderPositionTab'
import RenderSpSlTab from '../TabItems/RenderSpSlTab'
import { Params } from './types'

type IProps = Params & {
  rawItem: Order.BgaOrderPageListItem
  /** 止盈止损信息 */
  close?: () => void
}

// 持仓列表Tabs
export default forwardRef(({ rawItem, close, tabKey: initTabKey }: IProps, ref: ForwardedRef<RenderTabRef>) => {
  const i18n = useI18n()
  const { t } = i18n
  const { theme, cn } = useTheme()

  const positionRef = useRef<RenderTabRef>(null)
  const spslRef = useRef<RenderTabRef>(null)
  const marginRef = useRef<RenderTabRef>(null)

  const [tabKey, setTabKey] = useState<Params['tabKey']>(initTabKey)

  useImperativeHandle(ref, () => ({
    submit: () => {
      if (tabKey === 'CLOSE_POSITION') {
        positionRef.current?.submit()
      } else if (tabKey === 'SPSL') {
        spslRef.current?.submit()
      } else if (tabKey === 'MARGIN') {
        marginRef.current?.submit()
      }
    }
  }))

  const tabs: any = [
    {
      title: t('pages.position.Close Position'),
      key: 'CLOSE_POSITION'
    },
    {
      title: t('pages.trade.Spsl'),
      key: 'SPSL'
    },
    // 逐仓模式才有保证金
    ...(rawItem.marginType === 'ISOLATED_MARGIN'
      ? [
          {
            title: t('pages.trade.Margin'),
            key: 'MARGIN'
          }
        ]
      : [])
  ]

  const [_, setSwipeEnabled] = useState(true)

  useEffect(() => {
    if (initTabKey) {
      setTabKey(initTabKey)
    }
  }, [initTabKey])

  return (
    <>
      <View className={cn('flex-1')}>
        <Tabs
          items={tabs}
          onChange={(key: any) => {
            setTabKey(key)
          }}
          activeKey={tabKey}
          fixedActiveLineWidth={64}
          contentPadding={24}
        />
        <View className={cn('px-5')}>
          {tabKey === 'CLOSE_POSITION' && (
            <RenderPositionTab ref={positionRef} rawItem={rawItem} close={close} setSwipeEnabled={setSwipeEnabled} />
          )}
          {tabKey === 'SPSL' && <RenderSpSlTab ref={spslRef} rawItem={rawItem} close={close} />}
          {tabKey === 'MARGIN' && <RenderMarginTab ref={marginRef} rawItem={rawItem} close={close} />}
        </View>
      </View>
    </>
  )
})
