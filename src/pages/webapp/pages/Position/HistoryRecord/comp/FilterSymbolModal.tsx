import { useTheme } from '@/context/themeProvider'
import ListItem, { IlistItemProps } from '@/pages/webapp/components/Base/List/ListItem'
import Search from '@/pages/webapp/components/Base/Search'
import SheetModal, { SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import type { ForwardedRef } from 'react'
import { forwardRef, useImperativeHandle, useRef } from 'react'

type IProps = {
  trigger?: JSX.Element
  onPress?: (param: any) => any
  data?: IlistItemProps[]
}

export type FilterSymbolModalRef = {
  show: () => void
  close: () => void
}

const Item = (item: IlistItemProps) => {
  const { theme } = useTheme()

  const renderItem = {
    renderExtraElement: () => (item.active ? <img style={{ width: 22, height: 22 }} src={'/img/webapp/icon/radio_b.png'} /> : <View />),
    ...item
  }

  return (
    <ListItem
      {...renderItem}
      styles={{
        container: {
          borderColor: theme.colors.borderColor.weak,
          borderWidth: 1
        }
      }}
    />
  )
}

/** 选择品种列表弹窗 */
function FilterSymbolModal({ trigger, onPress, data }: IProps, ref: ForwardedRef<FilterSymbolModalRef>) {
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

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      height={600}
      hiddenFooter
      trigger={trigger}
      // showTabsMode
      children={
        <View className={cn('flex-1 w-full px-4')}>
          <Search
            style={{
              backgroundColor: theme.colors.backgroundColor.secondary
            }}
          />
          {/* <FlashListShopify
            data={data}
            renderItem={(item: { item: IlistItemProps }) => <Item {...item.item} />}
            ItemSeparatorComponent={() => <View style={{ marginBottom: 10 }} />}
            contentContainerStyle={{ padding: 0, paddingTop: 8 }}
            showMoreText={false}
          /> */}
          {data?.map((item, index) => (
            <Item key={index} {...item} />
          ))}
        </View>
      }
      backgroundStyle={{ backgroundColor: theme.colors.backgroundColor.secondary }}
    />
  )
}

export default forwardRef(FilterSymbolModal)
