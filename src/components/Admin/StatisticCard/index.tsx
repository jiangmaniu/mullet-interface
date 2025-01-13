import { ProCardProps } from '@ant-design/pro-card/es/ProCard'
import { ProCard } from '@ant-design/pro-components'
import { isValidElement } from 'react'

import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { colorTextPrimary } from '@/theme/theme.config'
import { formatNum } from '@/utils'

type Item = {
  value?: string | number | React.ReactNode
  label?: string | React.ReactNode
  icon?: string | React.ReactNode
  valueColor?: string
  iconWidth?: number
  iconHeight?: number
  noFormatValue?: boolean
  renderItem?: (item: Item) => React.ReactNode
}
interface IProps {
  showCardBg?: boolean
  style?: React.CSSProperties
  /**@name 子卡片高度 */
  height?: number | string
  items: Item[]
  direction?: 'column' | 'row' | undefined
  /**@name 外层卡片属性 */
  cardProps?: ProCardProps
  /**@name 子卡片属性 */
  subCardProps?: ProCardProps
  /**@name label样式 */
  valueLabelStyle?: React.CSSProperties
  /**@name 是否需要格式化value值为统一小数点 */
  needFormatValue?: boolean
}
export default function StatisticCard({
  showCardBg,
  style = {},
  cardProps,
  subCardProps = {},
  valueLabelStyle,
  height = 60,
  items = [],
  needFormatValue = false
}: IProps) {
  const { isMobile, isMobileOrIpad } = useEnv()
  const { lng } = useLang()
  const proCardStyle = {} as React.CSSProperties
  if (showCardBg) {
    proCardStyle.background = 'linear-gradient(270deg, #FFFFFF 60%, #F0FFE9 100%)'
  }
  const labelFontSize = isMobile ? 12 : 14
  const valueFontSize = isMobile ? 15 : 16
  const lineHeight = lng === 'zh-TW' ? '20px' : '15px'
  const renderItem = (item: Item) => {
    return (
      <>
        <span
          className="text-main font-bold text-base pb-[4px]"
          style={{
            color: Number(item.value) ? item.valueColor || colorTextPrimary : colorTextPrimary,
            fontSize: valueFontSize,
            lineHeight
          }}
        >
          {needFormatValue && !item.noFormatValue ? formatNum(item.value, { precision: 2 }) : item.value || 0}
        </span>
        <span className="text-sub" style={{ fontSize: labelFontSize, lineHeight, ...valueLabelStyle }}>
          {item.label}
        </span>
      </>
    )
  }
  const renderProCardItem = (item: Item) => {
    return (
      <div className="flex flex-col items-center text-center" style={{ flexDirection: subCardProps.direction }}>
        {item.icon ? (
          <>
            <div>
              {isValidElement(item.icon) ? (
                item.icon
              ) : (
                <img src={item.icon as string} style={{ width: item.iconWidth || 46, height: item.iconHeight || 46 }} />
              )}
            </div>
            <div className="flex flex-col items-center text-center">{renderItem(item)}</div>
          </>
        ) : (
          renderItem(item)
        )}
      </div>
    )
  }
  return (
    // @ts-ignore
    <ProCard ghost bordered style={{ ...style, ...proCardStyle }} bodyStyle={{ overflowX: 'auto', overflowY: 'hidden' }} {...cardProps}>
      {items.map((item: Item, index) => {
        return (
          // @ts-ignore
          <ProCard
            direction={item.icon ? 'row' : 'column'}
            className={index !== items.length - 1 && items.length > 1 && !isMobile ? 'proCardDivider' : ''}
            key={index}
            style={{ background: 'transparent', height: isMobileOrIpad && lng !== 'zh-TW' ? 'auto' : height }}
            layout="center"
            {...subCardProps}
          >
            {item.renderItem ? (item as any).renderItem?.(item) : renderProCardItem(item)}
          </ProCard>
        )
      })}
    </ProCard>
  )
}
