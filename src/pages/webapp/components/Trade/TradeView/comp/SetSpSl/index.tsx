import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useMemo } from 'react'

import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import useCurrentDepth from '@/hooks/useCurrentDepth'
import Switch from '@/pages/webapp/components/Base/Switch'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'

import FullModeSpSl from './FullModeSpSl'
import NonFullModeSpSl from './NonFullModeSpSl'

type IProps = {
  /** 是否全屏展示 */
  isFull?: boolean
}

// 全屏
const FullMode = observer(() => {
  const { cn, theme } = useTheme()
  const intl = useIntl()
  const { trade } = useStores()
  const { orderSpslChecked, setOrderSpslChecked } = trade

  return (
    <>
      <View className={cn('mt-1')}>
        <View className={cn('flex-row items-center justify-between')}>
          <Text color="primary" size="base" weight="medium">
            {intl.formatMessage({ id: 'pages.trade.Spsl' })}
          </Text>
          <Switch
            onChange={(checked) => {
              setOrderSpslChecked(checked)
            }}
            checked={orderSpslChecked}
          />
        </View>
      </View>
      {orderSpslChecked && <FullModeSpSl />}
    </>
  )
})

/** 止盈止损设置 */
function SetSpSl({ isFull }: IProps) {
  const depth = useCurrentDepth()
  const hasDepth = useMemo(
    () => Number(depth?.asks?.length) > 0 && Number(depth?.bids?.length) > 0,
    [depth?.asks?.length, depth?.bids?.length]
  )

  return <>{hasDepth && !isFull ? <NonFullModeSpSl /> : <FullMode />}</>
}

export default observer(SetSpSl)
