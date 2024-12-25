import { observer } from 'mobx-react'
import 'swiper/css'

import { stores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { View } from '@/pages/webapp/components/Base/View'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper/types'
import AccountItem from './AccountItem'

type IProps = {
  accountTabActiveKey: 'REAL' | 'DEMO'
  setSelectedItem: (item: AccountGroup.AccountGroupItem) => void
}

function AccountCarousel({ accountTabActiveKey, setSelectedItem }: IProps) {
  const { cn } = useTheme()

  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const data = useMemo(
    () =>
      stores.trade.accountGroupList
        ?.filter((item) => (accountTabActiveKey === 'DEMO' ? item.isSimulate : !item.isSimulate))
        .map((v, index) => ({ ...v, key: `${v.groupName}_${index}` })) ?? [],
    [accountTabActiveKey, stores.trade.accountGroupList]
  )

  useLayoutEffect(() => {
    if (!stores.trade.accountGroupList) {
      stores.trade.getAccountGroupList()
    }
  }, [stores.trade.accountGroupList])

  const handleOnPress = (item: AccountGroup.AccountGroupItem) => {
    // setSelectedItem(item)
    const index = data.findIndex((v) => v.groupName === item.groupName)

    swiperRef.current?.slideTo(index, 300)
    // setActiveIndex(index)
    // ref.current?.snapToItem(index, true, true)
  }

  useEffect(() => {
    if (activeIndex !== -1 && data.length) {
      setSelectedItem(data[activeIndex])
    }
  }, [data, activeIndex])

  const swiperRef = useRef<SwiperType | null>(null)
  return (
    <div className=" flex items-center flex-col gap-5 flex-1">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        // slidesPerView={'auto'}
        className="account-select w-full overflow-hidden"
        spaceBetween={16}
        slidesPerView={1}
        width={300}
        loop={true}
        initialSlide={0}
        onActiveIndexChange={(swiper) => {
          setActiveIndex(Number.isNaN(swiper.activeIndex) ? 0 : swiper.activeIndex)
        }}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <AccountItem item={item} width={233} height={320} active={index === activeIndex} onPress={handleOnPress} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex flex-row gap-[10px]">
        {data?.map((item, index) => (
          <View key={index} className={cn('h-[6px] w-[14px] bg-gray-250 rounded-[3px]', { 'bg-black w-10': index === activeIndex })}></View>
        ))}
      </div>
    </div>
  )
}

export default observer(AccountCarousel)
