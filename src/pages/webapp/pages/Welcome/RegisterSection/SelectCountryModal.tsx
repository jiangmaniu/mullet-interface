// import React, { useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'
// import { useTheme } from '@/context/themeProvider'
// import type { ForwardedRef } from 'react'
// import { observer } from 'mobx-react'
// import { forwardRef } from 'react'
// import { useStores } from '@/context/mobxProvider'
// import { useI18n } from '@/pages/webapp/hooks/useI18n'
// import { Text } from '@/pages/webapp/components/Base/Text'
// import { View } from '@/pages/webapp/components/Base/View'
// import ListItem from '@/pages/webapp/components/Base/List/ListItem'
// import { TextField } from '@/pages/webapp/components/Base/Form/TextField'

// type IProps = {
//   isSimulate?: boolean
//   header?: React.ReactNode
//   onPress?: (item?: Common.AreaCodeItem) => void
//   isRemainAtCurrentPage?: boolean
// }

// export type ModalRef = {
//   show: (onPress?: (item?: Common.AreaCodeItem) => void) => void
//   close: () => void
// }

// const renderList = (listData: Common.AreaCodeItem[], onPress: (item: Common.AreaCodeItem) => void) => {
//   const { cn, theme } = useTheme()
//   const { locale } = useI18n()
//   return (
//     <View style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
//       {listData.map((item: Common.AreaCodeItem, index: number) => {
//         const title = locale === 'zh-TW' ? item.nameCn : item.nameEn

//         return (
//           <ListItem
//             styles={{
//               container: {
//                 borderWidth: 1,
//                 borderColor: theme.colors.borderColor.weak,
//                 borderRadius: 10
//               }
//             }}
//             title={title}
//             renderExtraElement={() => {
//               return <Text>{item.areaCode}</Text>
//             }}
//             key={index}
//             {...item}
//             first={!index}
//             onPress={() => {
//               onPress(item)
//             }}
//           />
//         )
//       })}
//     </View>
//   )
// }

// /** 选择账户弹窗 */
// function SelectCountryModal({ isSimulate, onPress, isRemainAtCurrentPage }: IProps, ref: ForwardedRef<ModalRef>) {
//   const { cn, theme } = useTheme()
//   const { t, locale } = useI18n()
//   const { user, global } = useStores()

//   const bottomSheetModalRef = useRef<SheetRef>(null)

//   useImperativeHandle(ref, () => ({
//     show: () => {
//       bottomSheetModalRef.current?.sheet?.present()
//     },
//     close: () => {
//       bottomSheetModalRef.current?.sheet?.dismiss()
//     }
//   }))

//   const [countryList, setCountryList] = useState<Common.AreaCodeItem[]>([])

//   useLayoutEffect(() => {
//     getAreaCode().then((res) => {
//       const list = res.data?.filter((item) => item.areaCode !== '0')
//       setCountryList(list || [])
//     })
//   }, [])

//   const handlePress = (item: Common.AreaCodeItem) => {
//     // setFilteredList(countryList)
//     onPress?.(item)
//     bottomSheetModalRef.current?.sheet?.dismiss()
//   }

//   const [searchValue, setSearchValue] = useState('')

//   const filteredList = useMemo<Common.AreaCodeItem[]>(() => {
//     if (!searchValue) return countryList

//     return countryList.filter((item) => {
//       const title = locale === 'zh-TW' ? item.nameCn : item.nameEn
//       return title.toLowerCase().includes(searchValue.toLowerCase()) || item.areaCode.toLowerCase().includes(searchValue.toLowerCase())
//     })
//   }, [searchValue, countryList])

//   return (
//     <SheetModal
//       ref={bottomSheetModalRef}
//       height="100%"
//       hiddenFooter
//       useKeyboardShift={false}
//       dragOnContent={false}
//       children={
//         <View style={cn('flex-1')}>
//           <View style={cn('mx-3 mb-3')}>
//             <View style={cn('items-center flex-row w-full justify-between')}>
//               <Text style={cn('text-[22px] leading-7')} weight="medium">
//                 {t('pages.login.Residence Country')}
//               </Text>
//             </View>
//             <View style={{ marginTop: 10 }}>
//               <TextField
//                 value={searchValue}
//                 RightAccessory={({ style }) => (
//                   <View style={style}>
//                     <Icon name="hangqing-sousuo" size={20} />
//                   </View>
//                 )}
//                 height={44}
//                 placeholder={t('common.operate.Search')}
//                 onChangeText={(text) => {
//                   setSearchValue(text)
//                 }}
//                 containerStyle={[{ marginBottom: 14 }]}
//               />
//             </View>
//           </View>
//           <ScrollView style={cn('flex-1 mx-3 pb-10')}>{renderList(filteredList, handlePress)}</ScrollView>
//         </View>
//       }
//     />
//   )
// }

// export default observer(forwardRef(SelectCountryModal))
