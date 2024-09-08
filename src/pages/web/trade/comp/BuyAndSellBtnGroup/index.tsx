import { FormattedMessage } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useState, useTransition } from 'react'

import Buy from '@/components/Base/Svg/Buy'
import Sell from '@/components/Base/Svg/Sell'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'
import { getCurrentQuote } from '@/utils/wsUtil'

type IProps = {
  type?: string
  sellBgColor?: string
}

// 买卖切换按钮
export default observer(
  forwardRef(({ type, sellBgColor }: IProps, ref) => {
    const [isPending, startTransition] = useTransition() // 切换内容，不阻塞渲染，提高整体响应性
    const { trade } = useStores()
    const buySell = trade.buySell
    const isFooterBtnGroup = type === 'footer'
    const buyColor = buySell === 'BUY' ? 'text-white' : 'text-primary'
    const sellColor = isFooterBtnGroup ? 'text-white' : buySell === 'SELL' ? 'text-white' : 'text-primary'
    const { lng } = useLang()
    const { breakPoint } = useEnv()
    const [width, setWidth] = useState<any>(0)
    const [loading, setLoading] = useState(true)

    const quoteInfo = getCurrentQuote()

    useEffect(() => {
      setTimeout(() => {
        setLoading(false)
      }, 100)
    }, [])

    useEffect(() => {
      let w: any
      // 底部按钮组适配
      if (isFooterBtnGroup) {
        // @ts-ignore
        w = {
          xs: '32vw',
          sm: '40vw',
          md: '42vw',
          lg: '45vw'
        }[breakPoint]
      }

      // 弹窗中的按钮组的宽度适配
      if (type === 'popup') {
        // @ts-ignore
        w = {
          xs: '41vw',
          sm: '45vw',
          md: '46vw',
          lg: '47vw'
        }[breakPoint]
      }
      setWidth(w)
    }, [breakPoint, type])

    const hasQuote = quoteInfo.hasQuote

    return (
      <>
        <div
          className="relative flex cursor-pointer flex-col items-center py-[5px]"
          onClick={() => {
            startTransition(() => {
              trade.setBuySell('SELL')
            })
          }}
        >
          <Sell isActive={isFooterBtnGroup || buySell === 'SELL'} width={width} bgColor={sellBgColor}>
            {!loading && (
              <div className={cn('flex h-full flex-col items-center justify-center xl:pt-1 left-6')}>
                <div className={cn('select-none font-normal max-xl:text-base xl:text-xs', sellColor)}>
                  <FormattedMessage id="mt.maichuzuokong" />
                </div>
                <div className={cn('!font-dingpro-medium text-base max-xl:hidden', sellColor)}>
                  {hasQuote ? formatNum(quoteInfo.bid) : '--'}
                </div>
              </div>
            )}
          </Sell>
        </div>
        {hasQuote && (
          <div className="absolute left-[50%] top-[50%] z-[90] min-w-[30px] !font-dingpro-medium translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white px-[6px] py-[3px] text-center text-xs text-primary dark:text-black">
            {quoteInfo.spread || 0}
          </div>
        )}
        <div
          className="relative flex cursor-pointer flex-col items-center py-[5px]"
          onClick={() => {
            startTransition(() => {
              // 设置全局变量
              trade.setBuySell('BUY')
            })
          }}
        >
          <Buy isActive={isFooterBtnGroup || buySell === 'BUY'} width={width}>
            {!loading && (
              <div className={cn('flex h-full flex-col items-center justify-center xl:pt-1 right-6')}>
                <div className={cn('select-none font-normal max-xl:text-base xl:text-xs', buyColor)}>
                  <FormattedMessage id="mt.mairuzuoduo" />
                </div>
                <div className={cn('!font-dingpro-medium text-base max-xl:hidden', buyColor)}>
                  {hasQuote ? formatNum(quoteInfo.ask) : '--'}
                </div>
              </div>
            )}
          </Buy>
        </div>
      </>
    )
  })
)
