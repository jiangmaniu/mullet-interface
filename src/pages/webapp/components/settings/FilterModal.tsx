import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import type { ForwardedRef } from 'react'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useI18n } from '../../hooks/useI18n'
import ListItem, { IlistItemProps } from '../Base/List/ListItem'
import SheetModal, { SheetRef } from '../Base/SheetModal'
import { View } from '../Base/View'
type IProps = {
  trigger?: JSX.Element
  data: IlistItemProps[]
}

export type FilterModalRef = {
  show: () => void
  close: () => void
}

const Item = (item: IlistItemProps) => {
  const { theme } = useTheme()

  const renderItem = {
    renderExtraElement: () => (item.active ? <Iconfont name="danchuang-xuanzhong" size={26} /> : <View />),
    ...item
  }

  return (
    <ListItem
      {...renderItem}
      styles={{
        container: {
          borderWidth: 1,
          borderColor: item.active ? theme.colors.textColor.primary : theme.colors.borderColor.weak,
          borderRadius: 10
        },
        iconStyle: {
          display: 'none'
        }
      }}
    />
  )
}

/** 选择品种列表弹窗 */
function FilterModal({ trigger, data }: IProps, ref: ForwardedRef<FilterModalRef>) {
  const { cn, theme } = useTheme()
  const { t } = useI18n()

  const bottomSheetModalRef = useRef<SheetRef>(null)

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  const [currList, setCurrList] = useState(data)

  const [filter, setFilter] = useState('')

  useEffect(() => {
    // title or value
    const filteredList = data.filter(
      (item) =>
        !filter ||
        item.title.toLowerCase().includes(filter.toLowerCase()) ||
        (item.value && String(item.value).toLowerCase().includes(filter.toLowerCase()))
    )
    setCurrList(filteredList)
  }, [filter, data])

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      height={500}
      hiddenFooter
      title={t('pages.position.Filter')}
      trigger={trigger}
      // showTabsMode
      children={
        <View className={cn('flex-1 w-full px-4 gap-2 flex flex-col mb-2.5')}>
          {/* <Search
            value={filter}
            onChangeText={(val) => {
              setFilter(val)
            }}
            inputWrapperStyle={[
              {
                backgroundColor: theme.colors.backgroundColor.secondary
              }
            ]}
          /> */}
          {/* <FlashListShopify
            data={currList}
            renderItem={(item: { item: IlistItemProps }) => <Item {...item.item} />}
            ItemSeparatorComponent={() => <View style={{ marginBottom: 10 }} />}
            contentContainerStyle={{ padding: 0, paddingTop: 8 }}
            showMoreText={false}
          /> */}
          {currList.map((item) => (
            <Item {...item} key={item.value} />
          ))}
        </View>
      }
      backgroundStyle={{ backgroundColor: theme.colors.backgroundColor.secondary }}
    />
  )
}

export default forwardRef(FilterModal)
