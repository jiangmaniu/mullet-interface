import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import { TextField } from '@/pages/webapp/components/Base/Form/TextField'
import ListItem from '@/pages/webapp/components/Base/List/ListItem'
import SheetModal, { SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { observer } from 'mobx-react'
import type { ForwardedRef } from 'react'
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'

type IProps = {
  list: Common.AreaCodeItem[]
  isSimulate?: boolean
  header?: React.ReactNode
  onPress?: (item?: Common.AreaCodeItem) => void
  isRemainAtCurrentPage?: boolean
}

export type ModalRef = {
  show: (onPress?: (item?: Common.AreaCodeItem) => void) => void
  close: () => void
}

const renderList = (listData: Common.AreaCodeItem[], onPress: (item: Common.AreaCodeItem) => void) => {
  const { cn, theme } = useTheme()
  const { locale } = useI18n()
  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {listData.map((item: Common.AreaCodeItem, index: number) => {
        const title = locale === 'zh-TW' ? item.nameCn : item.nameEn

        return (
          <ListItem
            styles={{
              container: {
                borderWidth: 1,
                borderColor: theme.colors.borderColor.weak,
                borderRadius: 10
              }
            }}
            title={title}
            renderExtraElement={() => {
              return <Text>{item.areaCode}</Text>
            }}
            key={index}
            {...item}
            first={!index}
            onPress={() => {
              onPress(item)
            }}
          />
        )
      })}
    </View>
  )
}

/** 选择账户弹窗 */
function SelectCountryModal({ isSimulate, list, onPress, isRemainAtCurrentPage }: IProps, ref: ForwardedRef<ModalRef>) {
  const { cn, theme } = useTheme()
  const { t, locale } = useI18n()

  const bottomSheetModalRef = useRef<SheetRef>(null)

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  // const [filteredList, setFilteredList] = useState<Common.AreaCodeItem[]>([])

  // useEffect(() => {
  //   setFilteredList(list || [])
  // }, [list])

  const handlePress = (item: Common.AreaCodeItem) => {
    // setFilteredList(countryList)
    onPress?.(item)
    bottomSheetModalRef.current?.sheet?.dismiss()
  }

  const [searchValue, setSearchValue] = useState('')

  const filteredList = useMemo<Common.AreaCodeItem[]>(() => {
    if (!searchValue) return list

    return list.filter((item) => {
      const title = locale === 'zh-TW' ? item.nameCn : item.nameEn
      return title.toLowerCase().includes(searchValue.toLowerCase()) || item.areaCode.toLowerCase().includes(searchValue.toLowerCase())
    })
  }, [searchValue, list])
  return (
    <SheetModal
      ref={bottomSheetModalRef}
      // useKeyboardShift={false}
      height={500}
      hiddenFooter
      dragOnContent={false}
      children={
        <View className={cn('flex-1')}>
          <View className={cn('mx-3 mb-3')}>
            <View className={cn('items-center flex-row w-full justify-between')}>
              <Text className={cn('text-[22px] leading-7')} weight="medium">
                {t('pages.login.Residence Country')}
              </Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <TextField
                RightAccessory={({ style }) => (
                  <View style={style}>
                    <Iconfont name="hangqing-sousuo" size={20} />
                  </View>
                )}
                autoComplete="off"
                autoFocus={false}
                height={44}
                placeholder={t('common.operate.Search')}
                onChange={(text) => {
                  setSearchValue(text)
                  // title or value
                  // const filteredList = list.filter((item) => {
                  //   const title = locale === 'zh-TW' ? item.nameCn : item.nameEn
                  //   return title.toLowerCase().includes(text.toLowerCase()) || item.areaCode.toLowerCase().includes(text.toLowerCase())
                  // })
                  // setFilteredList(filteredList)
                }}
                containerStyle={{ marginBottom: 14 }}
              />
            </View>
          </View>
          <View className={cn('flex-1 mx-3 pb-10')}>{renderList(filteredList, handlePress)}</View>
        </View>
      }
    />
  )
}

export default observer(forwardRef(SelectCountryModal))
