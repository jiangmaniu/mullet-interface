import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { ForwardedRef, forwardRef, useImperativeHandle, useMemo, useRef } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'

import SheetModal, { SheetRef } from '../../../Base/SheetModal'
import { Text } from '../../../Base/Text'
import { View } from '../../../Base/View'

type IProps = {}

export type MarginTypeModalRef = {
  show: () => void
  close: () => void
}

function MarginTypeModal(props: IProps, ref: ForwardedRef<MarginTypeModalRef>) {
  const bottomSheetModalRef = useRef<SheetRef>(null)
  const intl = useIntl()
  const { trade } = useStores()
  const { cn, theme } = useTheme()
  const { buySell, orderType, setOrderType, orderSpslChecked, setOrderSpslChecked } = trade
  const isBuy = buySell === 'BUY'

  const enableIsolated = trade.currentAccountInfo.enableIsolated

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  const marginTypeList: Array<{ key: API.MarginType; desc: string; label: string }> = useMemo(() => {
    return enableIsolated
      ? [
          {
            key: 'CROSS_MARGIN',
            label: intl.formatMessage({ id: 'common.enum.MarginType.CROSS_MARGIN' }),
            desc: intl.formatMessage({ id: 'pages.trade.Cross margin tips' })
          },
          {
            key: 'ISOLATED_MARGIN',
            label: intl.formatMessage({ id: 'common.enum.MarginType.ISOLATED_MARGIN' }),
            desc: intl.formatMessage({ id: 'pages.trade.Isolated margin tips' })
          }
        ]
      : [
          {
            key: 'CROSS_MARGIN',
            label: intl.formatMessage({ id: 'common.enum.MarginType.CROSS_MARGIN' }),
            desc: intl.formatMessage({ id: 'pages.trade.Cross margin tips' })
          }
        ]
  }, [enableIsolated])

  return (
    <SheetModal ref={bottomSheetModalRef} height={enableIsolated ? '45%' : '30%'} hiddenFooter>
      <View className={cn('w-full')}>
        <View className={cn('mx-7 mb-6 flex flex-col items-center')}>
          <Text size="xl" color="primary" font="pf-bold">
            {intl.formatMessage({ id: 'pages.trade.Margin Mode Title' })}
          </Text>
          <Text size="sm" color="primary" className={cn('mt-1')}>
            {intl.formatMessage({ id: 'pages.trade.Margin Mode SubText' })}
          </Text>
        </View>
        <View className={cn('mx-3')}>
          {marginTypeList.map((item) => (
            <View
              key={item.key}
              onClick={() => {
                trade.setMarginType(item.key)
                bottomSheetModalRef.current?.sheet?.dismiss()
              }}
            >
              <View
                className={cn('border rounded-xl mb-3 px-4 py-3')}
                borderColor={trade.marginType === item.key ? 'active' : 'weak'}
                key={item.key}
              >
                <View className={cn('items-center flex-row mb-2 justify-between')}>
                  <Text color="primary" size="base" weight="bold">
                    {item.label}
                  </Text>
                  {trade.marginType === item.key && <Iconfont name="danchuang-xuanzhong" size={20} />}
                </View>
                <Text color="primary" size="xs">
                  {item.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SheetModal>
  )
}

export default observer(forwardRef(MarginTypeModal))
