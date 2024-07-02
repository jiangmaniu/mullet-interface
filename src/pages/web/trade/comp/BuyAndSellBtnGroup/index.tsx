import { FormattedMessage } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useState } from 'react'

import Buy from '@/components/Base/Svg/Buy'
import Sell from '@/components/Base/Svg/Sell'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { formatNum } from '@/utils'
import { getCurrentQuote } from '@/utils/wsUtil'

type IProps = {
  type?: string
  activeKey?: any
  onChange?: (value: any) => void
  onBuy?: () => void
  onSell?: () => void
  sellBgColor?: string
}

// 买卖切换按钮
export default observer(
  forwardRef(({ type, activeKey, onChange, sellBgColor, onBuy, onSell }: IProps, ref) => {
    const [current, setCurrent] = useState(1)
    const isFooterBtnGroup = type === 'footer'
    const buyColor = current === 1 ? 'text-white' : 'text-gray'
    const sellColor = isFooterBtnGroup ? 'text-white' : current === 2 ? 'text-white' : 'text-gray'
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

    useEffect(() => {
      setCurrent(activeKey || 1)
    }, [activeKey])

    const hasQuote = quoteInfo.hasQuote

    return (
      <>
        <div
          className="relative flex cursor-pointer flex-col items-center py-[5px]"
          onClick={() => {
            if (onSell) {
              onSell()
            } else {
              onChange?.(2)
              setCurrent(2)
            }
          }}
        >
          <Sell isActive={isFooterBtnGroup || current === 2} width={width} bgColor={sellBgColor}>
            {!loading && (
              <div className={classNames('flex h-full flex-col items-center justify-center xl:pt-1 left-6')}>
                <div className={classNames('select-none font-normal max-xl:text-base xl:text-xs', sellColor)}>
                  <FormattedMessage id="mt.maichuzuokong" />
                </div>
                <div className={classNames('!font-dingpro-medium text-base max-xl:hidden', sellColor)}>
                  {hasQuote ? formatNum(quoteInfo.ask) : '--'}
                </div>
              </div>
            )}
          </Sell>
        </div>
        {hasQuote && (
          <div className="absolute left-[50%] top-[50%] z-[90] min-w-[30px] !font-dingpro-medium translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white px-[6px] py-[3px] text-center text-xs text-gray">
            {quoteInfo.spread || 0}
          </div>
        )}
        <div
          className="relative flex cursor-pointer flex-col items-center py-[5px]"
          onClick={() => {
            if (onBuy) {
              onBuy()
            } else {
              setCurrent(1)
              onChange?.(1)
            }
          }}
        >
          <Buy isActive={isFooterBtnGroup || current === 1} width={width}>
            {!loading && (
              <div className={classNames('flex h-full flex-col items-center justify-center xl:pt-1 right-6')}>
                <div className={classNames('select-none font-normal max-xl:text-base xl:text-xs', buyColor)}>
                  <FormattedMessage id="mt.mairuzuoduo" />
                </div>
                <div className={classNames('!font-dingpro-medium text-base max-xl:hidden', buyColor)}>
                  {hasQuote ? formatNum(quoteInfo.bid) : '--'}
                </div>
              </div>
            )}
          </Buy>
        </div>
      </>
    )
  })
)
