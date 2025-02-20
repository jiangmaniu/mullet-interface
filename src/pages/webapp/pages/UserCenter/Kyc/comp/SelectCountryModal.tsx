import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import { TextField } from '@/pages/webapp/components/Base/Form/TextField'
import ListItem from '@/pages/webapp/components/Base/List/ListItem'
import SheetModal, { SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { getAreaCode } from '@/services/api/common'
import { observer } from 'mobx-react'
import type { ForwardedRef } from 'react'
import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'

type IProps = {
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
  const [current, setCurrent] = useState({} as any)

  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {listData.map((item: Common.AreaCodeItem, index: number) => {
        // const title = locale === 'zh-TW' ? item.nameTw : item.nameEn
        // const isActive = current.id === item.id
        const title = locale === 'zh-TW' ? `${item.nameTw} ${item.areaCode} ` : `${item.nameEn} ${item.areaCode}`

        const isActive = current.id === item.id
        // @ts-ignore
        item.renderExtraElement = () => {
          if (isActive) {
            return <Iconfont name="danchuang-xuanzhong" size={26} />
          }
          return <></>
        }

        return (
          <ListItem
            styles={{
              container: {
                borderWidth: 1,
                borderColor: isActive ? theme.colors.textColor.primary : theme.colors.borderColor.weak,
                borderRadius: 10
              },
              iconStyle: {
                display: 'none'
              }
            }}
            title={title}
            // renderExtraElement={() => {
            //   return <Text>{item.areaCode}</Text>
            // }}
            key={index}
            {...item}
            first={!index}
            onPress={() => {
              onPress(item)
              setCurrent(item)
            }}
          />
        )
      })}
    </View>
  )
}

const Children = observer(
  ({
    handlePress,
    searchValue,
    list
  }: {
    handlePress: (item: Common.AreaCodeItem) => void
    searchValue: string
    list: Common.AreaCodeItem[]
  }) => {
    const { cn, theme } = useTheme()
    const { t, locale } = useI18n()

    const filteredList = useMemo<Common.AreaCodeItem[]>(() => {
      if (!searchValue) return list || []

      return (
        list?.filter((item) => {
          const title = locale === 'zh-TW' ? item.nameTw : item.nameEn
          return title.toLowerCase().includes(searchValue.toLowerCase()) || item.areaCode.toLowerCase().includes(searchValue.toLowerCase())
        }) ?? []
      )
    }, [searchValue, list])

    return (
      <View className={cn('flex-1')}>
        <View className={cn('flex-1 mx-3 pb-10')}>{renderList(filteredList, handlePress)}</View>
      </View>
    )
  }
)

/** 选择账户弹窗 */
function SelectCountryModal({ isSimulate, onPress, isRemainAtCurrentPage }: IProps, ref: ForwardedRef<ModalRef>) {
  const { cn, theme } = useTheme()
  const { t, locale } = useI18n()
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const [countryList, setCountryList] = useState<Common.AreaCodeItem[]>([])
  const getCountryList = async () => {
    try {
      const res = await getAreaCode()
      const list = res.data?.filter((item) => item.areaCode !== '0')
      setCountryList(list || [])
    } catch (error) {
      console.error(error)
    }
  }

  useLayoutEffect(() => {
    getCountryList()
  }, [])

  const bottomSheetModalRef = useRef<SheetRef>(null)

  useImperativeHandle(ref, () => ({
    show: () => {
      setSearchValue('')
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }, [open])

  const handlePress = (item: Common.AreaCodeItem) => {
    onPress?.(item)
    bottomSheetModalRef.current?.sheet?.dismiss()
  }

  const [searchValue, setSearchValue] = useState('')

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      // useKeyboardShift={false}
      height={'90%'}
      hiddenFooter
      dragOnContent={false}
      onOpenChange={(open) => {
        setOpen(open)
        setLoading(true)
      }}
      header={
        <>
          {!loading && (
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
                    //   const title = locale === 'zh-TW' ? item.nameTw : item.nameEn
                    //   return title.toLowerCase().includes(text.toLowerCase()) || item.areaCode.toLowerCase().includes(text.toLowerCase())
                    // })
                    // setFilteredList(filteredList)
                  }}
                  containerStyle={{ marginBottom: 14 }}
                />
              </View>
            </View>
          )}
        </>
      }
      children={<Children handlePress={handlePress} searchValue={searchValue} list={countryList} />}
    />
  )
}

export default forwardRef(SelectCountryModal)
