import { Carousel as _Carousel, CarouselProps } from 'antd'
import React, { ReactNode } from 'react'

const defualtContentStyle: React.CSSProperties = {
  height: 26,
  textAlign: 'center'
}

type Message = {
  children: ReactNode
}

type IProps = CarouselProps & {
  contentStyle?: React.CSSProperties
  items: Message[]
}

const Carousel = ({ contentStyle, items, ...res }: IProps) => (
  <_Carousel {...res} autoplay>
    {items.map((item, index) => (
      <div style={{ ...defualtContentStyle, ...contentStyle }} key={index}>
        {item.children}
      </div>
    ))}
  </_Carousel>
)

export default Carousel
